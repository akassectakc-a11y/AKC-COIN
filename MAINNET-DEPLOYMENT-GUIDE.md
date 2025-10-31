# 🚀 BSC Mainnet 배포 가이드

> **실제 운영 환경으로의 안전한 배포**

---

## ⚠️ 중요 사항

### 배포 전 필수 확인

```
🔴 절대 확인 사항:
[ ] 로컬 테스트 100% 완료
[ ] BSC Testnet 배포 및 검증 완료
[ ] 보안 감사 완료 (최소 Slither)
[ ] 백업 지갑 준비 (Multisig 권장)
[ ] 충분한 BNB 확보 (가스비 + 유동성)
[ ] 팀 전체 검토 완료
```

**⚠️ Mainnet 배포는 되돌릴 수 없습니다!**

---

## 💰 필요 자금

### 최소 예산

```
1. 배포 가스비: ~0.02 BNB ($10)
2. 검증 가스비: ~0.005 BNB ($2.5)
3. PancakeSwap 유동성: 10 BNB + 1M AKC ($5,000)
4. 예비 자금: 5 BNB ($2,500)
────────────────────────────────────
총 최소: ~15 BNB ($7,500)
```

### 권장 예산

```
1. 배포 관련: 15 BNB
2. 마케팅: 20 BNB ($10,000)
3. 거래소 상장: 100 BNB ($50,000)
4. 비상 자금: 20 BNB ($10,000)
────────────────────────────────────
총 권장: ~155 BNB ($77,500)
```

---

## 🔧 STEP 1: 최종 준비 (1시간)

### 1.1 환경 변수 설정 (10분)

```bash
# .env.mainnet 파일 생성 (절대 GitHub에 올리지 말것!)
cat > .env.mainnet << 'EOF'
# 배포자 개인키 (절대 노출 금지!)
PRIVATE_KEY=your_mainnet_private_key

# Treasury 주소 (Multisig 지갑 권장)
TREASURY_ADDRESS=your_mainnet_treasury_address

# BscScan API Key
BSCSCAN_API_KEY=your_api_key

# 백업 지갑
BACKUP_WALLET=your_backup_address
EOF

# 권한 설정 (읽기 전용)
chmod 400 .env.mainnet
```

**체크포인트:**
- [ ] .env.mainnet 생성 완료
- [ ] PRIVATE_KEY 확인 (실제 자금 있는 지갑)
- [ ] TREASURY_ADDRESS 확인 (Multisig 권장)
- [ ] .gitignore에 .env.mainnet 추가됨

### 1.2 Multisig 지갑 설정 (20분)

```bash
# Gnosis Safe 사용 권장
# https://gnosis-safe.io/app/bnb:

# 1. Safe 생성
- 최소 3/5 Multisig (5명 중 3명 서명 필요)
- 소유자: 팀원 지갑 주소들

# 2. Safe 주소를 TREASURY_ADDRESS로 설정
TREASURY_ADDRESS=0x... (Gnosis Safe 주소)
```

**Multisig 장점:**
- ✅ 단일 실패점 제거
- ✅ 팀 합의 필수
- ✅ 보안성 극대화

### 1.3 최종 코드 검토 (30분)

```bash
# 1. 컨트랙트 재컴파일
pnpm hardhat clean
pnpm hardhat compile

# 2. 전체 테스트 재실행
pnpm hardhat test

# 3. 가스 최적화 확인
REPORT_GAS=true pnpm hardhat test

# 4. Slither 재분석
slither contracts/AKC.sol
```

**체크포인트:**
- [ ] 컴파일 에러 0건
- [ ] 테스트 11개 모두 통과
- [ ] 가스 사용량 최적화됨
- [ ] Slither 경고 0건

---

## 🚀 STEP 2: Mainnet 배포 (30분)

### 2.1 배포 스크립트 실행 (10분)

```bash
# .env.mainnet 로드
cp .env.mainnet .env

# 네트워크 연결 테스트
cat > scripts/test-mainnet-connection.js << 'EOF'
require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed1.binance.org"
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("🌐 BSC Mainnet 연결 테스트");
  console.log(`📍 지갑: ${wallet.address}`);
  
  const balance = await wallet.getBalance();
  console.log(`💰 잔액: ${ethers.utils.formatEther(balance)} BNB`);
  
  const network = await provider.getNetwork();
  console.log(`🔗 네트워크: ${network.name} (Chain ID: ${network.chainId})`);
  
  if (network.chainId !== 56) {
    console.error("❌ BSC Mainnet이 아닙니다!");
    process.exit(1);
  }
  
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.error("❌ BNB 잔액이 부족합니다! (최소 0.1 BNB 필요)");
    process.exit(1);
  }
  
  console.log("\n✅ 배포 준비 완료!");
}

main();
EOF

node scripts/test-mainnet-connection.js
```

**체크포인트:**
- [ ] Chain ID: 56 (BSC Mainnet)
- [ ] BNB 잔액 >= 0.1 BNB
- [ ] 연결 성공

### 2.2 실제 배포 (15분)

```bash
# 🔴 매우 중요: 마지막 확인!
echo "⚠️  BSC Mainnet에 배포하시겠습니까? (yes/no)"
read CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "배포 취소됨"
  exit 1
fi

# 배포 실행
echo "🚀 3초 후 배포 시작..."
sleep 3

pnpm hardhat run scripts/deploy.js --network bscMainnet
```

**예상 출력:**
```
🚀 AKC Token 배포 시작...

📝 Treasury: 0x... (Multisig)
👤 배포자: 0x...
💰 잔액: 15.0 BNB

⏳ AKC 컨트랙트 배포 중...
✅ AKC 배포 완료: 0x9876543210987654321098765432109876543210
📊 총 발행량: 300,000,000 AKC

💾 배포 정보 저장: deployments/bscMainnet-deployment.json

========================================
다음 단계: BscScan 검증
npx hardhat verify --network bscMainnet 0x987... 0x123...
========================================
```

**체크포인트:**
- [ ] 배포 트랜잭션 성공
- [ ] 컨트랙트 주소 확보
- [ ] bscMainnet-deployment.json 생성
- [ ] BscScan에서 트랜잭션 확인

### 2.3 즉시 백업 (5분)

```bash
# 1. 배포 정보 백업
cp deployments/bscMainnet-deployment.json backups/mainnet-$(date +%Y%m%d-%H%M%S).json

# 2. .env 백업 (암호화 권장)
cp .env.mainnet backups/.env.mainnet-$(date +%Y%m%d-%H%M%S).backup

# 3. GitHub에 배포 정보 커밋 (개인키 제외!)
git add deployments/bscMainnet-deployment.json
git commit -m "Deploy AKC to BSC Mainnet"
git push origin main

# 4. GitHub Release 생성
git tag -a v1.0.0 -m "AKC Token v1.0.0 - Mainnet Launch"
git push origin v1.0.0
```

**체크포인트:**
- [ ] 배포 정보 백업 완료
- [ ] GitHub 커밋 완료
- [ ] Release v1.0.0 생성

---

## ✅ STEP 3: BscScan 검증 (20분)

### 3.1 검증 실행 (10분)

```bash
# 검증 스크립트 실행
pnpm hardhat run scripts/verify.js --network bscMainnet
```

**예상 출력:**
```
🔍 컨트랙트 검증 시작...
📝 컨트랙트: 0x9876543210987654321098765432109876543210
📝 Treasury: 0x1234567890123456789012345678901234567890

Successfully submitted source code for contract
contracts/AKC.sol:AKC at 0x987...
for verification on the block explorer. Waiting for verification result...

Successfully verified contract AKC on Etherscan.
https://bscscan.com/address/0x987...#code

✅ 검증 완료!
```

**체크포인트:**
- [ ] 소스코드 공개 완료
- [ ] Read Contract 활성화
- [ ] Write Contract 활성화

### 3.2 BscScan에서 확인 (10분)

```bash
CONTRACT_ADDRESS=$(cat deployments/bscMainnet-deployment.json | grep contractAddress | cut -d'"' -f4)

echo "🔗 BscScan 링크:"
echo "https://bscscan.com/address/${CONTRACT_ADDRESS}"
echo "https://bscscan.com/token/${CONTRACT_ADDRESS}"
```

**BscScan에서 확인할 항목:**
- [ ] ✅ Contract 탭: 초록색 체크 (검증됨)
- [ ] ✅ Read Contract: 모든 함수 조회 가능
- [ ] ✅ Write Contract: Owner 함수 실행 가능
- [ ] ✅ Token Tracker: AKC 표시
- [ ] ✅ Holders: Treasury 1개 (100%)

---

## 🔒 STEP 4: 보안 설정 (30분)

### 4.1 소유권 Multisig로 이전 (10분)

```bash
cat > scripts/transfer-ownership.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const deployment = JSON.parse(
    fs.readFileSync("./deployments/bscMainnet-deployment.json", "utf8")
  );
  
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = AKC.attach(deployment.contractAddress);
  
  const MULTISIG_ADDRESS = process.env.TREASURY_ADDRESS;
  
  console.log("🔐 소유권 이전");
  console.log(`현재 Owner: ${await akc.owner()}`);
  console.log(`새 Owner: ${MULTISIG_ADDRESS}`);
  
  const tx = await akc.transferOwnership(MULTISIG_ADDRESS);
  await tx.wait();
  
  console.log(`✅ 소유권 이전 완료!`);
  console.log(`새 Owner: ${await akc.owner()}`);
}

main().catch(console.error);
EOF

# ⚠️ 신중하게 실행!
pnpm hardhat run scripts/transfer-ownership.js --network bscMainnet
```

**체크포인트:**
- [ ] 소유권이 Multisig로 이전됨
- [ ] 더 이상 단일 지갑으로 제어 불가

### 4.2 긴급 연락망 구축 (10분)

```markdown
# 긴급 연락망

## 비상 상황 대응 팀
1. CEO: [전화번호] [Telegram]
2. CTO: [전화번호] [Telegram]
3. 보안 담당: [전화번호] [Telegram]
4. Multisig 서명자:
   - 서명자 1: [연락처]
   - 서명자 2: [연락처]
   - 서명자 3: [연락처]

## 비상 절차
1. 보안 사고 발견 → 즉시 팀 전체 알림
2. Multisig로 pause() 실행
3. 문제 분석 및 해결
4. unpause() 실행
```

### 4.3 모니터링 설정 (10분)

```bash
# Tenderly 모니터링 설정
# https://tenderly.co/

# 1. Tenderly 계정 생성
# 2. 프로젝트 생성
# 3. 컨트랙트 추가
# 4. Alert 설정:
#    - 대량 전송 (> 1M AKC)
#    - Owner 변경
#    - pause() 호출
#    - 비정상 트랜잭션
```

---

## 📊 STEP 5: 유동성 풀 생성 (1시간)

### 5.1 PancakeSwap 유동성 추가

```bash
# 유동성 풀 생성 스크립트 실행
pnpm hardhat run scripts/create-pancakeswap-pool.js --network bscMainnet
```

**파라미터:**
```
AKC 수량: 1,000,000 AKC (총 발행량의 0.33%)
BNB 수량: 10 BNB
초기 가격: 1 AKC = 0.00001 BNB ($0.005)
시가총액: $1,500,000
```

**체크포인트:**
- [ ] 유동성 풀 생성 완료
- [ ] PancakeSwap에서 거래 가능
- [ ] LP 토큰 수령

### 5.2 거래 테스트

```bash
# PancakeSwap에서 소량 거래 테스트
# https://pancakeswap.finance/swap?outputCurrency=0x...

# 1. 0.01 BNB → AKC Swap
# 2. 100 AKC → BNB Swap
# 3. 정상 작동 확인
```

---

## 🎯 STEP 6: 공식 발표 (2시간)

### 6.1 공식 웹사이트 업데이트

```html
<!-- Mainnet 주소 업데이트 -->
<div class="contract-info">
  <h3>Contract Address (BSC Mainnet)</h3>
  <code>0x9876543210987654321098765432109876543210</code>
  <a href="https://bscscan.com/token/0x987...">View on BscScan</a>
</div>

<div class="trading">
  <h3>Trade AKC</h3>
  <a href="https://pancakeswap.finance/swap?outputCurrency=0x987...">
    Buy on PancakeSwap
  </a>
</div>
```

### 6.2 소셜 미디어 발표

```markdown
# Twitter 발표문

🎉 AINOVA Key Coin (AKC) Mainnet Launch! 🚀

We're excited to announce that AKC is now LIVE on BSC Mainnet!

📝 Contract: 0x987... (Verified ✅)
💎 Total Supply: 300,000,000 AKC
🥞 Trade Now: [PancakeSwap Link]
🔍 Explorer: [BscScan Link]

#AKC #BSC #DeFi #Crypto
```

### 6.3 커뮤니티 공지

```markdown
# Telegram/Discord 공지

🎊 MAINNET LAUNCH ANNOUNCEMENT 🎊

Dear AINOVA Community,

We are thrilled to announce the official launch of AINOVA Key Coin (AKC) on Binance Smart Chain Mainnet!

📍 Contract Address: 0x987...
✅ BscScan Verified
🥞 Live on PancakeSwap
💰 Initial Liquidity: 10 BNB + 1M AKC

🔗 Important Links:
- Trade: [PancakeSwap]
- Explorer: [BscScan]
- Chart: [Coming Soon]

Thank you for your support! 🙏

AINOVA Team
```

---

## 📈 STEP 7: 런칭 후 체크리스트

### 첫 24시간

```
매 1시간마다 체크:
[ ] 거래량 확인
[ ] 가격 안정성 확인
[ ] 비정상 트랜잭션 모니터링
[ ] 커뮤니티 피드백 수집
[ ] 긴급 이슈 대응
```

### 첫 1주일

```
매일 체크:
[ ] 총 거래량 분석
[ ] 홀더 수 증가 추적
[ ] 거래소 상장 준비
[ ] 마케팅 캠페인 진행
[ ] 파트너십 협상
```

### 첫 1개월

```
주간 체크:
[ ] 월간 리포트 작성
[ ] 로드맵 업데이트
[ ] 커뮤니티 AMA
[ ] 신규 거래소 상장
[ ] 기능 업데이트 계획
```

---

## 🚨 비상 상황 대응

### 보안 사고 발생 시

```bash
# 1. 즉시 거래 일시정지
# Multisig에서 실행:
await akc.pause();

# 2. 문제 분석
# - 트랜잭션 로그 확인
# - 공격 벡터 파악
# - 영향 범위 조사

# 3. 커뮤니티 공지
"We have temporarily paused AKC transfers while investigating 
a potential security issue. Your funds are safe."

# 4. 문제 해결 후
await akc.unpause();

# 5. 사후 보고서 작성
```

---

## ✅ 최종 체크리스트

### 배포 전
- [ ] 로컬 테스트 100% 완료
- [ ] Testnet 배포 및 검증 완료
- [ ] 보안 감사 완료
- [ ] Multisig 지갑 설정
- [ ] BNB 자금 준비 (15 BNB+)
- [ ] 팀 전체 승인

### 배포 후
- [ ] Mainnet 배포 성공
- [ ] BscScan 검증 완료
- [ ] 소유권 Multisig 이전
- [ ] PancakeSwap 유동성 풀 생성
- [ ] 거래 테스트 성공
- [ ] 공식 발표 완료

### 운영 중
- [ ] 모니터링 시스템 가동
- [ ] 긴급 연락망 구축
- [ ] 커뮤니티 관리
- [ ] 거래소 상장 진행
- [ ] 마케팅 캠페인 실행

---

## 🎉 축하합니다!

AKC Token이 성공적으로 BSC Mainnet에 배포되었습니다!

**다음 단계:**
1. [거래소 상장](./EXCHANGE-DEPLOYMENT-GUIDE.md)
2. 커뮤니티 구축
3. 파트너십 확대
4. 글로벌 확장

---

** Mirucoder ** Request End
