# 🔍 BscScan 배포 후 작업 가이드

**작성일**: 2025-11-01  
**목적**: 배포 후 BscScan에서 해야 할 모든 작업 완벽 정리

---

## 🎯 BscScan에서 해야 할 작업 (3가지)

```
1️⃣ 소스 코드 검증 (Verify Contract) - 필수! ⭐
2️⃣ 토큰 정보 업데이트 (Update Token Info) - 필수! ⭐
3️⃣ 소셜 링크 추가 (Optional)
```

---

## 📋 사전 준비

### BscScan 계정 생성

```
1. https://bscscan.com/ 접속
2. 우측 상단 "Sign In" 클릭
3. "Sign Up" 클릭
4. 이메일 입력 및 인증
5. 계정 생성 완료
```

### 필요한 정보

```
✅ 컨트랙트 주소 (배포 후 얻음)
✅ 컨트랙트 소스 코드 (contracts/AKC.sol)
✅ Solidity 버전 (0.8.19)
✅ Constructor Arguments (Treasury 주소)
✅ 로고 파일 (AKC-Icon-256.png)
✅ 프로젝트 정보 (웹사이트, 소셜 미디어)
```

---

## 1️⃣ 소스 코드 검증 (Verify Contract)

### 왜 필요한가?

```
✅ 컨트랙트 코드가 안전함을 증명
✅ BscScan에서 직접 읽기/쓰기 가능
✅ 투명성 확보 (누구나 코드 확인)
✅ 신뢰도 향상
✅ 다른 플랫폼 등록 시 필수

→ 배포 후 가장 먼저 해야 할 작업! ⭐
```

---

### 방법 1: Hardhat으로 자동 검증 (권장!)

```bash
# .env 파일에 API Key 추가
BSCSCAN_API_KEY=your_api_key_here

# 배포 후 즉시 검증
npx hardhat verify --network bscMainnet [CONTRACT_ADDRESS] [TREASURY_ADDRESS]

예시:
npx hardhat verify --network bscMainnet \
  0x1234567890123456789012345678901234567890 \
  0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
```

**장점**:
```
✅ 매우 빠름 (1-2분)
✅ 자동으로 처리
✅ 에러 적음
✅ 권장 방법! ⭐
```

---

### 방법 2: BscScan 웹사이트에서 수동 검증

#### Step 1: Verify 페이지 이동

```
1. https://bscscan.com/ 접속
2. 컨트랙트 주소 검색
3. "Contract" 탭 클릭
4. "Verify and Publish" 클릭
```

#### Step 2: 컴파일러 설정

```
Compiler Type: Solidity (Single file)
Compiler Version: v0.8.19+commit.7dd6d404
License Type: MIT
```

#### Step 3: 소스 코드 입력

```
1. "Solidity Contract Code" 필드에 전체 코드 복사

포함할 내용:
- contracts/AKC.sol
- @openzeppelin/contracts 임포트 코드
- 모든 의존성 라이브러리

또는:

Flattened Code 사용 (권장):
npx hardhat flatten contracts/AKC.sol > AKC-flattened.sol
```

#### Step 4: Constructor Arguments

```
ABI-encoded Constructor Arguments:

1. Treasury 주소를 ABI 인코딩
2. 온라인 도구 사용:
   https://abi.hashex.org/

입력:
- Type: address
- Value: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f

결과 (예시):
0000000000000000000000006ce8903fd7da2ec919450544f305708bb8a19a1f
```

#### Step 5: Optimization 설정

```
Optimization: Yes
Runs: 200

(hardhat.config.js 설정과 동일해야 함!)
```

#### Step 6: 검증 완료

```
"Verify and Publish" 클릭

성공 시:
✅ "Contract Source Code Verified"
✅ 초록색 체크마크 표시
✅ 코드 탭에서 소스 코드 확인 가능

실패 시:
❌ Constructor Arguments 다시 확인
❌ Solidity 버전 다시 확인
❌ Optimization 설정 다시 확인
```

---

### BscScan API Key 발급

```
1. https://bscscan.com/myapikey
2. "Add" 클릭
3. API Key 이름 입력 (예: "AKC Token")
4. API Key 복사
5. .env 파일에 추가:
   BSCSCAN_API_KEY=YOUR_API_KEY
```

---

## 2️⃣ 토큰 정보 업데이트 (Update Token Info)

### 왜 필요한가?

```
✅ 로고가 BscScan에 표시됨
✅ 프로젝트 정보가 표시됨
✅ 소셜 미디어 링크 추가
✅ 사용자가 쉽게 확인 가능
✅ 신뢰도 향상

→ 로고 표시를 위해 필수! ⭐
```

---

### Step 1: 로그인

```
1. https://bscscan.com/ 접속
2. 우측 상단 "Sign In"
3. 계정 로그인
```

### Step 2: 컨트랙트 페이지 이동

```
1. 컨트랙트 주소 검색
2. "More Options" 버튼 클릭 (우측 상단)
3. "Update Token Info" 선택
```

### Step 3: 토큰 정보 입력

#### 기본 정보

```
Token Name: AKASSECT
Token Symbol: AKC
Token Decimals: 18
Total Supply: 300,000,000 AKC
```

#### 로고 업로드

```
Logo Image:
- 파일: docs/logo/png/AKC-Icon-256.png
- 크기: 256x256 픽셀
- 형식: PNG
- 배경: 투명 권장
- 파일 크기: 100KB 이하

⚠️ 중요:
- 정확히 256x256이어야 함
- PNG 형식만 가능
- 투명 배경 권장
```

#### 프로젝트 정보

```
Official Website:
[프로젝트 웹사이트 URL]

Official Email:
[공식 이메일 주소]

Blog/Medium:
[블로그 URL] (선택)

Whitepaper:
[백서 URL] (선택)

Description:
AKASSECT (AKC) is a BEP-20 token on BNB Smart Chain with 
burnable and pausable features. Tested with 20,144 comprehensive 
tests achieving 100% success rate.

Project Sector:
[해당 섹터 선택]
예: DeFi, Payment, Utility, etc.
```

#### 소셜 미디어 링크

```
GitHub:
https://github.com/akassectakc-a11y/AKC-COIN

Twitter:
[트위터 URL]

Telegram:
[텔레그램 URL]

Discord:
[디스코드 URL] (선택)

Reddit:
[레딧 URL] (선택)
```

### Step 4: 제출

```
1. "reCAPTCHA" 완료
2. "Update" 또는 "Submit" 클릭
3. 이메일 확인 (인증 링크 클릭)
```

### Step 5: 승인 대기

```
승인 기간: 1-2시간 (빠름!)

승인 후:
✅ 로고가 BscScan에 표시됨
✅ 프로젝트 정보가 표시됨
✅ 소셜 링크가 추가됨

확인:
1. 컨트랙트 페이지 새로고침
2. 토큰 이름 옆에 로고 확인
3. "More Info" 섹션에서 정보 확인
```

---

## 3️⃣ 소셜 프로필 추가 (선택사항)

### Token Tracker Enhanced (선택)

```
1. 컨트랙트 페이지에서 "More Options"
2. "Submit Token Tracker Request" 선택
3. 추가 정보 입력:
   - Market Cap
   - Circulating Supply
   - Price Feed
   - 기타 데이터
```

**참고**: 이 기능은 선택사항이며, CoinMarketCap이나 CoinGecko 등록 후 자동으로 연동될 수 있습니다.

---

## 📊 작업 순서 (권장)

```
╔═══════════════════════════════════════════════════╗
║          배포 후 BscScan 작업 순서                 ║
╠═══════════════════════════════════════════════════╣
║  Day 0 - 배포 직후                                ║
║                                                    ║
║  1. 소스 코드 검증 (Verify) ⭐                    ║
║     방법: Hardhat 자동 검증 (권장)                ║
║     시간: 1-2분                                    ║
║     명령: npx hardhat verify ...                  ║
║                                                    ║
║  2. 로고 + 정보 업데이트 ⭐                       ║
║     방법: BscScan 웹사이트                        ║
║     시간: 5-10분 작업                             ║
║     승인: 1-2시간                                  ║
║                                                    ║
║  3. 확인                                           ║
║     - 초록색 체크마크 (검증 완료)                 ║
║     - 로고 표시                                    ║
║     - 프로젝트 정보 표시                          ║
╚═══════════════════════════════════════════════════╝
```

---

## 🔧 Hardhat 검증 명령어 (완전판)

### 기본 검증

```bash
npx hardhat verify \
  --network bscMainnet \
  [CONTRACT_ADDRESS] \
  [TREASURY_ADDRESS]
```

### 전체 예시

```bash
# 환경 변수 확인
echo $BSCSCAN_API_KEY

# 검증 실행
npx hardhat verify \
  --network bscMainnet \
  0x1234567890123456789012345678901234567890 \
  0x6CE8903FD7dA2ec919450544f305708BB8A19a1f

# 성공 메시지
Successfully submitted source code for contract
contracts/AKC.sol:AKC at 0x1234...
for verification on the block explorer. Waiting for verification result...

Successfully verified contract AKC on BscScan.
https://bscscan.com/address/0x1234...#code
```

---

## 🚨 문제 해결

### 검증 실패 시

#### 에러 1: Constructor Arguments 불일치

```
에러 메시지:
"Error: Constructor arguments do not match"

해결:
1. Treasury 주소 다시 확인
2. ABI 인코딩 다시 생성
3. 정확한 형식 사용
```

#### 에러 2: Compiler Version 불일치

```
에러 메시지:
"Error: Compiler version mismatch"

해결:
1. hardhat.config.js 확인
2. Solidity 버전 확인 (0.8.19)
3. 정확히 동일한 버전 사용
```

#### 에러 3: Optimization 설정 불일치

```
에러 메시지:
"Error: Bytecode mismatch"

해결:
1. hardhat.config.js에서 optimizer 확인
2. enabled: true, runs: 200
3. 정확히 동일한 설정 사용
```

### 로고 업로드 실패 시

```
문제 1: 파일 크기 초과
해결: 100KB 이하로 압축

문제 2: 형식 오류
해결: 정확히 PNG 형식 사용

문제 3: 크기 불일치
해결: 정확히 256x256 픽셀

문제 4: 투명도 문제
해결: 배경 투명 PNG로 재생성
```

---

## 📋 체크리스트

### 배포 후 즉시 (1시간 내)

```
[ ] BscScan 계정 생성/로그인
[ ] BscScan API Key 발급
[ ] .env에 API Key 추가
[ ] Hardhat으로 소스 코드 검증
[ ] 검증 완료 확인 (초록색 체크마크)
[ ] 로고 파일 준비 (256x256 PNG)
[ ] 토큰 정보 업데이트 제출
[ ] 프로젝트 정보 입력
[ ] 소셜 미디어 링크 추가
```

### 1-2시간 후

```
[ ] 로고 승인 확인
[ ] 프로젝트 정보 표시 확인
[ ] 소셜 링크 작동 확인
[ ] 컨트랙트 코드 읽기 테스트
[ ] 컨트랙트 코드 쓰기 테스트
```

---

## 🎯 최종 확인

### BscScan에서 확인할 것

```
✅ 초록색 체크마크 (검증 완료)
   → "Contract" 탭에 표시

✅ 로고 표시
   → 토큰 이름 옆에 로고

✅ 프로젝트 정보
   → "More Info" 섹션

✅ 소셜 링크
   → GitHub, Twitter, Telegram 등

✅ 코드 읽기/쓰기
   → "Read Contract" / "Write Contract" 탭
```

### 완성된 모습

```
BscScan 페이지:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 AKASSECT (AKC) 🎨[로고]

Contract: 0x1234...
✅ Contract Source Code Verified (Exact Match)

More Info:
- Website: [링크]
- GitHub: [링크]
- Twitter: [링크]
- Telegram: [링크]

Tabs:
- Transactions
- Contract ✅
- Read Contract ✅
- Write Contract ✅
- Events
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ 완벽! ✅
```

---

## 💡 Pro Tips

```
✅ Tip 1: Hardhat 검증 권장
   → 가장 빠르고 정확함

✅ Tip 2: 로고는 즉시 제출
   → 승인에 1-2시간 소요

✅ Tip 3: 모든 링크 준비
   → 한 번에 모두 입력

✅ Tip 4: 이메일 확인 필수
   → 인증 링크 클릭해야 승인

✅ Tip 5: 검증부터 먼저
   → 로고보다 검증이 더 중요
```

---

## 📊 예상 소요 시간

```
작업                    시간          난이도
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
계정 생성              5분          쉬움
API Key 발급           2분          쉬움
소스 코드 검증         1-2분        쉬움 ✅
로고 업로드           5분          쉬움
정보 입력             5-10분       쉬움
승인 대기             1-2시간      -
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
총 작업 시간:         15-20분
총 대기 시간:         1-2시간
```

---

## 🎉 완료 후 이점

```
✅ BscScan에서 로고 표시
✅ 프로젝트 정보 완전 공개
✅ 코드 투명성 확보
✅ 신뢰도 향상
✅ CoinMarketCap/CoinGecko 등록 시 유리
✅ 사용자가 쉽게 확인 가능
✅ 전문적인 이미지

→ 필수 작업! ⭐
```

---

**작성일**: 2025-11-01  
**상태**: ✅ **완전한 가이드 완성**  
**중요도**: ⭐⭐⭐⭐⭐ **매우 중요!**

**핵심**: 배포 후 1시간 내에 검증 + 로고 제출 필수!
