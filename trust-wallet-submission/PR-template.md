# 📱 Trust Wallet Assets Pull Request

## 🔧 **PR 생성 단계**

### **1. 리포지토리 포크 및 클론**
```bash
# 1. https://github.com/trustwallet/assets 포크 (이미 완료)
# 2. 포크한 리포지토리 클론
git clone https://github.com/YOUR_USERNAME/assets.git
cd assets

# 3. 새 브랜치 생성
git checkout -b add-akc-token
```

### **2. 파일 구조 생성**
```bash
# BSC 메인넷 폴더로 이동
cd blockchains/smartchain/assets/

# AKC 토큰 폴더 생성 (체크섬 주소 사용)
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
# 예상 출력:
# info.json
# logo.png

# info.json 내용 확인
cat info.json
```

## 📝 **Pull Request 템플릿**

### **제목**
```
Add AKASSECT (AKC) token to BSC mainnet
```

### **설명**
```markdown
## Token Information
- **Name**: AKASSECT
- **Symbol**: AKC
- **Contract**: 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- **Network**: BSC Mainnet (smartchain)
- **Type**: BEP20
- **Decimals**: 18
- **Total Supply**: 300,000,000 AKC

## Links
- **BscScan**: https://bscscan.com/token/0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- **GitHub**: https://github.com/akassectakc-a11y/AKC-COIN
- **Website**: https://akassect.com

## Verification
- [x] Contract deployed on BSC mainnet
- [x] Logo file provided (256x256 PNG)
- [x] info.json with correct information
- [x] Following Trust Wallet asset guidelines
- [x] Contract address uses proper checksum format

## Files Added
- `blockchains/smartchain/assets/0x02D8b729885290a3CA724F3Df5793b74Ff226A17/info.json`
- `blockchains/smartchain/assets/0x02D8b729885290a3CA724F3Df5793b74Ff226A17/logo.png`

## Additional Information
This is a utility token deployed on BSC mainnet with proper documentation and active development. The contract has been deployed and is functioning correctly.
```

## 🔍 **체크리스트**

### **파일 요구사항**
- [x] **폴더명**: 정확한 체크섬 주소 사용
- [x] **info.json**: 올바른 형식과 정보
- [x] **logo.png**: 256x256 PNG, 투명 배경
- [x] **네트워크**: smartchain (BSC 메인넷)

### **정보 검증**
- [x] **컨트랙트 주소**: 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
- [x] **심볼**: AKC (대소문자 정확)
- [x] **이름**: AKASSECT
- [x] **타입**: BEP20
- [x] **소수점**: 18

### **링크 검증**
- [x] **BscScan**: 작동하는 링크
- [x] **GitHub**: 공개 리포지토리
- [x] **웹사이트**: 접근 가능한 URL

## ⏰ **처리 시간**
- **PR 검토**: 1-7일
- **승인 후 반영**: 24시간 이내
- **Trust Wallet 앱**: 1-3일 후 표시

## 🎯 **성공 기준**
1. PR이 승인되고 머지됨
2. Trust Wallet에서 토큰 검색 시 자동 표시
3. 로고와 정보가 정확히 표시됨
