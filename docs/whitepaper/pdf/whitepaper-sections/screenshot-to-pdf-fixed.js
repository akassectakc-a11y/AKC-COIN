// screenshot-to-pdf-fixed.js
// 스크린샷으로 확실하게 PDF 생성

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log("📸 스크린샷 기반 PDF 생성 시작...");
  
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
        "--no-first-run"
      ],
      devtools: false
    });

    const page = await browser.newPage();
    
    // 웹 브라우저와 동일한 뷰포트
    await page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
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

    // 웹 배너 숨기기
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

    // 파일 경로 설정
    const outputDir = path.join(__dirname, "ko_pdf");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log("📁 ko_pdf 폴더 생성 완료");
    }

    const screenshotPath = path.join(outputDir, "AKASSECT_Screenshot.png");
    const pdfPath = path.join(outputDir, "AKASSECT_Screenshot_PDF.pdf");

    // 1단계: 전체 페이지 스크린샷
    console.log("📸 전체 페이지 스크린샷 촬영 중...");
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png'
    });

    console.log(`✅ 스크린샷 저장 완료: ${screenshotPath}`);

    // 2단계: 스크린샷을 PDF로 변환
    console.log("🔄 스크린샷을 PDF로 변환 중...");
    
    // 새로운 페이지에서 이미지를 PDF로 변환
    const pdfPage = await browser.newPage();
    
    // 이미지를 Base64로 인코딩
    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64Image = imageBuffer.toString('base64');
    
    const imageHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          width: 100vw; 
          height: 100vh; 
          display: flex; 
          justify-content: center; 
          align-items: flex-start; 
          background: white; 
          overflow: hidden; 
        }
        .image-container { 
          width: 100%; 
          height: 100%; 
          display: flex; 
          justify-content: center; 
          align-items: flex-start; 
        }
        .screenshot-image { 
          max-width: 100%; 
          height: auto; 
          display: block; 
          object-fit: contain; 
        }
      </style>
    </head>
    <body>
      <div class="image-container">
        <img src="data:image/png;base64,${base64Image}" alt="AKASSECT 백서 스크린샷" class="screenshot-image">
      </div>
    </body>
    </html>
    `;

    await pdfPage.setContent(imageHTML);
    await pdfPage.waitForTimeout(2000);

    // 스크린샷 크기에 맞는 PDF 생성
    const sizeOf = await import('image-size');
    const dimensions = sizeOf.default(screenshotPath);
    const imgWidth = dimensions.width;
    const imgHeight = dimensions.height;

    // PDF 저장 (스크린샷 전체 크기로)
    await pdfPage.pdf({
      path: pdfPath,
      width: imgWidth,
      height: imgHeight,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false
    });

    console.log("\n📸 스크린샷 기반 PDF 생성 완료!");
    
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      const screenshotStats = fs.statSync(screenshotPath);
      const screenshotSizeMB = (screenshotStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 PDF 위치: ${pdfPath}`);
      console.log(`📸 스크린샷 위치: ${screenshotPath}`);
      console.log(`📊 PDF 크기: ${fileSizeMB} MB`);
      console.log(`🖼️ 스크린샷 크기: ${screenshotSizeMB} MB`);
      console.log("\n✨ 특징:");
      console.log("  • 스크린샷 기반으로 100% 확실한 캡처");
      console.log("  • 웹과 완전히 동일한 시각적 결과");
      console.log("  • Base64 인코딩으로 이미지 직접 삽입");
      console.log("  • 모든 PDF 뷰어에서 정상 표시 보장");
      
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
