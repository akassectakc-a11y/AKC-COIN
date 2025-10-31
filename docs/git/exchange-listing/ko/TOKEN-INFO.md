# 📝 AKC 토큰 정보 시트 (한국어)

> **거래소 통합을 위한 완전한 기술 사양**

---

## 🎯 요약

**AINOVA Key Coin (AKC)**은 **BEP-20 표준** 유틸리티 토큰으로, Binance Smart Chain (BSC)에 구축되어 AINOVA 생태계를 구동하도록 설계되었습니다. 3억 개의 고정 공급량과 업계 표준의 완전한 준수로, AKC는 DeFi 커뮤니티에 안전하고 신뢰할 수 있는 디지털 자산을 제공합니다.

---

## 🪙 토큰 사양

### 기본 정보

```json
{
  "name": "AINOVA Key Coin",
  "symbol": "AKC",
  "standard": "BEP-20",
  "network": "Binance Smart Chain (BSC)",
  "chainId": 56,
  "decimals": 18,
  "totalSupply": "300000000000000000000000000",
  "totalSupplyFormatted": "300,000,000 AKC",
  "contractAddress": "0x...",
  "verified": true
}
```

### 토큰 표준: BEP-20

**BEP-20이란?**
- BEP-20은 Binance Smart Chain의 토큰 표준입니다
- ERC-20 (이더리움 표준)과 호환됩니다
- 빠르고 저렴한 거래를 위해 설계되었습니다
- 지갑과 거래소에서 널리 지원됩니다

**BEP-20 vs ERC-20**
| 기능 | BEP-20 | ERC-20 |
|------|--------|--------|
| 블록체인 | BSC | 이더리움 |
| 가스비 | $0.10 - $0.50 | $5 - $50 |
| 블록 시간 | ~3초 | ~15초 |
| 호환성 | ✅ ERC-20 호환 | ✅ ERC-20 |

---

## 🔧 기술 사양

### 컨트랙트 상세

| 파라미터 | 값 |
|---------|-----|
| **컨트랙트 타입** | 표준 BEP-20 토큰 |
| **컴파일러 버전** | Solidity 0.8.4 |
| **최적화** | 활성화 (200 runs) |
| **라이선스** | MIT |
| **프록시 컨트랙트** | 없음 (업그레이드 불가) |
| **일시정지 가능** | 예 (긴급 상황만) |
| **발행 가능** | 예 (소유자만, 런칭 후 잠금) |
| **소각 가능** | 예 (공개) |

### 스마트 컨트랙트 주소

```
메인넷 (BSC):
컨트랙트 주소: 0x... (실제 주소로 대체)
체인 ID: 56
블록 탐색기: https://bscscan.com/token/0x...
```

```
테스트넷 (BSC):
컨트랙트 주소: 0x... (실제 주소로 대체)
체인 ID: 97
블록 탐색기: https://testnet.bscscan.com/token/0x...
```

### 네트워크 정보

**메인넷 (운영 환경)**
- 네트워크 이름: Binance Smart Chain
- RPC URL: https://bsc-dataseed1.binance.org
- 체인 ID: 56
- 심볼: BNB
- 블록 탐색기: https://bscscan.com

**테스트넷 (테스트 환경)**
- 네트워크 이름: BSC Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
- 체인 ID: 97
- 심볼: BNB
- 블록 탐색기: https://testnet.bscscan.com

---

## 📊 공급 정보

### 총 공급량

- **최대 공급량**: 300,000,000 AKC (고정, 증가 불가)
- **초기 공급량**: 300,000,000 AKC (런칭 시 100% 발행)
- **유통량**: 300,000,000 AKC
- **소각량**: 0 AKC
- **잠금량**: 60,000,000 AKC (팀 베스팅)

### 공급 분배

```
총량: 300,000,000 AKC (100%)

├─ 퍼블릭 유통: 90,000,000 AKC (30%)
│  └─ 거래 가능
│
├─ 팀 & 어드바이저: 60,000,000 AKC (20%)
│  └─ 24개월 선형 베스팅
│
├─ 생태계: 90,000,000 AKC (30%)
│  └─ 파트너십, 개발, 그랜트
│
├─ 마케팅: 30,000,000 AKC (10%)
│  └─ 커뮤니티 보상, 에어드롭
│
└─ 리저브: 30,000,000 AKC (10%)
   └─ 향후 개발, 유동성
```

---

## 💰 토큰 이코노미

### 가격 정보 (예시)

| 지표 | 값 |
|------|-----|
| **초기 가격** | $0.005 USD |
| **현재 가격** | $0.005 USD |
| **시가총액** | $1,500,000 USD |
| **완전희석가치(FDV)** | $1,500,000 USD |
| **24시간 거래량** | $500,000 USD |
| **역대 최고가** | $0.005 USD |
| **역대 최저가** | $0.005 USD |

*참고: 가격은 예시이며 상장 후 업데이트됩니다*

### 유동성

**PancakeSwap 풀**
- AKC 수량: 1,000,000 AKC
- BNB 수량: 10 BNB
- 초기 유동성: ~$5,000 USD
- LP 토큰: 12개월 잠금

---

## 🔐 보안 기능

### 내장 보안

✅ **OpenZeppelin 라이브러리**
- 업계 표준 구현
- 감사 완료 및 실전 검증
- DeFi에서 널리 신뢰받음

✅ **접근 제어**
- 소유자 전용 함수 명확히 정의
- 숨겨진 관리자 함수 없음
- 소유권 포기 또는 멀티시그로 이전 가능

✅ **일시정지 메커니즘**
- 긴급 정지 기능
- 소유자 제어
- 투명한 구현

✅ **백도어 없음**
- 소스코드 완전 검증
- 프록시 또는 업그레이드 메커니즘 없음
- 불변 로직

### 보안 감사

| 감사 | 상태 | 심각도 | 보고서 |
|------|------|--------|--------|
| **Slither** | ✅ 통과 | 0 높음, 0 중간 | [보기](#) |
| **내부 검토** | ✅ 통과 | 0 치명적 | [보기](#) |
| **외부 감사** | ⏳ 대기 중 | - | CertiK/PeckShield |

---

## 🔗 통합 가이드

### MetaMask에 AKC 추가

```javascript
// MetaMask에 토큰 자동 추가
const tokenAddress = "0x..."; // AKC 컨트랙트 주소
const tokenSymbol = "AKC";
const tokenDecimals = 18;
const tokenImage = "https://ainova.io/logo.png";

await ethereum.request({
  method: 'wallet_watchAsset',
  params: {
    type: 'ERC20',
    options: {
      address: tokenAddress,
      symbol: tokenSymbol,
      decimals: tokenDecimals,
      image: tokenImage,
    },
  },
});
```

### Web3 통합

```javascript
// ethers.js 사용
const { ethers } = require("ethers");

// BSC 연결
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.binance.org"
);

// AKC 컨트랙트
const contractAddress = "0x...";
const abi = [...]; // AKC ABI

const contract = new ethers.Contract(contractAddress, abi, provider);

// 잔액 확인
const balance = await contract.balanceOf("0x...");
console.log(ethers.utils.formatEther(balance));

// 토큰 전송
const tx = await contract.transfer("0x...", ethers.utils.parseEther("100"));
await tx.wait();
```

### API 통합

```bash
# 토큰 정보 가져오기
curl https://api.bscscan.com/api \
  ?module=token \
  &action=tokeninfo \
  &contractaddress=0x... \
  &apikey=YOUR_API_KEY

# 토큰 잔액 가져오기
curl https://api.bscscan.com/api \
  ?module=account \
  &action=tokenbalance \
  &contractaddress=0x... \
  &address=0x... \
  &tag=latest \
  &apikey=YOUR_API_KEY
```

---

## 📈 거래 정보

### 지원 지갑

✅ **하드웨어 지갑**
- Ledger
- Trezor

✅ **소프트웨어 지갑**
- MetaMask
- Trust Wallet
- Binance Chain Wallet
- TokenPocket
- SafePal

✅ **거래소 지갑**
- Binance
- Gate.io
- MEXC
- 기타 (상장 후)

### 현재 상장

| 플랫폼 | 타입 | 거래쌍 | 링크 |
|--------|------|--------|------|
| **PancakeSwap** | DEX | AKC/BNB | [거래](#) |
| **CoinGecko** | 정보 | - | [보기](#) |
| **CoinMarketCap** | 정보 | - | [보기](#) |

### 예정 상장

- MEXC (Tier 3 CEX) - 2026년 1분기
- Gate.io (Tier 2 CEX) - 2026년 2분기
- Binance (Tier 1 CEX) - 2026년 3분기 (목표)

---

## 📞 기술 지원

### 거래소 통합 문의

- **이메일**: tech@ainova.io
- **텔레그램**: @ainova_tech
- **디스코드**: https://discord.gg/ainova
- **응답 시간**: 24시간 이내

### 통합 지원 포함 사항

✅ API 문서
✅ 테스트 환경 접근
✅ 통합 테스트
✅ 기술 컨설팅
✅ 통합 후 지원

---

## 📎 추가 자료

### 공식 링크

- **웹사이트**: https://ainova.io
- **문서**: https://docs.ainova.io
- **GitHub**: https://github.com/akassectakc-a11y/AKC-COIN
- **미디엄**: https://medium.com/@ainova

### 기술 자료

- **컨트랙트 소스코드**: [BscScan](#)
- **백서**: https://ainova.io/whitepaper.pdf
- **감사 보고서**: https://ainova.io/audits
- **API 문서**: https://docs.ainova.io/api

---

## ⚠️ 중요 사항

### 거래소용

1. **입출금 설정**
   - 최소 입금: 10 AKC
   - 최소 출금: 10 AKC
   - 출금 수수료: 0.5-1 AKC (권장)

2. **컨펌 수**
   - 입금 컨펌: 15 블록 (~45초)
   - 출금 컨펌: 30 블록 (~90초)

3. **컨트랙트 상호작용**
   - 표준 BEP-20 전송 메소드 사용
   - 특별한 수수료나 메커니즘 없음
   - 표준 거래소 인프라와 완전 호환

### 위험 경고

- 암호화폐 투자에는 위험이 따릅니다
- 스스로 조사하세요 (DYOR)
- AKC는 유틸리티 토큰이지 증권이 아닙니다
- 수익 보장 없음

---

## 🇰🇷 한국 거래소 특별 안내

### 규제 준수

✅ **특정금융정보법 (특금법)**
- 실명 확인 계좌 연동
- 자금세탁방지 (AML) 체계
- 의심거래 보고 (STR)

✅ **전자금융거래법**
- 전자금융업 등록
- 보안 인증 (ISMS)
- 개인정보 보호

✅ **정보통신망법**
- 개인정보 처리방침
- 이용약관
- 본인 인증 체계

### 한국 거래소 요구사항

**업비트 (Upbit)**
- ISMS 인증 필수
- 실명 확인 계좌
- 프로젝트 혁신성 평가
- 커뮤니티 규모

**빗썸 (Bithumb)**
- 실사용 사례
- 파트너십 증빙
- 사업 모델 현실성
- 팀 역량 평가

**코인원 (Coinone)**
- 프로젝트 실적
- 로드맵 명확성
- 기술 완성도
- 규제 준수 확인

**코빗 (Korbit)**
- 법률 검토 완료
- 보안 감사
- 토큰 이코노미
- 마케팅 계획

---

## 💼 거래소 지원 서비스

### 제공 서비스

✅ **기술 통합 지원**
- 완전한 API 문서 제공
- 테스트넷 환경 제공
- 통합 테스트 지원
- 실시간 기술 지원

✅ **마케팅 지원**
- 상장 공동 마케팅
- 거래 이벤트 지원
- 커뮤니티 활성화
- 콘텐츠 제공

✅ **운영 지원**
- 24/7 긴급 대응
- 정기 보고서
- 유동성 관리
- 커뮤니티 관리

---

## 📊 거래소 통합 체크리스트

### 기술 통합

- [ ] BEP-20 표준 호환성 확인
- [ ] 테스트넷 환경 테스트
- [ ] API 엔드포인트 연동
- [ ] 입출금 테스트
- [ ] 보안 검토

### 법률 및 컴플라이언스

- [ ] 토큰 분류 확인
- [ ] KYC/AML 정책 확인
- [ ] 이용약관 검토
- [ ] 개인정보 처리방침 확인
- [ ] 규제 준수 확인

### 마케팅 및 커뮤니티

- [ ] 상장 공지 준비
- [ ] 거래 이벤트 기획
- [ ] 커뮤니티 공지
- [ ] 마케팅 자료 준비
- [ ] SNS 홍보 계획

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025-10-31  
**다음 검토**: 2026-01-31

**연락처**: tech@ainova.io
