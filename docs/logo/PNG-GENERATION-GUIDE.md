# 🎨 AKC 로고 PNG 생성 가이드

SVG 파일을 PNG로 변환하는 방법을 안내합니다.

---

## 🖥️ 방법 1: 온라인 변환 (가장 간단)

### CloudConvert
1. https://cloudconvert.com/svg-to-png 접속
2. `AKC-Logo.svg` 업로드
3. 해상도 설정:
   - **1024x1024** (거래소 제출용)
   - **512x512** (표준)
   - **256x256** (아이콘)
4. 변환 후 다운로드

### SVG2PNG
1. https://svgtopng.com 접속
2. SVG 파일 드래그 앤 드롭
3. 크기 선택 후 다운로드

---

## 💻 방법 2: 명령줄 도구

### ImageMagick (추천)

```bash
# 설치 (macOS)
brew install imagemagick

# 변환
convert AKC-Logo.svg -resize 1024x1024 AKC-Logo-1024.png
convert AKC-Logo.svg -resize 512x512 AKC-Logo-512.png
convert AKC-Logo.svg -resize 256x256 AKC-Logo-256.png
convert AKC-Icon.svg -resize 256x256 AKC-Icon-256.png
```

### Inkscape

```bash
# 설치 (macOS)
brew install inkscape

# 변환
inkscape AKC-Logo.svg --export-type=png --export-width=1024 --export-filename=AKC-Logo-1024.png
```

### rsvg-convert

```bash
# 설치 (macOS)
brew install librsvg

# 변환
rsvg-convert -w 1024 -h 1024 AKC-Logo.svg -o AKC-Logo-1024.png
```

---

## 🎯 필요한 PNG 파일

### 거래소 제출용
```
AKC-Logo-1024.png  (1024x1024) - LBank, Binance
AKC-Logo-512.png   (512x512)   - Gate.io, KuCoin
AKC-Logo-256.png   (256x256)   - 일반 용도
```

### 웹사이트용
```
AKC-Icon-64.png    (64x64)     - Favicon
AKC-Icon-128.png   (128x128)   - 앱 아이콘
AKC-Icon-256.png   (256x256)   - 프로필 이미지
```

---

## ✅ 품질 체크리스트

변환 후 다음 사항을 확인하세요:

- [ ] 파일 크기 < 200KB
- [ ] 투명 배경 유지
- [ ] 텍스트 선명도
- [ ] 색상 정확도 (#000000, #FFD700)
- [ ] 비율 1:1 (정사각형)

---

## 📦 자동 생성 스크립트

### Batch 생성 (ImageMagick)

```bash
#!/bin/bash
# generate-pngs.sh

SIZES=(16 32 64 128 256 512 1024)

for size in "${SIZES[@]}"; do
    convert AKC-Logo.svg -resize ${size}x${size} AKC-Logo-${size}.png
    convert AKC-Icon.svg -resize ${size}x${size} AKC-Icon-${size}.png
    echo "Generated ${size}x${size}"
done

echo "✅ All PNG files generated!"
```

### 사용 방법
```bash
chmod +x generate-pngs.sh
./generate-pngs.sh
```

---

## 🔍 최적화

### 파일 크기 줄이기

```bash
# pngquant 사용
pngquant --quality=80-100 AKC-Logo-1024.png -o AKC-Logo-1024-optimized.png

# optipng 사용
optipng -o7 AKC-Logo-1024.png
```

---

**최종 업데이트**: 2025-11-01
