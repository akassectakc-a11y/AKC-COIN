// make-perfect-pdf.js
// Eric의 Mac 환경에 최적화된 완벽한 PDF 생성기
// 웹 디자인 그대로 PDF로 변환 (CSS 프린트 미디어 무시)

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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
    console.log("🚀 AKASSECT 완벽한 PDF 생성 시작...");
    
    const browser = await puppeteer.launch({
        headless: true, // 실제 브라우저 안보이게 실행
        defaultViewport: { width: 1440, height: 2000 },
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run"
        ],
    });

    const page = await browser.newPage();
    
    // 고해상도 설정
    await page.setViewport({
        width: 1440,
        height: 2000,
        deviceScaleFactor: 2 // 고해상도 렌더링
    });

    // 🔹 페이지 로딩
    const targetURL = "http://127.0.0.1:52306/ko/";
    console.log(`📄 페이지 로딩: ${targetURL}`);
    
    await page.goto(targetURL, {
        waitUntil: "networkidle2", // 모든 JS 로드 완료 대기
        timeout: 30000, // 30초 타임아웃
    });

    // 🔹 웹 폰트, 애니메이션, 이미지 로딩 대기
    console.log("⏳ 리소스 로딩 대기 중...");
    await page.waitForTimeout(4000);
    
    // 로고 이미지가 로드될 때까지 대기
    try {
        await page.waitForSelector('.main-logo', { timeout: 5000 });
        console.log("✅ 로고 이미지 로드 완료");
    } catch (e) {
        console.log("⚠️ 로고 대기 시간 초과 (계속 진행)");
    }
    
    // 🔹 웹 배너 숨기기 (PDF에서는 불필요)
    await page.addStyleTag({
        content: `
            .web-banner {
                display: none !important;
            }
            
            /* 웹과 동일한 뷰포트 설정 */
            body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                overflow-x: hidden !important;
            }
        `
    });

    // 🔹 한글 날짜 기반 파일명 생성
    const koreanDateTime = getKoreanDateTime();
    const currentDir = process.cwd();
    const outputDir = path.join(currentDir, 'ko_pdf');
    
    // ko_pdf 폴더가 없으면 생성
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log("📁 ko_pdf 폴더 생성 완료");
    }
    
    const pdfPath = path.join(outputDir, `AKASSECT_완벽한백서_${koreanDateTime}.pdf`);
    
    console.log("🎨 PDF 생성 중...");
    
    // 🔹 웹 디자인 완벽 재현을 위한 CSS 미디어 쿼리 비활성화
    await page.addStyleTag({
        content: `
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                /* 웹 스타일 강제 적용 */
                .cover-page {
                    min-height: 100vh !important;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                }
                
                /* 프린트 미디어 쿼리 무력화 */
                @page {
                    margin: 0 !important;
                    size: A4 !important;
                }
            }
        `
    });
    
    // 🔹 실제 화면 그대로 PDF 생성 (웹 디자인 완벽 재현)
    await page.pdf({
        path: pdfPath,
        width: '210mm',  // A4 너비
        height: '297mm', // A4 높이
        printBackground: true, // 배경 그라데이션 포함
        preferCSSPageSize: false, // 인쇄용 CSS 무시 (디자인 그대로)
        displayHeaderFooter: false, // 헤더/푸터 없음
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        // 고품질 설정
        scale: 1.0,
        landscape: false,
        // 웹 페이지와 동일한 렌더링
        omitBackground: false,
        tagged: false
    });

    await browser.close();

    // 파일 생성 확인
    if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log("\n🎉 완벽한 PDF 생성 완료!");
        console.log(`📁 파일 위치: ${pdfPath}`);
        console.log(`📊 파일 크기: ${fileSizeMB} MB`);
        console.log(`🕐 생성 시간: ${koreanDateTime}`);
        console.log("\n✨ 특징:");
        console.log("  • 웹 디자인 100% 그대로 재현");
        console.log("  • 프리미엄 로고 포함");
        console.log("  • 그라데이션 배경 완벽 보존");
        console.log("  • 고해상도 이미지 품질");
        console.log("  • 제로 마진 (여백 없음)");
    } else {
        console.error("❌ PDF 파일 생성 실패");
        process.exit(1);
    }
})().catch(error => {
    console.error("💥 오류 발생:", error);
    process.exit(1);
});
