# 📋 토큰리스트 등록 가이드

## 🎯 **주요 토큰리스트들**

### **1. PancakeSwap Default Token List**
- **URL**: https://github.com/pancakeswap/token-list
- **요구사항**:
  - BSC 메인넷 배포
  - 최소 $30,000 유동성
  - 커뮤니티 검증
- **제출 방법**: GitHub PR

### **2. Trust Wallet Token List**
- **URL**: https://github.com/trustwallet/assets
- **요구사항**:
  - 로고 파일 (256x256 PNG)
  - 토큰 정보 JSON
- **제출 방법**: GitHub PR

### **3. MetaMask Token List**
- **URL**: https://github.com/MetaMask/eth-contract-metadata
- **요구사항**:
  - 컨트랙트 검증
  - 로고 파일
- **제출 방법**: GitHub PR

### **4. CoinGecko Token List**
- **URL**: https://www.coingecko.com/en/coins/new
- **요구사항**:
  - 웹사이트
  - 소셜 미디어
  - 거래량
- **제출 방법**: 온라인 폼

## 📝 **토큰 정보 JSON 템플릿**

```json
{
  "name": "AKASSECT",
  "symbol": "AKC",
  "address": "0x02D8b729885290a3CA724F3Df5793b74Ff226A17",
  "decimals": 18,
  "chainId": 56,
  "logoURI": "https://raw.githubusercontent.com/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png",
  "tags": ["defi", "utility"]
}
```

## 🚀 **자동 등록을 위한 준비사항**

### **✅ 완료된 항목들**
- [x] BSC 메인넷 배포
- [x] 컨트랙트 주소 확보
- [x] 로고 파일 준비 (다양한 크기)
- [x] GitHub 리포지토리 공개
- [x] 토큰 메타데이터 생성

### **⏳ 필요한 추가 작업들**
- [ ] BscScan 컨트랙트 검증
- [ ] 공식 웹사이트 구축
- [ ] 소셜 미디어 계정 생성
- [ ] 유동성 풀 생성 (PancakeSwap)
- [ ] 거래량 확보

## 📊 **등록 우선순위**

### **1단계 (즉시 가능)**
1. **Trust Wallet Assets** - 로고만 있으면 등록 가능
2. **개별 지갑 수동 추가** - 사용자가 직접 추가

### **2단계 (유동성 후)**
1. **PancakeSwap Token List** - 유동성 풀 생성 후
2. **DexTools** - 거래 시작 후 자동 등록

### **3단계 (거래량 후)**
1. **CoinGecko** - 거래량 확보 후
2. **CoinMarketCap** - 거래량 + 커뮤니티 후

## 🔗 **즉시 사용 가능한 링크들**

### **MetaMask 원클릭 추가**
```
https://metamask.github.io/Add-Token/?address=0x02D8b729885290a3CA724F3Df5793b74Ff226A17&symbol=AKC&decimals=18&image=https://raw.githubusercontent.com/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png
```

### **BscScan 토큰 페이지**
```
https://bscscan.com/token/0x02D8b729885290a3CA724F3Df5793b74Ff226A17
```

---
**다음 단계**: BscScan 컨트랙트 검증 → Trust Wallet 등록 → 유동성 풀 생성
