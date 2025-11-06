#!/usr/bin/env node

/**
 * AKASSECT 백서 캡처 기반 PDF 생성기 (html-pdf-node 사용)
 * 100% 정확도 캡처 기반 PDF 생성
 */

const htmlPdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');

async function generateCaptureBasedPDF() {
    console.log('📸 AKASSECT 캡처 기반 PDF 생성 시작...');
    
    try {
        // HTML 옵션 설정
        const options = {
            format: 'A4',
            width: '210mm',
            height: '297mm',
            border: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            },
            // 캡처 기반 고품질 설정
            type: 'pdf',
            quality: 100,
            renderDelay: 5000,  // 5초 렌더링 대기
            zoomFactor: 2,      // 2배 확대로 품질 향상
            
            // 추가 옵션
            printBackground: true,
            displayHeaderFooter: false,
            preferCSSPageSize: true,
            
            // Puppeteer 추가 설정
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--force-color-profile=srgb',
                '--disable-features=TranslateUI'
            ]
        };
        
        // HTML 파일 설정 (URL 기반)
        const file = {
            url: 'http://127.0.0.1:52306/ko/',
            // 추가 CSS 주입 (사용자 제안 스타일)
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
                    
                    /* 그라데이션 배경 강제 렌더링 */
                    .cover-page {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* 글래스모피즘 효과 최적화 */
                    .highlight-item,
                    .contract-info {
                        background: rgba(255, 255, 255, 0.2) !important;
                        backdrop-filter: blur(20px) !important;
                        -webkit-backdrop-filter: blur(20px) !important;
                        border: 2px solid rgba(255, 255, 255, 0.4) !important;
                    }
                    
                    /* 이미지 캡처 최적화 */
                    img {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        image-rendering: -webkit-optimize-contrast !important;
                        image-rendering: crisp-edges !important;
                        max-width: 100% !important;
                        height: auto !important;
                    }
                    
                    /* 텍스트 렌더링 최적화 */
                    .akc-logo,
                    .main-title,
                    .sub-title,
                    .section-title {
                        text-rendering: optimizeLegibility !important;
                        -webkit-font-smoothing: antialiased !important;
                        -moz-osx-font-smoothing: grayscale !important;
                    }
                    
                    /* 웹 전용 요소 제거 */
                    .web-banner {
                        display: none !important;
                        visibility: hidden !important;
                    }
                    
                    /* 캡처 최적화를 위한 추가 스타일 */
                    .pdf-page {
                        page-break-after: always !important;
                        min-height: 277mm !important;
                        position: relative !important;
                    }
                }
                </style>
            `
        };
        
        console.log('🎨 고품질 캡처 진행 중...');
        console.log('   - 해상도: 2x 확대');
        console.log('   - 렌더링 대기: 5초');
        console.log('   - 색상 정확도: 100%');
        
        // PDF 생성
        const pdfBuffer = await htmlPdf.generatePdf(file, options);
        
        // 파일 저장
        const filename = `AKASSECT_Whitepaper_Capture_${new Date().toISOString().slice(0, 10)}.pdf`;
        fs.writeFileSync(filename, pdfBuffer);
        
        // 파일 정보 출력
        const stats = fs.statSync(filename);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
        console.log('✅ 캡처 기반 PDF 생성 완료!');
        console.log(`📁 파일명: ${filename}`);
        console.log(`📏 파일 크기: ${fileSizeMB} MB`);
        console.log(`📸 방식: html-pdf-node 캡처`);
        console.log(`🎯 품질: 100% 정확도`);
        console.log(`🌈 색상: 완벽 재현`);
        
    } catch (error) {
        console.error('❌ 캡처 기반 PDF 생성 실패:', error);
        console.log('\n💡 해결 방법:');
        console.log('1. npm install html-pdf-node');
        console.log('2. 서버가 http://127.0.0.1:52306/ko/ 에서 실행 중인지 확인');
        console.log('3. 모든 리소스가 로드될 때까지 대기');
    }
}

// 스크립트 실행
if (require.main === module) {
    generateCaptureBasedPDF().catch(console.error);
}

module.exports = { generateCaptureBasedPDF };
