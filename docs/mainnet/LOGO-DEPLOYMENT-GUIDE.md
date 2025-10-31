# 🎨 AKC Token 로고 배포 가이드

**최종 업데이트**: 2025-11-01  
**목적**: 메인넷 로고 배포 완전 가이드

---

## 🎯 로고 배포 개요

### ⚠️ 중요: 컨트랙트에 로고 배포 불필요!

```
╔═══════════════════════════════════════════════════╗
║          로고 배포 핵심 사실                       ║
╠═══════════════════════════════════════════════════╣
║  스마트 컨트랙트:     로고 포함 안함 ✅          ║
║  온체인 저장:         불필요 ✅                   ║
║  배포 필요:           외부 플랫폼만 ✅            ║
║                                                    ║
║  결론:                컨트랙트 1개만 배포!        ║
╚═══════════════════════════════════════════════════╝
```

**BEP-20 토큰은 로고를 온체인에 저장하지 않습니다!**

---

## 📝 1. 컨트랙트 배포 (1개만!)

### ✅ 배포할 컨트랙트

```
컨트랙트 개수: 1개만!

배포할 컨트랙트:
└── AKC.sol (BEP-20 토큰)
    ├── ERC20
    ├── ERC20Burnable
    ├── Pausable
    └── Ownable

추가 컨트랙트: 없음! ❌
```

### 🚫 배포하지 않는 것들

```
❌ 로고 컨트랙트 (존재하지 않음)
❌ NFT 컨트랙트 (필요 없음)
❌ 메타데이터 컨트랙트 (필요 없음)
❌ 로고 저장 컨트랙트 (필요 없음)

→ AKC.sol 1개만 배포하면 끝! ✅
```

### 배포 명령어

```bash
# 컨트랙트 1개만 배포
npx hardhat run scripts/deploy.js --network bscMainnet

# 예상 결과:
✅ AKC Token deployed at: 0x[주소]
✅ Total Supply: 300,000,000 AKC
✅ Treasury: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f

→ 배포 완료! 더 이상 배포 없음!
```

---

## 🎨 2. 로고 제출 플랫폼별 가이드

로고는 **외부 플랫폼에 제출**합니다. 온체인 배포가 아닙니다!

### 📋 플랫폼별 제출 파일

```
플랫폼               파일                크기           형식
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BscScan             1개 파일             256x256        PNG
CoinMarketCap       1개 파일             200x200        PNG  
CoinGecko           1개 파일             200x200        PNG
PancakeSwap         1개 파일             256x256        PNG
LBank               2개 파일             200x200        PNG + SVG
Trust Wallet        1개 파일             256x256        PNG
MetaMask            1개 파일             256x256        PNG
```

**중요**: 각 플랫폼마다 **1개씩만 제출**합니다!

---

## 🔥 3. 필수 로고 제출 (우선순위별)

### 🥇 최우선 (배포 직후)

#### 1️⃣ BscScan (필수!)

**제출 파일**: `docs/logo/png/AKC-Icon-256.png` (1개)

**제출 방법**:
```
1. https://bscscan.com/ 로그인
2. 컨트랙트 주소 검색
3. "Update Token Info" 클릭
4. Logo 업로드: AKC-Icon-256.png
5. Submit
```

**요구사항**:
- 크기: 256x256 픽셀
- 형식: PNG
- 배경: 투명
- 파일 크기: 100KB 이하

---

#### 2️⃣ CoinMarketCap

**제출 파일**: `docs/logo/png/AKC-Icon-200.png` (1개)

**제출 방법**:
```
1. https://coinmarketcap.com/request/ 접속
2. "Add New Cryptocurrency" 클릭
3. 토큰 정보 입력:
   - Contract: [배포된 주소]
   - Symbol: AKC
   - Name: AKASSECT
   - Logo: AKC-Icon-200.png 업로드
4. Submit
```

**요구사항**:
- 크기: 200x200 픽셀
- 형식: PNG
- 배경: 투명

---

#### 3️⃣ CoinGecko

**제출 파일**: `docs/logo/png/AKC-Icon-200.png` (1개)

**제출 방법**:
```
1. https://www.coingecko.com/request-form 접속
2. "List New Asset" 선택
3. 토큰 정보 입력
4. Logo: AKC-Icon-200.png 업로드
5. Submit
```

**요구사항**:
- 크기: 200x200 픽셀
- 형식: PNG
- 배경: 투명

---

### 🥈 중요 (1주일 내)

#### 4️⃣ PancakeSwap

**제출 파일**: `docs/logo/png/AKC-Icon-256.png` (1개)

**제출 방법** (GitHub):
```bash
# 1. PancakeSwap 리포지토리 Fork
git clone https://github.com/pancakeswap/token-list.git

# 2. 로고 복사
cp docs/logo/png/AKC-Icon-256.png \
   token-list/tokens/0x[컨트랙트주소].png

# 3. 토큰 정보 추가 (tokens.json)
{
  "name": "AKASSECT",
  "symbol": "AKC",
  "address": "0x[컨트랙트주소]",
  "chainId": 56,
  "decimals": 18,
  "logoURI": "https://tokens.pancakeswap.finance/images/0x[주소].png"
}

# 4. Pull Request 생성
```

**요구사항**:
- 크기: 256x256 픽셀
- 형식: PNG
- 파일명: 컨트랙트 주소.png

---

#### 5️⃣ LBank

**제출 파일**: 
- `docs/logo/exchanges/AKC-Exchange-Logo.png` (1개)
- `docs/logo/AKC-Logo.svg` (1개)

**제출 방법**:
```
1. listing@lbank.info 이메일 발송
2. 첨부:
   - AKC-Exchange-Logo.png
   - AKC-Logo.svg
3. 토큰 정보 포함:
   - Contract: [배포된 주소]
   - Network: BSC
   - Symbol: AKC
   - Name: AKASSECT
```

**요구사항**:
- PNG: 200x200 픽셀
- SVG: 벡터 형식

---

### 🥉 권장 (1개월 내)

#### 6️⃣ Trust Wallet

**제출 파일**: `docs/logo/png/AKC-Icon-256.png` (1개)

**제출 방법** (GitHub):
```bash
# 1. Trust Wallet Assets Fork
git clone https://github.com/trustwallet/assets.git

# 2. BSC 폴더로 이동
cd assets/blockchains/smartchain/assets

# 3. 컨트랙트 주소 폴더 생성
mkdir 0x[컨트랙트주소]

# 4. 로고 복사
cp [경로]/AKC-Icon-256.png \
   0x[컨트랙트주소]/logo.png

# 5. info.json 생성
{
  "name": "AKASSECT",
  "website": "https://akassect.com",
  "description": "AI-powered payment gateway token",
  "explorer": "https://bscscan.com/token/0x[주소]",
  "type": "BEP20",
  "symbol": "AKC",
  "decimals": 18,
  "status": "active"
}

# 6. Pull Request 생성
```

---

#### 7️⃣ MetaMask

**제출 파일**: `docs/logo/png/AKC-Icon-256.png` (1개)

**제출 방법**:
```
MetaMask는 Trust Wallet Assets를 사용하므로
Trust Wallet 제출 시 자동으로 표시됩니다!

추가 제출 불필요 ✅
```

---

## 📁 4. 제출 파일 준비

### 사용할 로고 파일 정리

```bash
# 각 플랫폼별 필요 파일
docs/logo/png/
├── AKC-Icon-256.png    # BscScan, PancakeSwap, Trust Wallet
├── AKC-Icon-200.png    # CoinMarketCap, CoinGecko
├── AKC-Icon-128.png    # (예비)
└── AKC-Icon-64.png     # (예비)

docs/logo/
├── AKC-Logo.svg        # LBank, 기타
└── AKC-Icon.svg        # (예비)

docs/logo/exchanges/
└── AKC-Exchange-Logo.png  # LBank
```

### 제출 체크리스트

```
플랫폼          파일                        제출 여부
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BscScan        AKC-Icon-256.png            [ ]
CoinMarketCap  AKC-Icon-200.png            [ ]
CoinGecko      AKC-Icon-200.png            [ ]
PancakeSwap    AKC-Icon-256.png            [ ]
LBank          2개 (PNG + SVG)             [ ]
Trust Wallet   AKC-Icon-256.png            [ ]
```

---

## 🚀 5. 제출 순서 (권장)

### Day 1: 배포 당일

```bash
1. 컨트랙트 배포
   npx hardhat run scripts/deploy.js --network bscMainnet
   
2. BscScan 소스 검증
   npx hardhat verify --network bscMainnet [ADDRESS] [TREASURY]
   
3. BscScan 로고 제출 (즉시!)
   - AKC-Icon-256.png 업로드
   - 승인: 1-2시간
```

### Day 2-3: 리스팅 시작

```bash
4. CoinMarketCap 제출
   - AKC-Icon-200.png
   - 승인: 1-2주
   
5. CoinGecko 제출
   - AKC-Icon-200.png
   - 승인: 1-2주
```

### Week 1: DEX 리스팅

```bash
6. PancakeSwap 제출
   - AKC-Icon-256.png
   - 승인: 3-7일
   
7. LBank 연락
   - PNG + SVG
   - 승인: 협의
```

### Week 2-4: 지갑 지원

```bash
8. Trust Wallet 제출
   - AKC-Icon-256.png
   - 승인: 1-2주
   
9. MetaMask (자동)
   - Trust Wallet 승인 시 자동
```

---

## ⚠️ 6. 중요 주의사항

### ✅ 해야 할 것

```
✅ 각 플랫폼에 1개씩만 제출
✅ 정확한 사이즈 사용
✅ 투명 배경 PNG
✅ 컨트랙트 주소 정확히 입력
✅ 공식 웹사이트 링크 포함
✅ 소셜 미디어 링크 포함
```

### ❌ 하지 말아야 할 것

```
❌ 여러 파일 동시 제출
❌ 잘못된 사이즈 사용
❌ 배경이 있는 이미지
❌ 컨트랙트 주소 오타
❌ 저작권 있는 이미지 사용
❌ 온체인 로고 배포 시도
```

---

## 📊 7. 배포 vs 제출 비교

### 온체인 배포 (스마트 컨트랙트)

```
배포 대상:     AKC.sol (1개만!)
배포 위치:     BSC Mainnet
배포 방법:     Hardhat
배포 비용:     ~0.0045 BNB
배포 횟수:     1회만!
로고 포함:     ❌ 없음!

→ 컨트랙트에 로고 배포 안함!
```

### 오프체인 제출 (로고 파일)

```
제출 대상:     로고 PNG/SVG
제출 위치:     외부 플랫폼 (BscScan 등)
제출 방법:     웹 폼 / GitHub PR
제출 비용:     무료
제출 횟수:     플랫폼당 1회
로고 개수:     플랫폼당 1개

→ 각 플랫폼에 1개씩 제출!
```

---

## 🎯 8. 빠른 참조

### 컨트랙트 배포

```bash
# 1개만 배포!
npx hardhat run scripts/deploy.js --network bscMainnet

# 배포 완료!
✅ AKC Token deployed
✅ 더 이상 배포 없음
```

### 로고 제출

```bash
# 각 플랫폼에 1개씩 제출

BscScan:       AKC-Icon-256.png (1개)
CoinMarketCap: AKC-Icon-200.png (1개)
CoinGecko:     AKC-Icon-200.png (1개)
PancakeSwap:   AKC-Icon-256.png (1개)
LBank:         PNG + SVG (2개)
Trust Wallet:  AKC-Icon-256.png (1개)

# 온체인 배포 아님!
# 웹사이트에 제출만!
```

---

## 📞 9. FAQ

### Q1: 로고를 컨트랙트에 포함해야 하나요?
**A**: ❌ **아니요!** BEP-20 토큰은 로고를 온체인에 저장하지 않습니다.

### Q2: 컨트랙트를 몇 개 배포해야 하나요?
**A**: ✅ **1개만!** AKC.sol 하나만 배포하면 됩니다.

### Q3: 각 플랫폼에 몇 개 파일을 제출하나요?
**A**: ✅ **1개씩!** 각 플랫폼당 1개 파일만 제출합니다. (LBank만 2개)

### Q4: 모든 사이즈 로고를 다 제출하나요?
**A**: ❌ **아니요!** 플랫폼 요구사항에 맞는 1개만 제출합니다.

### Q5: 추가 컨트랙트가 필요한가요?
**A**: ❌ **아니요!** BEP-20 토큰만 배포하면 됩니다.

### Q6: NFT나 메타데이터 컨트랙트가 필요한가요?
**A**: ❌ **아니요!** 일반 토큰은 필요 없습니다.

### Q7: 로고 제출 비용이 드나요?
**A**: ✅ **무료!** 모든 플랫폼 로고 제출은 무료입니다.

### Q8: 로고는 온체인에 저장되나요?
**A**: ❌ **아니요!** 로고는 오프체인(플랫폼 서버)에 저장됩니다.

---

## 🎉 10. 최종 요약

```
╔═══════════════════════════════════════════════════╗
║          배포 및 로고 제출 요약                    ║
╠═══════════════════════════════════════════════════╣
║  컨트랙트 배포:       1개만! (AKC.sol)           ║
║  추가 컨트랙트:       없음! ❌                    ║
║  로고 온체인:         안함! ❌                    ║
║  로고 제출:           각 플랫폼 1개씩 ✅         ║
║  제출 방법:           웹 폼 / GitHub PR           ║
║  제출 비용:           무료! ✅                    ║
║                                                    ║
║  결론:                간단하고 명확! ✅           ║
╚═══════════════════════════════════════════════════╝
```

**핵심 포인트**:
1. ✅ 컨트랙트 1개만 배포 (AKC.sol)
2. ✅ 로고는 온체인 배포 안함
3. ✅ 각 플랫폼에 1개씩 제출
4. ✅ 제출은 무료
5. ✅ 추가 컨트랙트 불필요

---

**작성일**: 2025-11-01  
**버전**: 1.0.0  
**상태**: ✅ 최종 확정
