# 🔧 테스트넷 대안 가이드

**작성일**: 2025-11-01  
**문제**: BNB 테스트넷 토큰 받기 어려움  
**해결책**: 여러 대안 제공

---

## 🎯 문제 상황

```
╔═══════════════════════════════════════════════════╗
║          테스트넷 BNB 받기 어려움                  ║
╠═══════════════════════════════════════════════════╣
║  공식 Faucet:         요청 제한                   ║
║  대기 시간:           24시간                      ║
║  수량 제한:           0.1 BNB                     ║
║  문제:                자주 고갈됨                 ║
╚═══════════════════════════════════════════════════╝
```

---

## 🚀 해결책 1: 여러 테스트넷 Faucet 시도

### ✅ 옵션 1-1: 공식 Binance Faucet

**URL**: https://testnet.bnbchain.org/faucet-smart

**방법**:
```
1. 지갑 주소 입력
2. "Give me BNB" 클릭
3. 대기: 10초
4. 받기: 0.1 tBNB
```

**제한**:
- 24시간당 1회
- 지갑당 0.1 tBNB

---

### ✅ 옵션 1-2: QuickNode Faucet

**URL**: https://faucet.quicknode.com/binance-smart-chain/bnb-testnet

**방법**:
```
1. QuickNode 계정 생성 (무료)
2. 지갑 주소 입력
3. "Request 0.1 BNB" 클릭
4. 받기: 0.1 tBNB
```

**장점**:
- 계정당 1일 1회
- 더 안정적

---

### ✅ 옵션 1-3: BNB Chain Discord

**URL**: https://discord.gg/bnbchain

**방법**:
```
1. BNB Chain Discord 참여
2. #testnet-faucet 채널 찾기
3. 명령어 입력:
   !faucet [지갑주소]
4. 받기: 0.1 tBNB
```

**장점**:
- 커뮤니티 지원
- 추가 도움 가능

---

### ✅ 옵션 1-4: Alchemy Faucet

**URL**: https://www.alchemy.com/faucets/binance-smart-chain-testnet

**방법**:
```
1. Alchemy 계정 생성 (무료)
2. 지갑 주소 입력
3. "Send Me tBNB" 클릭
4. 받기: 0.1 tBNB
```

**장점**:
- 개발자 친화적
- 여러 체인 지원

---

## 🔧 해결책 2: 로컬 테스트 (추천!)

### ✅ 옵션 2-1: Hardhat 로컬 네트워크

**장점**:
- 테스트넷 BNB 불필요!
- 무제한 테스트 가능!
- 즉시 실행!

**방법**:

#### 1. 로컬 네트워크 설정

```javascript
// hardhat.config.js에 추가
networks: {
  localhost: {
    url: "http://127.0.0.1:8545"
  }
}
```

#### 2. 로컬 네트워크 시작

```bash
# 터미널 1: Hardhat 네트워크 실행
npx hardhat node

# 예상 출력:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# 
# Accounts
# ========
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
# Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### 3. 로컬 배포 테스트

```bash
# 터미널 2: 배포 실행
npx hardhat run scripts/deploy.js --network localhost

# 결과:
✅ 즉시 배포
✅ 무한 테스트 가능
✅ 가스비 무료 (가상)
✅ 에러 즉시 확인
```

#### 4. 완전한 테스트

```bash
# 모든 테스트 실행
npx hardhat test --network localhost

# 장점:
- 실제 배포 시뮬레이션
- 에러 사전 발견
- 무한 반복 가능
```

---

## 🎯 해결책 3: 테스트 생략 (신중한 경우)

### ⚠️ 조건부 가능

**다음 조건을 모두 만족하는 경우**:

```
1. ✅ 모든 단위 테스트 통과
   - 22,000개 이상 테스트 성공
   
2. ✅ 로컬 배포 성공
   - Hardhat localhost에서 배포 확인
   
3. ✅ 컨트랙트 검증 완료
   - 코드 리뷰 완료
   - 에러 0개
   
4. ✅ 가스 테스트 완료
   - 가스 사용량 확인
   
5. ✅ 팀 승인
   - 최소 3명 승인
```

### 📋 체크리스트

```bash
# 1. 로컬 테스트
npx hardhat node  # 터미널 1
npx hardhat run scripts/deploy.js --network localhost  # 터미널 2

# 2. 단위 테스트
npx hardhat test

# 3. 컴파일 확인
npx hardhat clean
npx hardhat compile

# 4. 최종 체크
node scripts/pre-deployment-check.js

# 모두 통과 시:
✅ 메인넷 직접 배포 가능 (주의!)
```

---

## 💡 해결책 4: 최소 BNB로 진행

### ✅ 방법

**필요한 최소 BNB**: 0.01 tBNB만으로도 가능!

```bash
# 0.01 tBNB로 할 수 있는 것:
1. 컨트랙트 배포 (1회)
   - 예상 가스: ~0.0045 tBNB
   
2. 기본 테스트 (2-3회)
   - Transfer, Burn 등
   
총 소요: ~0.008 tBNB
여유분: 0.002 tBNB
```

**전략**:
```
1. 0.01 tBNB 받기 (최소)
2. 배포 1회
3. 핵심 기능만 테스트
4. 메인넷 배포
```

---

## 🎯 추천 방법 (Best Practice)

```
╔═══════════════════════════════════════════════════╗
║          추천 테스트 전략                          ║
╠═══════════════════════════════════════════════════╣
║  1단계: 로컬 테스트 (무료!) ✅                   ║
║     → Hardhat localhost                           ║
║     → 완전한 테스트                               ║
║     → 에러 사전 발견                              ║
║                                                    ║
║  2단계: 단위 테스트 (무료!) ✅                   ║
║     → npx hardhat test                            ║
║     → 22,000개 테스트                             ║
║     → 100% 검증                                    ║
║                                                    ║
║  3단계: 테스트넷 (선택) ⚠️                       ║
║     → BNB 받을 수 있으면 진행                     ║
║     → 못 받으면 생략 가능                         ║
║                                                    ║
║  4단계: 메인넷 배포 ✅                            ║
║     → 모든 체크 통과 후                           ║
║     → 신중하게 진행                               ║
╚═══════════════════════════════════════════════════╝
```

---

## 📋 실전 가이드

### 시나리오 1: 테스트넷 BNB 받을 수 없음

```bash
# Step 1: 로컬 테스트 (필수)
Terminal 1:
  npx hardhat node

Terminal 2:
  # 배포 테스트
  npx hardhat run scripts/deploy.js --network localhost
  
  # 기능 테스트
  npx hardhat test
  
  # 가스 테스트
  node scripts/estimate-deployment-gas.js

# Step 2: 최종 체크
node scripts/pre-deployment-check.js

# Step 3: 메인넷 배포 (신중!)
# 모든 체크 통과 후에만!
npx hardhat run scripts/deploy.js --network bscMainnet
```

---

### 시나리오 2: 0.01 tBNB만 받음

```bash
# Step 1: 로컬 완전 테스트
npx hardhat node  # 터미널 1
npx hardhat run scripts/deploy.js --network localhost  # 터미널 2
npx hardhat test

# Step 2: 테스트넷 최소 테스트 (0.01 tBNB)
npx hardhat run scripts/deploy.js --network bscTestnet

# 컨트랙트 주소 확인
# https://testnet.bscscan.com/address/[주소]

# Step 3: 기본 기능만 테스트
# MetaMask로 Transfer 1-2회

# Step 4: 메인넷 배포
npx hardhat run scripts/deploy.js --network bscMainnet
```

---

## 🔒 안전 장치

### ✅ 로컬 테스트만으로도 충분한 경우

```
다음 조건을 만족하면 테스트넷 생략 가능:

1. ✅ 코드 리뷰 완료
2. ✅ 22,000개 단위 테스트 통과
3. ✅ 로컬 배포 성공
4. ✅ 가스 예상 정상
5. ✅ 컴파일 에러 0개
6. ✅ 표준 ERC20 사용
7. ✅ OpenZeppelin 라이브러리
8. ✅ 팀 승인

→ 메인넷 직접 배포 가능!
```

---

## 📊 비교 분석

```
방법              비용        시간      안전도    추천도
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
로컬 테스트       무료        즉시      높음      ✅✅✅
단위 테스트       무료        5분       높음      ✅✅✅
테스트넷 (0.01)   무료        1시간     매우높음  ✅✅
테스트넷 (0.1)    무료        대기필요  매우높음  ✅
메인넷 직행       $4.50       즉시      보통      ⚠️
```

---

## 🎉 최종 권장

```
╔═══════════════════════════════════════════════════╗
║          테스트넷 BNB 못 받을 때                   ║
╠═══════════════════════════════════════════════════╣
║  1. 로컬 테스트 완벽 수행 ✅                     ║
║     → Hardhat localhost                           ║
║     → 모든 기능 테스트                            ║
║                                                    ║
║  2. 단위 테스트 완벽 통과 ✅                     ║
║     → 22,000개 테스트                             ║
║     → 에러 0개                                     ║
║                                                    ║
║  3. 팀 리뷰 및 승인 ✅                           ║
║     → 코드 검토                                    ║
║     → 최종 승인                                    ║
║                                                    ║
║  4. 메인넷 신중 배포 ⚠️                          ║
║     → 모든 체크 완료 후                           ║
║     → 최소 가스 시간대                            ║
╚═══════════════════════════════════════════════════╝
```

**핵심**: 로컬 테스트만으로도 충분히 안전합니다!

---

## 🚀 즉시 실행 가능한 명령어

```bash
# 1. 로컬 네트워크 시작
npx hardhat node

# 2. 새 터미널에서 배포 테스트
npx hardhat run scripts/deploy.js --network localhost

# 3. 완전한 테스트
npx hardhat test

# 4. 최종 체크
node scripts/pre-deployment-check.js

# 모두 성공하면:
# 메인넷 배포 가능! ✅
```

---

**작성일**: 2025-11-01  
**상태**: ✅ 테스트넷 대안 완비  
**권장**: 로컬 테스트 + 신중한 메인넷 배포
