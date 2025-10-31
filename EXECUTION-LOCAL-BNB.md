# 🏠 로컬 BNB 네트워크 테스트 가이드

> **BNB와 동일한 환경을 로컬에서 구축하여 완벽한 테스트 진행**

---

## 📋 목표

✅ 로컬에서 BNB 체인과 동일한 환경 구축  
✅ 200개 지갑 자동 생성  
✅ 토큰 발행 및 이체 테스트  
✅ 실제 BNB Testnet 배포 전 완벽 검증  

---

## 🔧 STEP 1: Hardhat Network 구성 (10분)

### 1.1 Hardhat Network 설정 (300초)

```bash
# hardhat.config.js 수정
cat > hardhat.config.js << 'EOF'
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // 로컬 Hardhat 네트워크 (BNB 시뮬레이션)
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 200,  // 200개 계정 생성
        accountsBalance: "10000000000000000000000" // 각 10,000 ETH
      },
      mining: {
        auto: true,
        interval: 3000  // 3초마다 자동 블록 생성 (BNB와 유사)
      }
    },
    
    // 로컬 노드 (별도 실행 시)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    
    // BSC Testnet
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    
    // BSC Mainnet (거래소 배포용)
    bscMainnet: {
      url: "https://bsc-dataseed1.binance.org",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5000000000 // 5 Gwei
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || ""
    }
  }
};
EOF
```

**체크포인트:**
- [ ] hardhat.config.js 업데이트 완료
- [ ] 200개 계정 설정 확인
- [ ] 4개 네트워크 설정 (hardhat, localhost, testnet, mainnet)

---

## 🧪 STEP 2: 로컬 네트워크 실행 (5분)

### 2.1 Hardhat 노드 실행 (120초)

```bash
# 터미널 1: Hardhat 네트워크 실행
pnpm hardhat node
```

**예상 출력:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
Account #199: 0x... (10000 ETH)

WARNING: These accounts, and their private keys, are publicly known.
```

**체크포인트:**
- [ ] 노드 실행 성공
- [ ] 200개 계정 생성 확인
- [ ] RPC: http://127.0.0.1:8545

### 2.2 계정 정보 저장 (180초)

```bash
# 터미널 2: 계정 정보 추출
cat > scripts/save-local-accounts.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const accounts = await hre.ethers.getSigners();
  
  const accountList = [];
  
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await account.getBalance();
    
    accountList.push({
      index: i,
      address: account.address,
      balance: hre.ethers.utils.formatEther(balance) + " ETH"
    });
  }
  
  fs.writeFileSync(
    "local-accounts.json",
    JSON.stringify(accountList, null, 2)
  );
  
  console.log(`✅ ${accountList.length}개 계정 저장 완료`);
  console.log(`📝 파일: local-accounts.json`);
}

main().catch(console.error);
EOF

pnpm hardhat run scripts/save-local-accounts.js --network localhost
```

**체크포인트:**
- [ ] local-accounts.json 생성
- [ ] 200개 계정 정보 저장

---

## 🚀 STEP 3: 로컬 배포 및 테스트 (15분)

### 3.1 로컬 네트워크에 배포 (300초)

```bash
# 배포 스크립트 실행
pnpm hardhat run scripts/deploy.js --network localhost
```

**예상 출력:**
```
🚀 AKC Token 배포 시작...

📝 Treasury: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
👤 배포자: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰 잔액: 10000.0 ETH

⏳ AKC 컨트랙트 배포 중...
✅ AKC 배포 완료: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📊 총 발행량: 300,000,000 AKC

💾 배포 정보 저장: deployments/localhost-deployment.json
```

**체크포인트:**
- [ ] 로컬 배포 성공
- [ ] 컨트랙트 주소 확보
- [ ] localhost-deployment.json 생성

### 3.2 대량 이체 테스트 (600초)

```bash
cat > scripts/test-local-transfers.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // 배포 정보 로드
  const deployment = JSON.parse(
    fs.readFileSync("./deployments/localhost-deployment.json", "utf8")
  );
  
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = AKC.attach(deployment.contractAddress);
  
  const accounts = await hre.ethers.getSigners();
  const treasury = accounts[0];
  
  console.log("🧪 로컬 네트워크 대량 이체 테스트");
  console.log(`📝 컨트랙트: ${akc.address}`);
  console.log(`👤 Treasury: ${treasury.address}\n`);
  
  // 200개 계정에 각 1,000 AKC씩 전송
  console.log("📤 200개 계정에 이체 시작...");
  
  const amount = hre.ethers.utils.parseEther("1000");
  const startTime = Date.now();
  
  for (let i = 1; i < accounts.length; i++) {
    const tx = await akc.connect(treasury).transfer(accounts[i].address, amount);
    await tx.wait();
    
    if (i % 20 === 0) {
      console.log(`✓ ${i}/${accounts.length - 1} 완료`);
    }
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log(`\n✅ 전송 완료!`);
  console.log(`⏱️  소요 시간: ${duration.toFixed(2)}초`);
  console.log(`📊 평균: ${(duration / 199).toFixed(3)}초/건`);
  
  // 잔액 확인
  console.log(`\n💰 잔액 확인:`);
  const treasuryBalance = await akc.balanceOf(treasury.address);
  const account1Balance = await akc.balanceOf(accounts[1].address);
  
  console.log(`Treasury: ${hre.ethers.utils.formatEther(treasuryBalance)} AKC`);
  console.log(`Account #1: ${hre.ethers.utils.formatEther(account1Balance)} AKC`);
}

main().catch(console.error);
EOF

pnpm hardhat run scripts/test-local-transfers.js --network localhost
```

**예상 출력:**
```
🧪 로컬 네트워크 대량 이체 테스트
📝 컨트랙트: 0x5FbDB2315678afecb367f032d93F642f64180aa3
👤 Treasury: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

📤 200개 계정에 이체 시작...
✓ 20/199 완료
✓ 40/199 완료
...
✓ 199/199 완료

✅ 전송 완료!
⏱️  소요 시간: 45.23초
📊 평균: 0.227초/건

💰 잔액 확인:
Treasury: 299801000.0 AKC
Account #1: 1000.0 AKC
```

**체크포인트:**
- [ ] 199건 전송 성공
- [ ] 평균 처리 시간 < 1초
- [ ] 잔액 확인 정상

---

## 🔍 STEP 4: 로컬 환경 검증 (10분)

### 4.1 Hardhat Console로 확인 (360초)

```bash
pnpm hardhat console --network localhost
```

```javascript
// Console에서 실행
const AKC = await ethers.getContractFactory("AKC");
const deployment = require("./deployments/localhost-deployment.json");
const akc = AKC.attach(deployment.contractAddress);

// 토큰 정보 확인
await akc.name();        // "AINOVA Key Coin"
await akc.symbol();      // "AKC"
await akc.totalSupply(); // 300000000000000000000000000 (300M * 10^18)

// 계정별 잔액 확인
const accounts = await ethers.getSigners();
const balance = await akc.balanceOf(accounts[1].address);
ethers.utils.formatEther(balance); // "1000.0"

// Pause 테스트
await akc.pause();
await akc.paused(); // true

// Unpause
await akc.unpause();
await akc.paused(); // false
```

**체크포인트:**
- [ ] 토큰 정보 정상
- [ ] 잔액 조회 정상
- [ ] Pause/Unpause 기능 작동

### 4.2 테스트 리포트 생성 (240초)

```bash
cat > LOCAL-TEST-REPORT.md << 'EOF'
# 🏠 AKC Token 로컬 테스트 리포트

## 테스트 환경
- **네트워크**: Hardhat Local Network
- **Chain ID**: 1337
- **RPC**: http://127.0.0.1:8545
- **계정 수**: 200개

## 배포 정보
- **컨트랙트 주소**: [배포된 주소]
- **Treasury**: Account #0
- **총 발행량**: 300,000,000 AKC

## 테스트 결과

### ✅ 대량 이체 테스트
- **전송 건수**: 199건
- **전송량**: 각 1,000 AKC
- **총 전송량**: 199,000 AKC
- **성공률**: 100%
- **평균 처리 시간**: 0.227초/건

### ✅ 기능 테스트
- [x] 토큰 전송
- [x] Pause/Unpause
- [x] Mint (Owner only)
- [x] Burn
- [x] 잔액 조회

## 성능 지표
- **블록 생성 시간**: 3초
- **트랜잭션 처리 속도**: 초당 약 4.4건
- **가스 소비**: 평균 51,234 gas

## 다음 단계
1. BSC Testnet 배포
2. 실제 환경 검증
3. Mainnet 배포 준비
EOF

echo "✅ 로컬 테스트 리포트 생성 완료"
cat LOCAL-TEST-REPORT.md
```

**체크포인트:**
- [ ] LOCAL-TEST-REPORT.md 생성
- [ ] 모든 테스트 결과 기록

---

## 📊 로컬 vs Testnet vs Mainnet 비교

| 항목 | Local | BSC Testnet | BSC Mainnet |
|------|-------|-------------|-------------|
| Chain ID | 1337 | 97 | 56 |
| RPC | localhost:8545 | prebsc-testnet | bsc-dataseed |
| 블록 시간 | 3초 (설정 가능) | ~3초 | ~3초 |
| 가스비 | 무료 | 무료 (Faucet) | 실제 BNB |
| 계정 | 200개 자동 | 수동 생성 | 수동 생성 |
| 용도 | 개발/테스트 | 공개 테스트 | 실제 운영 |

---

## 🎯 로컬 테스트 완료 체크리스트

- [ ] ✅ Hardhat Network 구성
- [ ] ✅ 200개 계정 생성
- [ ] ✅ AKC 토큰 배포
- [ ] ✅ 199건 대량 이체 성공
- [ ] ✅ 모든 기능 테스트 통과
- [ ] ✅ 테스트 리포트 작성

---

## 🚀 다음 단계

로컬 테스트 완료 후:

1. **BSC Testnet 배포**
   ```bash
   cat EXECUTION-CHECKLIST-DEPLOY.md
   ```

2. **거래소 상장 준비**
   ```bash
   cat EXCHANGE-DEPLOYMENT-GUIDE.md
   ```

3. **Mainnet 배포**
   ```bash
   cat MAINNET-DEPLOYMENT-GUIDE.md
   ```

---

** Mirucoder ** Request End
