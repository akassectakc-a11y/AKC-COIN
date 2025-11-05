# 📱 Trust Wallet Assets 등록 가이드

## ✅ **준비 완료된 파일들**

### **파일 위치**
```
trust-wallet-files/
├── info.json     (토큰 정보)
└── logo.png      (256x256 로고)
```

## 🔧 **등록 절차**

### **1. 포크한 리포지토리에서 작업**
```bash
# 포크한 리포지토리 클론
git clone https://github.com/YOUR_USERNAME/assets.git
cd assets

# 새 브랜치 생성
git checkout -b add-akc-token
```

### **2. 폴더 구조 생성**
```bash
# BSC 메인넷 폴더로 이동
cd blockchains/smartchain/assets/

# AKC 토큰 폴더 생성
mkdir 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
cd 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
```

### **3. 파일 복사**
```bash
# 준비된 파일들을 복사
cp /path/to/ak-coin/trust-wallet-files/info.json ./
cp /path/to/ak-coin/trust-wallet-files/logo.png ./
```

### **4. 파일 검증**
```bash
# 파일 구조 확인
ls -la
# 출력 예상:
# info.json
# logo.png

# info.json 내용 확인
cat info.json
```

### **5. 커밋 및 푸시**
```bash
git add .
git commit -m "Add AKASSECT (AKC) token to BSC mainnet

- Contract: 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- Symbol: AKC
- Network: BSC Mainnet
- Type: BEP20"

git push origin add-akc-token
```

### **6. Pull Request 생성**
1. GitHub에서 포크한 리포지토리로 이동
2. "Compare & pull request" 버튼 클릭
3. 제목: `Add AKASSECT (AKC) token to BSC mainnet`
4. 설명:
```markdown
## Token Information
- **Name**: AKASSECT
- **Symbol**: AKC
- **Contract**: 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- **Network**: BSC Mainnet
- **Type**: BEP20
- **Decimals**: 18
- **Total Supply**: 300,000,000 AKC

## Links
- **BscScan**: https://bscscan.com/token/0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- **GitHub**: https://github.com/akassectakc-a11y/AKC-COIN
- **Website**: https://akassect.com

## Verification
- [x] Contract deployed on BSC mainnet
- [x] Logo file (256x256 PNG)
- [x] info.json with correct information
- [x] Following Trust Wallet guidelines
```

## 📋 **체크리스트**

### **파일 요구사항**
- [x] **info.json**: 올바른 형식과 정보
- [x] **logo.png**: 256x256 PNG 형식
- [x] **폴더명**: 정확한 컨트랙트 주소 (체크섬)
- [x] **네트워크**: BSC 메인넷 (`smartchain`)

### **정보 검증**
- [x] **컨트랙트 주소**: `0x02D8b729885290a3CA724F3Df5793b74Ff226A17`
- [x] **심볼**: AKC
- [x] **이름**: AKASSECT
- [x] **Decimals**: 18
- [x] **타입**: BEP20

### **링크 검증**
- [x] **BscScan**: https://bscscan.com/token/0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- [x] **GitHub**: https://github.com/akassectakc-a11y/AKC-COIN
- [x] **웹사이트**: https://akassect.com

## ⏰ **예상 처리 시간**
- **PR 검토**: 1-7일
- **승인 후 반영**: 24시간 이내
- **Trust Wallet 앱 반영**: 1-3일

## 🎯 **완료 후 확인**
1. Trust Wallet에서 토큰 검색
2. 자동으로 로고와 정보 표시 확인
3. 토큰 추가 시 수동 입력 불필요

---
**생성일**: 2025-11-05  
**상태**: 준비 완료  
**다음 단계**: Pull Request 생성
