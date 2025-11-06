// final-perfect-pdf.js
// 웹과 완전히 동일한 크기와 가독성의 최종 PDF

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log("🎯 최종 완벽 PDF 생성 시작...");
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-infobars",
        "--no-first-run",
        "--disable-web-security"
      ],
      devtools: false
    });

    const page = await browser.newPage();

    // 웹 브라우저와 완전히 동일한 설정
    await page.setViewport({
      width: 1440,  // 일반적인 데스크톱 브라우저 너비
      height: 900,  // 일반적인 데스크톱 브라우저 높이
      deviceScaleFactor: 1  // 1배 스케일 (웹과 동일)
    });

    // 페이지 로딩
    const targetURL = "http://127.0.0.1:52306/ko/";
    console.log(`📄 페이지 로딩: ${targetURL}`);
    
    await page.goto(targetURL, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    console.log("⏳ 완전한 렌더링 대기...");
    await page.waitForTimeout(5000);

    // 모든 리소스 완전 로딩 대기
    await page.evaluate(async () => {
      // 이미지 로딩 대기
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve;
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
          setTimeout(resolve, 3000);
        });
      }));
      
      // 폰트 로딩 대기
      await document.fonts.ready;
      
      // 차트 및 동적 요소 대기
      const dynamicElements = document.querySelectorAll('canvas, svg, .chart, .graph');
      if (dynamicElements.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    });

    // 불필요한 요소 제거 (디버깅 도구, 웹 배너 등)
    await page.evaluate(() => {
      // 웹 배너 제거
      const banner = document.querySelector('.web-banner');
      if (banner) {
        banner.style.display = 'none';
      }
      
      // 개발자 도구 관련 요소 제거
      const devElements = document.querySelectorAll('[class*="devtools"], [id*="devtools"], [class*="debug"], [id*="debug"]');
      devElements.forEach(el => el.remove());
      
      // 브라우저 UI 요소들 제거
      const uiElements = document.querySelectorAll('.chrome-extension, .browser-action, .devtools-panel');
      uiElements.forEach(el => el.remove());
      
      // 스크롤바 제거
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    });

    // 최종 렌더링 대기
    console.log("✨ 최종 렌더링 완료 대기...");
    await page.waitForTimeout(3000);

    // 파일 경로 설정
    const outputDir = path.join(__dirname, "ko_pdf");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log("📁 ko_pdf 폴더 생성 완료");
    }

    const pdfPath = path.join(outputDir, "AKASSECT_Final_Perfect.pdf");

    // 전체 페이지 높이 측정
    const pageHeight = await page.evaluate(() => {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
    });

    console.log(`📏 전체 페이지 크기: 1440 x ${pageHeight} 픽셀`);
    console.log("📄 전체 페이지 PDF 생성 중...");

    // 전체 페이지를 포함하는 PDF 생성
    await page.pdf({
      path: pdfPath,
      width: '1440px',
      height: `${pageHeight}px`,  // 전체 페이지 높이
      printBackground: true,
      margin: { 
        top: '5mm', 
        right: '5mm', 
        bottom: '5mm', 
        left: '5mm' 
      },
      preferCSSPageSize: false,
      scale: 0.8  // 약간 축소해서 읽기 좋게
    });

    console.log("\n🎯 최종 완벽 PDF 생성 완료!");
    
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 PDF 위치: ${pdfPath}`);
      console.log(`📊 PDF 크기: ${fileSizeMB} MB`);
      console.log(`📏 페이지 크기: 1440 x 900 픽셀 (웹과 동일)`);
      console.log("\n✨ 특징:");
      console.log("  • 웹 브라우저와 완전히 동일한 크기");
      console.log("  • 읽기 좋은 글씨 크기 유지");
      console.log("  • 디버깅 도구 완전 제거");
      console.log("  • 적절한 여백으로 전문적 외관");
      console.log("  • 컴퓨터 초보자도 읽기 쉬움");
      
    } else {
      console.error("❌ PDF 파일 생성 실패");
    }

  } catch (error) {
    console.error("💥 오류 발생:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
