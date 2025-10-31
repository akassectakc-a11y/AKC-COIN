# 🚀 STEP 7: 배포 스크립트 작성 (10분)

## 7.1 배포 스크립트 생성 (360초)

```bash
cat > scripts/deploy.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 AKC Token 배포 시작...\n");
  
  // Treasury 주소 확인
  const treasuryAddress = process.env.TREASURY_ADDRESS;
  if (!treasuryAddress) {
    throw new Error("❌ TREASURY_ADDRESS not found in .env");
  }
  console.log(`📝 Treasury: ${treasuryAddress}`);
  
  // 배포자 정보
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 배포자: ${deployer.address}`);
  
  const balance = await deployer.getBalance();
  console.log(`💰 잔액: ${hre.ethers.utils.formatEther(balance)} BNB\n`);
  
  // 컨트랙트 배포
  console.log("⏳ AKC 컨트랙트 배포 중...");
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasuryAddress);
  await akc.deployed();
  
  console.log(`✅ AKC 배포 완료: ${akc.address}`);
  console.log(`📊 총 발행량: 300,000,000 AKC\n`);
  
  // 배포 정보 저장
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: akc.address,
    treasuryAddress: treasuryAddress,
    deployerAddress: deployer.address,
    blockNumber: akc.deployTransaction.blockNumber,
    transactionHash: akc.deployTransaction.hash,
    timestamp: new Date().toISOString(),
    gasUsed: (await akc.deployTransaction.wait()).gasUsed.toString()
  };
  
  // deployments 폴더 생성
  const deployDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }
  
  // 배포 정보 저장
  const filename = `${hre.network.name}-deployment.json`;
  fs.writeFileSync(
    path.join(deployDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`💾 배포 정보 저장: deployments/${filename}\n`);
  console.log("========================================");
  console.log("다음 단계: BscScan에서 컨트랙트 검증");
  console.log(`npx hardhat verify --network bscTestnet ${akc.address} ${treasuryAddress}`);
  console.log("========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
EOF
```

**체크포인트:**
- [ ] deploy.js 확인: `cat scripts/deploy.js`
- [ ] 라인 수: `wc -l scripts/deploy.js` (약 60줄)

## 7.2 검증 스크립트 생성 (180초)

```bash
cat > scripts/verify.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 배포 정보 로드
  const deployFile = path.join(__dirname, "../deployments/bscTestnet-deployment.json");
  
  if (!fs.existsSync(deployFile)) {
    console.error("❌ 배포 정보 파일을 찾을 수 없습니다.");
    console.log("먼저 배포를 진행하세요: pnpm hardhat run scripts/deploy.js --network bscTestnet");
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deployFile, "utf8"));
  
  console.log("🔍 컨트랙트 검증 시작...");
  console.log(`📝 컨트랙트: ${deployment.contractAddress}`);
  console.log(`📝 Treasury: ${deployment.treasuryAddress}\n`);
  
  try {
    await hre.run("verify:verify", {
      address: deployment.contractAddress,
      constructorArguments: [deployment.treasuryAddress],
    });
    
    console.log("\n✅ 검증 완료!");
    console.log(`🔗 BscScan: https://testnet.bscscan.com/address/${deployment.contractAddress}`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ 이미 검증된 컨트랙트입니다.");
    } else {
      console.error("❌ 검증 실패:", error.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
EOF
```

**체크포인트:**
- [ ] verify.js 확인: `cat scripts/verify.js`

---

# 🌐 STEP 8: BNB 테스트넷 배포 (20분)

## 8.1 .env 파일 설정 (300초)

```bash
# .env 파일 생성
cat > .env << 'EOF'
# 배포자 개인키 (MetaMask에서 Export)
PRIVATE_KEY=your_private_key_here

# Treasury 주소 (토큰을 받을 지갑)
TREASURY_ADDRESS=your_treasury_address_here

# BscScan API Key (https://bscscan.com/apis)
BSCSCAN_API_KEY=your_bscscan_api_key_here
EOF

echo "⚠️  .env 파일을 수정하세요!"
echo "1. MetaMask에서 개인키 복사"
echo "2. Treasury 주소 입력"
echo "3. BscScan API Key 발급 후 입력"
```

**체크포인트:**
- [ ] .env 파일 생성 확인: `ls .env`
- [ ] PRIVATE_KEY 입력 완료
- [ ] TREASURY_ADDRESS 입력 완료
- [ ] BSCSCAN_API_KEY 입력 완료

## 8.2 BNB Testnet Faucet에서 BNB 받기 (180초)

```bash
echo "💰 BNB Testnet Faucet에서 BNB를 받으세요:"
echo "https://testnet.binance.org/faucet-smart"
echo ""
echo "지갑 주소를 입력하고 BNB를 받으세요 (0.5 BNB)"
```

**체크포인트:**
- [ ] Faucet 접속
- [ ] 지갑 주소 입력
- [ ] BNB 수령 (0.5 BNB)
- [ ] MetaMask에서 잔액 확인

## 8.3 네트워크 연결 테스트 (60초)

```bash
cat > scripts/test-connection.js << 'EOF'
require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("🔗 네트워크 연결 테스트");
  console.log(`📍 지갑 주소: ${wallet.address}`);
  
  const balance = await wallet.getBalance();
  console.log(`💰 잔액: ${ethers.utils.formatEther(balance)} BNB`);
  
  const network = await provider.getNetwork();
  console.log(`🌐 네트워크: ${network.name} (Chain ID: ${network.chainId})`);
  
  if (balance.eq(0)) {
    console.log("\n⚠️  잔액이 0입니다. Faucet에서 BNB를 받으세요!");
  } else {
    console.log("\n✅ 배포 준비 완료!");
  }
}

main();
EOF

node scripts/test-connection.js
```

**체크포인트:**
- [ ] 지갑 주소 표시
- [ ] BNB 잔액 > 0
- [ ] Chain ID: 97 (BSC Testnet)

## 8.4 실제 배포 실행 (300초)

```bash
echo "🚀 배포를 시작합니다..."
pnpm hardhat run scripts/deploy.js --network bscTestnet
```

**예상 출력:**
```
🚀 AKC Token 배포 시작...

📝 Treasury: 0x1234567890123456789012345678901234567890
👤 배포자: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
💰 잔액: 0.5 BNB

⏳ AKC 컨트랙트 배포 중...
✅ AKC 배포 완료: 0x9876543210987654321098765432109876543210
📊 총 발행량: 300,000,000 AKC

💾 배포 정보 저장: deployments/bscTestnet-deployment.json

========================================
다음 단계: BscScan에서 컨트랙트 검증
npx hardhat verify --network bscTestnet 0x987... 0x123...
========================================
```

**체크포인트:**
- [ ] 배포 성공 메시지 확인
- [ ] 컨트랙트 주소 복사
- [ ] deployments/bscTestnet-deployment.json 생성 확인
- [ ] BscScan에서 트랜잭션 확인

## 8.5 BscScan에서 확인 (120초)

```bash
# 배포 정보 확인
cat deployments/bscTestnet-deployment.json

# BscScan 링크 생성
CONTRACT_ADDRESS=$(cat deployments/bscTestnet-deployment.json | grep contractAddress | cut -d'"' -f4)
echo "🔗 BscScan 링크:"
echo "https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}"
```

**체크포인트:**
- [ ] BscScan에서 컨트랙트 확인
- [ ] Transaction 확인
- [ ] Contract 탭에 바이트코드 표시

---

# ✅ STEP 9: 컨트랙트 검증 (10분)

## 9.1 BscScan API Key 발급 (180초)

```bash
echo "🔑 BscScan API Key 발급:"
echo "1. https://bscscan.com/register 회원가입"
echo "2. https://bscscan.com/myapikey API Key 발급"
echo "3. .env 파일에 BSCSCAN_API_KEY 입력"
```

**체크포인트:**
- [ ] BscScan 회원가입 완료
- [ ] API Key 발급 완료
- [ ] .env 파일 업데이트

## 9.2 컨트랙트 검증 실행 (180초)

```bash
pnpm hardhat run scripts/verify.js --network bscTestnet
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
https://testnet.bscscan.com/address/0x987...#code

✅ 검증 완료!
🔗 BscScan: https://testnet.bscscan.com/address/0x987...
```

**체크포인트:**
- [ ] 검증 성공 메시지 확인
- [ ] BscScan에서 Contract 탭에 소스코드 표시
- [ ] Read Contract, Write Contract 기능 활성화

---

**현재까지 누적 시간: 약 88분**

다음 체크리스트: **EXECUTION-CHECKLIST-LOGO.md** (로고 업로드 및 최종 검증)
