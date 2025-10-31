# ⚡ Phase 1: 프로젝트 초기화 (1,380초 = 23분)

> **밀리세컨드 단위 실행 가이드**

---

## ⏱️ Task 1.1: 디렉터리 생성 (60초)

### Step 1.1.1: 프로젝트 루트 생성 (15,000ms)
```bash
# 시작: 00:00:00.000
mkdir -p ~/akc-token-project && cd ~/akc-token-project
# 종료: 00:00:15.000
```
- [ ] ✅ 완료 (15초)
- [ ] ✅ 경로 확인: `pwd`

### Step 1.1.2: Git 초기화 (15,000ms)
```bash
# 시작: 00:00:15.000
git init
git config user.name "AINOVA"
git config user.email "dev@ainova.io"
# 종료: 00:00:30.000
```
- [ ] ✅ 완료 (30초)
- [ ] ✅ .git 확인: `ls -la`

### Step 1.1.3: 디렉터리 구조 (30,000ms)
```bash
# 시작: 00:00:30.000
mkdir -p contracts scripts test deployments assets/logo docs backups
# 종료: 00:01:00.000
```
- [ ] ✅ 완료 (60초)
- [ ] ✅ 구조 확인: `tree -L 1`

---

## ⏱️ Task 1.2: package.json (120초)

### Step 1.2.1: pnpm 초기화 (30,000ms)
```bash
# 시작: 00:01:00.000
pnpm init
# 종료: 00:01:30.000
```
- [ ] ✅ 완료 (90초)

### Step 1.2.2: package.json 수정 (90,000ms)
```bash
# 시작: 00:01:30.000
cat > package.json << 'EOF'
{
  "name": "akc-token",
  "version": "1.0.0",
  "description": "AINOVA Key Coin - BEP-20",
  "scripts": {
    "test": "hardhat test",
    "compile": "hardhat compile",
    "deploy:testnet": "hardhat run scripts/deploy.js --network bscTestnet"
  },
  "keywords": ["BEP-20", "BSC"],
  "license": "MIT"
}
EOF
# 종료: 00:03:00.000
```
- [ ] ✅ 완료 (180초)

---

## ⏱️ Task 1.3: 의존성 설치 (180초)

```bash
# 시작: 00:03:00.000
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan
pnpm add @openzeppelin/contracts
pnpm add -D dotenv
# 종료: 00:06:00.000
```
- [ ] ✅ 완료 (360초)
- [ ] ✅ node_modules 확인

---

## ⏱️ Task 1.4: 스마트 컨트랙트 (600초)

```bash
# 시작: 00:06:00.000
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
    
    constructor(address treasury) ERC20("AINOVA Key Coin", "AKC") {
        require(treasury != address(0), "Invalid treasury");
        _mint(treasury, TOTAL_SUPPLY);
        emit Minted(treasury, TOTAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
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
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) 
        internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "Token paused");
    }
    
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
EOF
# 종료: 00:16:00.000
```
- [ ] ✅ 완료 (960초)
- [ ] ✅ 라인 수: `wc -l contracts/AKC.sol`

---

## ⏱️ Task 1.5: Hardhat 설정 (360초)

```bash
# 시작: 00:16:00.000
cat > hardhat.config.js << 'EOF'
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    hardhat: { chainId: 1337, accounts: { count: 200 } },
    localhost: { url: "http://127.0.0.1:8545" },
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
    apiKey: { bscTestnet: process.env.BSCSCAN_API_KEY, bsc: process.env.BSCSCAN_API_KEY }
  }
};
EOF
# 종료: 00:22:00.000
```
- [ ] ✅ 완료 (1,320초)

```bash
# .env.example 생성
cat > .env.example << 'EOF'
PRIVATE_KEY=your_private_key
TREASURY_ADDRESS=your_treasury_address
BSCSCAN_API_KEY=your_api_key
EOF
```
- [ ] ✅ 완료 (1,380초)

---

## ✅ Phase 1 완료 (00:23:00.000)

**타임스탬프: 1,380초 (23분)**

- [ ] ✅ 디렉터리 생성
- [ ] ✅ Git 초기화
- [ ] ✅ package.json
- [ ] ✅ 의존성 설치
- [ ] ✅ AKC.sol 작성
- [ ] ✅ hardhat.config.js
- [ ] ✅ .env.example

**다음: Phase 2 시작 (00:23:00.000)**
