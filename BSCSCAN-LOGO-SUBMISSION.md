# 🔍 BscScan 로고 등록 가이드

## 📋 **BscScan 로고 등록 방법**

### **1. BscScan 공식 제출**
**URL**: https://bscscan.com/contactus

**제출 정보:**
```
Subject: Token Logo Submission Request

Token Name: AKASSECT
Token Symbol: AKC
Contract Address: 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
Network: BSC Mainnet

Logo Requirements:
- Format: PNG
- Size: 256x256 pixels
- Background: Transparent
- High Quality: Yes

Additional Information:
- Total Supply: 300,000,000 AKC
- Decimals: 18
- Token Type: BEP-20
- GitHub: https://github.com/akassectakc-a11y/AKC-COIN
- Website: https://akassect.com
```

### **2. 필요한 첨부 파일**
- **로고 파일**: `docs/logo/png/AKC-Icon-256.png`
- **컨트랙트 검증**: 소스코드 검증 필요
- **프로젝트 정보**: GitHub 링크, 웹사이트

### **3. 검증 요구사항**
```bash
# BscScan 컨트랙트 검증 (필수)
npx hardhat verify --network bscMainnet 0x02D8b729885290a3CA724F3Df5793b74Ff226A17 "0xb6fbdb9af4c956ca953c4536fec5b28361cadac1"
```

## ⏰ **처리 시간**
- **검토 기간**: 1-2주
- **승인 후 반영**: 24-48시간
- **조건**: 컨트랙트 검증 완료 필수

## 📊 **현재 상태**
- [x] 컨트랙트 배포 완료
- [x] 로고 파일 준비 완료
- [ ] 컨트랙트 소스코드 검증 필요
- [ ] BscScan 제출 필요

---
**참고**: BscScan 로고 등록은 무료이지만 검증된 컨트랙트만 가능합니다.
