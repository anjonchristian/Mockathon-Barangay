import svgPaths from "../../imports/Html→Body/svg-7ninsmypt3";

/**
 * SVG icon component that renders a path from the Figma-exported SVG map.
 *
 * Usage:
 * ```tsx
 * <SvgIcon name="p191dcc80" vb="0 0 18 18" w={18} h={18} fill="#96ADFF" />
 * ```
 */
export function SvgIcon({
  name,
  vb,
  w,
  h,
  fill,
}: {
  name: keyof typeof svgPaths;
  vb: string;
  w: number;
  h: number;
  fill: string;
}) {
  const d = svgPaths[name];
  if (!d) {
    console.warn(`[SvgIcon] Path not found: "${String(name)}"`);
    return null;
  }

  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox={vb}
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}
