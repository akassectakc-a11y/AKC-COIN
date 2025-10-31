# 🚀 AKC Token 개발 로드맵 (8주 완성 계획)

**프로젝트**: AKASSECT (AKC) Token  
**목표**: BEP-20 토큰 완성 및 LBank 상장  
**시작일**: 2025-11-01  
**완료 목표**: 2025-12-31

---

## 📊 전체 타임라인

```
Week 1  ▸ 법인 설립 (Delaware LLC)
Week 2  ▸ 스마트 컨트랙트 개발
Week 3  ▸ 테스트 코드 작성
Week 4  ▸ 보안 감사
Week 5  ▸ BSC Mainnet 배포
Week 6  ▸ 마케팅 & DEX 상장
Week 7  ▸ LBank 서류 제출
Week 8  ▸ LBank 상장 완료
```

---

## 📅 Week 1: 법인 설립 (2025-11-01 ~ 11-07)

### ✅ 체크리스트

**Day 1-2: 신청**
- [ ] 회사명 결정 (AINOVA LLC 또는 AKASSECT LLC)
- [ ] IncFile 온라인 신청
- [ ] 결제 완료 ($90)
- [ ] 신청 확인 이메일 수신

**Day 3-4: 승인 대기**
- [ ] 진행 상황 모니터링
- [ ] 추가 서류 준비 (여권, 주소증명)

**Day 5-7: 완료**
- [ ] Certificate of Formation 수령
- [ ] EIN 발급
- [ ] Operating Agreement 수령
- [ ] 모든 서류 PDF 정리

**결과물**:
- ✅ Delaware LLC 법인 설립 완료
- ✅ Certificate of Formation
- ✅ EIN Letter
- ✅ Operating Agreement

---

## 📅 Week 2: 스마트 컨트랙트 개발 (2025-11-08 ~ 11-14)

### ✅ 체크리스트

**개발 환경**
- [ ] Node.js 설치
- [ ] Hardhat 프로젝트 생성
- [ ] OpenZeppelin 설치
- [ ] Git 리포지토리 생성

**컨트랙트 개발**
- [ ] AKC.sol 작성
- [ ] 토큰 정보 설정 (AKASSECT, AKC, 300M)
- [ ] Burnable 기능 구현
- [ ] Pausable 기능 구현
- [ ] Ownable 기능 구현

**설정**
- [ ] hardhat.config.js 작성
- [ ] .env 파일 설정
- [ ] BSC Testnet 설정
- [ ] BSC Mainnet 설정

**컴파일**
- [ ] npx hardhat compile 실행
- [ ] 컴파일 오류 수정
- [ ] 컴파일 성공 확인

**결과물**:
- ✅ AKC.sol 스마트 컨트랙트
- ✅ Hardhat 설정 완료
- ✅ 컴파일 성공

---

## 📅 Week 3: 테스트 작성 (2025-11-15 ~ 11-21)

### ✅ 체크리스트

**테스트 코드**
- [ ] test/AKC.test.js 작성
- [ ] 배포 테스트
- [ ] 전송 테스트
- [ ] 소각 테스트
- [ ] 일시정지 테스트
- [ ] 소유권 테스트

**테스트 실행**
- [ ] npx hardhat test
- [ ] 모든 테스트 통과 (14+ 테스트)
- [ ] npx hardhat coverage
- [ ] 커버리지 95%+ 달성

**결과물**:
- ✅ 완전한 테스트 스위트
- ✅ 95%+ 코드 커버리지
- ✅ 모든 테스트 통과

---

## 📅 Week 4: 보안 감사 (2025-11-22 ~ 11-28)

### ✅ 체크리스트

**정적 분석**
- [ ] Slither 설치
- [ ] slither contracts/AKC.sol 실행
- [ ] High/Medium 이슈 모두 수정
- [ ] Low 이슈 검토 및 처리

**수동 리뷰**
- [ ] 재진입 공격 확인
- [ ] 정수 오버플로우 확인
- [ ] Access Control 확인
- [ ] Gas 최적화

**외부 감사 (선택)**
- [ ] 감사 업체 선정 (CertiK/Hacken)
- [ ] 계약 및 결제
- [ ] 코드 제출
- [ ] 감사 보고서 수령
- [ ] 이슈 수정

**결과물**:
- ✅ Slither 분석 통과
- ✅ 감사 보고서 (선택)
- ✅ 보안 검증 완료

---

## 📅 Week 5: BSC Mainnet 배포 (2025-11-29 ~ 12-05)

### ✅ 체크리스트

**Testnet 배포**
- [ ] scripts/deploy.js 작성
- [ ] BSC Testnet BNB 확보
- [ ] Testnet 배포 실행
- [ ] BscScan Testnet 검증
- [ ] 기능 테스트 (전송, 소각)

**Mainnet 준비**
- [ ] Treasury 주소 준비 (Multisig 권장)
- [ ] 배포 계정 BNB 확보 (0.1 BNB)
- [ ] 최종 코드 검토
- [ ] 백업 계획 수립

**Mainnet 배포**
- [ ] Mainnet 배포 실행
- [ ] 컨트랙트 주소 기록
- [ ] BscScan Mainnet 검증
- [ ] 배포 보고서 작성

**결과물**:
- ✅ BSC Mainnet 배포 완료
- ✅ BscScan 검증 완료
- ✅ 컨트랙트 주소 공개

**컨트랙트 정보 기록**:
```
Contract Address: 0x___________________
Transaction Hash: 0x___________________
Block Number: _______
Deployer: 0x___________________
Treasury: 0x___________________
BscScan: https://bscscan.com/token/0x___
```

---

## 📅 Week 6: 마케팅 & DEX 상장 (2025-12-06 ~ 12-12)

### ✅ 체크리스트

**브랜드 자료**
- [ ] 로고 디자인 (1024x1024, 512x512, 256x256)
- [ ] 배너 디자인 (Twitter, Telegram)
- [ ] 브랜드 가이드라인 문서

**소셜 미디어**
- [ ] 트위터 계정 (@AKC_Token)
- [ ] 텔레그램 그룹 (https://t.me/akc_token)
- [ ] 디스코드 서버
- [ ] 미디엄 블로그
- [ ] 첫 공식 발표

**정보 사이트 신청**
- [ ] CoinGecko 신청
- [ ] CoinMarketCap 신청
- [ ] Trust Wallet 신청 (GitHub PR)

**DEX 상장**
- [ ] PancakeSwap 유동성 풀 생성 (AKC/BNB)
- [ ] 초기 유동성 제공 (10+ BNB)
- [ ] 거래 링크 생성 및 공유

**결과물**:
- ✅ 완전한 브랜드 아이덴티티
- ✅ 활성 소셜 미디어 채널
- ✅ PancakeSwap DEX 상장

---

## 📅 Week 7: LBank 서류 제출 (2025-12-13 ~ 12-19)

### ✅ 체크리스트

**법률 문서**
- [ ] Certificate of Formation (PDF)
- [ ] EIN Letter (PDF)
- [ ] Operating Agreement (PDF)
- [ ] Good Standing Certificate
- [ ] 회원 명부

**프로젝트 문서**
- [ ] 백서 (영문) PDF
- [ ] 토큰 정보 시트
- [ ] 로드맵 및 마일스톤
- [ ] 팀 소개 및 이력

**기술 문서**
- [ ] 스마트 컨트랙트 소스코드
- [ ] BscScan 검증 링크
- [ ] 감사 보고서 (있는 경우)
- [ ] API 문서
- [ ] 기술 사양서

**마케팅 자료**
- [ ] 로고 파일 (모든 크기)
- [ ] 브랜드 가이드라인
- [ ] 소셜 미디어 링크 및 통계
- [ ] 커뮤니티 규모 증빙

**LBank 제출**
- [ ] 모든 서류 최종 검토
- [ ] LBank 포털 업로드
- [ ] 제출 확인
- [ ] 담당자 이메일 확인

**결과물**:
- ✅ 완전한 LBank 신청 패키지
- ✅ 모든 서류 제출 완료

---

## 📅 Week 8: LBank 상장 진행 (2025-12-20 ~ 12-31)

### ✅ 체크리스트

**실사 단계**
- [ ] 팀 KYC 제출
- [ ] 추가 문서 요청 대응
- [ ] LBank 질문 답변
- [ ] 법률 검토 협조

**기술 통합**
- [ ] API 문서 제공
- [ ] 테스트 지원
- [ ] 지갑 통합 협조
- [ ] 보안 테스트 참여

**마케팅 준비**
- [ ] 상장 공지 초안
- [ ] 거래 이벤트 기획
- [ ] 마케팅 캠페인 조율
- [ ] 커뮤니티 공지 준비

**상장 완료**
- [ ] LBank 최종 승인
- [ ] 상장 날짜 확정
- [ ] 공식 발표
- [ ] 거래 시작 🎉

**결과물**:
- ✅ LBank CEX 상장 완료
- ✅ AKC/USDT 거래 쌍 활성화

---

## 💰 예상 비용 계산

| 항목 | 비용 (USD) | 비용 (KRW) | 필수 |
|------|-----------|-----------|------|
| **법인 설립** | | | |
| Delaware LLC | $589 | ₩787,000 | ✅ |
| **개발** | | | |
| 개발 인력 (자체) | $0 | ₩0 | ✅ |
| **보안 감사** | | | |
| Slither (무료) | $0 | ₩0 | ✅ |
| CertiK 감사 | $10,000 | ₩13,400,000 | ⭐ |
| **배포** | | | |
| BSC Gas 비용 | $10 | ₩13,000 | ✅ |
| **마케팅** | | | |
| 로고 디자인 | $200 | ₩268,000 | ✅ |
| 소셜 미디어 | $0 | ₩0 | ✅ |
| **DEX 상장** | | | |
| PancakeSwap 유동성 | $1,000 | ₩1,340,000 | ✅ |
| **LBank 상장** | | | |
| 기본 수수료 | $30,000-50,000 | ₩40M-67M | ✅ |
| 마켓 메이킹 | $50,000-100,000 | ₩67M-134M | ✅ |
| 마케팅 패키지 | $10,000-30,000 | ₩13M-40M | ⭐ |
| **총 예상 비용** | | | |
| 최소 (감사 제외) | **$81,799** | **₩109M** | |
| 권장 (감사 포함) | **$91,799** | **₩123M** | |
| 최대 (모든 옵션) | **$191,799** | **₩257M** | |

---

## 🎯 각 단계별 목표

### Phase 1: 법인 (Week 1)
```
목표: Delaware LLC 설립
성공 기준:
✓ Certificate of Formation 수령
✓ EIN 발급 완료
✓ 모든 서류 준비 완료
```

### Phase 2-3: 개발 & 테스트 (Week 2-3)
```
목표: 완전한 BEP-20 토큰
성공 기준:
✓ 컨트랙트 작성 완료
✓ 14+ 테스트 통과
✓ 95%+ 커버리지
✓ 컴파일 성공
```

### Phase 4: 보안 (Week 4)
```
목표: 보안 검증
성공 기준:
✓ Slither 이슈 0개
✓ 감사 보고서 (선택)
✓ 취약점 없음
```

### Phase 5: 배포 (Week 5)
```
목표: BSC Mainnet 배포
성공 기준:
✓ Mainnet 배포 성공
✓ BscScan 검증 완료
✓ 전송 기능 작동
```

### Phase 6: 마케팅 (Week 6)
```
목표: 브랜드 구축 & DEX
성공 기준:
✓ 로고 완성
✓ 소셜 미디어 활성화
✓ PancakeSwap 상장
✓ 초기 거래량 확보
```

### Phase 7-8: CEX 상장 (Week 7-8)
```
목표: LBank 상장
성공 기준:
✓ 모든 서류 제출
✓ KYC 통과
✓ 기술 통합 완료
✓ 상장 승인 🎉
```

---

## 📋 마스터 체크리스트

### 법인 설립
- [ ] Delaware LLC 설립
- [ ] Certificate of Formation
- [ ] EIN Letter
- [ ] Operating Agreement

### 토큰 개발
- [ ] 스마트 컨트랙트 작성
- [ ] 테스트 코드 작성
- [ ] 보안 감사
- [ ] BSC Mainnet 배포

### 마케팅
- [ ] 로고 및 브랜드
- [ ] 소셜 미디어
- [ ] 백서 작성
- [ ] 커뮤니티 구축

### 상장
- [ ] PancakeSwap DEX
- [ ] CoinGecko 신청
- [ ] CoinMarketCap 신청
- [ ] LBank CEX

---

## 🔗 관련 문서

- [법률 요구사항 가이드](./docs/LEGAL-REQUIREMENTS-GUIDE.md)
- [LBank 신청 현황](./docs/LBANK-APPLICATION-STATUS.md)
- [Task 실행 마스터](./TASK-EXECUTION-MASTER.md)

---

**다음 단계**: Week 1 법인 설립 시작! 🚀

**문서 버전**: 1.0  
**최종 업데이트**: 2025-10-31  
**작성자**: AKC Development Team
