# ✅ AKC Token 완전 검증 체크리스트

**프로젝트**: AKASSECT (AKC) Token  
**검증 날짜**: 2025-11-01  
**검증자**: _____________  
**승인자**: _____________

---

## 📋 사용 방법

```
1. 각 항목을 순서대로 확인
2. 체크박스 [ ]를 [x]로 변경
3. 문제 발견 시 즉시 기록
4. 모든 항목 완료 후 서명
5. 3명 이상 독립적으로 검증
```

---

## 🔍 Section 1: 스마트 컨트랙트 코드 검증

### 1.1 컨트랙트 파일 존재 및 내용

- [ ] `contracts/AKC.sol` 파일 존재
- [ ] Solidity 버전: `^0.8.19`
- [ ] License: MIT
- [ ] Contract name: `AKC`
- [ ] Inherits: ERC20, ERC20Burnable, Pausable, Ownable

### 1.2 토큰 파라미터

```
검증 항목:
- [ ] Token Name: "AKASSECT" (정확히 일치)
- [ ] Token Symbol: "AKC" (정확히 일치)
- [ ] Decimals: 18
- [ ] Total Supply: 300,000,000 AKC
- [ ] Total Supply (wei): 300000000000000000000000000

계산 확인:
300,000,000 * 10^18 = 300,000,000,000,000,000,000,000,000
✅ 맞음 / ❌ 틀림
```

### 1.3 주석 및 문서

- [ ] NatSpec 주석 완전
- [ ] @title 존재
- [ ] @dev 설명 존재
- [ ] @notice 설명 존재
- [ ] @param 모두 문서화
- [ ] **⚠️ "INFINIBIT" 텍스트 제거됨** (Critical!)

```solidity
// 확인 필수:
@notice 내용이 "AKASSECT" 또는 "AI-powered payment gateway"인지 확인

현재 내용: _________________________
✅ 올바름 / ❌ 수정 필요
```

### 1.4 컴파일 검증

```bash
# 명령어 실행:
npx hardhat clean
npx hardhat compile

결과:
- [ ] 컴파일 성공
- [ ] Warning 0개
- [ ] Error 0개
- [ ] Artifacts 생성됨
```

---

## 🧪 Section 2: 테스트 검증

### 2.1 기본 테스트 (23개)

```bash
npx hardhat test test/AKC.test.js
```

- [ ] 23 passing
- [ ] 0 failing
- [ ] 실행 시간 < 5초

### 2.2 고급 테스트 (19개)

```bash
npx hardhat test test/AKC.advanced.test.js
```

- [ ] 19 passing
- [ ] 0 failing
- [ ] 실행 시간 < 10초

### 2.3 커버리지 테스트

```bash
npx hardhat coverage
```

- [ ] Statements: 100%
- [ ] Branches: 100%
- [ ] Functions: 100%
- [ ] Lines: 100%

### 2.4 20K 종합 테스트 결과 확인

- [ ] `logs/comprehensive-test-20k.log` 존재
- [ ] `logs/test-statistics.json` 존재
- [ ] `logs/TEST-REPORT-20K.md` 존재
- [ ] 총 테스트: 18,003개
- [ ] 핵심 기능 100% 통과 확인

```
핵심 기능 통과율:
- 소액 전송: _____% (100% 기대)
- 중액 전송: _____% (100% 기대)
- 대액 전송: _____% (100% 기대)
- 에러 처리: _____% (100% 기대)
```

---

## 🔒 Section 3: 보안 검증

### 3.1 코드 보안

- [ ] No delegatecall
- [ ] No selfdestruct
- [ ] No inline assembly (또는 안전 확인)
- [ ] Access control 완벽
- [ ] Reentrancy 공격 방지
- [ ] Integer overflow/underflow 방지 (Solidity 0.8+)

### 3.2 권한 관리

- [ ] Owner만 pause() 가능
- [ ] Owner만 unpause() 가능
- [ ] transferOwnership() 기능 확인
- [ ] renounceOwnership() 주의사항 이해

### 3.3 OpenZeppelin 라이브러리

```bash
# package.json 확인
cat package.json | grep "@openzeppelin/contracts"
```

- [ ] @openzeppelin/contracts 최신 안정 버전
- [ ] 버전: _______________
- [ ] 취약점 없음 (npm audit 확인)

---

## 📦 Section 4: 배포 설정 검증

### 4.1 환경 변수 (.env)

- [ ] `.env` 파일 존재
- [ ] `PRIVATE_KEY` 설정됨 (64자 hex)
- [ ] `BSCSCAN_API_KEY` 설정됨
- [ ] `BSC_MAINNET_RPC` URL 정상

```bash
# .env 검증 (실제 키는 표시하지 않음)
cat .env | grep -E "PRIVATE_KEY|BSCSCAN_API_KEY|BSC_MAINNET_RPC"
```

- [ ] PRIVATE_KEY 길이: 66자 (0x 포함)
- [ ] BSCSCAN_API_KEY 존재
- [ ] RPC URL: https://bsc-dataseed.binance.org/

### 4.2 hardhat.config.js

- [ ] bscMainnet 네트워크 설정
- [ ] chainId: 56
- [ ] Optimizer enabled: true
- [ ] Optimizer runs: 200
- [ ] etherscan apiKey 설정

```javascript
// 확인:
networks: {
  bscMainnet: {
    url: "...",
    chainId: 56,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### 4.3 배포 스크립트 (scripts/deploy.js)

- [ ] `scripts/deploy.js` 존재
- [ ] Treasury 주소 **하드코딩** 확인
- [ ] Treasury 주소 3번 확인됨

```javascript
// 🔥 Critical: Treasury 주소 확인
const TREASURY_ADDRESS = "0x_________________________";

확인 1: _____ (이니셜) _____ (날짜)
확인 2: _____ (이니셜) _____ (날짜)
확인 3: _____ (이니셜) _____ (날짜)

- [ ] 주소 형식 올바름 (0x + 40자)
- [ ] ethers.isAddress() 통과
- [ ] 실제 소유한 지갑 주소
```

---

## 💰 Section 5: 지갑 준비

### 5.1 Deployer 지갑

- [ ] Private Key 백업 완료
- [ ] Private Key 안전한 곳에 보관
- [ ] BNB 잔액 확인: _______ BNB
- [ ] BNB 잔액 > 0.1 BNB (필수)
- [ ] BNB 잔액 > 0.2 BNB (권장)

```bash
# 잔액 확인
npx hardhat run scripts/check-balance.js --network bscMainnet

결과: _______ BNB
```

### 5.2 Treasury 지갑

- [ ] Treasury 지갑 접근 가능 (MetaMask 등)
- [ ] 주소 올바름
- [ ] Multisig 고려 (권장)
- [ ] 백업 완료

---

## 🎨 Section 6: 로고 및 브랜딩

### 6.1 SVG 파일

- [ ] `docs/logo/AKC-Logo.svg` 존재 (1.6 KB)
- [ ] `docs/logo/AKC-Icon.svg` 존재 (464 bytes)
- [ ] SVG 파일 정상 렌더링
- [ ] 색상: Black (#000000), Gold (#FFD700)

### 6.2 PNG 파일 생성

```
필요한 PNG 파일:
- [ ] AKC-Logo-1024.png (LBank)
- [ ] AKC-Logo-512.png (표준)
- [ ] AKC-Icon-256.png (아이콘)
- [ ] AKC-Icon-200.png (CMC/CG)
- [ ] AKC-Icon-128.png (앱)
- [ ] AKC-Icon-64.png
- [ ] AKC-Icon-32.png (파비콘)
- [ ] AKC-Icon-16.png (파비콘)
```

생성 명령어:
```bash
cd docs/logo
bash generate-pngs.sh
# 또는 수동 생성 (PNG-GENERATION-GUIDE.md 참고)
```

- [ ] 모든 PNG 생성 완료
- [ ] 파일 크기 < 500KB
- [ ] 투명도 확인
- [ ] 선명도 확인

### 6.3 미리보기 확인

- [ ] `docs/logo/logo-preview.html` 열기
- [ ] 모든 배경에서 선명
- [ ] 모든 크기에서 정상

---

## 📄 Section 7: 문서 검증

### 7.1 필수 문서 존재

- [ ] `README.md`
- [ ] `docs/logo/AKC-LOGO-SPECIFICATION.md`
- [ ] `docs/logo/README.md`
- [ ] `docs/whitepaper/en/` 디렉터리
- [ ] `docs/lbank/` 디렉터리
- [ ] `docs/mainnet/MAINNET-DEPLOYMENT-CHECKLIST.md`
- [ ] `docs/mainnet/COINMARK-PREPARATION-GUIDE.md`
- [ ] `docs/mainnet/DEPLOYMENT-ISSUE-ANALYSIS.md`
- [ ] `docs/mainnet/COMPLETE-VERIFICATION-CHECKLIST.md` (본 파일)

### 7.2 문서 내용 확인

- [ ] 모든 문서에서 "INFINIBIT" 제거됨
- [ ] 도메인 일관성 (akc.ainovas.org 또는 대체)
- [ ] 이메일 일관성 (akassectakc@gmail.com)
- [ ] 컨트랙트 주소 placeholder 존재
- [ ] 배포 후 주소 업데이트 계획 있음

---

## 🌐 Section 8: 웹사이트 및 도메인

### 8.1 도메인 확인

```bash
# 도메인 접근 테스트
curl -I https://akc.ainovas.org

결과:
- [ ] HTTP 200 OK
- [ ] HTTPS 인증서 유효
- [ ] 웹사이트 정상 로딩
```

### 8.2 웹사이트 내용

- [ ] 프로젝트 소개 페이지
- [ ] 백서 링크
- [ ] 로드맵
- [ ] 팀 소개
- [ ] 컨트랙트 주소 표시 위치 준비
- [ ] 소셜 미디어 링크

---

## 🏦 Section 9: 거래소 제출 준비

### 9.1 LBank 준비

```
필요 파일:
- [ ] AKC-Logo-1024.png
- [ ] AKC-Icon-256.png
- [ ] 백서 PDF
- [ ] 법인 등록증
- [ ] KYC 문서
- [ ] 로고 사양서
```

### 9.2 CoinMarketCap 준비

- [ ] logo.png (200x200, <100KB)
- [ ] 컨트랙트 주소 (배포 후)
- [ ] Explorer 링크 (배포 후)
- [ ] 공식 웹사이트
- [ ] 소셜 미디어 링크

### 9.3 CoinGecko 준비

- [ ] logo.png (200x200, <100KB)
- [ ] 컨트랙트 주소 (배포 후)
- [ ] 프로젝트 설명
- [ ] 공식 웹사이트

---

## 🚀 Section 10: 배포 전 최종 확인

### 10.1 코드 최종 점검

```
- [ ] Git 상태 Clean
- [ ] 모든 변경사항 커밋됨
- [ ] 최신 코드 Pull 받음
- [ ] 백업 완료 (코드 + Private Key)
```

### 10.2 네트워크 확인

```bash
# BSC Mainnet RPC 테스트
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://bsc-dataseed.binance.org/

결과:
- [ ] 정상 응답
- [ ] 최신 블록 번호 받음
```

### 10.3 가스비 확인

```bash
# 현재 가스 가격 확인
npx hardhat run scripts/check-gas-price.js --network bscMainnet

결과:
- [ ] Gas Price: _______ Gwei
- [ ] 예상 배포 비용: _______ BNB
```

---

## ✅ Section 11: 배포 실행 체크

### 11.1 배포 전 마지막 확인

```
╔════════════════════════════════════════════════════╗
║          배포 전 최종 확인                          ║
╠════════════════════════════════════════════════════╣
║  [ ] 1. Treasury 주소 3번 확인 완료                ║
║  [ ] 2. Deployer 잔액 충분 (>0.1 BNB)             ║
║  [ ] 3. 모든 테스트 통과                           ║
║  [ ] 4. 보안 검증 완료                             ║
║  [ ] 5. 문서화 완료                                ║
║  [ ] 6. 로고 PNG 생성 완료                         ║
║  [ ] 7. 백업 완료                                  ║
║  [ ] 8. 팀원 승인 (3명 이상)                       ║
║  [ ] 9. 긴급 연락망 준비                           ║
║  [ ] 10. 롤백 계획 수립                            ║
╚════════════════════════════════════════════════════╝
```

### 11.2 배포 명령어 준비

```bash
# 1. 최종 컴파일
npx hardhat clean
npx hardhat compile

# 2. 배포 (메인넷)
npx hardhat run scripts/deploy.js --network bscMainnet
```

- [ ] 명령어 준비됨
- [ ] 터미널 대기 중
- [ ] 출력 로그 캡처 준비

---

## 📝 Section 12: 배포 후 검증

### 12.1 배포 정보 기록

```
컨트랙트 주소: 0x_________________________
TX Hash: 0x_________________________
Block Number: _________________________
Deploy Time: _________________________
Gas Used: _________________________
Total Cost: _________________________ BNB
```

### 12.2 BscScan 검증

```bash
# 소스 코드 검증
npx hardhat verify --network bscMainnet \
  [CONTRACT_ADDRESS] \
  "[TREASURY_ADDRESS]"
```

- [ ] 검증 성공
- [ ] Green checkmark ✅
- [ ] 소스 코드 표시됨

### 12.3 기능 테스트

```
BscScan에서 확인:
- [ ] totalSupply(): 300000000000000000000000000
- [ ] name(): "AKASSECT"
- [ ] symbol(): "AKC"
- [ ] decimals(): 18
- [ ] balanceOf(treasury): 300000000000000000000000000
```

### 12.4 전송 테스트 (소액!)

- [ ] Treasury → Test지갑: 10 AKC 전송
- [ ] Transfer 이벤트 확인
- [ ] 잔액 업데이트 확인
- [ ] 역전송 테스트: 5 AKC

---

## 📊 Section 13: 최종 승인

### 13.1 검증자 서명

```
검증자 1:
이름: _________________________
직책: _________________________
서명: _________________________
날짜: _________________________

검증자 2:
이름: _________________________
직책: _________________________
서명: _________________________
날짜: _________________________

검증자 3:
이름: _________________________
직책: _________________________
서명: _________________________
날짜: _________________________
```

### 13.2 최종 승인

```
╔════════════════════════════════════════════════════╗
║          최종 배포 승인                             ║
╠════════════════════════════════════════════════════╣
║  모든 섹션 완료:  [ ] YES / [ ] NO                 ║
║  Critical 이슈:   [ ] 0개 / [ ] ___개              ║
║  High 이슈:       [ ] 0개 / [ ] ___개              ║
║                                                     ║
║  배포 승인:       [ ] 승인 / [ ] 거부              ║
║                                                     ║
║  승인자 서명: _____________________                ║
║  날짜: _____________________                       ║
╚════════════════════════════════════════════════════╝
```

---

## 🚨 Section 14: 긴급 상황 대응

### 14.1 긴급 연락망

```
1차 담당자:
  이름: _________________________
  전화: _________________________
  이메일: _________________________

2차 담당자:
  이름: _________________________
  전화: _________________________
  이메일: _________________________

보안 전문가:
  이름: _________________________
  전화: _________________________
  이메일: _________________________
```

### 14.2 긴급 조치 절차

```
1. 즉시 컨트랙트 일시정지
   await akc.connect(owner).pause();

2. 팀 소집 (15분 이내)

3. 커뮤니티 공지 (30분 이내)
   - Telegram
   - Twitter
   - Discord

4. 전문가 자문 (1시간 이내)

5. 문제 분석 및 해결책 수립

6. 투명한 사후 보고서 작성
```

---

## 📈 Section 15: 진행 상황 요약

```
╔════════════════════════════════════════════════════╗
║          완료 진행률                                ║
╠════════════════════════════════════════════════════╣
║  Section 1:  스마트 컨트랙트     [    ] %          ║
║  Section 2:  테스트              [    ] %          ║
║  Section 3:  보안                [    ] %          ║
║  Section 4:  배포 설정           [    ] %          ║
║  Section 5:  지갑                [    ] %          ║
║  Section 6:  로고                [    ] %          ║
║  Section 7:  문서                [    ] %          ║
║  Section 8:  웹사이트            [    ] %          ║
║  Section 9:  거래소 준비         [    ] %          ║
║  Section 10: 최종 확인           [    ] %          ║
║  Section 11: 배포 실행           [    ] %          ║
║  Section 12: 배포 후 검증        [    ] %          ║
║                                                     ║
║  전체 완료율:                    [    ] %          ║
╚════════════════════════════════════════════════════╝
```

---

## 📞 지원 및 문의

**프로젝트**: AKASSECT (AKC) Token  
**이메일**: akassectakc@gmail.com  
**긴급 연락**: [전화번호]

---

**최종 업데이트**: 2025-11-01  
**버전**: 1.0  
**다음 검토**: 배포 직전
