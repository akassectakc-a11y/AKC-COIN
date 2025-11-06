// one-page-only-pdf.js
// A4 한 페이지 전용으로 설계된 백서 PDF 생성기

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// 영문 날짜 생성 함수
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
    console.log("📄 AKASSECT A4 한 페이지 전용 PDF 생성 시작...");
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        
        // A4 크기 정확히 맞추기
        await page.setViewport({
            width: 794,  // A4 너비 (픽셀)
            height: 1123, // A4 높이 (픽셀)
            deviceScaleFactor: 2 // 고해상도
        });

        // 한 페이지 전용 백서 HTML 파일 경로
        const currentDir = process.cwd();
        const htmlPath = path.join(currentDir, 'ko', 'one-page-whitepaper.html');
        const fileUrl = `file://${htmlPath}`;
        
        console.log(`📄 A4 전용 백서 로딩: ${fileUrl}`);
        
        await page.goto(fileUrl, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        console.log("⏳ 리소스 로딩 대기...");
        await page.waitForTimeout(3000);

        // 로고 이미지 로딩 대기
        console.log("🖼️ 로고 이미지 로딩 대기...");
        await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                    setTimeout(resolve, 2000);
                });
            }));
        });

        // 웹 폰트 로딩 완료 대기
        await page.evaluateHandle('document.fonts.ready');

        // 최종 렌더링 대기
        console.log("✨ 최종 렌더링 대기...");
        await page.waitForTimeout(2000);

        // 파일 경로 설정
        const englishDateTime = getEnglishDateTime();
        const outputDir = path.join(currentDir, 'ko_pdf');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("📁 ko_pdf 폴더 생성 완료");
        }

        const pdfPath = path.join(outputDir, `AKASSECT_OnePage_${englishDateTime}.pdf`);
        
        console.log("📄 A4 한 페이지 PDF 생성 중...");
        
        // 정확히 A4 한 페이지 PDF 생성
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { 
                top: 0, 
                right: 0, 
                bottom: 0, 
                left: 0 
            },
            scale: 1.0,
            preferCSSPageSize: false,
            displayHeaderFooter: false
        });

        console.log("\n📄 A4 한 페이지 PDF 생성 완료!");
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 파일 위치: ${pdfPath}`);
            console.log(`📊 파일 크기: ${fileSizeMB} MB`);
            console.log(`🕐 생성 시간: ${englishDateTime}`);
            console.log("\n✨ 특징:");
            console.log("  • A4 한 페이지 전용 설계");
            console.log("  • 핵심 정보만 압축 정리");
            console.log("  • 2컬럼 레이아웃으로 가독성 최적화");
            console.log("  • 로고, 차트, 통계 포함");
            console.log("  • 인쇄 및 디지털 보기 최적화");
            
            console.log("\n🎯 포함된 핵심 내용:");
            console.log("  • 프로젝트 개요 및 토큰 정보");
            console.log("  • AI 기술 및 핵심 기능");
            console.log("  • 시장 기회 및 해결책");
            console.log("  • 토큰 분배 및 로드맵");
            console.log("  • 팀 정보 및 연락처");
            
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
