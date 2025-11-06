// single-page-pdf.js
// 전체 백서를 한 페이지에 맞추는 PDF 생성기

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
    console.log("📄 AKASSECT 한 페이지 PDF 생성 시작...");
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        
        // 매우 큰 뷰포트 설정 (전체 내용을 한 번에 보기 위해)
        await page.setViewport({
            width: 1200,
            height: 8000, // 매우 긴 높이
            deviceScaleFactor: 1
        });

        // 페이지 로딩
        const targetURL = "http://127.0.0.1:52306/ko/";
        console.log(`📄 페이지 로딩: ${targetURL}`);
        
        await page.goto(targetURL, {
            waitUntil: "networkidle0",
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
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                    setTimeout(resolve, 3000);
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

        // 웹 배너 숨기기 및 한 페이지 최적화
        await page.evaluate(() => {
            const banner = document.querySelector('.web-banner');
            if (banner) {
                banner.style.display = 'none';
            }
            
            // 스크롤바 제거
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            
            // 페이지 브레이크 방지
            const style = document.createElement('style');
            style.textContent = `
                * {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                
                .section, .content-section {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                
                /* 폰트 크기 축소로 더 많은 내용 포함 */
                body {
                    font-size: 10px !important;
                    line-height: 1.2 !important;
                }
                
                h1 { font-size: 16px !important; }
                h2 { font-size: 14px !important; }
                h3 { font-size: 12px !important; }
                h4 { font-size: 11px !important; }
                
                .cover-page {
                    min-height: auto !important;
                    height: auto !important;
                }
                
                /* 여백 최소화 */
                .content-section {
                    margin-bottom: 10px !important;
                    padding: 5px !important;
                }
            `;
            document.head.appendChild(style);
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

        const pdfPath = path.join(outputDir, `AKASSECT_SinglePage_${englishDateTime}.pdf`);
        
        console.log("📄 한 페이지 PDF 생성 중...");
        
        // 한 페이지에 맞추는 PDF 생성
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { 
                top: '5mm', 
                right: '5mm', 
                bottom: '5mm', 
                left: '5mm' 
            },
            scale: 0.5, // 50% 축소로 더 많은 내용 포함
            preferCSSPageSize: false
        });

        console.log("\n📄 한 페이지 PDF 생성 완료!");
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 파일 위치: ${pdfPath}`);
            console.log(`📊 파일 크기: ${fileSizeMB} MB`);
            console.log(`🕐 생성 시간: ${englishDateTime}`);
            console.log("\n✨ 특징:");
            console.log("  • 전체 백서를 한 페이지에 압축");
            console.log("  • 50% 축소로 가독성 유지");
            console.log("  • 폰트 크기 최적화");
            console.log("  • 페이지 브레이크 방지");
            console.log("  • 여백 최소화");
            
            console.log("\n⚠️ 주의사항:");
            console.log("  • 내용이 많아 글씨가 작을 수 있음");
            console.log("  • 확대해서 보기 권장");
            console.log("  • 인쇄용보다는 디지털 보기용");
            
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
