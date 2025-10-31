# 📅 AKC Token 주간 실행 가이드

> **8주 완성 프로젝트 - 단계별 실행 가이드**

---

## 🗓️ Week 1: 법인 설립 (START HERE!)

### 📌 목표
Delaware LLC 법인 설립 완료

### ✅ Day-by-Day 체크리스트

#### Monday (Day 1)
```
09:00 - 10:00  회사명 최종 결정
               □ AINOVA LLC (추천)
               □ AKASSECT LLC
               □ 델라웨어 사용 가능 확인

10:00 - 13:00  IncFile 온라인 신청
               □ https://www.incfile.com 접속
               □ Delaware LLC 선택
               □ 회사 정보 입력
               □ 결제 ($90)
               □ 확인 이메일 수신

14:00 - 17:00  추가 서류 준비
               □ 여권/신분증 스캔
               □ 주소 증명서 준비
```

#### Tuesday-Wednesday (Day 2-3)
```
□ 승인 대기 중
□ 이메일 확인
□ 추가 요청 대응 준비
```

#### Thursday (Day 4)
```
09:00 - 13:00  법인 설립 완료
               □ Certificate of Formation 수령
               □ EIN 발급 신청
               □ EIN 수령 (즉시)
               □ Operating Agreement 수령

14:00 - 17:00  서류 정리
               □ PDF 파일 정리
               □ 백업 3곳 저장
```

#### Friday (Day 5)
```
□ Good Standing Certificate 신청 ($50)
□ 회원 명부 작성
□ LBank 제출용 패키지 준비
```

### 📦 Week 1 완료 시 보유 서류
- ✅ Certificate of Formation
- ✅ EIN Letter  
- ✅ Operating Agreement
- ✅ Good Standing Certificate
- ✅ 회원 명부

---

## 🗓️ Week 2: 스마트 컨트랙트 개발

### 📌 목표
AKC 토큰 컨트랙트 작성 및 컴파일

### ✅ Day-by-Day 체크리스트

#### Monday (Day 8)
```
09:00 - 13:00  개발 환경 설정
               □ Node.js 설치
               □ 프로젝트 디렉터리 생성
               □ npm init
               □ Hardhat 설치
               □ OpenZeppelin 설치

14:00 - 18:00  Git 설정
               □ git init
               □ GitHub 리포지토리 생성
               □ 첫 커밋
```

#### Tuesday (Day 9)
```
09:00 - 12:00  AKC.sol 작성 시작
               □ contracts/AKC.sol 파일 생성
               □ OpenZeppelin 임포트
               □ 기본 구조 작성

13:00 - 18:00  기능 구현
               □ ERC20 기본 기능
               □ Burnable 구현
               □ Pausable 구현
               □ Ownable 구현
```

#### Wednesday (Day 10)
```
09:00 - 12:00  hardhat.config.js 작성
               □ Solidity 버전 설정
               □ BSC Testnet 설정
               □ BSC Mainnet 설정

13:00 - 18:00  환경 변수 설정
               □ .env.example 작성
               □ .env 파일 생성
               □ Private Key 설정
               □ Treasury 주소 설정
```

#### Thursday (Day 11)
```
09:00 - 12:00  컴파일
               □ npx hardhat compile
               □ 오류 수정
               □ 컴파일 성공 확인

13:00 - 18:00  코드 리뷰
               □ 주석 추가
               □ 코드 정리
               □ Git 커밋
```

#### Friday (Day 12)
```
□ 최종 검토
□ 문서 작성
□ Week 2 완료 보고
```

### 📦 Week 2 완료 시 결과물
- ✅ AKC.sol 컨트랙트
- ✅ Hardhat 설정 완료
- ✅ 컴파일 성공
- ✅ GitHub 리포지토리

---

## 🗓️ Week 3: 테스트 코드 작성

### 📌 목표
완전한 테스트 스위트 작성

### ✅ 주간 체크리스트

```
□ test/AKC.test.js 작성
□ 배포 테스트 (4개)
□ 전송 테스트 (3개)
□ 소각 테스트 (2개)
□ 일시정지 테스트 (3개)
□ 소유권 테스트 (2개)
□ npx hardhat test 실행
□ 모든 테스트 통과 (14+)
□ npx hardhat coverage
□ 커버리지 95%+ 달성
```

### 📦 Week 3 완료 시 결과물
- ✅ 완전한 테스트 스위트
- ✅ 95%+ 코드 커버리지

---

## 🗓️ Week 4: 보안 감사

### 📌 목표
보안 검증 완료

### ✅ 주간 체크리스트

```
□ Slither 설치
□ slither contracts/AKC.sol 실행
□ High 이슈 수정
□ Medium 이슈 수정
□ Low 이슈 검토
□ 재분석 (이슈 0개)
□ 수동 코드 리뷰
□ 외부 감사 (선택)
```

### 📦 Week 4 완료 시 결과물
- ✅ Slither 분석 통과
- ✅ 감사 보고서

---

## 🗓️ Week 5: BSC Mainnet 배포

### 📌 목표
메인넷 배포 및 검증

### ✅ 주간 체크리스트

**Testnet 배포**
```
□ scripts/deploy.js 작성
□ Testnet BNB 확보
□ Testnet 배포
□ BscScan Testnet 검증
□ 기능 테스트
```

**Mainnet 배포**
```
□ Treasury 주소 준비
□ Mainnet BNB 확보 (0.1 BNB)
□ 최종 코드 검토
□ Mainnet 배포 실행
□ BscScan Mainnet 검증
□ 컨트랙트 주소 공개
```

### 📦 Week 5 완료 시 정보

```
Contract Address: 0x_______________________
BscScan: https://bscscan.com/token/0x_______
Deployer: 0x_______________________
Treasury: 0x_______________________
```

---

## 🗓️ Week 6: 마케팅 & DEX

### 📌 목표
브랜드 구축 및 PancakeSwap 상장

### ✅ 주간 체크리스트

**브랜드**
```
□ 로고 디자인 (1024x1024)
□ 배너 디자인
□ 브랜드 가이드라인
```

**소셜 미디어**
```
□ 트위터 계정 (@AKC_Token)
□ 텔레그램 그룹
□ 디스코드 서버
□ 첫 공식 발표
```

**정보 사이트**
```
□ CoinGecko 신청
□ CoinMarketCap 신청
□ Trust Wallet 신청
```

**DEX 상장**
```
□ PancakeSwap 유동성 풀 (10+ BNB)
□ AKC/BNB 페어 활성화
□ 거래 링크 생성
```

### 📦 Week 6 완료 시 링크

```
Twitter: https://twitter.com/AKC_Token
Telegram: https://t.me/akc_token
PancakeSwap: https://pancakeswap.finance/swap?outputCurrency=0x___
```

---

## 🗓️ Week 7: LBank 서류 제출

### 📌 목표
LBank 신청 패키지 완성

### ✅ 주간 체크리스트

**법률 문서**
```
□ Certificate of Formation (PDF)
□ EIN Letter (PDF)
□ Operating Agreement (PDF)
□ Good Standing Certificate
□ 회원 명부
```

**프로젝트 문서**
```
□ 백서 (영문) PDF
□ 토큰 정보 시트
□ 로드맵
□ 팀 소개
```

**기술 문서**
```
□ 컨트랙트 소스코드
□ BscScan 검증 링크
□ 감사 보고서
□ API 문서
```

**제출**
```
□ LBank 포털 업로드
□ 제출 확인
□ 담당자 연락
```

---

## 🗓️ Week 8: LBank 상장 완료

### 📌 목표
LBank CEX 상장

### ✅ 주간 체크리스트

```
□ 팀 KYC 제출
□ 추가 서류 대응
□ 기술 통합 협조
□ 마케팅 준비
□ 최종 승인
□ 상장 날짜 확정
□ 공식 발표
□ 거래 시작 🎉
```

---

## 📊 진행 상황 추적

### Overall Progress

```
□ Week 1: 법인 설립         [    ] 0%
□ Week 2: 컨트랙트 개발      [    ] 0%
□ Week 3: 테스트 작성        [    ] 0%
□ Week 4: 보안 감사          [    ] 0%
□ Week 5: Mainnet 배포       [    ] 0%
□ Week 6: 마케팅 & DEX       [    ] 0%
□ Week 7: LBank 서류         [    ] 0%
□ Week 8: LBank 상장         [    ] 0%
```

---

## 🚀 지금 바로 시작하기

### 첫 번째 단계 (지금!)

1. **IncFile 접속**
   ```
   https://www.incfile.com
   ```

2. **Delaware LLC 선택**

3. **회사명 입력**
   ```
   AINOVA LLC (추천)
   ```

4. **신청 완료**
   ```
   결제: $90
   시간: 15분
   ```

5. **다음 단계 대기**
   ```
   승인: 1-3일
   ```

---

## 💡 주간 팁

### Week 1 Tip
> IncFile 무료 패키지 사용하세요. 주정부 수수료 $90만 내면 됩니다.

### Week 2 Tip
> OpenZeppelin Contracts Wizard 사용하면 기본 코드 생성이 쉽습니다.

### Week 3 Tip
> Hardhat 테스트는 `describe`와 `it`로 구조화하세요.

### Week 4 Tip
> Slither는 무료이고 강력합니다. 반드시 사용하세요.

### Week 5 Tip
> Mainnet 배포 전 Testnet에서 충분히 테스트하세요.

### Week 6 Tip
> 소셜 미디어는 일관성이 중요합니다. 매일 포스팅하세요.

### Week 7 Tip
> LBank 서류는 한 번에 완벽하게 준비하세요. 시간 절약됩니다.

### Week 8 Tip
> 상장 후 커뮤니티 관리가 가장 중요합니다.

---

**다음: Week 1 법인 설립 시작!** 🎯

**문서 버전**: 1.0  
**최종 업데이트**: 2025-10-31
