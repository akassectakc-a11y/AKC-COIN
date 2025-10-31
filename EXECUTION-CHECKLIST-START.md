# 🚀 AKC Token 실행 체크리스트 - 초나노 단위

> **실제 실행 가능한 명령어 기반 체크리스트**
> **BNB 테스트넷 배포 + 로고 포함**

---

## 📋 시작 전 준비사항

### 필수 설치
```bash
# Node.js 18.20.4 확인
node --version

# pnpm 설치
npm install -g pnpm

# Git 확인
git --version

# Docker 확인
docker --version
```

---

## 🏗️ STEP 1: 프로젝트 초기화 (5분)

### 1.1 프로젝트 생성 (60초)
```bash
mkdir -p ~/akc-token-project
cd ~/akc-token-project
git init
echo "# AKC Token Project" > README.md
```

**체크포인트:**
- [ ] 디렉터리 생성 확인: `pwd`
- [ ] Git 초기화 확인: `ls -la .git`

### 1.2 기본 디렉터리 구조 (120초)
```bash
mkdir -p contracts scripts test assets docs
mkdir -p .github/workflows
touch contracts/.gitkeep scripts/.gitkeep test/.gitkeep
```

**체크포인트:**
- [ ] 디렉터리 확인: `tree -L 2`

### 1.3 .gitignore 생성 (60초)
```bash
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
coverage/
cache/
artifacts/
typechain-types/
deployments/*/
*.log
.DS_Store
EOF
```

**체크포인트:**
- [ ] .gitignore 파일 확인: `cat .gitignore`

### 1.4 package.json 생성 (120초)
```bash
cat > package.json << 'EOF'
{
  "name": "akc-token",
  "version": "1.0.0",
  "description": "AKASSECT (AKC) BEP-20 Token",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:testnet": "hardhat run scripts/deploy.js --network bscTestnet",
    "verify": "hardhat verify --network bscTestnet"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^2.0.0",
    "@nomiclabs/hardhat-ethers": "^2.2.3",
    "@nomiclabs/hardhat-etherscan": "^3.1.7",
    "@openzeppelin/contracts": "^4.9.3",
    "hardhat": "^2.17.0",
    "ethers": "^5.7.2",
    "chai": "^4.3.7",
    "dotenv": "^16.3.1"
  }
}
EOF
```

**체크포인트:**
- [ ] package.json 확인: `cat package.json`

---

## 🔧 STEP 2: 의존성 설치 (3분)

### 2.1 pnpm install (180초)
```bash
pnpm install
```

**체크포인트:**
- [ ] node_modules 생성 확인: `ls node_modules`
- [ ] pnpm-lock.yaml 생성 확인: `ls pnpm-lock.yaml`

---

## 📝 STEP 3: 스마트 컨트랙트 작성 (10분)

### 3.1 AKC.sol 작성 (600초)
```bash
cat > contracts/AKC.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AKC is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 300_000_000 * 10**18;
    
    event Minted(address indexed to, uint256 amount);
    event TokensPaused(address indexed by);
    event TokensUnpaused(address indexed by);
    
    constructor(address treasury) ERC20("AKASSECT", "AKC") {
        require(treasury != address(0), "AKC: treasury is zero address");
        _mint(treasury, TOTAL_SUPPLY);
        emit Minted(treasury, TOTAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "AKC: mint to zero address");
        require(amount > 0, "AKC: mint amount must be positive");
        _mint(to, amount);
        emit Minted(to, amount);
    }
    
    function pause() external onlyOwner {
        _pause();
        emit TokensPaused(msg.sender);
    }
    
    function unpause() external onlyOwner {
        _unpause();
        emit TokensUnpaused(msg.sender);
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "AKC: token transfer while paused");
    }
    
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
EOF
```

**체크포인트:**
- [ ] AKC.sol 파일 확인: `cat contracts/AKC.sol`
- [ ] 라인 수 확인: `wc -l contracts/AKC.sol` (약 50줄)

---

## ⚙️ STEP 4: Hardhat 설정 (5분)

### 4.1 hardhat.config.js 작성 (300초)
```bash
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
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || ""
    }
  }
};
EOF
```

**체크포인트:**
- [ ] hardhat.config.js 확인: `cat hardhat.config.js`

### 4.2 .env.example 작성 (60초)
```bash
cat > .env.example << 'EOF'
PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=your_treasury_address_here
BSCSCAN_API_KEY=your_bscscan_api_key_here
EOF
```

**체크포인트:**
- [ ] .env.example 확인: `cat .env.example`

---

## 다음 체크리스트

계속해서 다음 단계를 진행하세요:
- STEP 5: 테스트 코드 작성
- STEP 6: 로고 생성
- STEP 7: 배포 스크립트
- STEP 8: BNB 테스트넷 배포
- STEP 9: 로고 업로드 및 검증

**현재까지 소요 시간: 약 23분**
