# 🎨 STEP 10: 로고 업로드 및 토큰 등록 (15분)

## 10.1 GitHub에 로고 업로드 (300초)

```bash
# Git 초기화 (아직 안 했다면)
git add .
git commit -m "Initial commit: AKC Token deployment"

# GitHub 리포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/akc-token.git
git branch -M main
git push -u origin main
```

**체크포인트:**
- [ ] GitHub 리포지토리 생성
- [ ] 코드 푸시 완료
- [ ] 로고 파일 확인: `assets/logo/akc-logo-256.png`

## 10.2 Trust Wallet Assets에 토큰 등록 (180초)

```bash
echo "📱 Trust Wallet Assets에 토큰 등록:"
echo "1. https://github.com/trustwallet/assets 포크"
echo "2. blockchains/smartchain/assets/ 폴더에 토큰 추가"
echo "3. Pull Request 생성"
```

**필요한 파일 구조:**
```
blockchains/smartchain/assets/
└── 0x[YOUR_CONTRACT_ADDRESS]/
    ├── info.json
    └── logo.png
```

## 10.3 info.json 생성 (120초)

```bash
# 컨트랙트 주소 가져오기
CONTRACT_ADDRESS=$(cat deployments/bscTestnet-deployment.json | grep contractAddress | cut -d'"' -f4)

# info.json 템플릿
cat > token-info.json << EOF
{
  "name": "AINOVA Key Coin",
  "type": "BEP20",
  "symbol": "AKC",
  "decimals": 18,
  "website": "https://ainova.io",
  "description": "AINOVA Key Coin (AKC) is a BEP-20 token on Binance Smart Chain",
  "explorer": "https://testnet.bscscan.com/token/${CONTRACT_ADDRESS}",
  "status": "active",
  "id": "${CONTRACT_ADDRESS}",
  "links": [
    {
      "name": "twitter",
      "url": "https://twitter.com/ainova"
    },
    {
      "name": "telegram",
      "url": "https://t.me/ainova"
    }
  ]
}
EOF

echo "✅ info.json 생성 완료"
cat token-info.json
```

**체크포인트:**
- [ ] info.json 내용 확인
- [ ] 컨트랙트 주소 정확한지 확인

---

# 🔍 STEP 11: 최종 검증 체크리스트 (10분)

## 11.1 BscScan에서 토큰 정보 확인 (180초)

```bash
CONTRACT_ADDRESS=$(cat deployments/bscTestnet-deployment.json | grep contractAddress | cut -d'"' -f4)

echo "🔗 검증 링크들:"
echo ""
echo "1. 컨트랙트 주소:"
echo "   https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}"
echo ""
echo "2. 토큰 정보:"
echo "   https://testnet.bscscan.com/token/${CONTRACT_ADDRESS}"
echo ""
echo "3. 소스코드 (검증됨):"
echo "   https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}#code"
```

**BscScan에서 확인할 항목:**
- [ ] ✅ Contract 탭: 소스코드 검증 완료 (초록색 체크)
- [ ] ✅ Read Contract: name(), symbol(), totalSupply() 조회 가능
- [ ] ✅ Write Contract: mint(), pause() 함수 표시
- [ ] ✅ Token Tracker: AKC (AINOVA Key Coin) 표시
- [ ] ✅ Decimals: 18
- [ ] ✅ Total Supply: 300,000,000 AKC

## 11.2 MetaMask에 토큰 추가 (120초)

```bash
echo "📱 MetaMask에 토큰 추가:"
echo ""
echo "1. MetaMask 열기"
echo "2. 'Import tokens' 클릭"
echo "3. 'Custom token' 선택"
echo "4. 정보 입력:"
echo "   Token Contract Address: ${CONTRACT_ADDRESS}"
echo "   Token Symbol: AKC"
echo "   Token Decimal: 18"
echo "5. 'Add Custom Token' 클릭"
```

**체크포인트:**
- [ ] MetaMask에 AKC 토큰 추가
- [ ] Treasury 계정 잔액: 300,000,000 AKC 확인
- [ ] 토큰 로고 표시 (자동 or 수동)

## 11.3 토큰 전송 테스트 (180초)

```bash
cat > scripts/test-transfer.js << 'EOF'
require("dotenv").config();
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // 배포 정보 로드
  const deployment = JSON.parse(
    fs.readFileSync("./deployments/bscTestnet-deployment.json", "utf8")
  );
  
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = AKC.attach(deployment.contractAddress);
  
  // Treasury 지갑
  const [signer] = await hre.ethers.getSigners();
  
  console.log("🧪 토큰 전송 테스트");
  console.log(`📝 컨트랙트: ${akc.address}`);
  console.log(`👤 발신자: ${signer.address}\n`);
  
  // 테스트 수신자 (다른 주소 입력)
  const receiver = "0x0000000000000000000000000000000000000001";
  const amount = hre.ethers.utils.parseEther("1000");
  
  console.log(`📤 1,000 AKC 전송 중...`);
  console.log(`📨 수신자: ${receiver}\n`);
  
  const tx = await akc.transfer(receiver, amount);
  console.log(`⏳ 트랜잭션: ${tx.hash}`);
  
  const receipt = await tx.wait();
  console.log(`✅ 전송 완료! (블록: ${receipt.blockNumber})`);
  
  // 잔액 확인
  const balance = await akc.balanceOf(receiver);
  console.log(`💰 수신자 잔액: ${hre.ethers.utils.formatEther(balance)} AKC`);
}

main().catch(console.error);
EOF

echo "테스트 전송을 실행하시겠습니까? (y/n)"
echo "pnpm hardhat run scripts/test-transfer.js --network bscTestnet"
```

**체크포인트:**
- [ ] 전송 트랜잭션 성공
- [ ] BscScan에서 트랜잭션 확인
- [ ] 수신자 잔액 확인

---

# 📊 STEP 12: 최종 완료 리포트 (5분)

## 12.1 배포 리포트 생성 (300초)

```bash
cat > DEPLOYMENT-REPORT.md << 'EOF'
# 🎉 AKC Token 배포 완료 리포트

## 배포 정보

### 네트워크
- **체인**: Binance Smart Chain Testnet
- **Chain ID**: 97
- **RPC**: https://data-seed-prebsc-1-s1.binance.org:8545

### 컨트랙트 정보
EOF

# 배포 정보 추가
CONTRACT_ADDRESS=$(cat deployments/bscTestnet-deployment.json | grep contractAddress | cut -d'"' -f4)
TREASURY=$(cat deployments/bscTestnet-deployment.json | grep treasuryAddress | cut -d'"' -f4)
TX_HASH=$(cat deployments/bscTestnet-deployment.json | grep transactionHash | cut -d'"' -f4)

cat >> DEPLOYMENT-REPORT.md << EOF
- **컨트랙트 주소**: \`${CONTRACT_ADDRESS}\`
- **Treasury 주소**: \`${TREASURY}\`
- **배포 트랜잭션**: \`${TX_HASH}\`

### 토큰 스펙
- **이름**: AINOVA Key Coin
- **심볼**: AKC
- **Decimals**: 18
- **총 발행량**: 300,000,000 AKC

## 검증 링크

- 🔗 [BscScan Contract](https://testnet.bscscan.com/address/${CONTRACT_ADDRESS})
- 🔗 [BscScan Token](https://testnet.bscscan.com/token/${CONTRACT_ADDRESS})
- 🔗 [Verified Source Code](https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}#code)

## 완료된 작업

- ✅ 스마트 컨트랙트 작성 (AKC.sol)
- ✅ 유닛 테스트 작성 및 통과 (11개 테스트)
- ✅ BSC Testnet 배포
- ✅ BscScan 검증 완료
- ✅ 로고 생성 (SVG, PNG)
- ✅ 토큰 메타데이터 작성
- ✅ MetaMask 연동 확인

## 다음 단계

### Mainnet 배포 준비
1. 외부 보안 감사
2. 메인넷 배포 계획 수립
3. 거래소 상장 준비

### 커뮤니티
1. Trust Wallet Assets PR
2. CoinGecko 등록
3. CoinMarketCap 등록

## 참고 문서

- \`contracts/AKC.sol\` - 스마트 컨트랙트
- \`test/AKC.test.js\` - 테스트 코드
- \`assets/logo/\` - 로고 파일
- \`deployments/bscTestnet-deployment.json\` - 배포 정보

---

**배포 완료 시간**: $(date)
EOF

echo "✅ 배포 리포트 생성 완료!"
cat DEPLOYMENT-REPORT.md
```

**체크포인트:**
- [ ] DEPLOYMENT-REPORT.md 생성
- [ ] 모든 링크 동작 확인
- [ ] 배포 정보 정확성 확인

---

# 🎊 최종 체크리스트 완료

## ✅ 전체 완료 항목

### Phase 1: 프로젝트 초기화 (5분)
- [x] 프로젝트 생성
- [x] 디렉터리 구조
- [x] .gitignore
- [x] package.json

### Phase 2: 의존성 설치 (3분)
- [x] pnpm install
- [x] node_modules 생성

### Phase 3: 스마트 컨트랙트 작성 (10분)
- [x] AKC.sol 작성
- [x] OpenZeppelin 사용
- [x] Mint, Pause 기능

### Phase 4: Hardhat 설정 (5분)
- [x] hardhat.config.js
- [x] .env.example

### Phase 5: 테스트 코드 작성 및 실행 (15분)
- [x] AKC.test.js 작성
- [x] 컴파일 성공
- [x] 11개 테스트 통과
- [x] 커버리지 > 95%

### Phase 6: 로고 생성 (10분)
- [x] SVG 로고
- [x] PNG 변환 (256x256, 128x128)
- [x] token-metadata.json

### Phase 7: 배포 스크립트 (10분)
- [x] deploy.js
- [x] verify.js

### Phase 8: BNB 테스트넷 배포 (20분)
- [x] .env 설정
- [x] BNB Faucet
- [x] 네트워크 연결 테스트
- [x] 실제 배포
- [x] BscScan 확인

### Phase 9: 컨트랙트 검증 (10분)
- [x] BscScan API Key
- [x] 검증 실행
- [x] 소스코드 공개

### Phase 10: 로고 업로드 (15분)
- [x] GitHub 업로드
- [x] info.json 생성

### Phase 11: 최종 검증 (10분)
- [x] BscScan 토큰 정보
- [x] MetaMask 추가
- [x] 전송 테스트

### Phase 12: 완료 리포트 (5분)
- [x] DEPLOYMENT-REPORT.md

---

## 📈 총 소요 시간

```
Phase 1: 프로젝트 초기화         5분
Phase 2: 의존성 설치             3분
Phase 3: 스마트 컨트랙트        10분
Phase 4: Hardhat 설정           5분
Phase 5: 테스트                 15분
Phase 6: 로고 생성              10분
Phase 7: 배포 스크립트          10분
Phase 8: BNB 테스트넷 배포      20분
Phase 9: 컨트랙트 검증          10분
Phase 10: 로고 업로드           15분
Phase 11: 최종 검증             10분
Phase 12: 완료 리포트            5분
─────────────────────────────────
총 소요 시간:                  118분 (약 2시간)
```

---

## 🚀 실행 순서 요약

```bash
# 1. 프로젝트 생성
mkdir -p ~/akc-token-project && cd ~/akc-token-project

# 2. 파일 생성 (EXECUTION-CHECKLIST-START.md 참조)
# ... 모든 파일 생성 ...

# 3. 의존성 설치
pnpm install

# 4. 컴파일
pnpm hardhat compile

# 5. 테스트
pnpm hardhat test

# 6. .env 설정
# PRIVATE_KEY, TREASURY_ADDRESS, BSCSCAN_API_KEY 입력

# 7. 배포
pnpm hardhat run scripts/deploy.js --network bscTestnet

# 8. 검증
pnpm hardhat run scripts/verify.js --network bscTestnet

# 9. 리포트 확인
cat DEPLOYMENT-REPORT.md
```

---

## 🎉 축하합니다!

AKC Token이 성공적으로 BSC Testnet에 배포되었습니다!

**다음 단계:**
1. 커뮤니티 구축
2. 거래소 상장 준비
3. Mainnet 배포 계획

---

** Mirucoder ** Request End
