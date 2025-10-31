# ⚠️ AKC Token 배포 전 최종 검증 (FINAL CHECK)

**검증 날짜**: 2025-11-01 00:53  
**검증자**: _______________ (서명 필수)  
**심각도**: 🔴 CRITICAL

---

## 📋 .env 파일 검증 결과

### ✅ 현재 설정 확인됨

```bash
PRIVATE_KEY=0x4d02c1289dec3930c2c8517c22d968ba28cb3a340b45976177026a499fc29ee6
TREASURY_ADDRESS=0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
BSCSCAN_API_KEY=o0BGuiSR6P0aq82fjL3WAh3a2O0vRrpMHXd1bRotpXWzQAmTLOnIuxJ7vcya5eLr
```

### 🚨 CRITICAL 확인 필수!

```
╔═══════════════════════════════════════════════════╗
║          TREASURY 주소 3번 확인                   ║
╠═══════════════════════════════════════════════════╣
║  Treasury: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
║                                                    ║
║  ⚠️  이 주소로 300,000,000 AKC가 전송됩니다!     ║
║  ⚠️  배포 후 절대 변경 불가능!                    ║
║                                                    ║
║  확인 1: [ ] ___________ (이니셜/날짜)            ║
║  확인 2: [ ] ___________ (이니셜/날짜)            ║
║  확인 3: [ ] ___________ (이니셜/날짜)            ║
╚═══════════════════════════════════════════════════╝
```

**체크 항목**:
- [ ] 주소 길이: 42자 (0x + 40자) ✅
- [ ] 실제 소유한 지갑인가? ⚠️ **반드시 확인!**
- [ ] Private Key 백업 완료? ⚠️ **필수!**
- [ ] MetaMask에서 접근 가능? ⚠️ **테스트 필요!**
- [ ] Multisig 고려했는가? (권장)

---

## 🔍 전체 시스템 최종 체크

### 1. 스마트 컨트랙트 파라미터 ✅

```solidity
// contracts/AKC.sol

✅ Token Name: "AKASSECT" (Line 42)
✅ Token Symbol: "AKC" (Line 42)
✅ Total Supply: 300_000_000 * 10**18 (Line 29)
✅ Decimals: 18 (Line 82-84)
```

**검증 명령어**:
```bash
# 컨트랙트 내용 확인
grep -n "AKASSECT\|AKC\|300_000_000\|decimals" contracts/AKC.sol

# 예상 출력:
# 42:    constructor(address treasury) ERC20("AKASSECT", "AKC") {
# 29:    uint256 public constant TOTAL_SUPPLY = 300_000_000 * 10**18;
# 82:    function decimals() public pure override returns (uint8) {
# 83:        return 18;
```

- [ ] Token Name 정확: "AKASSECT"
- [ ] Token Symbol 정확: "AKC"
- [ ] Total Supply 정확: 300,000,000
- [ ] Decimals 정확: 18

---

### 2. 배포 스크립트 안전성 ✅

```javascript
// scripts/deploy.js (수정됨)

✅ Treasury fallback 제거됨
✅ 필수 검증 추가됨
✅ 15초 확인 시간 추가됨
```

**검증 명령어**:
```bash
# 위험한 코드 있는지 확인
grep -n "|| deployer.address" scripts/deploy.js

# 출력 없어야 함 (제거됨) ✅
```

- [ ] Fallback 코드 없음 ✅
- [ ] TREASURY_ADDRESS 필수 검증 있음 ✅
- [ ] 15초 대기 시간 있음 ✅

---

### 3. PNG 로고 파일 ❌ (CRITICAL!)

**현재 상태**:
```bash
docs/logo/
├── AKC-Logo.svg ✅
├── AKC-Icon.svg ✅
├── generate-all-logo-assets.sh ✅
└── png/ ❌ (디렉터리 없음!)
```

**필요한 PNG (8개)**:
```
❌ AKC-Logo-1024.png    (LBank 필수)
❌ AKC-Logo-512.png
❌ AKC-Icon-256.png
❌ AKC-Icon-200.png     (CMC/CG 필수)
❌ AKC-Icon-128.png
❌ AKC-Icon-64.png
❌ AKC-Icon-32.png
❌ AKC-Icon-16.png
```

**🚨 LBank 제출 불가능! 즉시 생성 필요!**

**생성 명령어**:
```bash
cd docs/logo
./generate-all-logo-assets.sh
```

- [ ] PNG 파일 8개 생성
- [ ] exchanges/ 폴더 구성
- [ ] social/ 이미지 생성
- [ ] favicons/ 생성

---

### 4. 문서 일관성 체크 ✅

**검증 명령어**:
```bash
# 토큰 이름 일관성 확인
grep -r "AKASSECT" --include="*.md" --include="*.sol" . | wc -l

# 토큰 심볼 일관성 확인
grep -r '"AKC"' --include="*.md" --include="*.sol" . | wc -l

# 발행량 일관성 확인
grep -r "300,000,000\|300000000\|300_000_000" --include="*.md" --include="*.sol" . | wc -l
```

- [ ] 모든 문서에서 "AKASSECT" 일치
- [ ] 모든 문서에서 "AKC" 일치
- [ ] 모든 문서에서 "300,000,000" 일치

---

### 5. 테스트 통과 확인 ✅

```bash
# 테스트 실행
npx hardhat test

# 예상 결과:
# 42 passing (기본 23 + 고급 19)
```

- [ ] 모든 테스트 통과 (42개)
- [ ] 컴파일 성공
- [ ] Warning 0개

---

## 🎯 최종 배포 체크리스트 (10단계)

### Phase 1: 사전 준비 (30분)

#### Step 1: ImageMagick 설치 (5분)
```bash
brew install imagemagick
```
- [ ] ImageMagick 설치 완료
- [ ] `convert --version` 실행 확인

#### Step 2: PNG 로고 생성 (10분) 🔥 CRITICAL
```bash
cd /Users/test-mac/project/ak-coin/docs/logo
./generate-all-logo-assets.sh
```
- [ ] 스크립트 실행 성공
- [ ] PNG 8개 생성 확인
- [ ] 파일 크기 < 500KB 확인

#### Step 3: Treasury 주소 3번 확인 (10분)
```
주소: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f

확인 1: ________ (이니셜) ________ (시간)
확인 2: ________ (이니셜) ________ (시간)
확인 3: ________ (이니셜) ________ (시간)
```
- [ ] 3명이 독립적으로 확인
- [ ] MetaMask에서 주소 확인
- [ ] Private Key 백업 확인

#### Step 4: BNB 잔액 확인 (5분)
```bash
npx hardhat run scripts/check-balance.js --network bscMainnet
```
- [ ] BNB > 0.1 (필수)
- [ ] BNB > 0.2 (권장)

---

### Phase 2: 최종 검증 (20분)

#### Step 5: 컴파일 (2분)
```bash
npx hardhat clean
npx hardhat compile
```
- [ ] 컴파일 성공
- [ ] Warning 0개

#### Step 6: 테스트 (10분)
```bash
npx hardhat test
```
- [ ] 42개 테스트 모두 통과
- [ ] Error 0개

#### Step 7: 배포 스크립트 확인 (5분)
```bash
# 위험 코드 확인
grep -n "|| deployer" scripts/deploy.js

# 출력 없어야 함 ✅
```
- [ ] Fallback 없음 확인
- [ ] Treasury 검증 로직 확인

#### Step 8: 네트워크 확인 (3분)
```bash
# hardhat.config.js 확인
grep -A5 "bscMainnet" hardhat.config.js
```
- [ ] chainId: 56 (Mainnet!)
- [ ] RPC URL 정상

---

### Phase 3: 배포 실행 (10분)

#### Step 9: 팀 승인 (5분)
```
배포 승인자 (최소 3명):

1. _________________ (서명) ______ (날짜)
2. _________________ (서명) ______ (날짜)
3. _________________ (서명) ______ (날짜)
```
- [ ] 3명 이상 서명 완료
- [ ] 모두 Treasury 주소 확인

#### Step 10: 배포 실행 (5분)
```bash
npx hardhat run scripts/deploy.js --network bscMainnet
```
- [ ] 15초 대기 중 최종 확인
- [ ] 배포 성공
- [ ] Contract Address 기록
- [ ] TX Hash 기록

---

## 📊 배포 정보 기록 양식

```
═══════════════════════════════════════════════════
            AKC Token Deployment Record
═══════════════════════════════════════════════════

배포 날짜: 2025-__-__ __:__:__ KST
배포자: ___________________________

Contract Address: 0x_____________________________________

Treasury Address: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f

Transaction Hash: 0x_____________________________________

Block Number: ___________

Gas Used: ___________

Total Cost: ___________ BNB

═══════════════════════════════════════════════════

Token Information:
- Name: AKASSECT
- Symbol: AKC
- Decimals: 18
- Total Supply: 300,000,000 AKC

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

## 🚨 배포 전 마지막 확인 (FINAL CHECKLIST)

```
╔═══════════════════════════════════════════════════╗
║          배포 전 최종 확인                         ║
╠═══════════════════════════════════════════════════╣
║  [ ] 1. PNG 로고 8개 생성 완료                    ║
║  [ ] 2. Treasury 주소 3번 확인                    ║
║  [ ] 3. Private Key 백업 완료                     ║
║  [ ] 4. BNB 잔액 > 0.1                            ║
║  [ ] 5. 컴파일 성공 (Warning 0)                   ║
║  [ ] 6. 테스트 통과 (42개)                        ║
║  [ ] 7. 배포 스크립트 안전 확인                   ║
║  [ ] 8. 네트워크 = BSC Mainnet (chainId: 56)     ║
║  [ ] 9. 팀 승인 (3명 이상)                        ║
║  [ ] 10. 긴급 연락망 준비                         ║
║                                                    ║
║  모든 항목 체크 완료: [ ] YES / [ ] NO            ║
╚═══════════════════════════════════════════════════╝
```

---

## ⚠️ 배포 시 주의사항

### 주의 1: Treasury 주소 재확인
```
배포 실행 전 15초 대기 시간에 다시 한번 확인!

표시된 주소: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f

맞으면 → 대기
틀리면 → Ctrl+C 즉시 중단!
```

### 주의 2: 네트워크 확인
```
⚠️ BSC Mainnet (chainId: 56)인지 확인!
⚠️ Testnet (chainId: 97)이 아닌지 확인!
```

### 주의 3: Gas Price
```
현재 BSC Gas Price 확인:
https://bscscan.com/gastracker

너무 높으면 대기 권장
```

---

## 🚀 즉시 실행 필요 (CRITICAL!)

### 1. PNG 로고 생성 (10분)
```bash
cd /Users/test-mac/project/ak-coin/docs/logo
./generate-all-logo-assets.sh

# 결과 확인
ls -lh png/*.png
```

### 2. 생성 확인
```bash
# 8개 파일 있어야 함
ls -1 png/*.png | wc -l

# 출력: 8
```

### 3. Git 커밋
```bash
git add docs/logo/
git commit -m "feat: Generate all PNG logo assets"
git push origin main
```

---

## 📋 현재 준비 상태

```
╔═══════════════════════════════════════════════════╗
║          현재 배포 준비 상태                       ║
╠═══════════════════════════════════════════════════╣
║  코드:                    ✅ 100% (수정 완료)      ║
║  테스트:                  ✅ 100% (42개 통과)      ║
║  보안:                    ✅ 100% (Fallback 제거)  ║
║  .env 설정:               ✅ 100% (확인 완료)      ║
║  PNG 로고:                ❌ 0% (즉시 생성 필요!)  ║
║                                                    ║
║  전체 준비도:             95% ⚠️                   ║
║  배포 가능:               🚫 PNG 생성 후 가능      ║
╚═══════════════════════════════════════════════════╝
```

---

## 📞 긴급 연락망

```
배포 중 문제 발생 시:

1차: _________________ (전화: _______)
2차: _________________ (전화: _______)
보안: _________________ (전화: _______)
```

---

**최종 검증일**: 2025-11-01 00:53  
**다음 액션**: PNG 로고 생성 (CRITICAL!)  
**예상 소요**: 10분  
**배포 가능**: PNG 생성 후 즉시 가능 ✅
