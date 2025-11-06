# AKASSECT 백서 PDF 익스포트 가이드

## 🎯 고품질 PDF 익스포트 방법들

### 방법 1: 브라우저 내장 PDF 기능 (현재 구현됨)
```javascript
// 현재 구현된 방법
function downloadPDF() {
    // 웹 배너 숨기기
    const banner = document.querySelector('.web-banner');
    if (banner) banner.style.display = 'none';
    
    // PDF 모드 활성화
    document.body.classList.add('pdf-mode');
    
    // 브라우저 인쇄 다이얼로그
    window.print();
    
    // 복원
    setTimeout(() => {
        if (banner) banner.style.display = 'flex';
        document.body.classList.remove('pdf-mode');
    }, 1000);
}
```

**장점**: 즉시 사용 가능, 별도 설치 불필요
**단점**: 브라우저별 차이, 제한적 디자인 제어

---

### 방법 2: Puppeteer를 이용한 고품질 PDF 생성

#### 설치 및 설정
```bash
npm install puppeteer
```

#### PDF 생성 스크립트
```javascript
// generate-pdf.js
const puppeteer = require('puppeteer');

async function generatePDF() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 페이지 로드
    await page.goto('http://localhost:8082/ko/index.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // 웹 배너 숨기기
    await page.evaluate(() => {
        const banner = document.querySelector('.web-banner');
        if (banner) banner.style.display = 'none';
        document.body.classList.add('pdf-mode');
    });
    
    // 모든 이미지 로드 대기
    await page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
    });
    
    // PDF 생성
    const pdf = await page.pdf({
        path: 'AKASSECT-Premium-Whitepaper.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true
    });
    
    await browser.close();
    console.log('PDF 생성 완료: AKASSECT-Premium-Whitepaper.pdf');
}

generatePDF().catch(console.error);
```

**장점**: 완벽한 디자인 재현, 프로그래밍 제어 가능
**단점**: Node.js 환경 필요

---

### 방법 3: Chrome DevTools Protocol 사용

#### 고급 PDF 설정
```javascript
// advanced-pdf.js
const puppeteer = require('puppeteer');

async function generateAdvancedPDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // 고해상도 설정
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2
    });
    
    await page.goto('http://localhost:8082/ko/index.html', {
        waitUntil: 'networkidle0'
    });
    
    // CSS 미디어 쿼리 적용
    await page.emulateMediaType('print');
    
    // 커스텀 CSS 주입
    await page.addStyleTag({
        content: `
            @page {
                size: A4;
                margin: 20mm;
            }
            .web-banner { display: none !important; }
            .pdf-page { 
                page-break-after: always;
                min-height: 247mm;
            }
            .page-footer {
                position: fixed;
                bottom: 0;
            }
        `
    });
    
    const pdf = await page.pdf({
        path: 'AKASSECT-Advanced-Whitepaper.pdf',
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true, // PDF 접근성
        outline: true // 북마크 생성
    });
    
    await browser.close();
}
```

---

### 방법 4: wkhtmltopdf 사용

#### 설치
```bash
# macOS
brew install wkhtmltopdf

# Ubuntu
sudo apt-get install wkhtmltopdf

# Windows
# https://wkhtmltopdf.org/downloads.html
```

#### 사용법
```bash
wkhtmltopdf \
  --page-size A4 \
  --margin-top 20mm \
  --margin-right 20mm \
  --margin-bottom 20mm \
  --margin-left 20mm \
  --print-media-type \
  --enable-local-file-access \
  --javascript-delay 3000 \
  http://localhost:8082/ko/index.html \
  AKASSECT-Whitepaper.pdf
```

---

### 방법 5: 온라인 PDF 변환 서비스

#### HTML/CSS to PDF API
```javascript
// 예: PDFShift API
const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        source: 'http://localhost:8082/ko/index.html',
        format: 'A4',
        margin: '20mm',
        print_background: true,
        wait_for: 'networkidle'
    })
});
```

---

## 🎨 최적 PDF 설정

### CSS 최적화
```css
/* PDF 전용 스타일 */
@media print {
    .web-banner { display: none !important; }
    
    .pdf-page {
        page-break-after: always;
        min-height: 247mm;
        padding-bottom: 30mm;
    }
    
    .page-footer {
        position: fixed;
        bottom: 5mm;
        left: 0;
        right: 0;
    }
    
    /* 고품질 이미지 */
    img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
    }
    
    /* 색상 보정 */
    .premium-chart {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
    }
}
```

### 폰트 최적화
```css
/* PDF용 폰트 설정 */
@font-face {
    font-family: 'Inter';
    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800');
    font-display: block; /* PDF에서 폰트 로딩 보장 */
}
```

---

## 🚀 권장 워크플로우

### 1단계: 로컬 테스트
```bash
# 서버 실행
cd whitepaper-sections
python3 -m http.server 8082
```

### 2단계: Puppeteer PDF 생성
```bash
# PDF 생성 스크립트 실행
node generate-pdf.js
```

### 3단계: 품질 검증
- [ ] 모든 이미지 정상 로드
- [ ] 폰트 정상 렌더링
- [ ] 색상 정확도
- [ ] 페이지 나누기
- [ ] 푸터 위치

### 4단계: 최종 배포
```bash
# 최종 PDF 파일명
AKASSECT-Official-Whitepaper-v1.0-KO.pdf
```

---

## 📋 체크리스트

### 디자인 요소
- [x] 그라데이션 배경
- [x] 프리미엄 차트
- [x] 팀 프로필 이미지
- [x] 브랜드 색상
- [x] 타이포그래피

### 기술적 요소
- [x] A4 크기 최적화
- [x] 페이지 브레이크
- [x] 푸터 위치
- [x] 이미지 해상도
- [x] 폰트 임베딩

### 콘텐츠 요소
- [x] 15개 섹션 완성
- [x] 다국어 지원 구조
- [x] 네비게이션
- [x] 목차
- [x] 법적 고지사항
