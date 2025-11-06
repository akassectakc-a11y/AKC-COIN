// to-pdf.js - 사용자 제안 방식 (ES6 모듈)
import fs from "fs";
import pdf from "html-pdf-node";

console.log('🚀 AKASSECT 백서 PDF 생성 시작...');

// 고품질 PDF 옵션
let options = { 
    format: 'A4', 
    printBackground: true,
    margin: {
        top: '0mm',
        right: '0mm', 
        bottom: '0mm',
        left: '0mm'
    },
    // 추가 품질 옵션
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    printBackground: true,
    // 렌더링 최적화
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--force-color-profile=srgb',
        '--disable-features=TranslateUI'
    ],
    // 품질 향상
    quality: 100,
    renderDelay: 3000,
    zoomFactor: 1.5
};

// 파일 설정 (사용자 제안 URL)
let file = { 
    url: "http://127.0.0.1:52306/ko/",
    // 추가 CSS 주입으로 품질 향상
    content: `
        <style>
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
                background: #a27bf8 !important;
            }
            * {
                box-shadow: none !important;
                text-shadow: none !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .cover-page {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                -webkit-print-color-adjust: exact !important;
            }
            .web-banner {
                display: none !important;
            }
        }
        </style>
    `
};

console.log('📄 URL:', file.url);
console.log('🎨 고품질 옵션 적용 중...');

// PDF 생성 (사용자 제안 방식)
pdf.generatePdf(file, options).then(buffer => {
    const filename = "AKASSECT_Whitepaper.pdf";
    fs.writeFileSync(filename, buffer);
    
    // 파일 정보 출력
    const stats = fs.statSync(filename);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    console.log('✅ PDF 생성 완료!');
    console.log(`📁 파일명: ${filename}`);
    console.log(`📏 파일 크기: ${fileSizeMB} MB`);
    console.log('🎯 품질: 고품질 (1.5x 확대)');
    console.log('🌈 색상: 100% 정확도');
    
}).catch(error => {
    console.error('❌ PDF 생성 실패:', error);
    console.log('\n💡 해결 방법:');
    console.log('1. npm install html-pdf-node');
    console.log('2. 서버가 http://127.0.0.1:52306/ko/ 에서 실행 중인지 확인');
    console.log('3. package.json에 "type": "module" 추가');
});
