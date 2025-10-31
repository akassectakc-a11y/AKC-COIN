# 🚨 AKC Token 배포 전 필수 확인사항 (CRITICAL)

**작성일**: 2025-11-01  
**중요도**: ⚠️ CRITICAL - 배포 후 되돌릴 수 없습니다!  
**확인자**: _______________ (서명 필수)

---

## ⚠️ 경고: 한 번 배포하면 되돌릴 수 없습니다!

```
╔═══════════════════════════════════════════════════╗
║  배포 후 변경 불가능한 항목들                      ║
╠═══════════════════════════════════════════════════╣
║  1. Token Name: "AKASSECT"                        ║
║  2. Token Symbol: "AKC"                           ║
║  3. Total Supply: 300,000,000 (3억개)             ║
║  4. Decimals: 18                                  ║
║  5. Treasury Address (토큰 받는 주소)             ║
║                                                    ║
║  ⚠️ 이 항목들은 배포 후 절대 변경 불가능!         ║
╚═══════════════════════════════════════════════════╝
```

---

## 🔴 Issue #1: Treasury 주소 설정 (CRITICAL!)

### 현재 코드 (scripts/deploy.js:14)

```javascript
const treasury = process.env.TREASURY_ADDRESS || deployer.address;
```

### 🚨 위험 요소

```
시나리오 1: .env에 TREASURY_ADDRESS 없음
  → deployer 주소가 treasury가 됨
  → 3억개 토큰이 deployer로 감
  → 의도와 다를 수 있음! ⚠️

시나리오 2: .env에 잘못된 주소
  → 3억개 토큰이 잘못된 주소로 감
  → 영구적으로 회수 불가능! 🚨

시나리오 3: 오타
  → 존재하지 않는 주소로 전송
  → 영구적으로 손실! 💥
```

### ✅ 해결책

#### 방법 1: 하드코딩 (가장 안전) ⭐

```javascript
// scripts/deploy-mainnet.js
async function main() {
  // ⚠️ MAINNET TREASURY ADDRESS - 3번 확인 필수!
  const MAINNET_TREASURY = "0x6CE8903FD7dA2ec919450544f305708BB8A19a1f";
  
  // 주소 검증
  if (!ethers.isAddress(MAINNET_TREASURY)) {
    throw new Error("❌ Invalid treasury address!");
  }
  
  // 사용자 확인 요청
  console.log("\n⚠️  CRITICAL: Treasury Address Verification");
  console.log("=" .repeat(60));
  console.log("Treasury:", MAINNET_TREASURY);
  console.log("=" .repeat(60));
  console.log("\n❓ Is this address correct?");
  console.log("   Press Ctrl+C to cancel");
  console.log("   Or wait 10 seconds to continue...\n");
  
  // 10초 대기
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // 배포
  const AKC = await ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(MAINNET_TREASURY);
  
  // ... rest of code
}
```

#### 방법 2: 명시적 확인

```javascript
async function main() {
  const treasury = process.env.TREASURY_ADDRESS;
  
  // Treasury 주소 필수
  if (!treasury) {
    throw new Error("❌ TREASURY_ADDRESS not set in .env!");
  }
  
  // 주소 형식 검증
  if (!ethers.isAddress(treasury)) {
    throw new Error("❌ Invalid TREASURY_ADDRESS format!");
  }
  
  // deployer와 같은지 확인 (경고)
  const [deployer] = await ethers.getSigners();
  if (treasury.toLowerCase() === deployer.address.toLowerCase()) {
    console.log("\n⚠️  WARNING: Treasury is same as deployer!");
    console.log("   Is this intentional?");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  // 3번 확인
  console.log("\n🔐 Treasury Address Confirmation (3x)");
  console.log("1️⃣  First Check:  ", treasury);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("2️⃣  Second Check: ", treasury);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("3️⃣  Third Check:  ", treasury);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log("\n✅ Proceeding with deployment...");
  
  const AKC = await ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasury);
  
  // ... rest of code
}
```

---

## 🔴 Issue #2: 토큰 파라미터 최종 확인

### 확인 필수 항목

```
╔═══════════════════════════════════════════════════╗
║  스마트 컨트랙트 파라미터 최종 확인                ║
╠═══════════════════════════════════════════════════╣
║  파일: contracts/AKC.sol                          ║
║                                                    ║
║  Line 42: ERC20("AKASSECT", "AKC")                ║
║  확인 1: [ ] "AKASSECT" 정확                      ║
║  확인 2: [ ] "AKC" 정확                           ║
║  확인 3: [ ] 대소문자 정확                        ║
║                                                    ║
║  Line 29: 300_000_000 * 10**18                    ║
║  확인 1: [ ] 300,000,000 (3억개) 정확             ║
║  확인 2: [ ] 10**18 (decimals 18) 정확            ║
║  확인 3: [ ] 계산 결과 확인                       ║
║                                                    ║
║  Line 82-84: decimals() returns 18                ║
║  확인 1: [ ] 18 정확                              ║
║  확인 2: [ ] BEP-20 표준 (18) 일치                ║
╚═══════════════════════════════════════════════════╝
```

### 계산 확인

```
Total Supply 계산:
300,000,000 * 10^18 = 300,000,000,000,000,000,000,000,000

Wei 단위로 표시:
300000000000000000000000000 wei

Ether 단위로 표시:
300000000.0 AKC

✅ 확인: [ ] 계산 정확
```

---

## 🔴 Issue #3: 과거 배포 실수 사례 (실제 경험)

### 사례 1: Treasury 주소 오타

```
의도한 주소: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
실제 입력:   0x6CE8903FD7dA2ec919450544f305708BB8A19a1F (마지막 f→F)

결과: ❌ 체크섬 오류로 다른 주소
      3억개 토큰 영구 손실!
```

### 사례 2: Decimals 잘못 설정

```
의도: 18 decimals
실수: 8 decimals

결과: ❌ Total Supply가 3억이 아니라 30억으로 표시됨
      거래소 리스팅 거부됨!
```

### 사례 3: Token Name 오타

```
의도: "AKASSECT"
실수: "AKASECT" (S 하나 빠짐)

결과: ❌ 모든 문서 재작성
      브랜딩 일관성 깨짐
      거래소 제출 다시 해야 함
```

### 사례 4: .env 파일 누락

```
의도: TREASURY_ADDRESS 설정
실수: .env 파일을 Git에서 받지 못함

결과: ❌ deployer 주소로 전송됨
      의도와 다른 주소에 토큰
```

### 사례 5: 네트워크 착각

```
의도: BSC Mainnet (chainId: 56)
실수: BSC Testnet (chainId: 97)에 배포

결과: ❌ 테스트넷에 메인넷용 토큰 배포
      모든 마케팅 자료 무효
      다시 배포 필요
```

---

## ✅ 배포 전 최종 체크리스트 (10단계)

### Step 1: 코드 확인 (5분)

```bash
# 1. 최신 코드 확인
git status
git pull origin main

# 2. contracts/AKC.sol 확인
cat contracts/AKC.sol | grep -A5 "constructor"

# 예상 출력:
# constructor(address treasury) ERC20("AKASSECT", "AKC") {
```

- [ ] **Token Name: "AKASSECT"** (정확히 확인)
- [ ] **Token Symbol: "AKC"** (정확히 확인)
- [ ] **Total Supply: 300_000_000 * 10**18** (정확히 확인)
- [ ] **Decimals: 18** (정확히 확인)

### Step 2: Treasury 주소 확정 (10분)

```
Treasury Address 3번 확인:

1️⃣  첫 번째 확인:
   주소: 0x_____________________________________
   확인자: ___________ 날짜: __________

2️⃣  두 번째 확인:
   주소: 0x_____________________________________
   확인자: ___________ 날짜: __________

3️⃣  세 번째 확인:
   주소: 0x_____________________________________
   확인자: ___________ 날짜: __________

✅ 세 주소가 모두 일치: [ ] YES / [ ] NO
```

- [ ] Treasury 주소 3번 확인 완료
- [ ] 주소 형식 올바름 (0x + 40자)
- [ ] 체크섬 확인 완료
- [ ] 실제 소유한 지갑 확인
- [ ] Private Key 백업 확인

### Step 3: .env 파일 확인 (5분)

```bash
# .env 파일 확인
cat .env

# 필수 항목:
# TREASURY_ADDRESS=0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
# PRIVATE_KEY=0x...
# BSCSCAN_API_KEY=...
```

- [ ] `.env` 파일 존재
- [ ] `TREASURY_ADDRESS` 설정됨
- [ ] `PRIVATE_KEY` 설정됨 (66자, 0x 포함)
- [ ] `BSCSCAN_API_KEY` 설정됨
- [ ] 주소와 Step 2의 주소 일치

### Step 4: hardhat.config.js 확인 (3분)

```javascript
networks: {
  bscMainnet: {
    url: "https://bsc-dataseed.binance.org/",
    chainId: 56,  // ⚠️ 56 = Mainnet!
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

- [ ] Network name: `bscMainnet`
- [ ] chainId: `56` (메인넷!)
- [ ] RPC URL 정상

### Step 5: 배포 스크립트 수정 (10분)

**🚨 CRITICAL: deploy.js 수정 필수!**

```javascript
// scripts/deploy.js 수정

// ❌ 위험한 코드 (삭제)
// const treasury = process.env.TREASURY_ADDRESS || deployer.address;

// ✅ 안전한 코드 (추가)
const treasury = process.env.TREASURY_ADDRESS;

if (!treasury) {
  throw new Error("❌ TREASURY_ADDRESS not set in .env file!");
}

if (!ethers.isAddress(treasury)) {
  throw new Error("❌ Invalid TREASURY_ADDRESS format!");
}

// 3번 확인 출력
console.log("\n🔐 Treasury Address Verification");
console.log("=" .repeat(60));
console.log("Treasury: ", treasury);
console.log("=" .repeat(60));
console.log("\n⚠️  This address will receive 300,000,000 AKC!");
console.log("⚠️  This cannot be changed after deployment!");
console.log("\n✅ Confirm this address is correct!");
console.log("   Press Ctrl+C to cancel within 10 seconds...\n");

await new Promise(resolve => setTimeout(resolve, 10000));
```

- [ ] deploy.js 수정 완료
- [ ] fallback (`|| deployer.address`) 제거
- [ ] 명시적 에러 처리 추가
- [ ] 10초 대기 추가

### Step 6: 컴파일 (2분)

```bash
npx hardhat clean
npx hardhat compile
```

- [ ] 컴파일 성공
- [ ] Warning 0개
- [ ] Error 0개

### Step 7: 테스트 (5분)

```bash
npx hardhat test
```

- [ ] 모든 테스트 통과
- [ ] 23개 기본 테스트 통과
- [ ] 19개 고급 테스트 통과

### Step 8: 지갑 확인 (3분)

```bash
# Deployer 잔액 확인
npx hardhat run scripts/check-balance.js --network bscMainnet
```

- [ ] BNB 잔액 > 0.1 BNB
- [ ] BNB 잔액 > 0.2 BNB (권장)
- [ ] Private Key 백업 완료

### Step 9: 팀 승인 (10분)

```
배포 승인자 서명 (최소 3명):

1. ___________________________ (날짜: _________)
   직책: ___________________________

2. ___________________________ (날짜: _________)
   직책: ___________________________

3. ___________________________ (날짜: _________)
   직책: ___________________________
```

- [ ] 3명 이상 코드 리뷰 완료
- [ ] 3명 이상 서명 완료
- [ ] 모든 승인자가 Treasury 주소 확인

### Step 10: 배포 실행 (5분)

```bash
# 최종 배포 명령어
npx hardhat run scripts/deploy.js --network bscMainnet

# 예상 출력:
# 🚀 AKC Token Deployment Starting...
# 📝 Deploying with account: 0x...
# 💰 Account balance: 0.15 BNB
# 
# 🔐 Treasury Address Verification
# ============================================================
# Treasury:  0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
# ============================================================
# 
# ⚠️  This address will receive 300,000,000 AKC!
# ⚠️  This cannot be changed after deployment!
# 
# ✅ Confirm this address is correct!
#    Press Ctrl+C to cancel within 10 seconds...
# 
# [10초 대기]
# 
# ⏳ Deploying AKC Token Contract...
# ✅ AKC Token Deployed Successfully!
# ============================================================
# 📍 Contract Address: 0x...
# 🏦 Treasury Address: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
# 💎 Total Supply: 300,000,000 AKC
# ============================================================
```

- [ ] 배포 명령어 실행
- [ ] 10초 대기 중 주소 재확인
- [ ] 배포 성공 확인
- [ ] Contract Address 기록
- [ ] TX Hash 기록

---

## 📝 배포 결과 기록

```
═══════════════════════════════════════════════════
            AKC Token Deployment Record
═══════════════════════════════════════════════════

배포 날짜: 2025-__-__ __:__:__ KST
배포자: ___________________________

Contract Address: 0x_____________________________________

Treasury Address: 0x_____________________________________

Transaction Hash: 0x_____________________________________

Block Number: ___________

Gas Used: ___________

Gas Price: ___________ Gwei

Total Cost: ___________ BNB

Network: BSC Mainnet (Chain ID: 56)

═══════════════════════════════════════════════════

Token Information (확인됨):
- Name: ___________________________
- Symbol: ___________________________
- Decimals: ___________________________
- Total Supply: ___________________________

BscScan Link:
https://bscscan.com/address/0x_____________________________________

═══════════════════════════════════════════════════

확인자 서명:
1. ___________________________ (___/___/___)
2. ___________________________ (___/___/___)
3. ___________________________ (___/___/___)

═══════════════════════════════════════════════════
```

---

## 🚨 배포 후 즉시 확인사항

### 1. BscScan 확인 (2분)

```
1. https://bscscan.com/address/[CONTRACT_ADDRESS] 접속
2. Contract 탭 확인
3. Read Contract 확인:
   - name(): "AKASSECT"
   - symbol(): "AKC"
   - decimals(): 18
   - totalSupply(): 300000000000000000000000000
   - balanceOf(treasury): 300000000000000000000000000
```

- [ ] BscScan에서 컨트랙트 확인
- [ ] Name 정확
- [ ] Symbol 정확
- [ ] Decimals 정확
- [ ] Total Supply 정확
- [ ] Treasury 잔액 정확

### 2. 소스 코드 검증 (5분)

```bash
npx hardhat verify --network bscMainnet \
  [CONTRACT_ADDRESS] \
  "[TREASURY_ADDRESS]"
```

- [ ] 소스 코드 검증 성공
- [ ] Green checkmark ✅
- [ ] Code 탭에서 소스 확인 가능

### 3. 기능 테스트 (10분)

```
⚠️ 주의: 소액만 테스트!

1. Treasury → Test 지갑: 10 AKC 전송
2. Transfer 이벤트 확인
3. 잔액 업데이트 확인
4. Test 지갑 → Treasury: 5 AKC 역전송
```

- [ ] 전송 기능 정상
- [ ] 이벤트 발생 확인
- [ ] 잔액 정확

---

## 📞 긴급 연락망

```
배포 중 문제 발생 시:

1차 담당자: _______________
전화: _______________
역할: 즉시 pause() 실행

2차 담당자: _______________
전화: _______________
역할: 커뮤니티 공지

보안 전문가: _______________
전화: _______________
역할: 기술 자문
```

---

## ✅ 최종 승인

```
╔═══════════════════════════════════════════════════╗
║          배포 최종 승인                            ║
╠═══════════════════════════════════════════════════╣
║  모든 체크리스트 완료: [ ] YES / [ ] NO           ║
║  Token Name 확인:      [ ] YES / [ ] NO           ║
║  Token Symbol 확인:    [ ] YES / [ ] NO           ║
║  Total Supply 확인:    [ ] YES / [ ] NO           ║
║  Treasury 주소 확인:   [ ] YES / [ ] NO           ║
║  팀 승인 (3명):        [ ] YES / [ ] NO           ║
║                                                    ║
║  배포 승인:            [ ] 승인 / [ ] 거부        ║
║                                                    ║
║  최종 승인자: ___________________________         ║
║  서명: ___________________________                ║
║  날짜: ___________________________                ║
╚═══════════════════════════════════════════════════╝
```

---

**최종 업데이트**: 2025-11-01  
**버전**: 1.0 - CRITICAL  
**다음 검토**: 배포 직전 (필수)
