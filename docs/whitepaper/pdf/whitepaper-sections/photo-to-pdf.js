// photo-to-pdf.js
// 웹 페이지를 실제 사진처럼 찍어서 PDF로 만드는 방식
// 완전한 이미지 기반 PDF 생성

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
    console.log("📸 AKASSECT 사진 기반 PDF 생성 시작...");
    
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
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding",
                "--disable-backgrounding-occluded-windows",
                "--disable-features=VizDisplayCompositor",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-infobars",
                "--disable-web-security"
            ],
            devtools: false // 개발자 도구 완전 비활성화
        });

        const page = await browser.newPage();
        
        // 고해상도 설정 (실제 사진 품질)
        await page.setViewport({
            width: 1920,  // 고해상도 너비
            height: 1080, // 고해상도 높이
            deviceScaleFactor: 2 // 2배 해상도 (Retina 급)
        });

        // 페이지 로딩
        const targetURL = "http://127.0.0.1:52306/ko/";
        console.log(`📄 페이지 로딩: ${targetURL}`);
        
        await page.goto(targetURL, {
            waitUntil: "networkidle0", // 모든 네트워크 완료 대기
            timeout: 30000,
        });

        console.log("⏳ 완전한 렌더링 대기...");
        await page.waitForTimeout(3000);

        // 모든 이미지 로딩 완료 대기
        console.log("🖼️ 모든 이미지 로딩 대기...");
        await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve, reject) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve); // 에러도 완료로 처리
                    setTimeout(resolve, 5000); // 5초 타임아웃
                });
            }));
        });

        // 차트 및 동적 콘텐츠 로딩 대기
        console.log("📊 차트 및 동적 콘텐츠 로딩 대기...");
        await page.evaluate(async () => {
            // Canvas 요소들이 렌더링될 때까지 대기
            const canvases = document.querySelectorAll('canvas');
            if (canvases.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
            // SVG 요소들이 렌더링될 때까지 대기
            const svgs = document.querySelectorAll('svg');
            if (svgs.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // 동적으로 생성되는 콘텐츠 대기
            const dynamicElements = document.querySelectorAll('[data-dynamic], .chart, .graph, .diagram');
            if (dynamicElements.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        });

        // 웹 폰트 로딩 완료 대기
        console.log("🔤 웹 폰트 로딩 완료 대기...");
        await page.evaluateHandle('document.fonts.ready');

        // 웹 배너 숨기기 (사진에 불필요한 요소 제거)
        await page.evaluate(() => {
            const banner = document.querySelector('.web-banner');
            if (banner) {
                banner.style.display = 'none';
            }
            
            // 스크롤바도 완전히 제거
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        });

        // 최종 렌더링 대기 (모든 것이 완료된 후)
        console.log("✨ 최종 렌더링 완료 대기...");
        await page.waitForTimeout(5000);

        // 파일 경로 설정
        const englishDateTime = getEnglishDateTime();
        const currentDir = process.cwd();
        const outputDir = path.join(currentDir, 'ko_pdf');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("📁 ko_pdf 폴더 생성 완료");
        }

        // 1단계: 전체 페이지 사진 촬영
        const photoPath = path.join(outputDir, `AKASSECT_Photo_${englishDateTime}.png`);
        console.log("📸 전체 페이지 사진 촬영 중...");
        
        await page.screenshot({
            path: photoPath,
            fullPage: true,
            type: 'png'
        });

        console.log(`✅ 사진 저장 완료: ${photoPath}`);

        // 2단계: 사진을 PDF로 변환
        const pdfPath = path.join(outputDir, `AKASSECT_PhotoPDF_${englishDateTime}.pdf`);
        console.log("🖼️ 사진을 PDF로 변환 중...");

        // 새로운 페이지에서 사진을 PDF로 변환
        const pdfPage = await browser.newPage();
        
        // A4 크기에 맞춰 페이지 설정
        await pdfPage.setViewport({
            width: 794,  // A4 너비 (픽셀)
            height: 1123 // A4 높이 (픽셀)
        });

        // 이미지를 Base64로 인코딩해서 HTML에 직접 삽입
        const imageBuffer = fs.readFileSync(photoPath);
        const base64Image = imageBuffer.toString('base64');
        
        const imageHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    background: white;
                    overflow: hidden;
                }
                
                .photo-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }
                
                .photo {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            <div class="photo-container">
                <img src="data:image/png;base64,${base64Image}" alt="AKASSECT 백서 사진" class="photo">
            </div>
        </body>
        </html>
        `;

        await pdfPage.setContent(imageHTML);
        await pdfPage.waitForTimeout(3000); // 이미지 로딩 대기

        // 사진을 PDF로 저장
        await pdfPage.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            preferCSSPageSize: false
        });

        console.log("\n📸 사진 기반 PDF 생성 완료!");
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            // 사진 파일 크기도 확인
            const photoStats = fs.statSync(photoPath);
            const photoSizeMB = (photoStats.size / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 PDF 위치: ${pdfPath}`);
            console.log(`📸 사진 위치: ${photoPath}`);
            console.log(`📊 PDF 크기: ${fileSizeMB} MB`);
            console.log(`🖼️ 사진 크기: ${photoSizeMB} MB`);
            console.log(`🕐 생성 시간: ${englishDateTime}`);
            console.log("\n✨ 특징:");
            console.log("  • 실제 사진처럼 웹 페이지 촬영");
            console.log("  • 고해상도 (1920x1080, 2배 스케일)");
            console.log("  • 완전한 이미지 기반 PDF");
            console.log("  • 웹과 100% 동일한 시각적 결과");
            console.log("  • PNG 사진 + PDF 두 파일 생성");
            console.log("  • 영문 파일명으로 PDF 호환성 개선");
            
            console.log("\n🔍 파일 설명:");
            console.log(`  • ${path.basename(photoPath)} - 원본 사진 파일`);
            console.log(`  • ${path.basename(pdfPath)} - 사진을 PDF로 변환한 파일`);
            
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
