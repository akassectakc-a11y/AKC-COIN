# ⚡ AKC Token 긴급 배포 가이드 (2-3일 완성)

**상황**: LBank 신청 완료, 실제 컨트랙트 주소 필요  
**목표**: 최대한 빠르게 BSC Mainnet 배포 완료  
**시간**: 2-3일

---

## 🚨 현재 상황

```
✅ LBank 신청 완료 (2025-10-31)
   - 신청자: AKC Team
   - 이메일: akassectakc@gmail.com
   - 프로젝트: AK-Asset Coin (AKC)

❌ 아직 없는 것:
   - 실제 스마트 컨트랙트 주소
   - BSC Mainnet 배포
   - BscScan 검증

⏰ 시급한 작업:
   1. 스마트 컨트랙트 작성 (4시간)
   2. 테스트 (2시간)
   3. BSC Testnet 배포 (1시간)
   4. BSC Mainnet 배포 (1시간)
   5. BscScan 검증 (30분)
   6. LBank 업데이트 (30분)
```

---

## 📅 긴급 3일 계획

### Day 1 (오늘): 개발 & 테스트 (8시간)
```
09:00 - 10:00  개발 환경 설정
10:00 - 14:00  스마트 컨트랙트 작성
14:00 - 16:00  테스트 작성 및 실행
16:00 - 17:00  로컬 테스트
17:00 - 18:00  Git 커밋 및 정리
```

### Day 2: BSC Testnet 배포 (4시간)
```
09:00 - 10:00  Testnet BNB 확보
10:00 - 11:00  Testnet 배포
11:00 - 12:00  BscScan Testnet 검증
12:00 - 13:00  기능 테스트
```

### Day 3: BSC Mainnet 배포 (4시간)
```
09:00 - 10:00  최종 검토
10:00 - 11:00  Mainnet 배포
11:00 - 12:00  BscScan Mainnet 검증
12:00 - 13:00  LBank 업데이트
```

---

## ⚡ Day 1: 개발 & 테스트 (오늘 시작!)

### Task 1.1: 개발 환경 설정 (1시간)

```bash
# 프로젝트 디렉터리 생성
cd ~/project
mkdir akc-token-production && cd akc-token-production

# Git 초기화
git init
git config user.name "AKC Team"
git config user.email "akassectakc@gmail.com"

# package.json 생성
cat > package.json << 'EOF'
{
  "name": "akc-token",
  "version": "1.0.0",
  "description": "AKASSECT (AKC) - BEP-20 Token",
  "scripts": {
    "test": "hardhat test",
    "compile": "hardhat compile"
  },
  "keywords": ["BEP-20", "BSC", "Token"],
  "author": "AKC Team",
  "license": "MIT"
}
EOF

# 의존성 설치 (5분)
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts@4.9.3 dotenv

# Hardhat 초기화
npx hardhat init
# 선택: Create a JavaScript project

# 디렉터리 생성
mkdir -p contracts scripts test
```

### Task 1.2: 스마트 컨트랙트 작성 (4시간)

```bash
# contracts/AKC.sol 생성
cat > contracts/AKC.sol << 'SOLIDITY'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AKC - AKASSECT Token
 * @dev BEP-20 Token on Binance Smart Chain
 * @notice Utility token for INFINIBIT ecosystem
 */
contract AKC is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 300_000_000 * 10**18;
    
    event TokensPaused(address indexed by, uint256 timestamp);
    event TokensUnpaused(address indexed by, uint256 timestamp);
    
    /**
     * @dev Constructor mints entire supply to treasury
     * @param treasury Address to receive initial supply
     */
    constructor(address treasury) ERC20("AKASSECT", "AKC") {
        require(treasury != address(0), "AKC: zero address");
        _mint(treasury, TOTAL_SUPPLY);
    }
    
    /**
     * @dev Pause all transfers (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
        emit TokensPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Unpause all transfers
     */
    function unpause() external onlyOwner {
        _unpause();
        emit TokensUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Hook called before any transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "AKC: paused");
    }
    
    /**
     * @dev Returns decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
SOLIDITY
```

### Task 1.3: Hardhat 설정 (30분)

```bash
# hardhat.config.js
cat > hardhat.config.js << 'JAVASCRIPT'
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    bscMainnet: {
      url: "https://bsc-dataseed1.binance.org",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY || ""
  }
};
JAVASCRIPT

# .env.example
cat > .env.example << 'ENV'
PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=your_treasury_address_here
BSCSCAN_API_KEY=your_bscscan_api_key_here
ENV

# .gitignore
cat > .gitignore << 'IGNORE'
node_modules/
.env
cache/
artifacts/
IGNORE
```

### Task 1.4: 테스트 작성 (1시간)

```bash
# test/AKC.test.js
cat > test/AKC.test.js << 'TEST'
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AKC Token", function () {
  let akc, owner, treasury, addr1;
  const TOTAL_SUPPLY = ethers.parseEther("300000000");

  beforeEach(async function () {
    [owner, treasury, addr1] = await ethers.getSigners();
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
  });

  it("Should have correct name and symbol", async function () {
    expect(await akc.name()).to.equal("AKASSECT");
    expect(await akc.symbol()).to.equal("AKC");
    expect(await akc.decimals()).to.equal(18);
  });

  it("Should mint total supply to treasury", async function () {
    expect(await akc.balanceOf(treasury.address)).to.equal(TOTAL_SUPPLY);
    expect(await akc.totalSupply()).to.equal(TOTAL_SUPPLY);
  });

  it("Should transfer tokens", async function () {
    await akc.connect(treasury).transfer(addr1.address, ethers.parseEther("1000"));
    expect(await akc.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
  });

  it("Should burn tokens", async function () {
    await akc.connect(treasury).burn(ethers.parseEther("1000"));
    expect(await akc.totalSupply()).to.equal(TOTAL_SUPPLY - ethers.parseEther("1000"));
  });

  it("Should pause and unpause", async function () {
    await akc.pause();
    expect(await akc.paused()).to.be.true;
    
    await expect(
      akc.connect(treasury).transfer(addr1.address, 100)
    ).to.be.revertedWith("AKC: paused");
    
    await akc.unpause();
    expect(await akc.paused()).to.be.false;
  });
});
TEST
```

### Task 1.5: 컴파일 및 테스트 (30분)

```bash
# 컴파일
npx hardhat compile

# 테스트 실행
npx hardhat test

# 예상 출력:
#   AKC Token
#     ✓ Should have correct name and symbol
#     ✓ Should mint total supply to treasury
#     ✓ Should transfer tokens
#     ✓ Should burn tokens
#     ✓ Should pause and unpause
#   5 passing

# Git 커밋
git add .
git commit -m "feat: Add AKC token contract and tests"
```

---

## ⚡ Day 2: BSC Testnet 배포

### Task 2.1: 배포 스크립트 (30분)

```bash
# scripts/deploy.js
cat > scripts/deploy.js << 'DEPLOY'
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("Treasury:", treasury);
  
  const AKC = await ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasury);
  await akc.waitForDeployment();
  
  const address = await akc.getAddress();
  console.log("✅ AKC deployed to:", address);
  console.log("📝 Save this address!");
  
  console.log("\n🔗 Next steps:");
  console.log("1. Verify on BscScan");
  console.log("2. Update LBank application");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
DEPLOY
```

### Task 2.2: Testnet BNB 확보 (30분)

```
1. BSC Testnet Faucet 방문:
   https://testnet.bnbchain.org/faucet-smart

2. 지갑 주소 입력

3. 0.5 BNB 받기 (충분함)

4. MetaMask에서 확인
```

### Task 2.3: Testnet 배포 (30분)

```bash
# .env 파일 생성 및 입력
cp .env.example .env
# 에디터로 .env 열어서 실제 값 입력

# Testnet 배포
npx hardhat run scripts/deploy.js --network bscTestnet

# 출력 예시:
# Deploying with: 0x...
# Treasury: 0x...
# ✅ AKC deployed to: 0xABC123...
# 📝 Save this address!

# ⚠️ 중요: 이 주소를 기록하세요!
```

### Task 2.4: BscScan Testnet 검증 (30분)

```bash
# scripts/verify.js
cat > scripts/verify.js << 'VERIFY'
const { run } = require("hardhat");

async function main() {
  const contractAddress = "0x___"; // Testnet 주소 입력
  const treasuryAddress = process.env.TREASURY_ADDRESS;

  console.log("Verifying contract...");
  
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [treasuryAddress]
    });
    console.log("✅ Verified!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
VERIFY

# BscScan API Key 발급:
# 1. https://bscscan.com/register
# 2. API Keys 메뉴
# 3. Add 버튼
# 4. .env에 추가

# 검증 실행
npx hardhat run scripts/verify.js --network bscTestnet
```

---

## ⚡ Day 3: BSC Mainnet 배포

### Task 3.1: 최종 준비 (1시간)

```
체크리스트:
□ 모든 테스트 통과
□ Testnet 배포 성공 확인
□ Testnet 검증 완료
□ Treasury 주소 재확인
□ Mainnet BNB 확보 (0.1 BNB)
□ 백업 생성
```

### Task 3.2: Mainnet 배포 (1시간)

```bash
# Mainnet 배포
npx hardhat run scripts/deploy.js --network bscMainnet

# 출력:
# Deploying with: 0x...
# Treasury: 0x...
# ✅ AKC deployed to: 0xREAL_ADDRESS_HERE
# 📝 Save this address!

# ⚠️ 매우 중요: 즉시 기록!
MAINNET_CONTRACT: 0x___________________
TX_HASH: 0x___________________
DEPLOYER: 0x___________________
TREASURY: 0x___________________
BLOCK: _______
```

### Task 3.3: Mainnet 검증 (30분)

```bash
# verify.js의 주소를 Mainnet 주소로 변경
# contractAddress = "0xREAL_ADDRESS_HERE"

# 검증 실행
npx hardhat run scripts/verify.js --network bscMainnet

# 확인:
# https://bscscan.com/address/0xREAL_ADDRESS_HERE
```

### Task 3.4: LBank 업데이트 (30분)

```
1. LBank 포털 로그인
   https://www.lbank.com

2. Application 페이지 접속

3. 업데이트 항목:
   □ Contract Address: 0xREAL_ADDRESS_HERE
   □ Block Explorer: https://bscscan.com/token/0xREAL_ADDRESS_HERE
   □ Status: Deployed ✅
   
4. Save 또는 Update 클릭

5. 이메일로 업데이트 알림
   To: listing@lbank.info
   Subject: AKC Token - Contract Deployed
   Body:
   "Dear LBank Team,
   
   We have successfully deployed AKC token on BSC Mainnet.
   
   Contract Address: 0xREAL_ADDRESS_HERE
   BscScan: https://bscscan.com/token/0xREAL_ADDRESS_HERE
   Verified: Yes
   
   Please update our application.
   
   Best regards,
   AKC Team"
```

---

## 📋 긴급 체크리스트

### Day 1 완료 확인
- [ ] 개발 환경 설정
- [ ] AKC.sol 작성
- [ ] 테스트 코드 작성
- [ ] 모든 테스트 통과
- [ ] Git 커밋

### Day 2 완료 확인
- [ ] Testnet BNB 확보
- [ ] Testnet 배포 성공
- [ ] Testnet 주소 기록
- [ ] BscScan Testnet 검증

### Day 3 완료 확인
- [ ] Mainnet BNB 확보
- [ ] Mainnet 배포 성공
- [ ] Mainnet 주소 기록
- [ ] BscScan Mainnet 검증
- [ ] LBank 업데이트 완료

---

## 🚨 트러블슈팅

### 컴파일 오류
```bash
# OpenZeppelin 버전 확인
npm list @openzeppelin/contracts

# 재설치
rm -rf node_modules package-lock.json
npm install
```

### 배포 오류
```bash
# Gas price 확인
# hardhat.config.js에 추가:
bscMainnet: {
  ...
  gasPrice: 3000000000  // 3 gwei
}
```

### 검증 오류
```bash
# Constructor arguments 확인
# Treasury 주소가 정확한지 확인
```

---

## 💡 완료 후 해야 할 일

### 즉시 (Day 3 완료 후)
1. ✅ LBank 업데이트 이메일 발송
2. ✅ 모든 문서에 실제 주소 업데이트
3. ✅ GitHub README 업데이트

### 이번 주 (Week 1)
1. 📊 CoinGecko 신청
2. 📊 CoinMarketCap 신청
3. 🎨 로고 준비
4. 💬 소셜 미디어 시작

### 다음 주 (Week 2)
1. 🥞 PancakeSwap 유동성 풀
2. 📱 Trust Wallet 신청
3. 📢 마케팅 시작

---

## 🎯 최종 목표

```
✅ Day 1: 스마트 컨트랙트 개발 완료
✅ Day 2: Testnet 배포 및 검증
✅ Day 3: Mainnet 배포 및 LBank 업데이트

결과:
├── 실제 컨트랙트 주소: 0x...
├── BscScan 검증: ✅
├── LBank 업데이트: ✅
└── 다음 단계 준비: ✅
```

---

**지금 바로 시작하세요!** ⚡

Day 1을 오늘 완료하면 3일 후 모든 것이 준비됩니다!

**문서 버전**: 1.0 (긴급)  
**최종 업데이트**: 2025-10-31  
**작성자**: AKC Team
