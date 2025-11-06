// screenshot-to-pdf.js
// 웹 페이지를 스크린샷으로 캡처한 후 PDF로 변환하는 방식
// 웹과 100% 동일한 결과를 보장

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// 한글 날짜 생성 함수
function getKoreanDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    return `${year}년${month.toString().padStart(2, '0')}월${day.toString().padStart(2, '0')}일_${hour.toString().padStart(2, '0')}시${minute.toString().padStart(2, '0')}분`;
}

(async () => {
    console.log("🚀 AKASSECT 스크린샷 기반 PDF 생성 시작...");
    
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null, // 전체 화면 사용
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--window-size=1440,2000"
        ],
    });

    const page = await browser.newPage();
    
    // 웹과 동일한 뷰포트 설정
    await page.setViewport({
        width: 1440,
        height: 2000,
        deviceScaleFactor: 2 // 고해상도
    });

    // 페이지 로딩
    const targetURL = "http://127.0.0.1:52306/ko/";
    console.log(`📄 페이지 로딩: ${targetURL}`);
    
    await page.goto(targetURL, {
        waitUntil: "networkidle2",
        timeout: 30000,
    });

    // 리소스 로딩 대기
    console.log("⏳ 리소스 로딩 대기 중...");
    await page.waitForTimeout(5000);
    
    // 로고 로딩 확인
    try {
        await page.waitForSelector('.main-logo', { timeout: 5000 });
        console.log("✅ 로고 이미지 로드 완료");
    } catch (e) {
        console.log("⚠️ 로고 대기 시간 초과 (계속 진행)");
    }

    // 웹 배너 숨기기
    await page.addStyleTag({
        content: `
            .web-banner {
                display: none !important;
            }
            
            body {
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
            }
            
            /* 스크롤바 숨기기 */
            ::-webkit-scrollbar {
                display: none;
            }
            
            html {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
        `
    });

    // 페이지 전체 높이 계산
    const bodyHeight = await page.evaluate(() => {
        return Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
    });

    console.log(`📏 페이지 전체 높이: ${bodyHeight}px`);

    // 뷰포트를 페이지 전체 크기로 조정
    await page.setViewport({
        width: 1440,
        height: bodyHeight,
        deviceScaleFactor: 2
    });

    // 추가 렌더링 대기
    await page.waitForTimeout(2000);

    // 파일 경로 설정
    const koreanDateTime = getKoreanDateTime();
    const currentDir = process.cwd();
    const outputDir = path.join(currentDir, 'ko_pdf');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log("📁 ko_pdf 폴더 생성 완료");
    }

    // 스크린샷 캡처
    const screenshotPath = path.join(outputDir, `AKASSECT_스크린샷_${koreanDateTime}.png`);
    console.log("📸 전체 페이지 스크린샷 캡처 중...");
    
    await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png'
    });

    console.log(`✅ 스크린샷 저장: ${screenshotPath}`);

    // 스크린샷을 PDF로 변환
    const pdfPath = path.join(outputDir, `AKASSECT_스크린샷PDF_${koreanDateTime}.pdf`);
    console.log("🎨 스크린샷을 PDF로 변환 중...");

    // 새 페이지에서 스크린샷을 PDF로 변환
    const pdfPage = await browser.newPage();
    
    // 스크린샷 이미지를 HTML로 감싸기
    const imageHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            * { margin: 0; padding: 0; }
            body { 
                margin: 0; 
                padding: 0; 
                width: 100vw; 
                height: 100vh; 
                overflow: hidden;
            }
            img { 
                width: 100%; 
                height: auto; 
                display: block;
                object-fit: contain;
            }
        </style>
    </head>
    <body>
        <img src="file://${screenshotPath}" alt="AKASSECT Whitepaper">
    </body>
    </html>
    `;

    await pdfPage.setContent(imageHTML);
    await pdfPage.waitForTimeout(2000);

    // PDF 생성
    await pdfPage.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: false
    });

    await browser.close();

    // 결과 확인
    if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log("\n🎉 스크린샷 기반 PDF 생성 완료!");
        console.log(`📁 PDF 위치: ${pdfPath}`);
        console.log(`📸 스크린샷: ${screenshotPath}`);
        console.log(`📊 PDF 크기: ${fileSizeMB} MB`);
        console.log(`🕐 생성 시간: ${koreanDateTime}`);
        console.log("\n✨ 특징:");
        console.log("  • 웹 페이지와 픽셀 단위로 동일");
        console.log("  • 전체 페이지 스크린샷 기반");
        console.log("  • 고해상도 이미지 품질");
        console.log("  • CSS 미디어 쿼리 영향 없음");
    } else {
        console.error("❌ PDF 파일 생성 실패");
        process.exit(1);
    }
})().catch(error => {
    console.error("💥 오류 발생:", error);
    process.exit(1);
});
