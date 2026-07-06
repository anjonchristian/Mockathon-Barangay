import svgPaths from "./svg-7ninsmypt3";

function Container1() {
  return (
    <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Container">
          <path d={svgPaths.p2bce57c0} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="Button">
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747685] text-[16px] w-full">
          <p className="leading-[normal]">Search records...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f8f9ff] h-[40px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[41px] pr-[17px] py-[10px] relative size-full">
          <Container3 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#c4c5d5] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bottom-[20%] content-stretch flex flex-col items-start left-[16px] top-[20%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #747685)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[448px] relative shrink-0 w-[448px]" data-name="Container">
      <Input />
      <Container4 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Container2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Online</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#16a34a] relative rounded-[12px] shrink-0 size-[8px]" data-name="Background" />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="Button">
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="Button">
      <Container10 />
    </div>
  );
}

function AnasProfilePicture() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[32px]" data-name="Ana's profile picture">
      <div aria-hidden className="absolute border border-[#c4c5d5] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ImgAnasProfilePictureMargin() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pl-[8px] relative shrink-0 w-[40px]" data-name="Img - Ana's profile picture:margin">
      <AnasProfilePicture />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Button1 />
      <Button2 />
      <ImgAnasProfilePictureMargin />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Container6 />
        <Container8 />
      </div>
    </div>
  );
}

function HeaderTopNavBar() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-full z-[2]" data-name="Header - TopNavBar">
      <div aria-hidden className="absolute border-[#c4c5d5] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[32px] relative size-full">
          <Container />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] whitespace-nowrap">
        <p className="leading-[31.2px]">Document Requests</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Container">
          <path d={svgPaths.p2889b5c0} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[7.99px] h-[48px] items-center px-[17px] py-px relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c4c5d5] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <Container13 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Filter</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Button3 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container12 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] uppercase w-full">
          <p className="leading-[24px]">PENDING REVIEW (2)</p>
        </div>
      </div>
    </div>
  );
}

function Ab6AXuBjmZLmNC1T6Iol6JpSeQx4DwYlXl2F2Ul8Swrk4EImUzwaVksh2Suh1CagFHxwRto7UfJ1SMtMyldaa6997I2Duy7IAc1OSzz40Q2BSt2Xf8Zer142Dg3DatNjuHdXt3Cw6X0OcLMxnt2VuaMiM2KeYhmqetJixpUTe26LyHicm46LQzFBsZ7Sh6R3BJfULn8BkSo57X2Ap9WxC2WpkKwZsTjbsqlZo2XoP7NBbH6RAqiJXnW6DiHr7PlFclA3OZ64R() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBjmZ_LM-nC1T6IOL6JpSeQX4dwYlXl2f2Ul8swrk4eImUZWAVksh2SUH1CagFHxwRto7ufJ1SMtMYLDAA6997i2duy7iAc1O_Szz40Q2BSt2xf8ZER-142DG3DatNjuHDXt3cw6X0ocL-MXNT2VuaMiM2keYHMQETJixpU-Te26Ly-hicm46lQzFBsZ7Sh6R3bJfULn8BkSO57X2Ap9wxC2WpkKWZsTJBSQLZo2XO-p7NBbH6rAqiJXnW6DI-hr7plFclA3oZ64r0" />;
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[2px] shrink-0 size-[48px]" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Ab6AXuBjmZLmNC1T6Iol6JpSeQx4DwYlXl2F2Ul8Swrk4EImUzwaVksh2Suh1CagFHxwRto7UfJ1SMtMyldaa6997I2Duy7IAc1OSzz40Q2BSt2Xf8Zer142Dg3DatNjuHdXt3Cw6X0OcLMxnt2VuaMiM2KeYhmqetJixpUTe26LyHicm46LQzFBsZ7Sh6R3BJfULn8BkSo57X2Ap9WxC2WpkKwZsTjbsqlZo2XoP7NBbH6RAqiJXnW6DiHr7PlFclA3OZ64R />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">
        <p className="leading-[27px] mb-0">Juan Dela</p>
        <p className="leading-[27px]">Cruz</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[25.59px] relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute bg-[#002576] left-0 rounded-[12px] size-[8px] top-[calc(50%+0.01px)]" data-name="Background" />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[12px] not-italic text-[#444653] text-[16px] top-[calc(50%-0.8px)] whitespace-nowrap">
        <p className="leading-[25.6px]">Barangay ID</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[86.03px]" data-name="Container">
      <Heading3 />
      <Container18 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <BackgroundBorder />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[39.19px] relative shrink-0 w-[55.89px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-0 not-italic text-[#747685] text-[14px] top-[19.3px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[19.6px] mb-0">10m</p>
        <p className="leading-[19.6px]">ago</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container16 />
        <Container19 />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[48px] items-center justify-center px-[36.17px] py-px relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Reject</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#002576] content-stretch flex flex-col h-[48px] items-center justify-center px-[27.67px] relative rounded-[2px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Approve</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Card 1">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[17px] relative size-full">
        <Container15 />
        <Container20 />
      </div>
    </div>
  );
}

function Ab6AXuAjukpaLkXoPf06Ptsm1Bhr6FmVOz7SVdNJInOaDEabe72MmF1YDokevDs4Nvg10QgegMb6ZeWylO5Lg7IcOqF04RceYqRMcFpEncjJZoqGXi8EXqTy9PfvStLfp4I9Wjlg4FM4Y7KjEz0XNvhzotofn3U3SrvUc2VgkMk9JtrIpwjEzLve2TVynJdr2QedIvTcGvE2Ayjpc5BlrbLfv1We3I59VedE6KQ9Cl7ZrRqju7RoIlfLiDDo0IdtAVekBfGq() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuAJUKPA-LKXoPf06PTSM1bhr6fmVOz7sVd_nJInOaDEabe72mmF1yDOKEVDs4Nvg10Qgeg-mb6zeWylO5LG7ICOqF04_RceYqRMcFPEncjJZoqGXi8-eXQ-TY9PFVStLFP4I9Wjlg4fM4y7kjEZ0xNvhzotofn3U3srvUC2VGK-mk9JtrIPWJEzLVE2tVynJdr2qedIVTcGvE2ayjpc5blrbLFV1WE_3i-59VED-e6kQ9Cl7ZrRQJU7ROIlfLiDDo0Idt-aVEKBfGQ" />;
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[2px] shrink-0 size-[48px]" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Ab6AXuAjukpaLkXoPf06Ptsm1Bhr6FmVOz7SVdNJInOaDEabe72MmF1YDokevDs4Nvg10QgegMb6ZeWylO5Lg7IcOqF04RceYqRMcFpEncjJZoqGXi8EXqTy9PfvStLfp4I9Wjlg4FM4Y7KjEz0XNvhzotofn3U3SrvUc2VgkMk9JtrIpwjEzLve2TVynJdr2QedIvTcGvE2Ayjpc5BlrbLfv1We3I59VedE6KQ9Cl7ZrRqju7RoIlfLiDDo0IdtAVekBfGq />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">
        <p className="leading-[27px] mb-0">Maria</p>
        <p className="leading-[27px]">Santos</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[25.59px] relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute bg-[#8d4f11] left-0 rounded-[12px] size-[8px] top-[calc(50%+0.01px)]" data-name="Background" />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[12px] not-italic text-[#444653] text-[16px] top-[calc(50%-0.8px)] whitespace-nowrap">
        <p className="leading-[25.6px]">Clearance</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[60.09px]" data-name="Container">
      <Heading4 />
      <Container24 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-0 top-0" data-name="Container">
      <BackgroundBorder1 />
      <Container23 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[14.667px] relative shrink-0 w-[10.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 14.6667">
        <g id="Container">
          <path d={svgPaths.p35cda880} fill="var(--fill-0, #002576)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[152.97px] top-[-0.5px]" data-name="Container">
      <Container26 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#002576] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[19.6px]">Processing</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[79.59px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container22 />
        <Container25 />
      </div>
    </div>
  );
}

function Card2ProcessingState() {
  return (
    <div className="bg-[#dce1ff] opacity-80 relative rounded-[2px] shrink-0 w-full" data-name="Card 2: Processing State">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[17px] relative size-full">
          <div className="absolute bg-[rgba(0,37,118,0.05)] inset-px" data-name="Overlay" />
          <Container21 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#b6c4ff] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function PendingReviewColumn() {
  return (
    <div className="bg-[#eff4ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Pending Review Column">
      <div aria-hidden className="absolute border border-[#c4c5d5] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[9px] relative size-full">
        <Heading2 />
        <Card />
        <Card2ProcessingState />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] uppercase w-full">
          <p className="leading-[24px]">READY FOR PICKUP (1)</p>
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #747685)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[2px] shrink-0 size-[48px]" data-name="Background+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Container29 />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">
        <p className="leading-[27px]">Pedro Penduko</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[25.59px] relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute bg-[#62000a] left-0 rounded-[12px] size-[8px] top-[calc(50%+0.01px)]" data-name="Background" />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[12px] not-italic text-[#444653] text-[16px] top-[calc(50%-0.8px)] whitespace-nowrap">
        <p className="leading-[25.6px]">Certificate</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[131.8px]" data-name="Container">
      <Heading6 />
      <Container31 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <BackgroundBorder2 />
      <Container30 />
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container28 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#747685] text-[14px] tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[19.6px]">1h ago</p>
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[12.025px] relative shrink-0 w-[16.3px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3 12.025">
        <g id="Container">
          <path d={svgPaths.p2f7dfa00} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[48px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-center p-px relative size-full">
        <Container32 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Mark Claimed</p>
        </div>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Card 3">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[17px] relative size-full">
        <Container27 />
        <Button6 />
      </div>
    </div>
  );
}

function ReadyForPickupColumn() {
  return (
    <div className="bg-[#eff4ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Ready for Pickup Column">
      <div aria-hidden className="absolute border border-[#c4c5d5] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[9px] relative size-full">
        <Heading5 />
        <Card1 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <PendingReviewColumn />
      <ReadyForPickupColumn />
    </div>
  );
}

function KanbanBoard23Width() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col gap-[16px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Kanban Board (2/3 width)">
      <Margin />
      <Container14 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] w-full">
        <p className="leading-[31.2px]">Urgent Actions</p>
      </div>
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Heading 2:margin">
      <Heading7 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p7555480} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading8() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">
          <p className="leading-[27px]">Missed Calls</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.5)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder+OverlayBlur">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[17px] pt-[16px] px-[16px] relative size-full">
          <Container33 />
          <Heading8 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="relative shrink-0 w-[93.48px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[9.75px] pt-[9.25px] px-[8px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] uppercase whitespace-nowrap">
          <p className="leading-[21px]">RESIDENT</p>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="relative shrink-0 w-[63.5px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[9.75px] pt-[9.25px] px-[8px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] uppercase whitespace-nowrap">
          <p className="leading-[21px]">TIME</p>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="relative shrink-0 w-[129.02px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end pb-[9.75px] pt-[9.25px] px-[8px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] text-right uppercase whitespace-nowrap">
          <p className="leading-[21px]">ACTION</p>
        </div>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex items-start justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header → Row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <Cell />
      <Cell1 />
      <Cell2 />
    </div>
  );
}

function Data() {
  return (
    <div className="relative shrink-0 w-[77.48px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Rosa</p>
          <p className="leading-[24px]">Rosal</p>
        </div>
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="relative shrink-0 w-[71.5px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12.8px] pl-[16px] pr-[8px] pt-[12.2px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[19.6px] mb-0">5m</p>
          <p className="leading-[19.6px]">ago</p>
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.pb3c9680} fill="var(--fill-0, #002576)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pl-[9.61px] pr-[9.62px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#002576] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px] mb-0">Call</p>
          <p className="leading-[24px]">Back</p>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] h-[42px] items-center px-[17px] py-px relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <Container35 />
      <Container36 />
    </div>
  );
}

function Data2() {
  return (
    <div className="relative shrink-0 w-[129.02px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[8px] py-[11.5px] relative size-full">
        <Button7 />
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-px pl-[8px] relative size-full">
          <Data />
          <Data1 />
          <Data2 />
        </div>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[77.48px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px] mb-0">Jose</p>
        <p className="leading-[24px]">Rizal</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12.3px] pl-[16px] pr-[8px] pt-[12.2px] relative shrink-0 w-[71.5px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[19.6px] mb-0">12m</p>
        <p className="leading-[19.6px]">ago</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.pb3c9680} fill="var(--fill-0, #002576)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pl-[9.61px] pr-[9.62px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#002576] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px] mb-0">Call</p>
          <p className="leading-[24px]">Back</p>
        </div>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] h-[42px] items-center px-[17px] py-px relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <Container37 />
      <Container38 />
    </div>
  );
}

function Data5() {
  return (
    <div className="content-stretch flex flex-col items-end pb-[11px] pt-[11.5px] px-[8px] relative shrink-0 w-[129.02px]" data-name="Data">
      <Button8 />
    </div>
  );
}

function Row1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[8px] relative size-full">
          <Data3 />
          <Data4 />
          <Data5 />
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <Row />
      <Row1 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Table">
      <HeaderRow />
      <Body />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[4px] relative size-full">
          <Table />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#fffbeb] flex-[1_0_0] min-h-px relative rounded-[2px] w-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <OverlayHorizontalBorderOverlayBlur />
        <Container34 />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[2px] shadow-[-4px_0px_0px_0px_#fbbf24]" />
    </div>
  );
}

function UrgenciesPanel13Width() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[16px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Urgencies Panel (1/3 width)">
      <Heading2Margin />
      <BackgroundBorderShadow />
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_912px] min-h-px relative w-full" data-name="Container">
      <KanbanBoard23Width />
      <UrgenciesPanel13Width />
    </div>
  );
}

function MainWorkspace() {
  return (
    <div className="flex-[1_0_0] max-w-[1440px] min-h-px relative w-full z-[1]" data-name="Main Workspace">
      <div className="flex flex-col justify-center max-w-[inherit] overflow-x-clip overflow-y-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center max-w-[inherit] p-[32px] relative size-full">
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-w-px relative self-stretch" data-name="Main Content Area">
      <HeaderTopNavBar />
      <MainWorkspace />
    </div>
  );
}

function Ab6AXuBcsAghtC6NlkvGtEubInaJlj1A8MSd9OnidTg6ZalxzjkzxxwJlarXDntKztEoi86QIj7MUzSfpjF0Udls7Yg9I7We6FlXtJDu6OfKiO1IZLQNmy9TLaPMgihLq77KePbTvrhIjFgmfdj8GrRe3Djxp3ZQvyBvP6UkAzCz6X8HdNnzdPs1UPw1Vr32Cy8W7EMuKNgqfuVpoUqYuach1SkgodJ2Oh6RwYit1MwRkBq29HtHoxo3Bng7NngoBNqQfjCnju() {
  return <div className="max-w-[247px] relative rounded-[12px] shrink-0 size-[48px]" data-name="AB6AXuBcsAGHT_c6nlkvGTEubInaJlj1A8mSd9OnidTG_6ZALXZJKZXXWJlarXDnt_KztEOI86Q-IJ7MUzSfpjF0UDLS7YG9I7we-6flXtJDu6ofKiO1i-zL-qNMY9tLaPMgihLq77KePbTvrhIJFgmfdj-8grRe3Djxp3zQvyBvP6UkAzCZ6X8hdNNZDPs1uPW1vr32Cy8w7EMuKNgqfuVPOUqYUACH1skgodJ2Oh-6rwYit1MwRkBq29HTHoxo3bng7nngoBNqQfjCNJU" />;
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#002576] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">e-Kap Admin</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[19.6px]">District 1 Office</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[127.83px]" data-name="Container">
      <Heading />
      <Container41 />
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[8px] relative size-full">
          <Ab6AXuBcsAghtC6NlkvGtEubInaJlj1A8MSd9OnidTg6ZalxzjkzxxwJlarXDntKztEoi86QIj7MUzSfpjF0Udls7Yg9I7We6FlXtJDu6OfKiO1IZLQNmy9TLaPMgihLq77KePbTvrhIjFgmfdj8GrRe3Djxp3ZQvyBvP6UkAzCz6X8HdNnzdPs1UPw1Vr32Cy8W7EMuKNgqfuVpoUqYuach1SkgodJ2Oh6RwYit1MwRkBq29HtHoxo3Bng7NngoBNqQfjCnju />
          <Container40 />
        </div>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container39 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p2bb32400} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">New Record</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#002576] content-stretch flex gap-[8px] h-[48px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <Container42 />
      <Container43 />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24px] relative size-full">
        <Button9 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p191dcc80} fill="var(--fill-0, #96ADFF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#96adff] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Dashboard</p>
      </div>
    </div>
  );
}

function LinkActiveTabDashboard() {
  return (
    <div className="bg-[#0038a8] content-stretch flex gap-[16px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-[247px]" data-name="Link - Active Tab: Dashboard">
      <Container45 />
      <Container46 />
    </div>
  );
}

function LinkActiveTabDashboardCssTransform() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0 w-[247px]" data-name="Link - Active Tab: Dashboard:css-transform">
      <LinkActiveTabDashboard />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pf86ae00} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Archives</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container47 />
          <Container48 />
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Settings</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container49 />
          <Container50 />
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <LinkActiveTabDashboardCssTransform />
        <Link />
        <Link1 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[20px] relative shrink-0 w-[17px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 20">
        <g id="Container">
          <path d={svgPaths.p2d9a1e80} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Support</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container51 />
          <Container52 />
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #444653)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Logout</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container53 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#c4c5d5] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[17px] relative size-full">
        <Link2 />
        <Link3 />
      </div>
    </div>
  );
}

function SideNavBar() {
  return (
    <div className="absolute bg-[#f8f9ff] h-[1024px] left-0 top-0 w-[280px]" data-name="SideNavBar">
      <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip pl-[16px] pr-[17px] py-[16px] relative rounded-[inherit] size-full">
        <Margin1 />
        <ButtonMargin />
        <Container44 />
        <HorizontalBorder />
      </div>
      <div aria-hidden className="absolute border-[#c4c5d5] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Ab6AXuByNm1EcOc6Iokv6IzlDqKuZEtYMnuRoxIOm961SJowrUg656BWzpWuXzZp1RgDbVfNYwP0DhKxyJteo9QxDdrJAeQs8IZz1SRnt4JaJs8Uj6NZVmDOm62O2IXzkDer5CizOCrrLce2KhTitt75JPrhKv6FcllI4ZHkTr5Or3QrHb5BbrUrHfQOvigbczpcCgNxReupq4SjOnckVyhz6HezbPeL8Amlya0C8MteSyTjQ8KWk7Xv78UVSex8InCx3M() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBYNm1ecOC6iokv-6izlDQKuZEtYMnuRoxIOm961sJOWRUg6_56bWZPWuXZ-ZP1RgDBVf_NYwP0DHKxy-jteo9qxDdrJ-Ae-QS8IZz1sRNT4jaJS8UJ6nZ_VmDOm62o2iXzkDER-5Ciz-OCrrLce2khTitt75jPRHKv6fcllI4zHkTr5OR3QR-Hb5bbrURHf_QOvigbczpcCgNXReupq4SjONCKVyhz6HezbPeL8amlya0C8mteSyTjQ8KWk7Xv78uV-Sex8InCX3M" />;
}

function Background() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[2px] shrink-0 size-[64px]" data-name="Background">
      <Ab6AXuByNm1EcOc6Iokv6IzlDqKuZEtYMnuRoxIOm961SJowrUg656BWzpWuXzZp1RgDbVfNYwP0DhKxyJteo9QxDdrJAeQs8IZz1SRnt4JaJs8Uj6NZVmDOm62O2IXzkDer5CizOCrrLce2KhTitt75JPrhKv6FcllI4ZHkTr5Or3QrHb5BbrUrHfQOvigbczpcCgNxReupq4SjOnckVyhz6HezbPeL8Amlya0C8MteSyTjQ8KWk7Xv78UVSex8InCx3M />
      <div className="absolute inset-0 rounded-[2px]" data-name="Border">
        <div aria-hidden className="absolute border-2 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[10.667px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 10.6667">
        <g id="Container">
          <path d={svgPaths.p256d480} fill="var(--fill-0, #16A34A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[14px] tracking-[0.7px] uppercase whitespace-nowrap">
        <p className="leading-[19.6px]">INCOMING CALL</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Container58 />
      <Container59 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip pt-[4px] relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] w-full">
        <p className="leading-[27px]">Lolo Cardo</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444653] text-[14px] tracking-[0.14px] w-full">
        <p className="leading-[19.6px]">Zone 3 Resident</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container57 />
      <Heading9 />
      <Container60 />
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start p-[16px] relative size-full">
        <Background />
        <Container56 />
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[8.703px] relative shrink-0 w-[22.4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.4 8.7025">
        <g id="Container">
          <path d={svgPaths.p8c50c10} fill="var(--fill-0, #DC2626)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#f8fafc] h-[48px] relative shrink-0 w-[159.5px]" data-name="Button">
      <div aria-hidden className="absolute border-[#e2e8f0] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center pr-px relative size-full">
        <Container61 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#dc2626] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Decline</p>
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p143e1930} fill="var(--fill-0, #15803D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#f0fdf4] h-[48px] relative shrink-0 w-[158.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.99px] items-center justify-center relative size-full">
        <Container62 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#15803d] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Accept</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center pt-px relative size-full">
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function IncomingCallUiToastFloating() {
  return (
    <div className="absolute bg-white right-[32px] rounded-[8px] top-[32px] w-[320px]" data-name="Incoming Call UI Toast (Floating)">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container55 />
        <HorizontalBorder1 />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[280px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <MainContentArea />
      <SideNavBar />
      <IncomingCallUiToastFloating />
    </div>
  );
}