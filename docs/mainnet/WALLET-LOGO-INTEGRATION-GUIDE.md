# 🎨 지갑 로고 통합 가이드 (TokenPocket, MetaMask)

**작성일**: 2025-11-01  
**목적**: 지갑에 토큰 추가 시 로고 자동 표시

---

## 🎯 개요

사용자가 TokenPocket이나 MetaMask에 AKC 토큰을 추가할 때, **로고가 자동으로 표시**되도록 설정하는 방법입니다.

### 필요한 작업

```
1️⃣ Trust Wallet Assets 등록 (필수!)
   → TokenPocket, MetaMask 등 대부분의 지갑이 참조

2️⃣ CoinGecko/CoinMarketCap 등록
   → 메타데이터 제공

3️⃣ Token Lists 등록
   → 추가 지원
```

---

## 1️⃣ Trust Wallet Assets 등록 (최우선!)

### 왜 Trust Wallet Assets인가?

```
✅ TokenPocket이 Trust Wallet Assets 사용
✅ MetaMask도 Trust Wallet Assets 참조
✅ PancakeSwap도 Trust Wallet Assets 사용
✅ 대부분의 지갑이 이 리포지토리 사용

→ 여기만 등록하면 대부분 해결! ✅
```

### 준비물

```
1. 컨트랙트 주소 (배포 후)
2. 로고 파일 (256x256 PNG)
3. GitHub 계정
4. info.json 파일
```

---

## 📋 Trust Wallet Assets 등록 방법

### Step 1: 리포지토리 Fork

```bash
# 1. GitHub에서 Fork
https://github.com/trustwallet/assets

# 2. Fork한 리포지토리 클론
git clone https://github.com/[YOUR_USERNAME]/assets.git
cd assets
```

### Step 2: 디렉토리 구조 생성

```bash
# BNB Smart Chain (BEP20) 경로
# 컨트랙트 주소는 반드시 checksum 형식이어야 함!

mkdir -p blockchains/smartchain/assets/[CONTRACT_ADDRESS]/

예시:
mkdir -p blockchains/smartchain/assets/0x1234567890123456789012345678901234567890/
```

**⚠️ 중요**: 컨트랙트 주소는 **checksum 형식**이어야 합니다!

```bash
# Checksum 변환 도구
https://etherscan.io/address/[YOUR_ADDRESS]
# 또는
https://bscscan.com/address/[YOUR_ADDRESS]

예시:
❌ 0x1234567890123456789012345678901234567890 (소문자)
✅ 0x1234567890123456789012345678901234567890 (checksum)
```

### Step 3: 로고 파일 추가

```bash
# 로고 파일 복사
cp /Users/test-mac/project/ak-coin/docs/logo/png/AKC-Icon-256.png \
   blockchains/smartchain/assets/[CONTRACT_ADDRESS]/logo.png

# 파일명은 반드시 "logo.png"
```

**로고 요구사항**:
```
✅ 크기: 256x256 픽셀
✅ 형식: PNG
✅ 배경: 투명 권장
✅ 파일명: logo.png (소문자, 고정)
✅ 파일 크기: 100KB 이하
```

### Step 4: info.json 생성

```bash
# info.json 파일 생성
nano blockchains/smartchain/assets/[CONTRACT_ADDRESS]/info.json
```

**info.json 내용**:
```json
{
  "name": "AKASSECT",
  "website": "https://your-website.com",
  "description": "AKASSECT (AKC) is a BEP-20 token on BNB Smart Chain with burnable and pausable features.",
  "explorer": "https://bscscan.com/token/[CONTRACT_ADDRESS]",
  "type": "BEP20",
  "symbol": "AKC",
  "decimals": 18,
  "status": "active",
  "id": "[CONTRACT_ADDRESS]",
  "links": [
    {
      "name": "github",
      "url": "https://github.com/akassectakc-a11y/AKC-COIN"
    },
    {
      "name": "twitter",
      "url": "https://twitter.com/your-account"
    },
    {
      "name": "telegram",
      "url": "https://t.me/your-channel"
    }
  ]
}
```

**필수 필드**:
```json
{
  "name": "AKASSECT",          // 토큰 이름
  "website": "...",             // 공식 웹사이트 (필수!)
  "description": "...",         // 토큰 설명
  "explorer": "...",            // BscScan 링크
  "type": "BEP20",              // 토큰 타입
  "symbol": "AKC",              // 심볼
  "decimals": 18,               // Decimals
  "status": "active",           // 상태
  "id": "[CONTRACT_ADDRESS]"    // 컨트랙트 주소
}
```

### Step 5: 검증

```bash
# Trust Wallet Assets 검증 도구 실행
npm install
npm run test

# 특정 체인만 검증
npm run test -- blockchains/smartchain
```

**검증 항목**:
```
✅ 로고 파일 존재 (logo.png)
✅ 로고 크기 (256x256)
✅ 로고 형식 (PNG)
✅ info.json 형식 올바름
✅ Checksum 주소 올바름
✅ 필수 필드 모두 존재
```

### Step 6: Pull Request 생성

```bash
# 1. 변경사항 커밋
git add blockchains/smartchain/assets/[CONTRACT_ADDRESS]/
git commit -m "Add AKASSECT (AKC) token"

# 2. Fork한 리포지토리에 푸시
git push origin master

# 3. GitHub에서 Pull Request 생성
# https://github.com/trustwallet/assets
# "New Pull Request" 클릭
```

**Pull Request 제목**:
```
Add AKASSECT (AKC) - BNB Smart Chain
```

**Pull Request 설명**:
```markdown
## Token Information

- **Token Name**: AKASSECT
- **Symbol**: AKC
- **Type**: BEP20 (BNB Smart Chain)
- **Contract Address**: [YOUR_CONTRACT_ADDRESS]
- **Decimals**: 18
- **Website**: [YOUR_WEBSITE]
- **Explorer**: https://bscscan.com/token/[CONTRACT_ADDRESS]

## Checklist

- [x] Logo is 256x256 PNG format
- [x] info.json is valid JSON
- [x] Contract address is checksummed
- [x] All tests pass
- [x] Token is verified on BscScan

## Additional Information

AKASSECT (AKC) is a BEP-20 token with burnable and pausable features, 
tested with 20,144 comprehensive tests achieving 100% success rate.
```

### Step 7: 승인 대기

```
검토 기간: 1-2주
승인 조건:
✅ 모든 검증 통과
✅ BscScan 검증 완료
✅ 웹사이트 활성화
✅ 실제 사용 중인 토큰

승인 후:
→ TokenPocket에 자동 표시 ✅
→ MetaMask에 자동 표시 ✅
→ 대부분의 지갑에 자동 표시 ✅
```

---

## 2️⃣ TokenPocket 직접 등록

Trust Wallet Assets가 승인되면 자동으로 적용되지만, 별도로 TokenPocket에도 등록할 수 있습니다.

### TokenPocket Token List

```bash
# 리포지토리
https://github.com/TP-Lab/tokens

# Fork 및 클론
git clone https://github.com/[YOUR_USERNAME]/tokens.git
cd tokens
```

### 파일 구조

```bash
# BNB Smart Chain (BSC)
bsc/
└── [CONTRACT_ADDRESS].json

예시:
bsc/0x1234567890123456789012345678901234567890.json
```

### JSON 파일 생성

```json
{
  "symbol": "AKC",
  "address": "[CONTRACT_ADDRESS]",
  "decimals": 18,
  "name": "AKASSECT",
  "ens_address": "",
  "website": "https://your-website.com",
  "logo": {
    "src": "https://your-cdn.com/akc-logo.png",
    "width": "256",
    "height": "256",
    "ipfs_hash": ""
  },
  "support": {
    "email": "support@your-domain.com",
    "url": "https://your-website.com/support"
  },
  "social": {
    "blog": "",
    "chat": "",
    "discord": "",
    "facebook": "",
    "forum": "",
    "github": "https://github.com/akassectakc-a11y/AKC-COIN",
    "gitter": "",
    "instagram": "",
    "linkedin": "",
    "reddit": "",
    "slack": "",
    "telegram": "https://t.me/your-channel",
    "twitter": "https://twitter.com/your-account",
    "youtube": ""
  }
}
```

---

## 3️⃣ MetaMask Token Lists

### Uniswap Token Lists 형식

```bash
# 리포지토리 생성 또는 기존 리포지토리 사용
https://github.com/[YOUR_ORG]/token-list

# token-list.json 생성
```

### token-list.json 예시

```json
{
  "name": "AKASSECT Token List",
  "timestamp": "2025-11-01T00:00:00.000Z",
  "version": {
    "major": 1,
    "minor": 0,
    "patch": 0
  },
  "logoURI": "https://your-cdn.com/akc-logo.png",
  "keywords": ["akassect", "akc", "bsc", "bep20"],
  "tokens": [
    {
      "chainId": 56,
      "address": "[CONTRACT_ADDRESS]",
      "name": "AKASSECT",
      "symbol": "AKC",
      "decimals": 18,
      "logoURI": "https://your-cdn.com/akc-logo.png"
    }
  ]
}
```

**호스팅**:
```
1. GitHub Pages
2. IPFS
3. CDN (Cloudflare, AWS)

예시:
https://your-username.github.io/token-list/token-list.json
```

---

## 4️⃣ CoinGecko / CoinMarketCap

### CoinGecko API

CoinGecko에 등록되면 자동으로 메타데이터 제공:

```
https://api.coingecko.com/api/v3/coins/[COIN_ID]

자동 제공 정보:
- 로고
- 가격
- 시가총액
- 거래량
```

### CoinMarketCap API

```
https://pro-api.coinmarketcap.com/v1/cryptocurrency/info

자동 제공 정보:
- 로고
- 설명
- 링크
- 태그
```

---

## 🎯 전체 프로세스

### 배포 직후 (Day 0)

```bash
1. BscScan 소스 검증 ✅
2. BscScan 로고 제출 ✅
```

### 1주일 내 (Week 1)

```bash
1. Trust Wallet Assets PR 생성 ✅
   → TokenPocket, MetaMask 자동 지원

2. CoinMarketCap 신청 ✅
3. CoinGecko 신청 ✅
```

### 2주 후 (Week 2)

```bash
1. Trust Wallet Assets 승인 확인
2. TokenPocket 표시 확인
3. MetaMask 표시 확인
```

### 1개월 후 (Month 1)

```bash
1. PancakeSwap 로고 표시 확인
2. 모든 주요 지갑 확인
```

---

## ✅ 확인 방법

### TokenPocket 확인

```
1. TokenPocket 앱 열기
2. BSC 네트워크 선택
3. "토큰 추가" 클릭
4. 컨트랙트 주소 입력
5. 로고 자동 표시 확인 ✅
```

### MetaMask 확인

```
1. MetaMask 열기
2. BSC 네트워크 선택
3. "Import tokens" 클릭
4. "Custom token" 선택
5. 컨트랙트 주소 입력
6. 로고 자동 표시 확인 ✅
```

### Trust Wallet 확인

```
1. Trust Wallet 앱 열기
2. Smart Chain 선택
3. 토큰 검색
4. 로고 자동 표시 확인 ✅
```

---

## 🚨 문제 해결

### 로고가 표시되지 않는 경우

```
원인 1: Trust Wallet Assets 미등록
해결: Trust Wallet Assets PR 생성

원인 2: Checksum 주소 불일치
해결: https://bscscan.com에서 checksum 주소 확인

원인 3: 로고 형식 오류
해결: 256x256 PNG 형식 확인

원인 4: 아직 승인 대기 중
해결: 1-2주 대기 또는 수동 추가
```

### 수동으로 로고 추가

사용자가 수동으로 로고를 볼 수 있도록 가이드 제공:

```markdown
## 로고 수동 추가 방법

### MetaMask
1. 토큰 추가 시 "Image URL" 입력
2. URL: https://your-cdn.com/akc-logo.png

### TokenPocket
1. 설정 → 토큰 관리
2. 사용자 정의 아이콘 설정
```

---

## 📁 필요한 파일

### 로고 파일 (Trust Wallet Assets용)

```bash
파일: logo.png
크기: 256x256 픽셀
형식: PNG
배경: 투명 권장
경로: blockchains/smartchain/assets/[ADDRESS]/logo.png
```

### info.json (Trust Wallet Assets용)

```json
{
  "name": "AKASSECT",
  "website": "https://your-website.com",
  "description": "AKASSECT (AKC) Token",
  "explorer": "https://bscscan.com/token/[ADDRESS]",
  "type": "BEP20",
  "symbol": "AKC",
  "decimals": 18,
  "status": "active",
  "id": "[CONTRACT_ADDRESS]"
}
```

### token-list.json (MetaMask Token Lists용)

```json
{
  "name": "AKASSECT Token List",
  "tokens": [{
    "chainId": 56,
    "address": "[CONTRACT_ADDRESS]",
    "name": "AKASSECT",
    "symbol": "AKC",
    "decimals": 18,
    "logoURI": "https://your-cdn.com/akc-logo.png"
  }]
}
```

---

## 🎉 최종 결과

### Trust Wallet Assets 승인 후

```
✅ TokenPocket - 자동 로고 표시
✅ MetaMask - 자동 로고 표시
✅ Trust Wallet - 자동 로고 표시
✅ SafePal - 자동 로고 표시
✅ 대부분의 지갑 - 자동 로고 표시
```

### 추가 등록 후

```
✅ PancakeSwap - 로고 표시
✅ CoinMarketCap - 로고 표시
✅ CoinGecko - 로고 표시
✅ BscScan - 로고 표시
```

---

## 📋 체크리스트

```
배포 전:
[ ] 로고 파일 준비 (256x256 PNG)
[ ] 웹사이트 준비
[ ] 소셜 미디어 링크 준비
[ ] GitHub 계정 준비

배포 후 즉시:
[ ] BscScan 소스 검증
[ ] BscScan 로고 제출

1주일 내:
[ ] Trust Wallet Assets Fork
[ ] 디렉토리 생성 (checksum 주소)
[ ] logo.png 추가
[ ] info.json 생성
[ ] 검증 실행 (npm run test)
[ ] Pull Request 생성

2주 후:
[ ] Trust Wallet Assets 승인 확인
[ ] TokenPocket 로고 확인
[ ] MetaMask 로고 확인

1개월 후:
[ ] 모든 주요 지갑 확인
[ ] CoinMarketCap 로고 확인
[ ] CoinGecko 로고 확인
```

---

## 💡 Pro Tips

```
✅ Tip 1: Trust Wallet Assets 최우선
   → 대부분의 지갑이 여기서 로고 가져옴

✅ Tip 2: Checksum 주소 필수
   → 소문자 주소는 거부됨

✅ Tip 3: 로고 품질 중요
   → 256x256, 투명 배경, PNG

✅ Tip 4: 웹사이트 필수
   → info.json에 활성화된 웹사이트 필요

✅ Tip 5: 인내심 필요
   → 승인까지 1-2주 소요
```

---

**작성일**: 2025-11-01  
**상태**: ✅ **완전한 가이드 완성**  
**적용 대상**: TokenPocket, MetaMask, Trust Wallet 및 대부분의 지갑

**핵심**: Trust Wallet Assets 등록 = 모든 지갑 해결! ✅
