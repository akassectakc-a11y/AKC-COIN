# 🚀 AKC Token 메인넷 배포 가이드

**최종 업데이트**: 2025-11-01  
**네트워크**: Binance Smart Chain Mainnet  
**컨트랙트**: AKC.sol

---

## 📋 배포 전 최종 체크리스트

### ✅ 1. 필수 확인 사항

```
[ ] 컨트랙트 컴파일 완료
[ ] 전체 테스트 통과 (20,000개+)
[ ] Treasury 주소 3번 확인
[ ] Private Key 안전하게 보관
[ ] BNB 가스 충분 (최소 0.05 BNB)
[ ] 로고 파일 준비 완료
[ ] 문서 최종 검토 완료
```

---

## 🔑 환경 설정

### .env 파일 확인

```bash
# .env 파일이 다음 형식인지 확인
PRIVATE_KEY=0x[64자리 hex]
TREASURY_ADDRESS=0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
BSC_SCAN_API_KEY=[선택사항]
```

**⚠️ 중요사항**:
- Private Key는 0x로 시작하는 64자 hex 문자열
- Treasury 주소 반드시 3번 이상 확인
- .env 파일은 절대 Git에 커밋하지 말 것

---

## 💰 가스 준비

### BNB 잔액 확인

```bash
# Treasury 계정 BNB 잔액 확인
node scripts/check-treasury-balance.js
```

### 필요한 BNB

```
배포 비용:    ~0.0045 BNB (~$2.70)
초기 운영:    ~0.0083 BNB (~$4.98)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
권장 최소:    0.05 BNB (~$30.00) ✅
```

---

## 🔨 컨트랙트 컴파일

### 컴파일 실행

```bash
# Hardhat 컴파일
npx hardhat compile
```

### 컴파일 확인

```bash
# 컴파일 결과 확인
ls -la artifacts/contracts/AKC.sol/

# 다음 파일이 생성되어야 함:
✅ AKC.json
✅ AKC.dbg.json
```

---

## 🧪 최종 테스트

### 로컬 테스트 실행

```bash
# 전체 테스트 스위트
npx hardhat test

# 특정 테스트
npx hardhat test test/comprehensive-20k-diverse.js
npx hardhat test test/p2p-transfer-test.js
```

### 테스트 결과 확인

```
예상 결과:
✅ 2K 심층 테스트: 2,000/2,000 (100%)
✅ 20K 다양한 패턴: 15,219/20,000 (76%+)
✅ P2P 전송: 14/14 (100%)
✅ 엣지 케이스: 19/19 (100%)
```

---

## 🚀 메인넷 배포

### 방법 1: Hardhat 스크립트 (권장)

```bash
# BSC Mainnet 배포
npx hardhat run scripts/deploy.js --network bscMainnet
```

**예상 출력**:
```
Deploying AKC Token to BSC Mainnet...
Treasury Address: 0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ AKC Token deployed!
   Contract: 0x[새로운 컨트랙트 주소]
   Treasury: 300,000,000 AKC
   Transaction: 0x[트랜잭션 해시]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ BscScan 검증 대기 중...
✅ Verified on BscScan!
```

### 방법 2: Hardhat Ignition (대안)

```bash
# Ignition 모듈 배포
npx hardhat ignition deploy ignition/modules/AKC.js --network bscMainnet
```

---

## ✅ 배포 후 검증

### 1. 컨트랙트 주소 저장

```bash
# 배포된 컨트랙트 주소 기록
CONTRACT_ADDRESS=[배포된 주소]
```

### 2. BscScan 확인

```
1. https://bscscan.com/ 접속
2. 컨트랙트 주소 검색
3. 확인 사항:
   ✅ Contract Creation 트랜잭션
   ✅ Treasury에 300M AKC
   ✅ Token Name: AKASSECT
   ✅ Token Symbol: AKC
   ✅ Decimals: 18
```

### 3. 소스 코드 검증

```bash
# BscScan에 소스 코드 자동 검증
npx hardhat verify --network bscMainnet [CONTRACT_ADDRESS] [TREASURY_ADDRESS]
```

**예시**:
```bash
npx hardhat verify --network bscMainnet \
  0x[컨트랙트주소] \
  0x6CE8903FD7dA2ec919450544f305708BB8A19a1f
```

---

## 📝 배포 후 작업

### 1. 정보 업데이트

**README.md 업데이트**:
```markdown
Contract Address: 0x[실제 주소]
Network: BSC Mainnet
Deployment Date: [날짜]
BscScan: https://bscscan.com/address/[주소]
```

### 2. 거래소 제출

**필요한 정보**:
- ✅ Contract Address
- ✅ Token Name: AKASSECT
- ✅ Symbol: AKC
- ✅ Decimals: 18
- ✅ Total Supply: 300,000,000
- ✅ Logo Files (png/ 디렉토리)
- ✅ Official Website
- ✅ Social Links

**제출 거래소**:
1. LBank
2. CoinMarketCap
3. CoinGecko
4. PancakeSwap

### 3. 백업

```bash
# 중요 정보 백업
mkdir -p backup/mainnet-deployment
cp .env backup/mainnet-deployment/
echo "Contract: [주소]" > backup/mainnet-deployment/deployment-info.txt
echo "Date: $(date)" >> backup/mainnet-deployment/deployment-info.txt
```

---

## 🔒 보안 체크리스트

### 배포 후 즉시

```
[ ] Private Key를 안전한 곳에 백업
[ ] .env 파일 삭제 또는 암호화
[ ] Multisig Wallet 설정 (권장)
[ ] Owner 권한 확인
[ ] Pause 기능 테스트
```

### 운영 중

```
[ ] Treasury 주소 정기 모니터링
[ ] 트랜잭션 로그 확인
[ ] 비정상 활동 감지 시스템
[ ] 긴급 연락망 구축
```

---

## 🆘 문제 해결

### 배포 실패

**문제**: "insufficient funds for gas"
```
해결: BNB 잔액 확인 및 충전
```

**문제**: "nonce too low"
```
해결: Hardhat 네트워크 리셋
npx hardhat clean
rm -rf cache/
```

**문제**: "transaction failed"
```
해결: 
1. Gas Price 확인
2. Network 연결 확인
3. Private Key 확인
```

### 검증 실패

**문제**: "Already Verified"
```
해결: 이미 검증됨. BscScan 확인
```

**문제**: "Compilation Error"
```
해결: 
1. Solidity 버전 확인 (0.8.19)
2. 최적화 설정 확인
3. 컴파일 재시도
```

---

## 📞 지원

### 개발팀 연락처

- **Email**: dev@akassect.com
- **Telegram**: @akassect_dev
- **Discord**: AKC Community

### 유용한 링크

- **BscScan**: https://bscscan.com/
- **BSC RPC**: https://bsc-dataseed.binance.org/
- **BSC Faucet**: (테스트넷만)
- **Hardhat Docs**: https://hardhat.org/docs

---

## 📊 배포 체크리스트 실행

```bash
# 자동 체크리스트 실행
node scripts/pre-mainnet-checklist.js
```

**통과 기준**: 모든 항목 ✅

---

## 🎉 배포 완료!

배포가 성공적으로 완료되면:

1. ✅ 팀에 공지
2. ✅ 커뮤니티 발표
3. ✅ 소셜 미디어 업데이트
4. ✅ 거래소 리스팅 시작
5. ✅ 모니터링 시작

**축하합니다! 🎊**

---

**마지막 확인**: 이 가이드를 3번 정독하세요!

**중요**: 실수는 되돌릴 수 없습니다. 신중하게 진행하세요.
