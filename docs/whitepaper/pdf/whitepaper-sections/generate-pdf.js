#!/usr/bin/env node

/**
 * AKASSECT 백서 고품질 PDF 생성기
 * Puppeteer를 사용하여 완벽한 디자인 재현
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('🚀 AKASSECT 백서 PDF 생성 시작...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // 고해상도 설정
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2
        });
        
        console.log('📄 페이지 로딩 중...');
        
        // 페이지 로드 (로컬 서버 필요)
        await page.goto('http://localhost:8082/ko/index.html', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });
        
        console.log('🎨 PDF 모드 활성화...');
        
        // PDF 최적화 설정
        await page.evaluate(() => {
            // 웹 배너 숨기기
            const banner = document.querySelector('.web-banner');
            if (banner) {
                banner.style.display = 'none';
            }
            
            // PDF 모드 클래스 추가
            document.body.classList.add('pdf-mode');
            
            // 색상 및 애니메이션 최적화
            const style = document.createElement('style');
            style.textContent = `
                /* 애니메이션 비활성화 */
                *, *::before, *::after {
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0s !important;
                    transition-delay: 0s !important;
                }
                
                /* 색상 강제 출력 */
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                /* 그라데이션 강화 */
                .premium-chart,
                .highlight-box,
                .executive-card,
                .content-table th,
                .section-header,
                .expertise-tags .tag,
                .timeline-item,
                .growth-bar {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                /* 이미지 품질 향상 */
                img {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: crisp-edges;
                }
            `;
            document.head.appendChild(style);
        });
        
        // 인쇄 미디어 타입 설정
        await page.emulateMediaType('print');
        
        console.log('🖼️ 이미지 로딩 대기 중...');
        
        // 모든 이미지 로드 완료 대기
        await page.waitForFunction(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).every(img => 
                img.complete && img.naturalHeight !== 0
            );
        }, { timeout: 30000 });
        
        console.log('📊 차트 렌더링 대기 중...');
        
        // 차트 렌더링 완료 대기
        await page.waitForTimeout(3000);
        
        console.log('📑 PDF 생성 중...');
        
        // PDF 생성 (여백 제거)
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: true,
            tagged: true, // 접근성
            outline: true // 북마크
        });
        
        // 파일명 생성
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `AKASSECT-Official-Whitepaper-v1.0-KO-${timestamp}.pdf`;
        const outputPath = path.join(__dirname, filename);
        
        // PDF 파일 저장
        fs.writeFileSync(outputPath, pdfBuffer);
        
        console.log('✅ PDF 생성 완료!');
        console.log(`📁 파일 위치: ${outputPath}`);
        console.log(`📏 파일 크기: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        
    } catch (error) {
        console.error('❌ PDF 생성 실패:', error);
    } finally {
        await browser.close();
    }
}

// 스크립트 실행
if (require.main === module) {
    generatePDF().catch(console.error);
}

module.exports = { generatePDF };
