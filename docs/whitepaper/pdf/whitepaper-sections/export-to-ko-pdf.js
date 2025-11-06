#!/usr/bin/env node

/**
 * AKASSECT 백서 ko_pdf 폴더 익스포트 스크립트
 * 버전별로 정리하여 한글 폴더에 저장
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 버전 정보
const versions = [
    {
        name: 'AKASSECT-공식백서-v1.0-정식버전-한국어',
        description: '정식 출시 버전',
        type: 'release'
    },
    {
        name: 'AKASSECT-공식백서-v1.0-임시버전-한국어',
        description: '검토용 임시 버전',
        type: 'draft'
    }
];

async function generateVersionedPDFs() {
    console.log('🚀 AKASSECT 백서 버전별 PDF 생성 시작...');
    
    // ko_pdf 폴더 생성
    const outputDir = path.join(__dirname, '..', 'ko_pdf');
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
        for (const version of versions) {
            console.log(`\n📄 ${version.description} 생성 중...`);
            
            const page = await browser.newPage();
            
            // 고해상도 설정
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 2
            });
            
            // 페이지 로드
            await page.goto('http://localhost:8082/ko/index.html', {
                waitUntil: 'networkidle0',
                timeout: 60000
            });
            
            // 버전별 설정
            await page.evaluate((versionType) => {
                // 웹 배너 숨기기
                const banner = document.querySelector('.web-banner');
                if (banner) {
                    banner.style.display = 'none';
                }
                
                // PDF 모드 활성화
                document.body.classList.add('pdf-mode');
                
                // 버전 정보 업데이트
                const versionBadges = document.querySelectorAll('.version-badge');
                versionBadges.forEach(badge => {
                    if (versionType === 'release') {
                        badge.textContent = '정식버전';
                        badge.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                    } else {
                        badge.textContent = '임시버전';
                        badge.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
                    }
                });
                
                // 푸터 버전 정보 업데이트
                const footerVersions = document.querySelectorAll('.footer-content span:last-child');
                footerVersions.forEach(span => {
                    if (versionType === 'release') {
                        span.textContent = '한국어 - 정식버전';
                    } else {
                        span.textContent = '한국어 - 임시버전';
                    }
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
            }, version.type);
            
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
            const filename = `${version.name}-${timestamp}.pdf`;
            const outputPath = path.join(outputDir, filename);
            
            // PDF 파일 저장
            fs.writeFileSync(outputPath, pdfBuffer);
            
            console.log(`✅ ${version.description} 완료!`);
            console.log(`📁 파일: ${filename}`);
            console.log(`📏 크기: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
            
            await page.close();
        }
        
        // README 파일 생성
        const readmeContent = generateReadme();
        fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
        
        console.log('\n🎉 모든 버전 PDF 생성 완료!');
        console.log(`📁 출력 폴더: ${outputDir}`);
        
    } catch (error) {
        console.error('❌ PDF 생성 실패:', error);
    } finally {
        await browser.close();
    }
}

function generateReadme() {
    const timestamp = new Date().toISOString().slice(0, 10);
    
    return `# AKASSECT 공식 백서 - 한국어 PDF 컬렉션

## 📄 포함된 문서들

### 정식 버전
- **파일명**: \`AKASSECT-공식백서-v1.0-정식버전-한국어-${timestamp}.pdf\`
- **용도**: 공식 배포용, 투자자 제출용
- **특징**: 정식 버전 배지, 완성된 디자인

### 임시 버전  
- **파일명**: \`AKASSECT-공식백서-v1.0-임시버전-한국어-${timestamp}.pdf\`
- **용도**: 내부 검토용, 피드백 수집용
- **특징**: 임시 버전 배지, 수정 가능 표시

## 🎯 문서 정보

- **프로젝트**: AKASSECT (AKC) - AI 기반 P2P 결제 시스템
- **버전**: v1.0
- **언어**: 한국어
- **생성일**: ${new Date().toLocaleDateString('ko-KR')}
- **페이지 수**: 약 15-20 페이지
- **파일 크기**: 5-10MB (고품질 이미지 포함)

## 📋 문서 구성

1. **커버 페이지** - 프로젝트 소개
2. **목차** - 전체 구성 안내
3. **서론** - 프로젝트 개요 및 비전
4. **시장 분석** - 프리미엄 성장 차트 포함
5. **시스템 개요** - 기술 구조 설명
6. **기술 아키텍처** - 상세 기술 정보
7. **토큰 구조** - AKC 토큰 정보
8. **안전결제 메커니즘** - 핵심 기능 설명
9. **AI 위험분석** - AI 시스템 소개
10. **비즈니스 모델** - 수익 구조
11. **로드맵** - 프리미엄 타임라인 차트
12. **팀 및 파트너** - Fortune 500 출신 팀 소개
13. **법률 및 면책** - 법적 고지사항
14. **결론** - 프로젝트 요약
15. **부록** - 추가 정보

## 🎨 디자인 특징

- **프리미엄 그라데이션**: 전문적인 색상 팔레트
- **고품질 차트**: 인터랙티브 시각화 요소
- **팀 프로필**: Unsplash 고품질 이미지
- **전문 타이포그래피**: Google Fonts 사용
- **A4 최적화**: 완벽한 인쇄 레이아웃

## 📞 연락처

- **웹사이트**: https://akassect.com
- **이메일**: team@akassect.com
- **GitHub**: https://github.com/akassect

---
© 2025 AKASSECT Project Team. All rights reserved.
`;
}

// 스크립트 실행
if (require.main === module) {
    generateVersionedPDFs().catch(console.error);
}

module.exports = { generateVersionedPDFs };
