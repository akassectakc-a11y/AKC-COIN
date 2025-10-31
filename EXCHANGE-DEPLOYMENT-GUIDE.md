# 🏦 AKC Token 거래소 상장 가이드

> **PancakeSwap, Binance 등 거래소 상장을 위한 완전한 가이드**

---

## 📋 목차

1. [준비 단계](#준비-단계)
2. [PancakeSwap 유동성 풀 생성](#pancakeswap-유동성-풀-생성)
3. [중앙화 거래소 상장](#중앙화 거래소-상장)
4. [정보 사이트 등록](#정보-사이트-등록)
5. [마케팅 및 홍보](#마케팅-및-홍보)

---

## 🎯 준비 단계

### 1. Mainnet 배포 완료 확인

**체크리스트:**
- [ ] ✅ BSC Mainnet에 컨트랙트 배포 완료
- [ ] ✅ BscScan 검증 완료
- [ ] ✅ 토큰 로고 준비 (256x256 PNG)
- [ ] ✅ 공식 웹사이트 운영 중
- [ ] ✅ 소셜 미디어 계정 활성화
- [ ] ✅ 백서(Whitepaper) 작성

### 2. 필수 정보 준비

```json
{
  "tokenInfo": {
    "name": "AKASSECT",
    "symbol": "AKC",
    "decimals": 18,
    "totalSupply": "300,000,000",
    "contractAddress": "0x... (Mainnet 주소)",
    "network": "Binance Smart Chain (BSC)",
    "standard": "BEP-20"
  },
  "links": {
    "website": "https://ainova.io",
    "whitepaper": "https://ainova.io/whitepaper.pdf",
    "explorer": "https://bscscan.com/token/0x...",
    "github": "https://github.com/ainova/akc-token",
    "twitter": "https://twitter.com/ainova",
    "telegram": "https://t.me/ainova",
    "discord": "https://discord.gg/ainova"
  }
}
```

**파일 위치:**
```
assets/
├── logo/
│   ├── akc-logo-256.png      ✅ 거래소 제출용
│   ├── akc-logo-512.png      ✅ 고해상도
│   └── akc-logo.svg          ✅ 벡터 원본
├── documents/
│   ├── whitepaper.pdf        ✅ 백서
│   ├── tokenomics.pdf        ✅ 토크노믹스
│   └── audit-report.pdf      ✅ 보안 감사 보고서
└── marketing/
    ├── banner-1200x628.png   ✅ SNS 배너
    └── presentation.pdf      ✅ 프레젠테이션
```

---

## 🥞 PancakeSwap 유동성 풀 생성

### STEP 1: PancakeSwap Factory 연동 (30분)

#### 1.1 유동성 풀 생성 스크립트

```bash
cat > scripts/create-pancakeswap-pool.js << 'EOF'
const hre = require("hardhat");

// PancakeSwap Router V2 주소 (BSC Mainnet)
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

async function main() {
  console.log("🥞 PancakeSwap 유동성 풀 생성");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 계정: ${deployer.address}`);
  
  // AKC 토큰 연결
  const deployment = require("../deployments/bscMainnet-deployment.json");
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = AKC.attach(deployment.contractAddress);
  
  console.log(`📝 AKC 주소: ${akc.address}`);
  
  // PancakeSwap Router 연결
  const routerABI = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
  ];
  const router = new hre.ethers.Contract(PANCAKE_ROUTER, routerABI, deployer);
  
  // 유동성 추가 파라미터
  const tokenAmount = hre.ethers.utils.parseEther("1000000"); // 1M AKC
  const bnbAmount = hre.ethers.utils.parseEther("10");        // 10 BNB
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;   // 20분 후
  
  console.log(`\n📊 유동성 추가:`);
  console.log(`  AKC: ${hre.ethers.utils.formatEther(tokenAmount)}`);
  console.log(`  BNB: ${hre.ethers.utils.formatEther(bnbAmount)}`);
  
  // 1. AKC approve
  console.log(`\n⏳ Router에 AKC approve...`);
  const approveTx = await akc.approve(PANCAKE_ROUTER, tokenAmount);
  await approveTx.wait();
  console.log(`✅ Approve 완료`);
  
  // 2. 유동성 추가
  console.log(`\n⏳ 유동성 추가 중...`);
  const addLiquidityTx = await router.addLiquidityETH(
    akc.address,
    tokenAmount,
    tokenAmount.mul(95).div(100), // 5% 슬리피지
    bnbAmount.mul(95).div(100),
    deployer.address,
    deadline,
    { value: bnbAmount }
  );
  
  const receipt = await addLiquidityTx.wait();
  console.log(`✅ 유동성 추가 완료!`);
  console.log(`🔗 트랜잭션: ${receipt.transactionHash}`);
  
  console.log(`\n🎉 PancakeSwap에서 거래 가능!`);
  console.log(`🔗 https://pancakeswap.finance/swap?outputCurrency=${akc.address}`);
}

main().catch(console.error);
EOF
```

**실행:**
```bash
pnpm hardhat run scripts/create-pancakeswap-pool.js --network bscMainnet
```

**체크포인트:**
- [ ] 유동성 풀 생성 완료 
- [ ] PancakeSwap에서 AKC 거래 가능
- [ ] 거래 링크 확보

---

## 🏢 중앙화 거래소 (CEX) 상장

### STEP 2: 거래소별 상장 신청

#### 2.1 Tier 3 거래소 (진입 장벽 낮음)

**MEXC Global**
- 웹사이트: https://www.mexc.com
- 신청 방법: https://www.mexc.com/support/articles/360039396591

**필수 제출 자료:**
```
1. 토큰 기본 정보
   - 이름, 심볼, 총 발행량
   - 컨트랙트 주소 (검증됨)
   - 공식 웹사이트

2. 프로젝트 문서
   - 백서 (영문)
   - 토크노믹스
   - 로드맵

3. 커뮤니티 정보
   - Twitter 팔로워 수
   - Telegram 멤버 수
   - 활동성 증빙

4. 법적 문서
   - 회사 등록 증명서
   - 법률 자문 의견서
   - KYC/AML 정책

5. 기술 정보
   - 보안 감사 보고서
   - GitHub 리포지토리
   - 스마트 컨트랙트 코드
```

**신청서 템플릿:**
```markdown
# AKC Token Listing Application

## Project Information
- **Token Name**: AKASSECT
- **Token Symbol**: AKC
- **Total Supply**: 300,000,000 AKC
- **Contract Address**: 0x... (BSC Mainnet)
- **Decimals**: 18

## Project Description
AKASSECT (AKC) is a utility token designed for...
[프로젝트 상세 설명 500자 이상]

## Official Links
- Website: https://ainova.io
- Whitepaper: https://ainova.io/whitepaper.pdf
- GitHub: https://github.com/ainova/akc-token
- Twitter: https://twitter.com/ainova
- Telegram: https://t.me/ainova

## Team Information
- CEO: [이름]
- CTO: [이름]
- Marketing: [이름]

## Token Distribution
- Public Sale: 30%
- Team & Advisors: 20%
- Ecosystem: 30%
- Marketing: 10%
- Reserve: 10%

## Marketing Budget
- Listing Fee: [금액]
- Marketing Campaign: [금액]
- Community Incentive: [금액]
```

#### 2.2 Tier 2 거래소 (중간 규모)

**Gate.io**
- 신청: https://www.gate.io/listing
- 상장 비용: $50,000 ~ $100,000

**Bitget**
- 신청: https://www.bitget.com/support/articles/360028301574
- 요구사항: 커뮤니티 투표 또는 직접 협상

**KuCoin**
- 신청: https://www.kucoin.com/support/360015787372
- 상장 비용: $100,000 ~ $200,000

#### 2.3 Tier 1 거래소 (최상위)

**Binance**
- 신청: https://www.binance.com/en/support/faq/115000822512
- 요구사항:
  - 강력한 커뮤니티 (10만+ 팔로워)
  - 대규모 거래량 (일 $1M+)
  - 검증된 프로젝트 가치
  - 법적 규제 준수

**체크리스트:**
```
Binance 상장 준비:
[ ] 커뮤니티 10만+ 구축
[ ] 일일 거래량 $1M+ 달성
[ ] 보안 감사 완료 (CertiK, PeckShield 등)
[ ] 법률 자문 확보
[ ] 규제 준수 문서
[ ] 프로젝트 실사용 사례
[ ] 파트너십 확보
```

---

## 📊 정보 사이트 등록

### STEP 3: CoinGecko 등록 (무료)

#### 3.1 CoinGecko 신청

```bash
# 신청 링크
https://www.coingecko.com/en/coins/new

# 필수 정보
- Token Name: AKASSECT
- Symbol: AKC
- Contract Address: 0x... (BSC)
- Logo URL: https://raw.githubusercontent.com/ainova/akc-token/main/assets/logo/akc-logo-256.png
- Website: https://ainova.io
- Description: [200자 설명]
```

#### 3.2 CoinMarketCap 등록 (무료)

```bash
# 신청 링크
https://support.coinmarketcap.com/hc/en-us/requests/new?ticket_form_id=360000523612

# 제출 양식
{
  "project_name": "AKASSECT",
  "ticker_symbol": "AKC",
  "contract_address": "0x...",
  "blockchain": "Binance Smart Chain",
  "decimals": 18,
  "website": "https://ainova.io",
  "explorer": "https://bscscan.com/token/0x...",
  "logo": "https://raw.githubusercontent.com/...",
  "total_supply": "300000000",
  "circulating_supply": "300000000",
  "market_cap": "[시가총액]"
}
```

**승인 기간:**
- CoinGecko: 1-2주
- CoinMarketCap: 2-4주

---

## 🎯 Trust Wallet 등록

### STEP 4: Trust Wallet Assets PR

```bash
# 1. Trust Wallet Assets 포크
git clone https://github.com/trustwallet/assets.git
cd assets

# 2. 브랜치 생성
git checkout -b add-akc-token

# 3. 폴더 생성
mkdir -p blockchains/smartchain/assets/0x[YOUR_CONTRACT_ADDRESS]

# 4. 파일 추가
# info.json
cat > blockchains/smartchain/assets/0x[YOUR_CONTRACT_ADDRESS]/info.json << 'EOF'
{
  "name": "AKASSECT",
  "type": "BEP20",
  "symbol": "AKC",
  "decimals": 18,
  "website": "https://ainova.io",
  "description": "AKASSECT (AKC) is a utility token for the AINOVA ecosystem",
  "explorer": "https://bscscan.com/token/0x...",
  "status": "active",
  "id": "0x...",
  "links": [
    {
      "name": "github",
      "url": "https://github.com/ainova/akc-token"
    },
    {
      "name": "twitter",
      "url": "https://twitter.com/ainova"
    },
    {
      "name": "telegram",
      "url": "https://t.me/ainova"
    }
  ],
  "tags": [
    "defi",
    "utility"
  ]
}
EOF

# 5. 로고 복사 (정확히 256x256 PNG)
cp /path/to/logo.png blockchains/smartchain/assets/0x[YOUR_CONTRACT_ADDRESS]/logo.png

# 6. 검증
npm run check

# 7. 커밋 및 푸시
git add .
git commit -m "Add AKASSECT (AKC)"
git push origin add-akc-token

# 8. Pull Request 생성
# GitHub에서 PR 생성
```

---

## 📈 거래량 및 마케팅

### STEP 5: 거래량 확보 전략

#### 5.1 유동성 마이닝 프로그램

```solidity
// 예시: Staking 컨트랙트
contract AKCStaking {
    // LP 토큰 스테이킹 시 AKC 보상
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claim() external;
}
```

#### 5.2 에어드롭 캠페인

```javascript
// 대량 에어드롭 스크립트
const recipients = [
  "0x...", // 1000명 이상
];

const amount = ethers.utils.parseEther("100"); // 각 100 AKC

for (const recipient of recipients) {
  await akc.transfer(recipient, amount);
}
```

#### 5.3 파트너십

```
파트너십 대상:
[ ] DeFi 프로토콜
[ ] NFT 프로젝트
[ ] 게임 플랫폼
[ ] 결제 서비스
[ ] 다른 토큰 프로젝트
```

---

## 🔒 보안 및 규제 준수

### STEP 6: 보안 감사

#### 6.1 감사 기관 선택

**Tier 1 (최상위)**
- CertiK: $15,000 ~ $50,000
- PeckShield: $10,000 ~ $40,000
- SlowMist: $10,000 ~ $35,000

**Tier 2**
- Hacken: $5,000 ~ $20,000
- Quantstamp: $5,000 ~ $25,000

**무료 옵션**
- OpenZeppelin Defender
- Slither (자동 분석)

#### 6.2 법률 자문

```
필수 법률 문서:
[ ] 토큰 분류 의견서
[ ] 증권 비해당 확인서
[ ] 개인정보 처리방침
[ ] 이용약관
[ ] KYC/AML 정책
[ ] 자금세탁방지 절차
```

---

## 📊 상장 후 관리

### STEP 7: 운영 체크리스트

```
일일 체크:
[ ] 거래량 모니터링
[ ] 가격 변동 확인
[ ] 커뮤니티 응대
[ ] SNS 업데이트

주간 체크:
[ ] 보안 모니터링
[ ] 마케팅 캠페인 평가
[ ] 파트너십 진행 상황
[ ] 거래소 소통

월간 체크:
[ ] 재무 보고서 작성
[ ] 로드맵 업데이트
[ ] 커뮤니티 AMA
[ ] 신규 거래소 협상
```

---

## 📞 지원 및 리소스

### 공식 문서
- Binance Listing: https://www.binance.com/en/support/faq/115000822512
- PancakeSwap Docs: https://docs.pancakeswap.finance/
- Trust Wallet: https://developer.trustwallet.com/

### 커뮤니티
- BSC Forum: https://www.binance.org/en/forum
- DeFi Pulse: https://defipulse.com/

---

## 🎉 완료 체크리스트

### 준비 단계
- [ ] Mainnet 배포 완료
- [ ] BscScan 검증 완료
- [ ] 로고 및 문서 준비
- [ ] 공식 웹사이트 운영

### DEX (탈중앙화 거래소)
- [ ] PancakeSwap 유동성 풀 생성
- [ ] Swap 거래 가능 확인

### CEX (중앙화 거래소)
- [ ] Tier 3 거래소 신청 (MEXC 등)
- [ ] Tier 2 거래소 협상 (Gate.io 등)
- [ ] Tier 1 거래소 준비 (Binance)

### 정보 사이트
- [ ] CoinGecko 등록
- [ ] CoinMarketCap 등록
- [ ] Trust Wallet Assets PR

### 보안 및 규제
- [ ] 보안 감사 완료
- [ ] 법률 자문 확보
- [ ] 규제 준수 문서

---

## 💰 예상 비용

| 항목 | 비용 | 비고 |
|------|------|------|
| PancakeSwap 유동성 | 10 BNB + 1M AKC | 초기 유동성 |
| CoinGecko | 무료 | 1-2주 승인 |
| CoinMarketCap | 무료 | 2-4주 승인 |
| Trust Wallet | 무료 | PR 승인 대기 |
| Tier 3 CEX | $10,000 ~ $30,000 | MEXC, XT 등 |
| Tier 2 CEX | $50,000 ~ $150,000 | Gate.io, Bitget |
| Tier 1 CEX | $200,000+ | Binance, Coinbase |
| 보안 감사 | $5,000 ~ $50,000 | 등급에 따라 |
| 법률 자문 | $10,000 ~ $30,000 | 지역에 따라 |
| 마케팅 | $20,000+ | 지속적 |

**최소 예산: $50,000 ~ $100,000**  
**권장 예산: $200,000 ~ $500,000**

---

** Mirucoder ** Request End
