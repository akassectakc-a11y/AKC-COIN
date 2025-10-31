# 🧪 STEP 5: 테스트 코드 작성 및 실행 (15분)

## 5.1 테스트 파일 작성 (600초)

```bash
cat > test/AKC.test.js << 'EOF'
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AKC Token", function () {
  let akc;
  let owner;
  let treasury;
  let user1;
  let user2;
  
  const TOTAL_SUPPLY = ethers.utils.parseEther("300000000");
  
  beforeEach(async function () {
    [owner, treasury, user1, user2] = await ethers.getSigners();
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
    
    it("총 발행량 300,000,000 AKC", async function () {
      expect(await akc.totalSupply()).to.equal(TOTAL_SUPPLY);
    });
    
    it("Treasury 전체 발행량 보유", async function () {
      expect(await akc.balanceOf(treasury.address)).to.equal(TOTAL_SUPPLY);
    });
  });
  
  describe("전송", function () {
    it("정상 토큰 전송", async function () {
      const amount = ethers.utils.parseEther("1000");
      await akc.connect(treasury).transfer(user1.address, amount);
      expect(await akc.balanceOf(user1.address)).to.equal(amount);
    });
    
    it("잔액 부족 시 실패", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        akc.connect(user1).transfer(user2.address, amount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
  
  describe("Mint", function () {
    it("Owner가 발행 가능", async function () {
      const amount = ethers.utils.parseEther("1000000");
      await akc.mint(user1.address, amount);
      expect(await akc.balanceOf(user1.address)).to.equal(amount);
    });
    
    it("Owner 아니면 불가", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        akc.connect(user1).mint(user2.address, amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  
  describe("Pause", function () {
    it("Owner가 일시정지 가능", async function () {
      await akc.pause();
      expect(await akc.paused()).to.be.true;
    });
    
    it("일시정지 시 전송 불가", async function () {
      await akc.pause();
      const amount = ethers.utils.parseEther("1000");
      await expect(
        akc.connect(treasury).transfer(user1.address, amount)
      ).to.be.revertedWith("AKC: token transfer while paused");
    });
    
    it("재개 후 전송 가능", async function () {
      await akc.pause();
      await akc.unpause();
      const amount = ethers.utils.parseEther("1000");
      await akc.connect(treasury).transfer(user1.address, amount);
      expect(await akc.balanceOf(user1.address)).to.equal(amount);
    });
  });
});
EOF
```

**체크포인트:**
- [ ] 테스트 파일 확인: `cat test/AKC.test.js`
- [ ] 라인 수: `wc -l test/AKC.test.js` (약 80줄)

## 5.2 컴파일 실행 (120초)

```bash
pnpm hardhat compile
```

**예상 출력:**
```
Compiled 10 Solidity files successfully
```

**체크포인트:**
- [ ] 컴파일 성공 확인
- [ ] artifacts 폴더 생성: `ls artifacts`
- [ ] cache 폴더 생성: `ls cache`

## 5.3 테스트 실행 (180초)

```bash
pnpm hardhat test
```

**예상 출력:**
```
  AKC Token
    배포
      ✔ 정확한 이름과 심볼
      ✔ 18 decimals
      ✔ 총 발행량 300,000,000 AKC
      ✔ Treasury 전체 발행량 보유
    전송
      ✔ 정상 토큰 전송
      ✔ 잔액 부족 시 실패
    Mint
      ✔ Owner가 발행 가능
      ✔ Owner 아니면 불가
    Pause
      ✔ Owner가 일시정지 가능
      ✔ 일시정지 시 전송 불가
      ✔ 재개 후 전송 가능

  11 passing (2s)
```

**체크포인트:**
- [ ] 모든 테스트 PASS (11개)
- [ ] 0 failing

## 5.4 커버리지 확인 (옵션, 120초)

```bash
pnpm hardhat coverage
```

**체크포인트:**
- [ ] Statements: > 95%
- [ ] Branches: > 95%
- [ ] Functions: > 95%
- [ ] Lines: > 95%

---

# 🎨 STEP 6: AKC 로고 생성 (10분)

## 6.1 로고 디렉터리 생성 (30초)

```bash
mkdir -p assets/logo
```

## 6.2 SVG 로고 생성 (300초)

```bash
cat > assets/logo/akc-logo.svg << 'EOF'
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 그라디언트 -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 원형 배경 -->
  <circle cx="128" cy="128" r="120" fill="url(#grad1)"/>
  
  <!-- AKC 텍스트 -->
  <text x="128" y="150" font-family="Arial, sans-serif" font-size="72" 
        font-weight="bold" text-anchor="middle" fill="white">AKC</text>
  
  <!-- 서브 텍스트 -->
  <text x="128" y="180" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="white" opacity="0.8">AINOVA KEY COIN</text>
</svg>
EOF
```

**체크포인트:**
- [ ] SVG 파일 확인: `cat assets/logo/akc-logo.svg`
- [ ] 브라우저에서 열기: `open assets/logo/akc-logo.svg`

## 6.3 PNG 변환 (ImageMagick 필요, 120초)

```bash
# ImageMagick 설치 (Mac)
brew install imagemagick

# PNG 변환 (256x256)
convert assets/logo/akc-logo.svg -resize 256x256 assets/logo/akc-logo-256.png

# PNG 변환 (128x128)
convert assets/logo/akc-logo.svg -resize 128x128 assets/logo/akc-logo-128.png
```

**체크포인트:**
- [ ] PNG 파일 생성 확인: `ls assets/logo/*.png`
- [ ] 이미지 확인: `open assets/logo/akc-logo-256.png`

## 6.4 메타데이터 JSON 생성 (120초)

```bash
cat > assets/logo/token-metadata.json << 'EOF'
{
  "name": "AKASSECT",
  "symbol": "AKC",
  "decimals": 18,
  "totalSupply": "300000000",
  "description": "AKASSECT (AKC) is a BEP-20 token on BSC",
  "website": "https://ainova.io",
  "logo": {
    "svg": "akc-logo.svg",
    "png256": "akc-logo-256.png",
    "png128": "akc-logo-128.png"
  },
  "social": {
    "twitter": "https://twitter.com/ainova",
    "telegram": "https://t.me/ainova"
  }
}
EOF
```

**체크포인트:**
- [ ] JSON 파일 확인: `cat assets/logo/token-metadata.json`

---

**현재까지 누적 시간: 약 48분**

다음 체크리스트: **EXECUTION-CHECKLIST-DEPLOY.md** (배포 및 검증)
