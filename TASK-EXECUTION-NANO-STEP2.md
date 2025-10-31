# ⚡ Phase 2: 테스트 & 검증 (1,500초 = 25분)

> **밀리세컨드 단위 실행 가이드 - 테스트 코드 작성 및 실행**

---

## ⏱️ Task 2.1: 컴파일 테스트 (120초)

```bash
# 시작: 00:23:00.000
pnpm hardhat compile
# 종료: 00:25:00.000
```

**예상 출력:**
```
Compiled 1 Solidity file successfully
✓ Compiled successfully
```

- [ ] ✅ 완료 (00:25:00.000 / 1,500초)
- [ ] ✅ artifacts/ 폴더 확인: `ls artifacts/contracts/`
- [ ] ✅ ABI 확인: `ls artifacts/contracts/AKC.sol/AKC.json`

---

## ⏱️ Task 2.2: 테스트 코드 작성 (600초)

```bash
# 시작: 00:25:00.000
cat > test/AKC.test.js << 'EOF'
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AKC Token", function () {
  let akc, owner, treasury, addr1, addr2;
  const TOTAL_SUPPLY = ethers.utils.parseEther("300000000");
  
  beforeEach(async function () {
    [owner, treasury, addr1, addr2] = await ethers.getSigners();
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.deployed();
  });
  
  describe("배포", function () {
    it("정확한 이름과 심볼", async function () {
      expect(await akc.name()).to.equal("AKASSECT");
      expect(await akc.symbol()).to.equal("AKC");
    });
    
    it("18 decimals", async function () {
      expect(await akc.decimals()).to.equal(18);
    });
    
    it("총 발행량 3억", async function () {
      expect(await akc.totalSupply()).to.equal(TOTAL_SUPPLY);
    });
    
    it("Treasury 잔액", async function () {
      expect(await akc.balanceOf(treasury.address)).to.equal(TOTAL_SUPPLY);
    });
  });
  
  describe("전송", function () {
    it("정상 전송", async function () {
      const amount = ethers.utils.parseEther("1000");
      await akc.connect(treasury).transfer(addr1.address, amount);
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
    });
    
    it("잔액 부족 시 실패", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        akc.connect(addr1).transfer(addr2.address, amount)
      ).to.be.reverted;
    });
  });
  
  describe("Mint", function () {
    it("Owner 발행 가능", async function () {
      const amount = ethers.utils.parseEther("1000");
      await akc.mint(addr1.address, amount);
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
    });
    
    it("일반 유저 발행 불가", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        akc.connect(addr1).mint(addr2.address, amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  
  describe("Pause", function () {
    it("Owner 일시정지 가능", async function () {
      await akc.pause();
      expect(await akc.paused()).to.equal(true);
    });
    
    it("일시정지 중 전송 불가", async function () {
      await akc.pause();
      const amount = ethers.utils.parseEther("1000");
      await expect(
        akc.connect(treasury).transfer(addr1.address, amount)
      ).to.be.revertedWith("Token paused");
    });
    
    it("재개 후 전송 가능", async function () {
      await akc.pause();
      await akc.unpause();
      const amount = ethers.utils.parseEther("1000");
      await akc.connect(treasury).transfer(addr1.address, amount);
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
    });
  });
  
  describe("Burn", function () {
    it("토큰 소각 가능", async function () {
      const amount = ethers.utils.parseEther("1000");
      await akc.connect(treasury).transfer(addr1.address, amount);
      await akc.connect(addr1).burn(amount);
      expect(await akc.balanceOf(addr1.address)).to.equal(0);
    });
  });
});
EOF
# 종료: 00:35:00.000
```

- [ ] ✅ 완료 (00:35:00.000 / 2,100초)
- [ ] ✅ 라인 수: `wc -l test/AKC.test.js` → 100+ lines
- [ ] ✅ 테스트 케이스 12개 확인

---

## ⏱️ Task 2.3: 테스트 실행 (180초)

```bash
# 시작: 00:35:00.000
pnpm hardhat test
# 종료: 00:38:00.000
```

**예상 출력:**
```
  AKC Token
    배포
      ✔ 정확한 이름과 심볼 (120ms)
      ✔ 18 decimals (45ms)
      ✔ 총 발행량 3억 (55ms)
      ✔ Treasury 잔액 (50ms)
    전송
      ✔ 정상 전송 (180ms)
      ✔ 잔액 부족 시 실패 (85ms)
    Mint
      ✔ Owner 발행 가능 (165ms)
      ✔ 일반 유저 발행 불가 (95ms)
    Pause
      ✔ Owner 일시정지 가능 (110ms)
      ✔ 일시정지 중 전송 불가 (130ms)
      ✔ 재개 후 전송 가능 (200ms)
    Burn
      ✔ 토큰 소각 가능 (155ms)

  12 passing (1.5s)
```

- [ ] ✅ 완료 (00:38:00.000 / 2,280초)
- [ ] ✅ 12 passing 확인
- [ ] ✅ 0 failing 확인

---

## ⏱️ Task 2.4: 커버리지 확인 (180초)

```bash
# 시작: 00:38:00.000
pnpm hardhat coverage
# 종료: 00:41:00.000
```

**예상 출력:**
```
-------------|----------|----------|----------|----------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |
-------------|----------|----------|----------|----------|
 contracts/  |      100 |    95.83 |      100 |      100 |
  AKC.sol    |      100 |    95.83 |      100 |      100 |
-------------|----------|----------|----------|----------|
All files    |      100 |    95.83 |      100 |      100 |
-------------|----------|----------|----------|----------|
```

- [ ] ✅ 완료 (00:41:00.000 / 2,460초)
- [ ] ✅ Coverage > 95% 확인
- [ ] ✅ coverage/ 폴더 생성 확인

---

## ⏱️ Task 2.5: 보안 분석 (180초)

```bash
# 시작: 00:41:00.000
# Slither 설치 (처음 1회만)
pip3 install slither-analyzer

# Slither 실행
slither .
# 종료: 00:44:00.000
```

**예상 출력:**
```
INFO:Detectors:
No issues found

INFO:Slither:
. analyzed (1 contracts)
```

- [ ] ✅ 완료 (00:44:00.000 / 2,640초)
- [ ] ✅ High/Medium issues: 0
- [ ] ✅ 보안 검증 통과

---

## ⏱️ Task 2.6: Git 커밋 (60초)

```bash
# 시작: 00:44:00.000
git add .
git commit -m "feat: Add AKC contract and tests

- Implement BEP-20 token contract
- Add 12 comprehensive test cases
- Achieve >95% test coverage
- Pass security analysis"
# 종료: 00:45:00.000
```

- [ ] ✅ 완료 (00:45:00.000 / 2,700초)
- [ ] ✅ Git log 확인: `git log --oneline`

---

## ⏱️ Task 2.7: 로고 생성 (180초)

### Step 2.7.1: SVG 로고 (120,000ms)
```bash
# 시작: 00:45:00.000
cat > assets/logo/akc-logo.svg << 'EOF'
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="120" fill="#F0B90B" stroke="#1E1E1E" stroke-width="4"/>
  <circle cx="128" cy="128" r="100" fill="#1E1E1E"/>
  <text x="128" y="145" font-family="Arial" font-size="64" font-weight="bold" 
        fill="#F0B90B" text-anchor="middle">AKC</text>
  <text x="128" y="180" font-family="Arial" font-size="16" 
        fill="#F0B90B" text-anchor="middle">AINOVA</text>
</svg>
EOF
# 종료: 00:47:00.000
```

- [ ] ✅ 완료 (00:47:00.000 / 2,820초)
- [ ] ✅ SVG 파일 확인: `cat assets/logo/akc-logo.svg`

### Step 2.7.2: PNG 변환 (60,000ms)
```bash
# 시작: 00:47:00.000
# 방법 1: ImageMagick 사용
convert -background none assets/logo/akc-logo.svg -resize 256x256 assets/logo/akc-256.png
convert -background none assets/logo/akc-logo.svg -resize 128x128 assets/logo/akc-128.png

# 방법 2: 온라인 도구 사용
# https://convertio.co/svg-png/

# 종료: 00:48:00.000
```

- [ ] ✅ 완료 (00:48:00.000 / 2,880초)
- [ ] ✅ PNG 파일 확인: `ls -lh assets/logo/`

---

## ✅ Phase 2 완료 (00:48:00.000)

**타임스탬프: 2,880초 (48분)**

### 완료 체크리스트
- [ ] ✅ 컴파일 성공
- [ ] ✅ 테스트 12개 통과
- [ ] ✅ 커버리지 >95%
- [ ] ✅ Slither 분석 통과
- [ ] ✅ Git 커밋 완료
- [ ] ✅ 로고 생성 (SVG + PNG)

### 파일 구조 확인
```bash
tree -L 2
```

**예상 출력:**
```
.
├── contracts/
│   └── AKC.sol
├── test/
│   └── AKC.test.js
├── assets/
│   └── logo/
│       ├── akc-logo.svg
│       ├── akc-256.png
│       └── akc-128.png
├── hardhat.config.js
├── package.json
└── .env.example
```

**다음: Phase 3 배포 스크립트 (00:48:00.000)**
