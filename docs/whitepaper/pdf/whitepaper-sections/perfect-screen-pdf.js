// make-perfect-pdf.js
// 완벽히 동일한 화면 PDF 생성용 (Mac + Node.js 환경)

import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // 현재 폴더의 ko_pdf 디렉토리에 저장
  const outputPath = path.join(__dirname, "ko_pdf", "AKASSECT_Whitepaper.pdf");
  
  // ko_pdf 폴더가 없으면 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log("📁 ko_pdf 폴더 생성 완료");
  }

  // Puppeteer 실행
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

  // 웹과 동일한 뷰포트 먼저 설정
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2
  });

  // 페이지 로드 (필요에 따라 URL 변경 가능)
  await page.goto("http://127.0.0.1:52306/ko/", {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  console.log("⏳ 완전한 렌더링 대기...");
  await page.waitForTimeout(5000);

  // 모든 이미지 로딩 완료 대기
  console.log("🖼️ 모든 이미지 로딩 대기...");
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
        setTimeout(resolve, 3000);
      });
    }));
  });

  // 차트 및 동적 콘텐츠 로딩 대기
  console.log("📊 차트 및 동적 콘텐츠 로딩 대기...");
  await page.evaluate(async () => {
    const canvases = document.querySelectorAll('canvas');
    const svgs = document.querySelectorAll('svg');
    const charts = document.querySelectorAll('.chart, .graph, .diagram');
    
    if (canvases.length > 0 || svgs.length > 0 || charts.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  });

  // 웹 폰트 로딩 완료 대기
  console.log("🔤 웹 폰트 로딩 완료 대기...");
  await page.evaluateHandle('document.fonts.ready');

  // 웹 배너 숨기기 (PDF에 불필요)
  await page.evaluate(() => {
    const banner = document.querySelector('.web-banner');
    if (banner) {
      banner.style.display = 'none';
    }
    
    // 스크롤바도 완전히 제거
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  });

  // 최종 렌더링 대기
  console.log("✨ 최종 렌더링 완료 대기...");
  await page.waitForTimeout(3000);

  // 웹 페이지 전체 높이를 기준으로 캡처
  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({
    width: 1440,
    height: fullHeight,
    deviceScaleFactor: 2
  });

  // PDF 생성 (화면 그대로)
  await page.pdf({
    path: outputPath,
    printBackground: true,
    width: "1440px",
    height: `${fullHeight}px`,
    preferCSSPageSize: false, // CSS 페이지 크기 무시
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log(`✅ PDF 생성 완료: ${outputPath}`);
  await browser.close();
})();
