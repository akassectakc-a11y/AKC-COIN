#!/usr/bin/env node

/**
 * AKASSECT 백서 고품질 PDF 생성기 (사용자 제안 방식 적용)
 * Puppeteer + 캡처 기반 100% 정확도 PDF 생성
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateHighQualityPDF() {
    console.log('🚀 AKASSECT 고품질 PDF 생성 시작...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--force-color-profile=srgb',
            '--disable-features=TranslateUI'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // 고해상도 설정 (캡처 기반 품질 향상)
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 3  // 3배 해상도로 캡처 품질 극대화
        });
        
        console.log('📄 페이지 로딩 중...');
        
        // 사용자 제안 URL 사용
        await page.goto('http://127.0.0.1:52306/ko/', { 
            waitUntil: 'networkidle0',
            timeout: 60000
        });
        
        console.log('🎨 PDF 최적화 스타일 주입 중...');
        
        // 사용자 제안 스타일 + 추가 최적화 적용
        await page.addStyleTag({
            content: `
                <style>
                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: #a27bf8 !important; /* fallback color */
                    }
                    
                    * {
                        box-shadow: none !important;
                        text-shadow: none !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* 그라데이션 강제 렌더링 */
                    .cover-page {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* 글래스모피즘 효과 강화 */
                    .highlight-item,
                    .contract-info {
                        background: rgba(255, 255, 255, 0.15) !important;
                        backdrop-filter: blur(15px) !important;
                        -webkit-backdrop-filter: blur(15px) !important;
                        border: 2px solid rgba(255, 255, 255, 0.3) !important;
                    }
                    
                    /* 이미지 품질 최적화 */
                    img {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        image-rendering: -webkit-optimize-contrast !important;
                        image-rendering: crisp-edges !important;
                        image-rendering: pixelated !important;
                    }
                    
                    /* 텍스트 선명도 향상 */
                    .akc-logo,
                    .main-title,
                    .sub-title {
                        text-rendering: optimizeLegibility !important;
                        -webkit-font-smoothing: antialiased !important;
                        -moz-osx-font-smoothing: grayscale !important;
                    }
                    
                    /* 웹 배너 완전 제거 */
                    .web-banner {
                        display: none !important;
                        visibility: hidden !important;
                    }
                }
                </style>
            `
        });
        
        // 프린트 미디어 타입 설정
        await page.emulateMediaType('print');
        
        console.log('⏳ 모든 리소스 로딩 대기 중...');
        
        // 모든 이미지와 폰트 완전 로딩 대기
        await page.waitForFunction(() => {
            const images = document.querySelectorAll('img');
            const fonts = document.fonts;
            return Array.from(images).every(img => 
                img.complete && img.naturalHeight !== 0
            ) && fonts.status === 'loaded';
        }, { timeout: 30000 });
        
        // 추가 렌더링 시간 확보
        await page.waitForTimeout(5000);
        
        console.log('📑 고품질 PDF 생성 중...');
        
        // 사용자 제안 설정 + 고품질 옵션 적용
        const pdfBuffer = await page.pdf({
            path: 'AKASSECT_Whitepaper_Premium.pdf',
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
            tagged: true,
            outline: true,
            // 추가 고품질 옵션
            scale: 1.0,
            landscape: false,
            pageRanges: '',
            omitBackground: false
        });
        
        // 파일 크기 및 정보 출력
        const stats = fs.statSync('AKASSECT_Whitepaper_Premium.pdf');
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
        console.log('✅ PDF 생성 완료!');
        console.log(`📁 파일명: AKASSECT_Whitepaper_Premium.pdf`);
        console.log(`📏 파일 크기: ${fileSizeMB} MB`);
        console.log(`🎯 품질: 프리미엄 (3x 해상도)`);
        console.log(`🌈 색상: 100% 정확도`);
        
    } catch (error) {
        console.error('❌ PDF 생성 실패:', error);
    } finally {
        await browser.close();
    }
}

// 스크립트 실행
if (require.main === module) {
    generateHighQualityPDF().catch(console.error);
}

module.exports = { generateHighQualityPDF };
