import { Router, Request, Response } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import { OcrCache } from "../models/OcrCache.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const OCR_SYSTEM_PROMPT = `You are an OCR assistant for Philippine government IDs. Extract the following fields 
as valid JSON (no markdown, no extra text). If a field is unreadable, return null for it.
Fields: fullName, address, birthDate (YYYY-MM-DD), gender (Male/Female/Other/null), 
nationality, idNumber, idType (national_id or barangay_id).`;

router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No image provided" });
      return;
    }

    // Compute image hash for caching
    const imageHash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

    // Check cache
    const cached = await OcrCache.findOne({ imageHash });
    if (cached) {
      console.log("OCR cache hit");
      res.json({ success: true, data: cached.result });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(502).json({ success: false, error: "Gemini API key not configured" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: OCR_SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType: req.file.mimetype || "image/jpeg",
                data: req.file.buffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    const responseText = result.response.text();

    // Parse JSON from response (handle possible markdown wrapping)
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    let extractedData;
    try {
      extractedData = JSON.parse(jsonStr);
    } catch {
      res.status(502).json({ success: false, error: "Gemini extraction failed - invalid JSON response" });
      return;
    }

    // Validate required fields
    const validatedData = {
      fullName: extractedData.fullName || null,
      address: extractedData.address || null,
      birthDate: extractedData.birthDate || null,
      gender: ["Male", "Female", "Other"].includes(extractedData.gender) ? extractedData.gender : null,
      nationality: extractedData.nationality || "Filipino",
      idNumber: extractedData.idNumber || null,
      idType: ["national_id", "barangay_id"].includes(extractedData.idType) ? extractedData.idType : null,
    };

    // Save to cache
    await OcrCache.create({ imageHash, result: validatedData });

    res.json({ success: true, data: validatedData });
  } catch (error) {
    console.error("OCR error:", error);
    res.status(502).json({ success: false, error: "Gemini extraction failed" });
  }
});

export default router;
