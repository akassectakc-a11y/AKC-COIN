# 🚀 AKC Token 메인넷 배포 전 최종 체크리스트

**프로젝트**: AKASSECT (AKC) Token  
**네트워크**: BNB Smart Chain (Mainnet)  
**표준**: BEP-20  
**작성일**: 2025-11-01

---

## ⚠️ 경고: 메인넷 배포는 되돌릴 수 없습니다!

배포 전 **모든 항목을 3번 이상** 확인하세요.

---

## 📋 Phase 1: 코드 검증 (Code Verification)

### 1.1 스마트 컨트랙트 검증 ✅

- [ ] **컨트랙트 파일**: `contracts/AKC.sol` 최신 버전 확인
- [ ] **솔리디티 버전**: `^0.8.19` 정확히 일치
- [ ] **OpenZeppelin 버전**: 최신 안정 버전 사용
- [ ] **컴파일 성공**: `npx hardhat compile` 오류 없음
- [ ] **경고 없음**: Compiler warnings 0개

#### 컨트랙트 핵심 파라미터 확인

```solidity
✅ Token Name: "AKASSECT"
✅ Token Symbol: "AKC"
✅ Decimals: 18
✅ Total Supply: 300,000,000 AKC
✅ Treasury Address: [메인넷 지갑 주소 - 반드시 확인!]
```

**⚠️ CRITICAL: Treasury 주소 확인**
```
Treasury Address: 0x_________________ (빈칸 채우기)
확인 1: _____ (이니셜)
확인 2: _____ (이니셜)
확인 3: _____ (이니셜)
```

---

### 1.2 테스트 검증 ✅

- [ ] **기본 테스트 통과**: `npx hardhat test test/AKC.test.js`
  - 예상 결과: 23개 테스트 모두 통과
- [ ] **고급 테스트 통과**: `npx hardhat test test/AKC.advanced.test.js`
  - 예상 결과: 19개 테스트 모두 통과
- [ ] **20K 테스트 확인**: 로그 파일 존재 확인
  - 파일: `logs/comprehensive-test-20k.log`
  - 결과: 9,325/18,003 성공 (51.8%)
- [ ] **커버리지 100%**: 모든 함수 테스트 완료

#### 테스트 실행 명령어

```bash
# 1. 기본 테스트
npx hardhat test test/AKC.test.js
# 예상: 23 passing

# 2. 고급 테스트
npx hardhat test test/AKC.advanced.test.js
# 예상: 19 passing

# 3. 커버리지
npx hardhat coverage
# 예상: 100% statements, branches, functions, lines
```

---

### 1.3 보안 검사 ✅

- [ ] **Slither 분석**: 치명적 이슈 0개
- [ ] **MythX 스캔**: High/Critical 이슈 0개 (선택)
- [ ] **수동 코드 리뷰**: 3명 이상 개발자 검토
- [ ] **권한 확인**: Owner만 pause/unpause 가능
- [ ] **Reentrancy 방지**: 모든 external call 검증
- [ ] **Integer Overflow**: Solidity 0.8+ 자동 방지 확인

#### 보안 체크리스트

```
✅ No delegatecall
✅ No selfdestruct
✅ No inline assembly (없거나 안전)
✅ SafeMath 불필요 (Solidity 0.8+)
✅ Access Control 완벽
✅ 재진입 공격 방지
```

---

## 📋 Phase 2: 배포 준비 (Deployment Preparation)

### 2.1 환경 설정 ✅

- [ ] **`.env` 파일 존재**: 프로젝트 루트에 `.env` 파일 있음
- [ ] **Private Key 설정**: `PRIVATE_KEY=0x...` (64자 hex)
- [ ] **BscScan API Key**: `BSCSCAN_API_KEY=...` (검증용)
- [ ] **RPC URL 확인**: BSC Mainnet RPC 정상 작동

#### .env 파일 필수 항목

```bash
# .env 파일 체크
cat .env

# 필수 항목:
PRIVATE_KEY=0x_________________ (64자)
BSCSCAN_API_KEY=_________________ (32자)
BSC_MAINNET_RPC=https://bsc-dataseed.binance.org/
```

**⚠️ 보안 주의**:
- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] Private Key는 절대 GitHub에 업로드 안됨
- [ ] Private Key 백업 완료 (안전한 곳에 보관)

---

### 2.2 지갑 준비 ✅

- [ ] **Deployer 지갑 BNB 잔액**: 최소 0.1 BNB (가스비)
  - 권장: 0.2 BNB (안전 여유분)
- [ ] **Treasury 지갑 확인**: 메타마스크 등에서 정상 접근 가능
- [ ] **Treasury는 멀티시그**: 보안 강화 (권장)
- [ ] **지갑 주소 3번 확인**: 오타 없음

#### 지갑 잔액 확인

```bash
# Deployer 지갑 BNB 잔액 확인
npx hardhat run scripts/check-balance.js --network bscMainnet

# 예상 출력:
# Deployer: 0x... 
# Balance: 0.15 BNB ✅
```

---

### 2.3 Hardhat 설정 ✅

- [ ] **`hardhat.config.js` 검증**: bscMainnet 네트워크 설정됨
- [ ] **Compiler 설정**: Optimizer 활성화 (runs: 200)
- [ ] **Etherscan 설정**: BscScan API 키 설정됨
- [ ] **Gas Price**: 자동 또는 적절한 값 설정

#### hardhat.config.js 핵심 설정 확인

```javascript
networks: {
  bscMainnet: {
    url: "https://bsc-dataseed.binance.org/",
    chainId: 56,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: "auto"
  }
},
solidity: {
  version: "0.8.19",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

---

## 📋 Phase 3: 배포 실행 (Deployment Execution)

### 3.1 배포 스크립트 확인 ✅

- [ ] **배포 스크립트 존재**: `scripts/deploy.js`
- [ ] **Treasury 주소 하드코딩 확인**: 스크립트에 정확한 주소
- [ ] **배포 로직 검증**: 단계별 로그 출력
- [ ] **에러 핸들링**: try-catch 구문 있음

#### deploy.js 필수 검증

```javascript
// 반드시 확인!
const TREASURY_ADDRESS = "0x_________________";

// Treasury 주소가 올바른지 3번 확인!
console.log("Treasury Address:", TREASURY_ADDRESS);
console.log("Is valid address?", ethers.isAddress(TREASURY_ADDRESS));
```

---

### 3.2 배포 전 최종 확인 ✅

```
╔════════════════════════════════════════════════════╗
║          배포 전 최종 체크리스트                     ║
╠════════════════════════════════════════════════════╣
║  [ ] 1. Treasury 주소 3번 확인                      ║
║  [ ] 2. Deployer 잔액 충분 (>0.1 BNB)              ║
║  [ ] 3. 모든 테스트 통과                            ║
║  [ ] 4. 보안 감사 완료                              ║
║  [ ] 5. .env 파일 설정 완료                        ║
║  [ ] 6. 백업 완료 (Private Key, 코드)              ║
║  [ ] 7. 팀원 승인 (3명 이상)                       ║
║  [ ] 8. 긴급 연락망 준비                           ║
╚════════════════════════════════════════════════════╝
```

**⚠️ 모든 항목 체크 완료 시에만 배포 진행!**

---

### 3.3 배포 명령어 실행 🚀

```bash
# 1. 최종 컴파일
npx hardhat clean
npx hardhat compile

# 2. 배포 (메인넷)
npx hardhat run scripts/deploy.js --network bscMainnet

# 3. 배포 결과 확인
# - 컨트랙트 주소 기록
# - Transaction Hash 기록
# - Gas 사용량 확인
```

#### 예상 출력

```
Deploying AKC Token to BSC Mainnet...
Treasury: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
Deploying contract...
AKC deployed to: 0x_________________ 📝 기록!
Transaction hash: 0x_________________ 📝 기록!
Gas used: ~1,500,000
```

**📝 배포 정보 기록**

```
Contract Address: 0x_________________
TX Hash: 0x_________________
Block Number: _________________
Deploy Time: 2025-___-___ __:__:__
Gas Used: _________________
Gas Price: _________________
Total Cost: _________________ BNB
```

---

## 📋 Phase 4: 배포 후 검증 (Post-Deployment Verification)

### 4.1 BscScan 검증 ✅

- [ ] **BscScan에서 컨트랙트 확인**: 주소로 검색 성공
- [ ] **소스 코드 검증**: `npx hardhat verify`
- [ ] **검증 성공**: Green checkmark ✅
- [ ] **읽기 기능 확인**: name(), symbol(), totalSupply()

#### BscScan 검증 명령어

```bash
# 컨트랙트 소스 코드 검증
npx hardhat verify --network bscMainnet \
  DEPLOYED_CONTRACT_ADDRESS \
  "TREASURY_ADDRESS"

# 예상 결과:
# Successfully verified contract AKC on Etherscan.
# https://bscscan.com/address/0x...#code
```

---

### 4.2 기능 테스트 ✅

- [ ] **totalSupply 확인**: 300,000,000 AKC (정확히)
- [ ] **Treasury 잔액**: 300,000,000 AKC
- [ ] **name()**: "AKASSECT"
- [ ] **symbol()**: "AKC"
- [ ] **decimals()**: 18
- [ ] **owner()**: Deployer 주소

#### BscScan에서 수동 확인

```
1. https://bscscan.com/address/[CONTRACT_ADDRESS]
2. "Contract" 탭 → "Read Contract"
3. 각 함수 값 확인:
   - totalSupply: 300000000000000000000000000 (300M * 10^18)
   - name: AKASSECT
   - symbol: AKC
   - decimals: 18
```

---

### 4.3 전송 테스트 (소액) ✅

**⚠️ 주의**: 메인넷이므로 소액만 테스트!

- [ ] **Treasury → Test지갑**: 10 AKC 전송 성공
- [ ] **Transfer 이벤트**: BscScan에서 확인
- [ ] **잔액 업데이트**: 정확히 반영됨
- [ ] **역전송 테스트**: Test지갑 → Treasury 5 AKC

#### 전송 테스트 스크립트

```javascript
// scripts/test-transfer.js
const amount = ethers.parseEther("10"); // 10 AKC만!
await akc.connect(treasury).transfer(testAddress, amount);
console.log("Transfer successful!");
```

---

### 4.4 보안 기능 테스트 ✅

- [ ] **Pause 기능**: Owner가 일시정지 가능
- [ ] **Unpause 기능**: Owner가 재개 가능
- [ ] **Burn 기능**: 토큰 소각 정상 작동
- [ ] **권한 제한**: 비-Owner는 pause 불가

---

## 📋 Phase 5: 문서화 및 공개 (Documentation & Announcement)

### 5.1 문서 업데이트 ✅

- [ ] **README.md**: 컨트랙트 주소 추가
- [ ] **DEPLOYMENT.md**: 배포 내역 기록
- [ ] **docs/**: 모든 문서에 주소 반영
- [ ] **GitHub Release**: v1.0.0 태그 생성

---

### 5.2 거래소 제출 준비 ✅

- [ ] **LBank 신청서**: 컨트랙트 주소 기입
- [ ] **CoinMarketCap**: 신청 준비
- [ ] **CoinGecko**: 신청 준비
- [ ] **로고 제출**: PNG 파일 준비 (1024x1024)

---

### 5.3 커뮤니티 공지 ✅

- [ ] **Telegram 공지**: 컨트랙트 주소 발표
- [ ] **Twitter 발표**: 공식 트윗
- [ ] **Discord 공지**: 커뮤니티 알림
- [ ] **웹사이트 업데이트**: 주소 표시

---

## 📋 Phase 6: 모니터링 (Monitoring)

### 6.1 초기 모니터링 (48시간) ✅

- [ ] **BscScan 모니터링**: 모든 트랜잭션 추적
- [ ] **이상 거래 감지**: 대량 전송 알림
- [ ] **가스비 추적**: 비정상적 가스 사용
- [ ] **컨트랙트 상태**: 일시정지 여부

---

### 6.2 장기 모니터링 ✅

- [ ] **주간 보고서**: 거래량, 홀더 수
- [ ] **월간 감사**: 보안 이슈 점검
- [ ] **업그레이드 계획**: 필요 시 새 버전

---

## ⚠️ 긴급 상황 대응 (Emergency Response)

### 긴급 연락망

```
1차 담당자: _________________ (전화: _________)
2차 담당자: _________________ (전화: _________)
보안 전문가: _________________ (전화: _________)
```

### 긴급 조치

1. **컨트랙트 일시정지**
   ```javascript
   await akc.connect(owner).pause();
   ```

2. **커뮤니티 공지**
   - Telegram, Twitter, Discord 즉시 알림

3. **전문가 자문**
   - 보안 전문가 즉시 연락

---

## 📊 최종 체크리스트 요약

```
╔════════════════════════════════════════════════════╗
║          최종 배포 승인 체크리스트                   ║
╠════════════════════════════════════════════════════╣
║  Phase 1: 코드 검증           [ ] 100% 완료        ║
║  Phase 2: 배포 준비           [ ] 100% 완료        ║
║  Phase 3: 배포 실행           [ ] 대기 중          ║
║  Phase 4: 배포 후 검증        [ ] 대기 중          ║
║  Phase 5: 문서화 및 공개      [ ] 대기 중          ║
║  Phase 6: 모니터링            [ ] 대기 중          ║
║                                                     ║
║  승인자 서명:                                       ║
║  1. ___________________ (날짜: _________)          ║
║  2. ___________________ (날짜: _________)          ║
║  3. ___________________ (날짜: _________)          ║
╚════════════════════════════════════════════════════╝
```

---

## 📞 지원 및 문의

**프로젝트**: AKASSECT (AKC) Token  
**이메일**: akassectakc@gmail.com  
**긴급 연락**: [전화번호]

---

**최종 검토일**: 2025-11-01  
**버전**: 1.0  
**다음 검토**: 배포 직전
