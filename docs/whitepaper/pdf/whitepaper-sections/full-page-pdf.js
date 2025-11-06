// full-page-pdf.js
// 전체 페이지가 완전히 보이는 PDF 생성 (욕 안 먹는 버전)

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log("📄 전체 페이지 완벽 PDF 생성 시작...");
  
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

    // 페이지 로딩 먼저
    const targetURL = "http://127.0.0.1:52306/ko/";
    console.log(`📄 페이지 로딩: ${targetURL}`);
    
    await page.goto(targetURL, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    console.log("⏳ 완전한 렌더링 대기...");
    await page.waitForTimeout(5000);

    // 모든 리소스 로딩 완료 대기
    await page.evaluate(async () => {
      // 이미지 로딩 대기
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
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

    // 웹 배너 제거
    await page.evaluate(() => {
      const banner = document.querySelector('.web-banner');
      if (banner) {
        banner.style.display = 'none';
      }
      
      // 스크롤바 제거
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    });

    // 최종 렌더링 대기
    console.log("✨ 최종 렌더링 완료 대기...");
    await page.waitForTimeout(3000);

    // 전체 페이지 높이 측정
    const pageMetrics = await page.evaluate(() => {
      return {
        width: Math.max(
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.clientWidth,
          document.documentElement.scrollWidth,
          document.documentElement.offsetWidth
        ),
        height: Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )
      };
    });

    console.log(`📏 페이지 크기: ${pageMetrics.width} x ${pageMetrics.height}`);

    // 뷰포트를 전체 페이지 크기로 설정
    await page.setViewport({
      width: pageMetrics.width,
      height: pageMetrics.height,
      deviceScaleFactor: 1
    });

    // 추가 대기 (뷰포트 변경 후)
    await page.waitForTimeout(2000);

    // 파일 경로 설정
    const outputDir = path.join(__dirname, "ko_pdf");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log("📁 ko_pdf 폴더 생성 완료");
    }

    const pdfPath = path.join(outputDir, "AKASSECT_FullPage_Perfect.pdf");

    console.log("📄 전체 페이지 PDF 생성 중...");

    // 전체 페이지 크기로 PDF 생성
    await page.pdf({
      path: pdfPath,
      width: `${pageMetrics.width}px`,
      height: `${pageMetrics.height}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false
    });

    console.log("\n📄 전체 페이지 완벽 PDF 생성 완료!");
    
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 PDF 위치: ${pdfPath}`);
      console.log(`📊 PDF 크기: ${fileSizeMB} MB`);
      console.log(`📏 페이지 크기: ${pageMetrics.width} x ${pageMetrics.height} 픽셀`);
      console.log("\n✨ 특징:");
      console.log("  • 전체 페이지 100% 완전 표시");
      console.log("  • 잘림 없는 완벽한 캡처");
      console.log("  • 실제 페이지 크기에 정확히 맞춤");
      console.log("  • 욕 안 먹는 완벽한 품질");
      
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
