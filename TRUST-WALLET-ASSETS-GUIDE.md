# 🎨 Trust Wallet Assets 로고 등록 가이드

## 📋 **개요**
Trust Wallet Assets에 토큰 로고를 등록하면 BscScan, PancakeSwap, MetaMask 등에서 자동으로 로고가 표시됩니다.

## 🚀 **등록 단계**

### **1단계: Trust Wallet Assets 저장소 Fork**
1. https://github.com/trustwallet/assets 접속
2. **Fork** 버튼 클릭하여 본인 계정으로 복사

### **2단계: 폴더 구조 생성**
```
assets/blockchains/smartchain/assets/0x02D8b729885290a3CA724F3Df5793b74Ff226A17/
├── info.json
└── logo.png
```

### **3단계: 파일 준비**

#### **logo.png 요구사항**
- **크기**: 256x256 픽셀
- **형식**: PNG
- **배경**: 투명 또는 흰색
- **파일 크기**: 100KB 이하

#### **info.json 내용**
```json
{
  "name": "AKASSECT",
  "website": "https://github.com/akassectakc-a11y/AKC-COIN",
  "description": "AI-powered payment gateway token for AKASSECT ecosystem",
  "explorer": "https://bscscan.com/token/0x02D8b729885290a3CA724F3Df5793b74Ff226A17",
  "type": "BEP20",
  "symbol": "AKC",
  "decimals": 18,
  "status": "active",
  "id": "0x02D8b729885290a3CA724F3Df5793b74Ff226A17",
  "tags": [
    "defi"
  ]
}
```

### **4단계: Pull Request 생성**
1. 파일 업로드 완료 후 커밋
2. **Pull Request** 생성
3. 제목: `Add AKASSECT (AKC) token - BSC`
4. 설명에 토큰 정보 포함

### **5단계: 검토 및 승인**
- Trust Wallet 팀 검토 (1-2주 소요)
- 승인 후 자동으로 각 플랫폼에 반영

---

## 📁 **현재 준비된 파일들**

### **로고 파일 위치**
- `docs/logo/png/AKC-Icon-256.png` ✅ 준비됨
- 크기: 256x256 픽셀 ✅
- 형식: PNG ✅

### **토큰 정보**
- **컨트랙트 주소**: `0x02D8b729885290a3CA724F3Df5793b74Ff226A17`
- **토큰명**: AKASSECT (AKC)
- **네트워크**: BSC (BEP-20)
- **총 공급량**: 300,000,000 AKC
- **소수점**: 18

---

## 🔄 **대안 방법**

### **방법 2: BscScan 직접 등록**
1. BscScan 지원팀에 이메일 문의
2. 토큰 정보 및 로고 첨부
3. 검토 후 수동 등록

### **방법 3: CoinGecko/CoinMarketCap**
- 거래량 확보 후 등록 가능
- 승인 시 BscScan에도 자동 반영

---

## 📞 **지원**

**Trust Wallet Assets 관련 문의**:
- GitHub Issues: https://github.com/trustwallet/assets/issues
- 가이드라인: https://github.com/trustwallet/assets/blob/master/dapps/tutorial.md

**예상 처리 시간**: 1-2주
