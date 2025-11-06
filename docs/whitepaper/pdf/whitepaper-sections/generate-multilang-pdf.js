#!/usr/bin/env node

/**
 * AKASSECT 다국어 백서 PDF 생성기
 * 한국어, 영어, 일본어, 중국어 버전 자동 생성
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 언어별 설정
const languages = {
    ko: {
        name: 'Korean',
        nativeName: '한국어',
        port: 8082,
        filename: 'AKASSECT-공식백서-v1.0-한국어',
        versionText: '한국어 - 정식버전'
    },
    en: {
        name: 'English',
        nativeName: 'English',
        port: 8083,
        filename: 'AKASSECT-Official-Whitepaper-v1.0-English',
        versionText: 'English - Release Version'
    },
    ja: {
        name: 'Japanese',
        nativeName: '日本語',
        port: 8084,
        filename: 'AKASSECT-公式ホワイトペーパー-v1.0-日本語',
        versionText: '日本語 - 正式版'
    },
    zh: {
        name: 'Chinese',
        nativeName: '中文',
        port: 8085,
        filename: 'AKASSECT-官方白皮书-v1.0-中文',
        versionText: '中文 - 正式版'
    }
};

async function generateMultiLanguagePDFs() {
    console.log('🌐 AKASSECT 다국어 백서 PDF 생성 시작...');
    
    // 출력 폴더 생성
    const outputDir = path.join(__dirname, 'multilang-pdfs');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
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
        for (const [langCode, config] of Object.entries(languages)) {
            console.log(`\n📄 ${config.name} (${config.nativeName}) 버전 생성 중...`);
            
            const page = await browser.newPage();
            
            // 고해상도 설정
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 2
            });
            
            // 페이지 로드
            const url = `http://localhost:${config.port}/${langCode}/index.html`;
            console.log(`   URL: ${url}`);
            
            try {
                await page.goto(url, {
                    waitUntil: 'networkidle0',
                    timeout: 60000
                });
            } catch (error) {
                console.log(`   ⚠️  서버가 실행되지 않음. 기본 포트 8082 사용`);
                await page.goto(`http://localhost:8082/${langCode}/index.html`, {
                    waitUntil: 'networkidle0',
                    timeout: 60000
                });
            }
            
            // PDF 최적화 설정
            await page.evaluate((versionText) => {
                // 웹 배너 숨기기
                const banner = document.querySelector('.web-banner');
                if (banner) {
                    banner.style.display = 'none';
                }
                
                // PDF 모드 활성화
                document.body.classList.add('pdf-mode');
                
                // 푸터 버전 정보 업데이트
                const footerVersions = document.querySelectorAll('.footer-content span:last-child');
                footerVersions.forEach(span => {
                    span.textContent = versionText;
                });
                
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
            }, config.versionText);
            
            // 인쇄 미디어 타입 설정
            await page.emulateMediaType('print');
            
            // 이미지 로딩 대기
            await page.waitForFunction(() => {
                const images = document.querySelectorAll('img');
                return Array.from(images).every(img => 
                    img.complete && img.naturalHeight !== 0
                );
            }, { timeout: 30000 });
            
            // 차트 렌더링 대기
            await page.waitForTimeout(3000);
            
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
                tagged: true,
                outline: true
            });
            
            // 파일명 및 경로 설정
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `${config.filename}-${timestamp}.pdf`;
            const outputPath = path.join(outputDir, filename);
            
            // PDF 파일 저장
            fs.writeFileSync(outputPath, pdfBuffer);
            
            console.log(`   ✅ ${config.name} 버전 완료!`);
            console.log(`   📁 파일: ${filename}`);
            console.log(`   📏 크기: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
            
            await page.close();
        }
        
        // README 파일 생성
        const readmeContent = generateMultiLangReadme();
        fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
        
        console.log('\n🎉 모든 언어 버전 PDF 생성 완료!');
        console.log(`📁 출력 폴더: ${outputDir}`);
        
        // 생성된 파일 목록 표시
        const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
        console.log('\n📋 생성된 파일들:');
        files.forEach(file => {
            const stats = fs.statSync(path.join(outputDir, file));
            console.log(`   📄 ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        });
        
    } catch (error) {
        console.error('❌ PDF 생성 실패:', error);
    } finally {
        await browser.close();
    }
}

function generateMultiLangReadme() {
    const timestamp = new Date().toISOString().slice(0, 10);
    
    return `# AKASSECT 다국어 백서 PDF 컬렉션

## 🌐 포함된 언어 버전

### 한국어 (Korean)
- **파일명**: \`AKASSECT-공식백서-v1.0-한국어-${timestamp}.pdf\`
- **대상**: 한국 투자자 및 파트너
- **특징**: 한국어 완전 번역, 현지화된 내용

### 영어 (English)
- **파일명**: \`AKASSECT-Official-Whitepaper-v1.0-English-${timestamp}.pdf\`
- **대상**: 글로벌 투자자 및 국제 파트너
- **특징**: 국제 표준 영어, 글로벌 시장 대응

### 일본어 (Japanese)
- **파일명**: \`AKASSECT-公式ホワイトペーパー-v1.0-日本語-${timestamp}.pdf\`
- **대상**: 일본 시장 및 투자자
- **특징**: 일본어 완전 번역, 일본 시장 특화

### 중국어 (Chinese)
- **파일명**: \`AKASSECT-官方白皮书-v1.0-中文-${timestamp}.pdf\`
- **대상**: 중국 및 중화권 시장
- **특징**: 간체 중국어, 중국 시장 대응

## 📊 문서 정보

- **프로젝트**: AKASSECT (AKC) - AI 기반 P2P 결제 시스템
- **버전**: v1.0
- **생성일**: ${new Date().toLocaleDateString('ko-KR')}
- **총 언어**: 4개 언어
- **페이지 수**: 약 15-20 페이지 (언어별)
- **총 파일 크기**: 약 20-40MB

## 🎯 사용 목적별 가이드

### 투자자 제출용
- **영어**: 해외 기관투자자
- **한국어**: 국내 투자자
- **일본어**: 일본 투자자
- **중국어**: 중화권 투자자

### 파트너십 제안용
- **영어**: 글로벌 파트너십
- **현지어**: 각 지역별 파트너십

### 마케팅 및 홍보용
- **현지어**: 각 시장별 마케팅 자료
- **영어**: 글로벌 마케팅

## 🚀 생성 방법

### 자동 생성 (권장)
\`\`\`bash
cd whitepaper-sections
node generate-multilang-pdf.js
\`\`\`

### 개별 언어 생성
\`\`\`bash
# 한국어
cd ko && python3 -m http.server 8082 &
node ../generate-pdf.js

# 영어  
cd en && python3 -m http.server 8083 &
node ../generate-pdf.js

# 일본어
cd ja && python3 -m http.server 8084 &
node ../generate-pdf.js

# 중국어
cd zh && python3 -m http.server 8085 &
node ../generate-pdf.js
\`\`\`

## 📞 연락처

### 각 지역별 연락처
- **한국**: korea@akassect.com
- **글로벌**: global@akassect.com  
- **일본**: japan@akassect.com
- **중국**: china@akassect.com

### 기술 지원
- **개발팀**: dev@akassect.com
- **GitHub**: https://github.com/akassect/whitepaper

---
**© 2025 AKASSECT Project Team. All rights reserved.**

이 컬렉션의 모든 문서는 AKASSECT 프로젝트의 공식 다국어 자료입니다.
`;
}

// 스크립트 실행
if (require.main === module) {
    generateMultiLanguagePDFs().catch(console.error);
}

module.exports = { generateMultiLanguagePDFs };
