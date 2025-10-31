# 🚀 AKC Token 초고도 세부 작업 계획서 - Phase 2

> **스마트 컨트랙트 개발 단계**
> 예상 소요 시간: **2시간 30분**
> 담당: Blockchain Dev

---

## 📋 Phase 2 목표
- AKC.sol 스마트 컨트랙트 완성
- OpenZeppelin 표준 구현
- 300,000,000 AKC 발행 로직 구현
- 보안 기능 (Pause/Ownable) 구현

---

## Task 2.1: AKC.sol 기본 구조 작성 (25분)

### Step 2.1.1: 파일 생성 및 라이선스 선언 (3분)
```solidity
// 파일: /repo/ainova/akc-token/apps/akc-contract/contracts/AKC.sol
// 실행 시간: 180초
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
```

**체크포인트:**
- ✅ `AKC.sol` 파일 생성
- ✅ Solidity 버전 ^0.8.4 선언

### Step 2.1.2: OpenZeppelin 임포트 (5분)
```solidity
// 실행 시간: 300초
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

**체크포인트:**
- ✅ ERC20 표준 임포트
- ✅ ERC20Burnable 확장 임포트
- ✅ Pausable 보안 기능 임포트
- ✅ Ownable 접근 제어 임포트

### Step 2.1.3: 컨트랙트 선언 및 상속 (7분)
```solidity
// 실행 시간: 420초
/**
 * @title AKASSECT (AKC)
 * @dev BEP-20 토큰 (ERC-20 호환)
 * @notice 총 발행량: 300,000,000 AKC
 */
contract AKC is ERC20, ERC20Burnable, Pausable, Ownable {
    // 상수 정의
    uint256 public constant TOTAL_SUPPLY = 300_000_000 * 10**18;
    
    // 이벤트 정의
    event Minted(address indexed to, uint256 amount);
    event TokensPaused(address indexed by);
    event TokensUnpaused(address indexed by);
}
```

**체크포인트:**
- ✅ 컨트랙트 이름 `AKC` 선언
- ✅ 4개 부모 컨트랙트 상속
- ✅ TOTAL_SUPPLY 상수 정의 (300,000,000 * 10^18)
- ✅ 이벤트 3개 정의 완료

### Step 2.1.4: 생성자 함수 작성 (10분)
```solidity
// 실행 시간: 600초
/**
 * @dev 생성자
 * @param treasury 초기 토큰을 받을 Treasury 주소
 */
constructor(address treasury) ERC20("AKASSECT", "AKC") {
    require(treasury != address(0), "AKC: treasury is zero address");
    
    // 전체 토큰을 Treasury로 발행
    _mint(treasury, TOTAL_SUPPLY);
    
    emit Minted(treasury, TOTAL_SUPPLY);
}
```

**체크포인트:**
- ✅ 생성자 파라미터 `treasury` 정의
- ✅ ERC20 생성자 호출 (이름: "AKASSECT", 심볼: "AKC")
- ✅ treasury 주소 0x0 검증
- ✅ TOTAL_SUPPLY만큼 treasury로 발행
- ✅ Minted 이벤트 발생

---

## Task 2.2: 핵심 기능 구현 (35분)

### Step 2.2.1: mint 함수 구현 (10분)
```solidity
// 실행 시간: 600초
/**
 * @dev 새 토큰 발행 (Owner만 가능)
 * @param to 토큰을 받을 주소
 * @param amount 발행할 토큰 수량
 */
function mint(address to, uint256 amount) external onlyOwner {
    require(to != address(0), "AKC: mint to zero address");
    require(amount > 0, "AKC: mint amount must be positive");
    
    _mint(to, amount);
    
    emit Minted(to, amount);
}
```

**체크포인트:**
- ✅ `mint` 함수 external 선언
- ✅ `onlyOwner` 제한자 적용
- ✅ to 주소 0x0 검증
- ✅ amount > 0 검증
- ✅ `_mint` 내부 함수 호출
- ✅ Minted 이벤트 발생

### Step 2.2.2: pause 함수 구현 (8분)
```solidity
// 실행 시간: 480초
/**
 * @dev 토큰 전송 일시정지 (Owner만 가능)
 */
function pause() external onlyOwner {
    _pause();
    emit TokensPaused(msg.sender);
}
```

**체크포인트:**
- ✅ `pause` 함수 external 선언
- ✅ `onlyOwner` 제한자 적용
- ✅ `_pause` 내부 함수 호출
- ✅ TokensPaused 이벤트 발생

### Step 2.2.3: unpause 함수 구현 (7분)
```solidity
// 실행 시간: 420초
/**
 * @dev 토큰 전송 재개 (Owner만 가능)
 */
function unpause() external onlyOwner {
    _unpause();
    emit TokensUnpaused(msg.sender);
}
```

**체크포인트:**
- ✅ `unpause` 함수 external 선언
- ✅ `onlyOwner` 제한자 적용
- ✅ `_unpause` 내부 함수 호출
- ✅ TokensUnpaused 이벤트 발생

### Step 2.2.4: _beforeTokenTransfer 오버라이드 (10분)
```solidity
// 실행 시간: 600초
/**
 * @dev 토큰 전송 전 훅
 * @notice Pausable 기능 적용
 */
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
) internal virtual override {
    super._beforeTokenTransfer(from, to, amount);
    
    // 일시정지 상태에서는 전송 불가
    require(!paused(), "AKC: token transfer while paused");
}
```

**체크포인트:**
- ✅ `_beforeTokenTransfer` 함수 오버라이드
- ✅ `super._beforeTokenTransfer` 호출
- ✅ `paused()` 상태 확인
- ✅ 일시정지 시 전송 차단

---

## Task 2.3: 컨트랙트 완성 및 검증 (20분)

### Step 2.3.1: decimals 함수 확인 (5분)
```solidity
// 실행 시간: 300초
/**
 * @dev 소수점 자리수
 * @return 18 (BEP-20 표준)
 */
function decimals() public pure override returns (uint8) {
    return 18;
}
```

**체크포인트:**
- ✅ `decimals` 함수 오버라이드
- ✅ 18 반환 확인

### Step 2.3.2: 전체 코드 리뷰 (10분)
```bash
# 실행 시간: 600초
cd /repo/ainova/akc-token/apps/akc-contract
cat contracts/AKC.sol
```

**체크포인트:**
- ✅ 모든 함수 정의 확인
- ✅ 주석 완성도 확인
- ✅ 이벤트 발생 위치 확인

### Step 2.3.3: Solidity 문법 검증 (5분)
```bash
# 실행 시간: 300초
pnpm hardhat compile
```

**체크포인트:**
- ✅ 컴파일 성공 (0 errors)
- ✅ artifacts/ 디렉터리 생성
- ✅ AKC.json 아티팩트 생성

---

## Task 2.4: 배포 스크립트 작성 (30분)

### Step 2.4.1: deploy.ts 기본 구조 (10분)
```typescript
// 파일: /repo/ainova/akc-token/apps/akc-contract/scripts/deploy.ts
// 실행 시간: 600초
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 AKC Token 배포 시작...");
  
  // 1. Treasury 주소 로드
  const treasuryAddress = process.env.TREASURY_ADDRESS;
  if (!treasuryAddress) {
    throw new Error("TREASURY_ADDRESS not found in .env");
  }
  
  console.log(`📝 Treasury: ${treasuryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

**체크포인트:**
- ✅ `deploy.ts` 파일 생성
- ✅ ethers 임포트
- ✅ main 함수 정의
- ✅ TREASURY_ADDRESS 로드

### Step 2.4.2: 컨트랙트 배포 로직 (12분)
```typescript
// 실행 시간: 720초
async function main() {
  // ... (이전 코드)
  
  // 2. 배포자 정보 확인
  const [deployer] = await ethers.getSigners();
  console.log(`👤 배포자: ${deployer.address}`);
  
  const balance = await deployer.getBalance();
  console.log(`💰 배포자 잔액: ${ethers.utils.formatEther(balance)} BNB`);
  
  // 3. AKC 컨트랙트 배포
  console.log("\n⏳ 컨트랙트 배포 중...");
  const AKC = await ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasuryAddress);
  
  await akc.deployed();
  
  console.log(`✅ AKC 배포 완료: ${akc.address}`);
  console.log(`📊 총 발행량: 300,000,000 AKC`);
}
```

**체크포인트:**
- ✅ Signer 정보 조회
- ✅ 배포자 잔액 확인
- ✅ ContractFactory 생성
- ✅ 컨트랙트 배포 (treasury 전달)
- ✅ deployed() 대기

### Step 2.4.3: 배포 정보 저장 (8분)
```typescript
// 실행 시간: 480초
async function main() {
  // ... (이전 코드)
  
  // 4. 배포 정보 저장
  const deploymentInfo = {
    network: "local",
    chainId: 1337,
    contractAddress: akc.address,
    treasuryAddress: treasuryAddress,
    deployerAddress: deployer.address,
    blockNumber: akc.deployTransaction.blockNumber,
    transactionHash: akc.deployTransaction.hash,
    timestamp: new Date().toISOString(),
    abi: JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../artifacts/contracts/AKC.sol/AKC.json"),
        "utf8"
      )
    ).abi
  };
  
  const deployDir = path.join(__dirname, "../deployments/local");
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(deployDir, "AKC.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 배포 정보 저장: deployments/local/AKC.json`);
}
```

**체크포인트:**
- ✅ deploymentInfo 객체 생성
- ✅ ABI 파일 로드
- ✅ deployments/local/ 디렉터리 생성
- ✅ AKC.json 파일 저장

---

## Task 2.5: 유닛 테스트 작성 (40분)

### Step 2.5.1: 테스트 파일 기본 구조 (8분)
```typescript
// 파일: /repo/ainova/akc-token/apps/akc-contract/test/akc.spec.ts
// 실행 시간: 480초
import { expect } from "chai";
import { ethers } from "hardhat";
import { AKC } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("AKC Token", function () {
  let akc: AKC;
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  
  const TOTAL_SUPPLY = ethers.utils.parseEther("300000000");
  
  beforeEach(async function () {
    [owner, treasury, user1, user2] = await ethers.getSigners();
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.deployed();
  });
});
```

**체크포인트:**
- ✅ `akc.spec.ts` 파일 생성
- ✅ chai, ethers 임포트
- ✅ describe 블록 정의
- ✅ beforeEach 훅 구현

### Step 2.5.2: 배포 테스트 (7분)
```typescript
// 실행 시간: 420초
describe("배포", function () {
  it("정확한 이름과 심볼을 가져야 함", async function () {
    expect(await akc.name()).to.equal("AKASSECT");
    expect(await akc.symbol()).to.equal("AKC");
  });
  
  it("18 decimals를 가져야 함", async function () {
    expect(await akc.decimals()).to.equal(18);
  });
  
  it("총 발행량이 300,000,000 AKC여야 함", async function () {
    expect(await akc.totalSupply()).to.equal(TOTAL_SUPPLY);
  });
  
  it("Treasury가 전체 발행량을 보유해야 함", async function () {
    expect(await akc.balanceOf(treasury.address)).to.equal(TOTAL_SUPPLY);
  });
});
```

**체크포인트:**
- ✅ 이름/심볼 테스트
- ✅ decimals 테스트
- ✅ totalSupply 테스트
- ✅ Treasury 잔액 테스트

### Step 2.5.3: 전송 테스트 (8분)
```typescript
// 실행 시간: 480초
describe("전송", function () {
  it("정상적으로 토큰을 전송할 수 있어야 함", async function () {
    const amount = ethers.utils.parseEther("1000");
    
    await akc.connect(treasury).transfer(user1.address, amount);
    
    expect(await akc.balanceOf(user1.address)).to.equal(amount);
  });
  
  it("잔액 부족 시 전송 실패해야 함", async function () {
    const amount = ethers.utils.parseEther("1000");
    
    await expect(
      akc.connect(user1).transfer(user2.address, amount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
});
```

**체크포인트:**
- ✅ 정상 전송 테스트
- ✅ 잔액 부족 전송 테스트

### Step 2.5.4: Mint 테스트 (7분)
```typescript
// 실행 시간: 420초
describe("Mint", function () {
  it("Owner가 새 토큰을 발행할 수 있어야 함", async function () {
    const amount = ethers.utils.parseEther("1000000");
    
    await akc.mint(user1.address, amount);
    
    expect(await akc.balanceOf(user1.address)).to.equal(amount);
  });
  
  it("Owner가 아니면 Mint 불가능해야 함", async function () {
    const amount = ethers.utils.parseEther("1000");
    
    await expect(
      akc.connect(user1).mint(user2.address, amount)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
```

**체크포인트:**
- ✅ Owner mint 성공 테스트
- ✅ 비-Owner mint 실패 테스트

### Step 2.5.5: Burn 테스트 (5분)
```typescript
// 실행 시간: 300초
describe("Burn", function () {
  it("토큰을 소각할 수 있어야 함", async function () {
    const amount = ethers.utils.parseEther("1000000");
    const burnAmount = ethers.utils.parseEther("500000");
    
    await akc.connect(treasury).burn(burnAmount);
    
    const expectedBalance = TOTAL_SUPPLY.sub(burnAmount);
    expect(await akc.balanceOf(treasury.address)).to.equal(expectedBalance);
  });
});
```

**체크포인트:**
- ✅ burn 함수 테스트

### Step 2.5.6: Pause 테스트 (5분)
```typescript
// 실행 시간: 300초
describe("Pause", function () {
  it("Owner가 일시정지할 수 있어야 함", async function () {
    await akc.pause();
    expect(await akc.paused()).to.be.true;
  });
  
  it("일시정지 시 전송 불가능해야 함", async function () {
    await akc.pause();
    
    const amount = ethers.utils.parseEther("1000");
    
    await expect(
      akc.connect(treasury).transfer(user1.address, amount)
    ).to.be.revertedWith("AKC: token transfer while paused");
  });
  
  it("재개 후 전송 가능해야 함", async function () {
    await akc.pause();
    await akc.unpause();
    
    const amount = ethers.utils.parseEther("1000");
    await akc.connect(treasury).transfer(user1.address, amount);
    
    expect(await akc.balanceOf(user1.address)).to.equal(amount);
  });
});
```

**체크포인트:**
- ✅ pause 함수 테스트
- ✅ 일시정지 시 전송 차단 테스트
- ✅ unpause 후 전송 재개 테스트

---

## Task 2.6: 테스트 실행 및 검증 (10분)

### Step 2.6.1: 유닛 테스트 실행 (7분)
```bash
# 실행 시간: 420초
cd /repo/ainova/akc-token/apps/akc-contract
pnpm hardhat test
```

**체크포인트:**
- ✅ 모든 테스트 PASS
- ✅ 테스트 커버리지 > 95%
- ✅ 0 errors

### Step 2.6.2: 커버리지 리포트 생성 (3분)
```bash
# 실행 시간: 180초
pnpm hardhat coverage
```

**체크포인트:**
- ✅ `coverage/` 디렉터리 생성
- ✅ HTML 리포트 생성
- ✅ Statements, Branches, Functions, Lines 모두 95% 이상

---

## Phase 2 완료 체크리스트

### 최종 검증 (10분)
```bash
# 실행 시간: 600초
# 1. 컴파일 검증
pnpm hardhat clean
pnpm hardhat compile

# 2. 테스트 검증
pnpm hardhat test

# 3. 파일 존재 확인
ls -lh contracts/AKC.sol
ls -lh scripts/deploy.ts
ls -lh test/akc.spec.ts
```

### 완료 항목
- ✅ AKC.sol 스마트 컨트랙트 완성 (25분)
- ✅ mint, pause, unpause 기능 구현 (35분)
- ✅ 컨트랙트 검증 및 컴파일 (20분)
- ✅ deploy.ts 배포 스크립트 완성 (30분)
- ✅ akc.spec.ts 유닛 테스트 완성 (40분)
- ✅ 테스트 실행 및 커버리지 확인 (10분)

### 산출물
- ✅ `contracts/AKC.sol` (150 라인)
- ✅ `scripts/deploy.ts` (80 라인)
- ✅ `test/akc.spec.ts` (120 라인)
- ✅ `artifacts/contracts/AKC.sol/AKC.json` (컴파일 결과)
- ✅ `coverage/` (커버리지 리포트)

### 품질 지표
- ✅ Solidity 컴파일 에러: 0건
- ✅ 테스트 통과율: 100%
- ✅ 코드 커버리지: > 95%
- ✅ OpenZeppelin 표준 준수: 100%

### 총 소요 시간: **2시간 30분**

### 다음 단계
**Phase 3: 배포 및 검증** (예상 1시간 30분)
