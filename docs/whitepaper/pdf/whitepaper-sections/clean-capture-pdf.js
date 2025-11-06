// clean-capture-pdf.js
// 근본적 해결: 새로운 브라우저 인스턴스로 완전히 깔끔한 캡처

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
    console.log("🧹 AKASSECT 완전 깔끔한 PDF 생성 시작...");
    
    let browser;
    try {
        // 완전히 새로운 브라우저 프로세스 시작
        browser = await puppeteer.launch({
            headless: "new", // 새로운 헤드리스 모드
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox", 
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-plugins",
                "--disable-default-apps",
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding",
                "--disable-backgrounding-occluded-windows",
                "--disable-ipc-flooding-protection",
                "--disable-hang-monitor",
                "--disable-prompt-on-repost",
                "--disable-sync",
                "--disable-translate",
                "--disable-features=TranslateUI",
                "--disable-features=VizDisplayCompositor",
                "--disable-infobars",
                "--no-first-run",
                "--no-default-browser-check",
                "--no-pings",
                "--no-zygote",
                "--single-process",
                "--disable-web-security"
            ],
            ignoreDefaultArgs: ['--enable-automation'], // 자동화 감지 제거
            defaultViewport: null,
            devtools: false
        });

        // 완전히 새로운 페이지 생성
        const page = await browser.newPage();
        
        // 모든 자동화 흔적 제거
        await page.evaluateOnNewDocument(() => {
            // webdriver 속성 제거
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            
            // 자동화 관련 속성들 제거
            delete window.chrome;
            delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
            delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
            delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
        });

        // User-Agent를 일반 브라우저로 설정
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // 뷰포트를 일반 데스크톱 크기로 설정
        await page.setViewport({
            width: 1440,
            height: 900,
            deviceScaleFactor: 2
        });

        // 페이지 로딩
        const targetURL = "http://127.0.0.1:52306/ko/";
        console.log(`📄 깔끔한 페이지 로딩: ${targetURL}`);
        
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

        // 웹 배너 및 불필요한 요소 제거
        await page.evaluate(() => {
            // 웹 배너 제거
            const banner = document.querySelector('.web-banner');
            if (banner) banner.remove();
            
            // 스크롤바 제거
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            
            // 개발자 도구 관련 요소들 강제 제거
            const devElements = document.querySelectorAll('[class*="devtools"], [id*="devtools"], [class*="debug"], [id*="debug"]');
            devElements.forEach(el => el.remove());
            
            // 브라우저 UI 요소들 제거
            const uiElements = document.querySelectorAll('.chrome-extension, .browser-action, .devtools-panel');
            uiElements.forEach(el => el.remove());
        });

        console.log("✨ 최종 정리 및 렌더링 대기...");
        await page.waitForTimeout(3000);

        // 파일 경로 설정
        const englishDateTime = getEnglishDateTime();
        const currentDir = process.cwd();
        const outputDir = path.join(currentDir, 'ko_pdf');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("📁 ko_pdf 폴더 생성 완료");
        }

        // 1단계: 완전히 깔끔한 스크린샷
        const photoPath = path.join(outputDir, `AKASSECT_Clean_${englishDateTime}.png`);
        console.log("📸 완전히 깔끔한 스크린샷 촬영 중...");
        
        await page.screenshot({
            path: photoPath,
            fullPage: true,
            type: 'png',
            omitBackground: false
        });

        console.log(`✅ 깔끔한 스크린샷 저장: ${photoPath}`);

        // 2단계: 스크린샷을 PDF로 변환
        const pdfPath = path.join(outputDir, `AKASSECT_CleanPDF_${englishDateTime}.pdf`);
        console.log("🎨 깔끔한 스크린샷을 PDF로 변환 중...");

        // 새로운 페이지에서 이미지를 PDF로 변환
        const pdfPage = await browser.newPage();
        
        // 이미지를 Base64로 인코딩
        const imageBuffer = fs.readFileSync(photoPath);
        const base64Image = imageBuffer.toString('base64');
        
        const cleanHTML = `
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
                .clean-image { 
                    max-width: 100%; 
                    height: auto; 
                    display: block; 
                    object-fit: contain; 
                }
            </style>
        </head>
        <body>
            <div class="image-container">
                <img src="data:image/png;base64,${base64Image}" alt="AKASSECT 깔끔한 백서" class="clean-image">
            </div>
        </body>
        </html>
        `;

        await pdfPage.setContent(cleanHTML);
        await pdfPage.waitForTimeout(2000);

        // 깔끔한 PDF 저장
        await pdfPage.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            preferCSSPageSize: false
        });

        console.log("\n🧹 완전히 깔끔한 PDF 생성 완료!");
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            const photoStats = fs.readFileSync(photoPath);
            const photoSizeMB = (photoStats.length / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 PDF 위치: ${pdfPath}`);
            console.log(`📸 스크린샷 위치: ${photoPath}`);
            console.log(`📊 PDF 크기: ${fileSizeMB} MB`);
            console.log(`🖼️ 스크린샷 크기: ${photoSizeMB} MB`);
            console.log(`🕐 생성 시간: ${englishDateTime}`);
            console.log("\n✨ 특징:");
            console.log("  • 새로운 브라우저 프로세스로 완전 격리");
            console.log("  • 모든 자동화 흔적 제거");
            console.log("  • 디버깅 도구 완전 차단");
            console.log("  • 브라우저 UI 요소 강제 제거");
            console.log("  • 100% 깔끔한 웹 콘텐츠만");
            
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
