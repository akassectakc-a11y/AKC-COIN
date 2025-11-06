// simple-web-pdf.js
// 가장 간단하고 안정적인 방법으로 웹과 동일한 PDF 생성

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// 영문 날짜 생성 함수 (PDF 호환성을 위해)
function getEnglishDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}_${hour.toString().padStart(2, '0')}-${minute.toString().padStart(2, '0')}`;
}

(async () => {
    console.log("🚀 AKASSECT 간단 웹 PDF 생성 시작...");
    
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
            devtools: false // 개발자 도구 완전 비활성화
        });

        const page = await browser.newPage();
        
        // 웹과 동일한 뷰포트
        await page.setViewport({
            width: 1440,
            height: 900,
            deviceScaleFactor: 1
        });

        // 페이지 로딩
        const targetURL = "http://127.0.0.1:52306/ko/";
        console.log(`📄 페이지 로딩: ${targetURL}`);
        
        await page.goto(targetURL, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });

        console.log("⏳ 리소스 로딩 대기...");
        await page.waitForTimeout(3000);

        // 모든 이미지 로딩 완료 대기
        console.log("🖼️ 이미지 로딩 대기...");
        await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                    setTimeout(resolve, 3000); // 3초 타임아웃
                });
            }));
        });

        // 차트 및 동적 콘텐츠 로딩 대기
        console.log("📊 차트 로딩 대기...");
        await page.evaluate(async () => {
            const canvases = document.querySelectorAll('canvas');
            const svgs = document.querySelectorAll('svg');
            const charts = document.querySelectorAll('.chart, .graph, .diagram');
            
            if (canvases.length > 0 || svgs.length > 0 || charts.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        });

        // 웹 폰트 로딩 완료 대기
        await page.evaluateHandle('document.fonts.ready');

        // 웹 배너만 숨기기 (최소한의 수정)
        await page.evaluate(() => {
            const banner = document.querySelector('.web-banner');
            if (banner) {
                banner.style.display = 'none';
            }
        });

        // 최종 렌더링 대기
        console.log("✨ 최종 렌더링 대기...");
        await page.waitForTimeout(2000);

        // 파일 경로 설정
        const englishDateTime = getEnglishDateTime();
        const currentDir = process.cwd();
        const outputDir = path.join(currentDir, 'ko_pdf');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("📁 ko_pdf 폴더 생성 완료");
        }

        const pdfPath = path.join(outputDir, `AKASSECT_SimplePDF_${englishDateTime}.pdf`);
        
        console.log("🎯 간단 PDF 생성 중...");
        
        // 가장 기본적인 PDF 생성
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        console.log("\n🎉 간단 PDF 생성 완료!");
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 파일 위치: ${pdfPath}`);
            console.log(`📊 파일 크기: ${fileSizeMB} MB`);
            console.log(`🕐 생성 시간: ${englishDateTime}`);
            console.log("\n✨ 특징:");
            console.log("  • 최소한의 설정으로 안정적 생성");
            console.log("  • 웹 배너만 제거");
            console.log("  • 기본 PDF 엔진 사용");
            console.log("  • 영문 파일명으로 PDF 호환성 개선");
            
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
