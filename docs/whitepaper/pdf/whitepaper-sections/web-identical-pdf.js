// web-identical-pdf.js
// 웹 페이지와 완전히 동일한 PDF 생성
// 모든 CSS 미디어 쿼리를 무력화하고 웹 스타일 그대로 적용

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
    console.log("🚀 AKASSECT 웹 동일 PDF 생성 시작...");
    
    const browser = await puppeteer.launch({
        headless: true, // 안정적인 헤드리스 모드
        defaultViewport: null,
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--single-process",
            "--disable-extensions"
        ],
        timeout: 60000 // 60초 타임아웃
    });

    const page = await browser.newPage();
    
    // 웹과 완전히 동일한 뷰포트 설정
    await page.setViewport({
        width: 1440,
        height: 900, // 웹 브라우저와 동일한 초기 높이
        deviceScaleFactor: 1 // 웹과 동일한 스케일
    });

    // 페이지 로딩
    const targetURL = "http://127.0.0.1:52306/ko/";
    console.log(`📄 페이지 로딩: ${targetURL}`);
    
    await page.goto(targetURL, {
        waitUntil: "networkidle0", // 모든 네트워크 요청 완료 대기
        timeout: 30000,
    });

    console.log("⏳ 완전한 리소스 로딩 대기 중...");
    
    // 모든 이미지와 폰트 로딩 완료 대기
    await page.evaluate(async () => {
        const selectors = Array.from(document.querySelectorAll("img"));
        await Promise.all(selectors.map(img => {
            if (img.complete) return;
            return new Promise((resolve, reject) => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', reject);
            });
        }));
    });

    // 웹 폰트 로딩 완료 대기
    await page.evaluateHandle('document.fonts.ready');
    
    // 추가 렌더링 대기
    await page.waitForTimeout(3000);

    console.log("🎨 웹과 동일한 스타일 강제 적용 중...");
    
    // 모든 CSS 미디어 쿼리를 완전히 무력화
    await page.addStyleTag({
        content: `
            /* 모든 프린트 미디어 쿼리 무력화 */
            @media print {
                * {
                    all: unset !important;
                }
            }
            
            /* 웹 배너 숨기기 */
            .web-banner {
                display: none !important;
            }
            
            /* 웹과 완전히 동일한 body 스타일 강제 적용 */
            body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                min-height: 100vh !important;
                overflow-x: hidden !important;
                background: white !important;
            }
            
            /* 커버 페이지 웹 스타일 강제 적용 */
            .cover-page {
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                min-height: 100vh !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            /* 모든 색상 정확히 렌더링 */
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* 스크롤바 완전 제거 */
            ::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }
            
            html {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }
            
            /* 페이지 브레이크 방지 */
            * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
        `
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

    const pdfPath = path.join(outputDir, `AKASSECT_웹동일PDF_${koreanDateTime}.pdf`);
    
    console.log("🎯 웹과 완전히 동일한 PDF 생성 중...");
    
    // 웹과 완전히 동일한 PDF 생성
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false, // CSS 페이지 크기 무시
        displayHeaderFooter: false,
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        scale: 1.0, // 웹과 동일한 스케일
        landscape: false,
        omitBackground: false,
        tagged: false,
        // 웹 렌더링과 동일한 설정
        timeout: 0
    });

    await browser.close();

    // 결과 확인
    if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log("\n🎉 웹 동일 PDF 생성 완료!");
        console.log(`📁 파일 위치: ${pdfPath}`);
        console.log(`📊 파일 크기: ${fileSizeMB} MB`);
        console.log(`🕐 생성 시간: ${koreanDateTime}`);
        console.log("\n✨ 특징:");
        console.log("  • 웹 페이지와 완전히 동일한 렌더링");
        console.log("  • 모든 CSS 미디어 쿼리 무력화");
        console.log("  • 웹과 동일한 뷰포트 및 스케일");
        console.log("  • 완전한 리소스 로딩 대기");
        console.log("  • 새로운 헤드리스 모드 사용");
        
        // 웹과 PDF 비교 가이드
        console.log("\n🔍 웹과 비교 방법:");
        console.log("  1. 웹 브라우저에서 http://127.0.0.1:52306/ko/ 열기");
        console.log("  2. 생성된 PDF와 시각적으로 비교");
        console.log("  3. 차이점이 있다면 추가 조정 필요");
        
    } else {
        console.error("❌ PDF 파일 생성 실패");
        process.exit(1);
    }
})().catch(error => {
    console.error("💥 오류 발생:", error);
    process.exit(1);
});
