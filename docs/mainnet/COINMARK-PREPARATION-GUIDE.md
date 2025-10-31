# 🎨 AKC 코인마크 배포 전 완전 가이드

**프로젝트**: AKASSECT (AKC) Token  
**용도**: 거래소 상장, 메인넷 배포, 마케팅  
**작성일**: 2025-11-01

---

## 📋 Step 1: 로고 파일 확인

### 1.1 기존 파일 검증 ✅

- [ ] **SVG 파일 존재**: `docs/logo/AKC-Logo.svg`
- [ ] **아이콘 파일 존재**: `docs/logo/AKC-Icon.svg`
- [ ] **미리보기 페이지**: `docs/logo/logo-preview.html`
- [ ] **사양 문서**: `docs/logo/AKC-LOGO-SPECIFICATION.md`

#### 확인 명령어

```bash
# 로고 파일 존재 확인
ls -lh docs/logo/

# 예상 출력:
# AKC-Logo.svg (1.6 KB)
# AKC-Icon.svg (464 bytes)
# logo-preview.html
# AKC-LOGO-SPECIFICATION.md
```

---

### 1.2 로고 디자인 스펙 확인 ✅

```
╔════════════════════════════════════════════════════╗
║          AKC 로고 핵심 스펙                         ║
╠════════════════════════════════════════════════════╣
║  크기:        512×512 px (SVG, 확대 가능)          ║
║  배경:        Black (#000000)                      ║
║  주요 색상:   Gold (#FFD700)                       ║
║  텍스트:      "AKC" + "AKASSECT"                   ║
║  스타일:      Premium, Metallic                    ║
║  파일 형식:   SVG, PNG                             ║
╚════════════════════════════════════════════════════╝
```

---

## 📋 Step 2: PNG 파일 생성

### 2.1 필요한 PNG 크기

```
거래소별 요구사항:

🏦 LBank:        1024×1024 (필수)
🏦 Binance:      1024×1024 (필수)
🏦 Gate.io:      512×512
🏦 KuCoin:       512×512
🏦 CoinMarketCap: 200×200 (최소)
🏦 CoinGecko:    200×200 (최소)
📱 앱 아이콘:     256×256, 128×128, 64×64
🌐 파비콘:       32×32, 16×16
```

---

### 2.2 PNG 생성 방법

#### 방법 1: 온라인 변환 (가장 간단) ⭐

```
1. https://cloudconvert.com/svg-to-png 접속
2. AKC-Logo.svg 업로드
3. 크기 선택:
   - 1024×1024 (LBank용)
   - 512×512 (표준)
   - 256×256 (아이콘)
   - 200×200 (CMC/CG)
4. 변환 및 다운로드
```

#### 방법 2: ImageMagick (자동화)

```bash
# ImageMagick 설치 (macOS)
brew install imagemagick

# PNG 생성 (모든 크기)
cd docs/logo

# 1024x1024 (거래소 제출용)
convert AKC-Logo.svg -resize 1024x1024 AKC-Logo-1024.png

# 512x512 (표준)
convert AKC-Logo.svg -resize 512x512 AKC-Logo-512.png

# 256x256 (아이콘)
convert AKC-Icon.svg -resize 256x256 AKC-Icon-256.png

# 200x200 (CoinMarketCap/CoinGecko)
convert AKC-Icon.svg -resize 200x200 AKC-Icon-200.png

# 128x128 (앱 아이콘)
convert AKC-Icon.svg -resize 128x128 AKC-Icon-128.png

# 64x64 (작은 아이콘)
convert AKC-Icon.svg -resize 64x64 AKC-Icon-64.png

# 32x32 (파비콘)
convert AKC-Icon.svg -resize 32x32 AKC-Icon-32.png

# 16x16 (파비콘)
convert AKC-Icon.svg -resize 16x16 AKC-Icon-16.png
```

#### 자동 생성 스크립트

```bash
#!/bin/bash
# scripts/generate-logo-pngs.sh

SIZES=(16 32 64 128 200 256 512 1024)
LOGO_FILE="docs/logo/AKC-Logo.svg"
ICON_FILE="docs/logo/AKC-Icon.svg"
OUTPUT_DIR="docs/logo/png"

# 출력 디렉터리 생성
mkdir -p $OUTPUT_DIR

# Full Logo PNG 생성
for size in "${SIZES[@]}"; do
    if [ $size -ge 256 ]; then
        convert $LOGO_FILE -resize ${size}x${size} $OUTPUT_DIR/AKC-Logo-${size}.png
        echo "✅ Generated: AKC-Logo-${size}.png"
    fi
done

# Icon PNG 생성
for size in "${SIZES[@]}"; do
    convert $ICON_FILE -resize ${size}x${size} $OUTPUT_DIR/AKC-Icon-${size}.png
    echo "✅ Generated: AKC-Icon-${size}.png"
done

echo "✅ All PNG files generated successfully!"
```

---

### 2.3 PNG 품질 확인 ✅

- [ ] **파일 크기**: 각 PNG < 500KB
- [ ] **투명 배경**: PNG에서 투명도 유지
- [ ] **선명도**: 확대 시 깨지지 않음
- [ ] **색상 정확도**: Gold (#FFD700), Black (#000000)

#### 품질 확인 명령어

```bash
# PNG 파일 정보 확인
file docs/logo/png/*.png

# 파일 크기 확인
du -h docs/logo/png/*.png

# 이미지 상세 정보
identify docs/logo/png/AKC-Logo-1024.png
```

---

## 📋 Step 3: 거래소별 제출 파일 준비

### 3.1 LBank 제출 패키지 📦

```
📁 LBank_Submission/
├── AKC-Logo-1024.png          (1024×1024, <500KB)
├── AKC-Icon-256.png            (256×256)
├── AKC_Logo_Spec.pdf          (선택사항)
└── README.txt                 (로고 정보)
```

#### README.txt 템플릿

```
AKASSECT (AKC) Token Logo Package
===================================

Project Name: AKASSECT
Token Symbol: AKC
Network: BNB Smart Chain (BEP-20)

Logo Files:
- AKC-Logo-1024.png: Full logo (1024x1024)
- AKC-Icon-256.png: Icon version (256x256)

Colors:
- Background: Black (#000000)
- Primary: Gold (#FFD700)

Usage:
- White/Light backgrounds: Use as-is
- Dark backgrounds: Recommended (optimal contrast)

Contact:
Email: akassectakc@gmail.com
Website: https://akc.ainovas.org
```

---

### 3.2 CoinMarketCap 제출 ✅

- [ ] **로고 PNG**: 200×200 (투명 배경)
- [ ] **파일 크기**: < 100KB
- [ ] **파일명**: `logo.png` (CMC 요구사항)
- [ ] **형식**: PNG-24 (투명 지원)

#### CMC 전용 PNG 생성

```bash
# 200x200, 최적화
convert docs/logo/AKC-Icon.svg \
  -resize 200x200 \
  -quality 95 \
  docs/logo/coinmarketcap/logo.png

# 파일 크기 확인 (< 100KB 확인)
du -h docs/logo/coinmarketcap/logo.png
```

---

### 3.3 CoinGecko 제출 ✅

- [ ] **로고 PNG**: 200×200 (투명 배경)
- [ ] **파일 크기**: < 100KB
- [ ] **파일명**: `logo.png`
- [ ] **배경**: 투명 (선택) 또는 White

#### CoinGecko 전용 PNG 생성

```bash
# 200x200, 투명 배경
convert docs/logo/AKC-Icon.svg \
  -resize 200x200 \
  -background transparent \
  docs/logo/coingecko/logo.png
```

---

## 📋 Step 4: 웹사이트 및 앱 아이콘

### 4.1 파비콘 생성 ✅

```bash
# 파비콘 (32x32, 16x16)
convert docs/logo/AKC-Icon.svg -resize 32x32 docs/logo/favicon-32x32.png
convert docs/logo/AKC-Icon.svg -resize 16x16 docs/logo/favicon-16x16.png

# ICO 파일 생성 (선택)
convert docs/logo/favicon-32x32.png \
        docs/logo/favicon-16x16.png \
        docs/logo/favicon.ico
```

#### HTML에 적용

```html
<!-- 웹사이트 <head>에 추가 -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="shortcut icon" href="/favicon.ico">
```

---

### 4.2 앱 아이콘 (iOS/Android) ✅

```bash
# iOS 아이콘 (180x180)
convert docs/logo/AKC-Icon.svg -resize 180x180 docs/logo/app-icon-ios.png

# Android 아이콘 (512x512)
convert docs/logo/AKC-Icon.svg -resize 512x512 docs/logo/app-icon-android.png

# PWA 아이콘 (192x192, 512x512)
convert docs/logo/AKC-Icon.svg -resize 192x192 docs/logo/pwa-icon-192.png
convert docs/logo/AKC-Icon.svg -resize 512x512 docs/logo/pwa-icon-512.png
```

---

## 📋 Step 5: 소셜 미디어 프로필 이미지

### 5.1 Twitter/X 프로필 ✅

```bash
# Twitter 프로필 이미지 (400x400)
convert docs/logo/AKC-Icon.svg -resize 400x400 docs/logo/social/twitter-profile.png

# Twitter 배너 (1500x500)
# 별도 디자인 필요
```

---

### 5.2 Telegram 프로필 ✅

```bash
# Telegram 그룹 아이콘 (512x512)
convert docs/logo/AKC-Logo.svg -resize 512x512 docs/logo/social/telegram-profile.png
```

---

### 5.3 Discord 서버 아이콘 ✅

```bash
# Discord 서버 아이콘 (512x512)
convert docs/logo/AKC-Logo.svg -resize 512x512 docs/logo/social/discord-icon.png
```

---

## 📋 Step 6: 최종 파일 구조

### 6.1 완성된 디렉터리 구조

```
docs/logo/
├── AKC-Logo.svg                    ✅ 원본 SVG
├── AKC-Icon.svg                    ✅ 원본 아이콘
├── logo-preview.html               ✅ 미리보기
├── AKC-LOGO-SPECIFICATION.md       ✅ 사양서
│
├── png/                            📁 PNG 파일
│   ├── AKC-Logo-1024.png           ✅ LBank, Binance
│   ├── AKC-Logo-512.png            ✅ 표준
│   ├── AKC-Icon-256.png            ✅ 아이콘
│   ├── AKC-Icon-200.png            ✅ CMC, CoinGecko
│   ├── AKC-Icon-128.png            ✅ 앱
│   ├── AKC-Icon-64.png             ✅ 작은 아이콘
│   ├── AKC-Icon-32.png             ✅ 파비콘
│   └── AKC-Icon-16.png             ✅ 파비콘
│
├── exchanges/                      📁 거래소 제출용
│   ├── lbank/
│   │   ├── AKC-Logo-1024.png
│   │   ├── AKC-Icon-256.png
│   │   └── README.txt
│   ├── coinmarketcap/
│   │   └── logo.png (200x200)
│   └── coingecko/
│       └── logo.png (200x200)
│
├── social/                         📁 소셜 미디어용
│   ├── twitter-profile.png (400x400)
│   ├── telegram-profile.png (512x512)
│   └── discord-icon.png (512x512)
│
└── favicons/                       📁 파비콘
    ├── favicon-32x32.png
    ├── favicon-16x16.png
    └── favicon.ico
```

---

## 📋 Step 7: 품질 검증

### 7.1 시각적 검증 ✅

- [ ] **배경 테스트**: White, Black, Gray에서 모두 선명
- [ ] **크기 테스트**: 모든 크기에서 깨지지 않음
- [ ] **색상 테스트**: Gold, Black 정확히 일치
- [ ] **투명도 테스트**: 투명 배경 정상 작동

#### 미리보기 페이지 열기

```bash
# 브라우저에서 확인
open docs/logo/logo-preview.html

# 또는
cd docs/logo
python3 -m http.server 8000
# http://localhost:8000/logo-preview.html
```

---

### 7.2 기술적 검증 ✅

```bash
# 모든 PNG 파일 정보
identify docs/logo/png/*.png

# 예상 출력:
# AKC-Logo-1024.png PNG 1024x1024 ...
# AKC-Icon-256.png PNG 256x256 ...
```

---

### 7.3 파일 크기 검증 ✅

```bash
# 파일 크기 확인
du -h docs/logo/png/*.png

# 모든 파일 < 500KB 확인
find docs/logo/png -name "*.png" -size +500k
# (출력 없음 = 모든 파일 OK)
```

---

## 📋 Step 8: 거래소 제출

### 8.1 LBank 제출 체크리스트 ✅

```
╔════════════════════════════════════════════════════╗
║          LBank 로고 제출 체크리스트                 ║
╠════════════════════════════════════════════════════╣
║  [ ] AKC-Logo-1024.png (1024×1024, <500KB)        ║
║  [ ] AKC-Icon-256.png (256×256, <100KB)           ║
║  [ ] 투명 배경 또는 Black 배경                     ║
║  [ ] PNG-24 형식                                   ║
║  [ ] 색상: #FFD700 (Gold), #000000 (Black)        ║
║  [ ] README.txt 포함                               ║
╚════════════════════════════════════════════════════╝
```

---

### 8.2 CoinMarketCap 제출 ✅

```
제출 URL: https://coinmarketcap.com/request/

필요 정보:
  - Token Name: AKASSECT
  - Symbol: AKC
  - Logo: logo.png (200x200, <100KB)
  - Contract Address: [메인넷 배포 후]
  - Official Website: https://akc.ainovas.org
  - Explorer Link: https://bscscan.com/token/[ADDRESS]
```

---

### 8.3 CoinGecko 제출 ✅

```
제출 URL: https://www.coingecko.com/en/coins/new

필요 정보:
  - Token Name: AKASSECT
  - Ticker: AKC
  - Logo: logo.png (200x200, <100KB)
  - Contract: [메인넷 배포 후]
  - Website: https://akc.ainovas.org
  - Description: AI-powered payment gateway token
```

---

## 📋 Step 9: 최종 확인

### 9.1 전체 체크리스트 ✅

```
╔════════════════════════════════════════════════════╗
║          코인마크 최종 체크리스트                   ║
╠════════════════════════════════════════════════════╣
║  [ ] SVG 파일 존재 및 정상                         ║
║  [ ] PNG 생성 완료 (8개 크기)                      ║
║  [ ] 거래소 제출 패키지 준비                       ║
║  [ ] 소셜 미디어 이미지 준비                       ║
║  [ ] 파비콘 생성 완료                              ║
║  [ ] 품질 검증 완료                                ║
║  [ ] 파일 크기 확인 (모두 < 500KB)                ║
║  [ ] 색상 정확도 확인                              ║
║  [ ] 투명도 테스트 완료                            ║
║  [ ] 미리보기 페이지 확인                          ║
╚════════════════════════════════════════════════════╝
```

---

## 📞 문의 및 지원

**프로젝트**: AKASSECT (AKC) Token  
**이메일**: akassectakc@gmail.com  
**웹사이트**: https://akc.ainovas.org  
**GitHub**: https://github.com/akassectakc-a11y/AKC-COIN

---

**최종 업데이트**: 2025-11-01  
**버전**: 1.0  
**상태**: 준비 완료 ✅
