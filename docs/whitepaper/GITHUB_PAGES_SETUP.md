# 🌐 AKASSECT 백서 GitHub Pages 설정 가이드

## 🎯 **완성된 구조**

```
docs/whitepaper/
├── index.html              # 메인 랜딩 페이지 (언어 선택)
├── _config.yml            # GitHub Pages 설정
├── ko/                    # 한국어 백서
│   ├── index.html         # 한국어 백서 메인
│   ├── sections/          # 섹션별 HTML 파일들
│   ├── styles/           # CSS 스타일
│   └── assets/           # 이미지, 로고 등
├── en/                   # 영어 백서 (준비 중)
├── ja/                   # 일본어 백서 (준비 중)
└── zh/                   # 중국어 백서 (준비 중)
```

## 🚀 **GitHub Pages 활성화 방법**

### **1단계: GitHub 저장소 설정**
1. GitHub 저장소로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭

### **2단계: 소스 설정**
1. **Source**: `Deploy from a branch` 선택
2. **Branch**: `main` (또는 `master`) 선택
3. **Folder**: `/docs/whitepaper` 선택
4. **Save** 클릭

### **3단계: 도메인 확인**
- 약 5-10분 후 다음 주소에서 접근 가능:
```
https://yourusername.github.io/ak-coin/docs/whitepaper/
```

## 🌍 **다국어 주소 구조**

### **메인 페이지**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/
```
- 언어 선택 랜딩 페이지
- 초고급 디자인 (그라데이션, 애니메이션, 파티클)
- 4개 언어 카드 (한국어, 영어, 일본어, 중국어)

### **한국어 백서**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/ko/
```
- 완전한 한국어 백서
- 12개 섹션 포함
- 인터랙티브 목차
- 모바일 최적화

### **영어 백서 (준비 중)**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/en/
```

### **일본어 백서 (준비 중)**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/ja/
```

### **중국어 백서 (준비 중)**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/zh/
```

## ✨ **특별 기능**

### **🎨 초고급 디자인**
- **그라데이션 배경**: 보라-파랑 그라데이션
- **파티클 애니메이션**: 떠다니는 파티클 효과
- **글래스모피즘**: 반투명 카드 디자인
- **호버 효과**: 카드 호버 시 애니메이션
- **반응형**: 모바일, 태블릿, 데스크톱 최적화

### **🌐 SEO 최적화**
- **메타 태그**: 완벽한 SEO 설정
- **Open Graph**: 소셜 미디어 공유 최적화
- **사이트맵**: 자동 생성
- **다국어 지원**: hreflang 설정

### **📱 모바일 친화적**
- **반응형 디자인**: 모든 디바이스 지원
- **터치 최적화**: 모바일 터치 인터페이스
- **빠른 로딩**: 최적화된 리소스

## 🔧 **커스터마이징**

### **도메인 변경**
`_config.yml` 파일에서 수정:
```yaml
url: "https://yourdomain.com"
baseurl: "/whitepaper"
```

### **소셜 링크 변경**
`index.html`의 푸터 섹션에서 수정:
```html
<a href="https://yourwebsite.com" class="footer-link">Official Website</a>
<a href="https://github.com/yourusername" class="footer-link">GitHub</a>
```

### **언어 추가**
1. 새 언어 폴더 생성 (예: `es/` for Spanish)
2. `index.html`에 언어 카드 추가
3. `_config.yml`에 언어 추가

## 📊 **성능 최적화**

### **로딩 속도**
- **Google Fonts**: 프리로드 설정
- **이미지 최적화**: WebP 형식 사용
- **CSS 최적화**: 인라인 중요 CSS
- **JavaScript 최적화**: 지연 로딩

### **SEO 점수**
- **Lighthouse**: 90+ 점수 목표
- **Core Web Vitals**: 최적화
- **접근성**: WCAG 2.1 준수

## 🎉 **완성!**

이제 전 세계 어디서든 다음 주소로 AKASSECT 백서에 접근할 수 있습니다:

**🌍 메인 주소**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/
```

**🇰🇷 한국어 백서**
```
https://yourusername.github.io/ak-coin/docs/whitepaper/ko/
```

**초고급 디자인의 전문적인 백서 사이트가 완성되었습니다!** 🚀✨
