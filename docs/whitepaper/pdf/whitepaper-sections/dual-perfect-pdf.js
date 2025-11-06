// make-perfect-pdf.js
// 완벽한 화면 기반 + A4 인쇄용 두 가지 버전 동시 생성 (현재 폴더 기준)

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const sizeOf = require("image-size");

(async () => {
  const url = "http://127.0.0.1:52306/ko/";
  
  // 현재 폴더의 ko_pdf 디렉토리에 저장
  const outputDir = path.join(__dirname, "ko_pdf");
  const outputFull = path.join(outputDir, "AKASSECT_Whitepaper_FULL.pdf");
  const outputA4 = path.join(outputDir, "AKASSECT_Whitepaper_A4.pdf");
  const tempImg = path.join(outputDir, "temp_fullpage.png");

  // ko_pdf 폴더가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log("📁 ko_pdf 폴더 생성 완료");
  }

  console.log("🚀 Puppeteer 시작 중...");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--font-render-hinting=none",
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });

  // 페이지 전체 높이 측정
  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: 1280, height: fullHeight });

  // -------------------------------
  // 1️⃣ 화면 그대로 PDF (FULL 버전)
  // -------------------------------
  await page.pdf({
    path: outputFull,
    printBackground: true,
    width: "1280px",
    height: `${fullHeight}px`,
    preferCSSPageSize: true,
  });
  console.log(`✅ FULL PDF 생성 완료: ${outputFull}`);

  // -------------------------------
  // 2️⃣ A4 규격 자동 분할 버전
  // -------------------------------
  console.log("🖼️ 전체 페이지를 이미지로 캡처 중...");
  await page.screenshot({ path: tempImg, fullPage: true });
  await browser.close();

  const dimensions = sizeOf(tempImg);
  const imgWidth = dimensions.width;
  const imgHeight = dimensions.height;
  const a4Width = 595.28; // pt
  const a4Height = 841.89; // pt
  const scale = a4Width / imgWidth;
  const sliceHeight = a4Height / scale;

  console.log("📄 A4 페이지로 분할 생성 중...");
  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(outputA4);
  doc.pipe(stream);

  for (let y = 0; y < imgHeight; y += sliceHeight) {
    const clipHeight = Math.min(sliceHeight, imgHeight - y);
    const imgData = await pageScreenshotCrop(tempImg, y, clipHeight, imgWidth);
    doc.addPage({ size: "A4" });
    doc.image(imgData, 0, 0, { width: a4Width });
  }

  doc.end();
  
  // 스트림 완료 대기
  await new Promise((resolve) => {
    stream.on('finish', resolve);
  });
  
  console.log(`✅ A4 규격 PDF 생성 완료: ${outputA4}`);

  // 임시 이미지 삭제
  fs.unlinkSync(tempImg);
  
  console.log("\n🎉 두 가지 버전 PDF 생성 완료!");
  console.log(`📄 FULL 버전: ${outputFull}`);
  console.log(`📄 A4 버전: ${outputA4}`);
})();

// -------------------------------
// 이미지 분할 함수
// -------------------------------
async function pageScreenshotCrop(imagePath, y, height, width) {
  const { createCanvas, loadImage } = await import("canvas");
  const img = await loadImage(imagePath);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, -y);
  return canvas.toBuffer("image/png");
}
