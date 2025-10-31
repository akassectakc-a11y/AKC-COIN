# ⚡ Phase 3: 배포 스크립트 (2,400초 = 40분)

> **밀리세컨드 단위 실행 가이드 - 배포 및 검증**

---

## ⏱️ Task 3.1: 배포 스크립트 작성 (600초)

```bash
# 시작: 00:48:00.000
cat > scripts/deploy.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 AKC Token 배포 시작...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log(`📡 Network: ${network}`);
  console.log(`👤 Deployer: ${deployer.address}`);
  
  const balance = await deployer.getBalance();
  console.log(`💰 Balance: ${hre.ethers.utils.formatEther(balance)} BNB\n`);
  
  // Treasury 주소 가져오기
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log(`🏦 Treasury: ${treasuryAddress}\n`);
  
  // 컨트랙트 배포
  console.log("⏳ AKC 컨트랙트 배포 중...");
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasuryAddress);
  await akc.deployed();
  
  console.log(`✅ AKC 배포 완료: ${akc.address}\n`);
  
  // 배포 정보 저장
  const deploymentInfo = {
    network: network,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    treasury: treasuryAddress,
    contract: akc.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    totalSupply: "300000000"
  };
  
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const filename = `${network}-${Date.now()}.json`;
  const filepath = path.join(deploymentDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`📄 배포 정보 저장: ${filename}\n`);
  
  // 컨트랙트 정보 출력
  console.log("=" .repeat(60));
  console.log("📋 배포 요약");
  console.log("=".repeat(60));
  console.log(`Network:      ${network}`);
  console.log(`Contract:     ${akc.address}`);
  console.log(`Deployer:     ${deployer.address}`);
  console.log(`Treasury:     ${treasuryAddress}`);
  console.log(`Total Supply: 300,000,000 AKC`);
  console.log(`Decimals:     18`);
  console.log(`Block:        ${deploymentInfo.blockNumber}`);
  console.log("=".repeat(60));
  
  if (network !== "hardhat" && network !== "localhost") {
    console.log("\n⚠️  BscScan 검증을 위해 다음 명령어를 실행하세요:");
    console.log(`pnpm hardhat verify --network ${network} ${akc.address} ${treasuryAddress}`);
  }
  
  return akc.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
EOF
# 종료: 00:58:00.000
```

- [ ] ✅ 완료 (00:58:00.000 / 3,480초)
- [ ] ✅ 라인 수: `wc -l scripts/deploy.js`

---

## ⏱️ Task 3.2: 검증 스크립트 작성 (300초)

```bash
# 시작: 00:58:00.000
cat > scripts/verify.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 BscScan 검증 시작...\n");
  
  const network = hre.network.name;
  const deploymentDir = path.join(__dirname, "../deployments");
  
  // 최신 배포 파일 찾기
  const files = fs.readdirSync(deploymentDir)
    .filter(f => f.startsWith(network) && f.endsWith('.json'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error(`❌ ${network} 배포 정보를 찾을 수 없습니다.`);
    process.exit(1);
  }
  
  const deploymentFile = path.join(deploymentDir, files[0]);
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  
  console.log(`📄 배포 정보: ${files[0]}`);
  console.log(`📡 Network: ${deployment.network}`);
  console.log(`📝 Contract: ${deployment.contract}`);
  console.log(`🏦 Treasury: ${deployment.treasury}\n`);
  
  console.log("⏳ 검증 중... (최대 2분 소요)\n");
  
  try {
    await hre.run("verify:verify", {
      address: deployment.contract,
      constructorArguments: [deployment.treasury],
    });
    
    console.log("\n✅ 검증 완료!");
    console.log(`🔗 BscScan: https://bscscan.com/address/${deployment.contract}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ 이미 검증된 컨트랙트입니다.");
    } else {
      console.error("\n❌ 검증 실패:", error.message);
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
EOF
# 종료: 01:03:00.000
```

- [ ] ✅ 완료 (01:03:00.000 / 3,780초)
- [ ] ✅ 검증 스크립트 생성

---

## ⏱️ Task 3.3: 로컬 배포 테스트 (300초)

```bash
# 시작: 01:03:00.000

# Terminal 1: 로컬 노드 시작
pnpm hardhat node

# Terminal 2: 배포 실행
pnpm hardhat run scripts/deploy.js --network localhost

# 종료: 01:08:00.000
```

**예상 출력:**
```
🚀 AKC Token 배포 시작...

📡 Network: localhost
👤 Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰 Balance: 10000.0 BNB

🏦 Treasury: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

⏳ AKC 컨트랙트 배포 중...
✅ AKC 배포 완료: 0x5FbDB2315678afecb367f032d93F642f64180aa3

📄 배포 정보 저장: localhost-1730369280000.json

============================================================
📋 배포 요약
============================================================
Network:      localhost
Contract:     0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployer:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Treasury:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Total Supply: 300,000,000 AKC
Decimals:     18
Block:        1
============================================================
```

- [ ] ✅ 완료 (01:08:00.000 / 4,080초)
- [ ] ✅ 배포 성공 확인
- [ ] ✅ deployments/ 폴더 확인

---

## ⏱️ Task 3.4: 대량 전송 테스트 스크립트 (600초)

```bash
# 시작: 01:08:00.000
cat > scripts/mass-transfer.js << 'EOF'
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("💸 대량 전송 테스트 시작...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  // 배포된 컨트랙트 주소 가져오기
  const deploymentDir = "./deployments";
  const files = fs.readdirSync(deploymentDir)
    .filter(f => f.startsWith(network) && f.endsWith('.json'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error("❌ 배포 정보를 찾을 수 없습니다.");
    process.exit(1);
  }
  
  const deployment = JSON.parse(
    fs.readFileSync(`${deploymentDir}/${files[0]}`, 'utf8')
  );
  
  console.log(`📝 Contract: ${deployment.contract}\n`);
  
  const AKC = await hre.ethers.getContractFactory("AKC");
  const akc = AKC.attach(deployment.contract);
  
  // 200개 계정 생성
  const accounts = await hre.ethers.getSigners();
  const recipients = accounts.slice(1, 201); // 첫 번째는 deployer
  
  console.log(`👥 Recipients: ${recipients.length}명\n`);
  
  const amount = hre.ethers.utils.parseEther("1000"); // 각 1,000 AKC
  const batchSize = 50;
  let totalSent = 0;
  
  console.log("⏳ 전송 시작...");
  const startTime = Date.now();
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, Math.min(i + batchSize, recipients.length));
    
    console.log(`📦 Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(recipients.length/batchSize)}: ${batch.length}명 전송 중...`);
    
    const txs = await Promise.all(
      batch.map(recipient => akc.transfer(recipient.address, amount))
    );
    
    await Promise.all(txs.map(tx => tx.wait()));
    
    totalSent += batch.length;
    console.log(`   ✅ ${totalSent}/${recipients.length} 완료`);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 전송 완료 요약");
  console.log("=".repeat(60));
  console.log(`총 수신자:    ${recipients.length}명`);
  console.log(`각 전송량:    1,000 AKC`);
  console.log(`총 전송량:    ${totalSent * 1000} AKC`);
  console.log(`소요 시간:    ${duration}초`);
  console.log(`초당 전송:    ${(recipients.length / duration * 60).toFixed(2)}명/분`);
  console.log("=".repeat(60));
  
  // 랜덤 계정 10개 검증
  console.log("\n🔍 랜덤 검증 (10개 계정):");
  for (let i = 0; i < 10; i++) {
    const randomIdx = Math.floor(Math.random() * recipients.length);
    const recipient = recipients[randomIdx];
    const balance = await akc.balanceOf(recipient.address);
    const formatted = hre.ethers.utils.formatEther(balance);
    console.log(`  ${recipient.address.slice(0, 10)}... → ${formatted} AKC`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
EOF
# 종료: 01:18:00.000
```

- [ ] ✅ 완료 (01:18:00.000 / 4,680초)
- [ ] ✅ 대량 전송 스크립트 생성

---

## ⏱️ Task 3.5: 대량 전송 실행 (600초)

```bash
# 시작: 01:18:00.000
pnpm hardhat run scripts/mass-transfer.js --network localhost
# 종료: 01:28:00.000
```

**예상 출력:**
```
💸 대량 전송 테스트 시작...

📝 Contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3

👥 Recipients: 200명

⏳ 전송 시작...
📦 Batch 1/4: 50명 전송 중...
   ✅ 50/200 완료
📦 Batch 2/4: 50명 전송 중...
   ✅ 100/200 완료
📦 Batch 3/4: 50명 전송 중...
   ✅ 150/200 완료
📦 Batch 4/4: 50명 전송 중...
   ✅ 200/200 완료

============================================================
📊 전송 완료 요약
============================================================
총 수신자:    200명
각 전송량:    1,000 AKC
총 전송량:    200000 AKC
소요 시간:    45.23초
초당 전송:    265.36명/분
============================================================

🔍 랜덤 검증 (10개 계정):
  0x70997970... → 1000.0 AKC
  0x3C44CdDD... → 1000.0 AKC
  ...
```

- [ ] ✅ 완료 (01:28:00.000 / 5,280초)
- [ ] ✅ 200명 전송 성공
- [ ] ✅ 모든 계정 1,000 AKC 보유 확인

---

## ⏱️ Task 3.6: Git 커밋 (60초)

```bash
# 시작: 01:28:00.000
git add scripts/ deployments/
git commit -m "feat: Add deployment and mass transfer scripts

- Add deploy.js for contract deployment
- Add verify.js for BscScan verification
- Add mass-transfer.js for bulk distribution
- Successfully tested with 200 accounts"
# 종료: 01:29:00.000
```

- [ ] ✅ 완료 (01:29:00.000 / 5,340초)

---

## ✅ Phase 3 완료 (01:29:00.000)

**타임스탬프: 5,340초 (89분)**

### 완료 체크리스트
- [ ] ✅ deploy.js 작성
- [ ] ✅ verify.js 작성
- [ ] ✅ mass-transfer.js 작성
- [ ] ✅ 로컬 배포 성공
- [ ] ✅ 대량 전송 테스트 (200명)
- [ ] ✅ Git 커밋 완료

### 생성된 파일
```bash
scripts/
├── deploy.js
├── verify.js
└── mass-transfer.js

deployments/
└── localhost-1730369280000.json
```

**다음: Phase 4 문서화 및 최종 검증**
