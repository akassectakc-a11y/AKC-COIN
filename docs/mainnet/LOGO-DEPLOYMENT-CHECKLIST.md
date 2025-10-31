# ✅ 로고 배포 체크리스트

**작성일**: 2025-11-01  
**목적**: 로고 배포 프로세스 완전 검증

---

## 🎯 로고 파일 준비 상태

### ✅ 필수 로고 파일 확인

```bash
docs/logo/png/
├── AKC-Icon-256.png  ✅ (256x256) - BscScan, PancakeSwap
├── AKC-Icon-200.png  ✅ (200x200) - CoinMarketCap, CoinGecko
└── AKC-Logo-1024.png ✅ (1024x1024) - 고해상도
```

**상태**: ✅ **모든 로고 파일 준비 완료!**

---

## 📋 플랫폼별 로고 제출 체크리스트

### 1️⃣ BscScan (최우선!)

```
╔═══════════════════════════════════════════════════╗
║          BscScan 로고 제출                         ║
╠═══════════════════════════════════════════════════╣
║  시기:    배포 직후 즉시 (1시간 내)              ║
║  파일:    AKC-Icon-256.png                        ║
║  크기:    256x256 픽셀                            ║
║  형식:    PNG                                      ║
║  승인:    1-2시간                                  ║
╚═══════════════════════════════════════════════════╝
```

**제출 방법**:
1. https://bscscan.com/ 로그인
2. 컨트랙트 주소 검색
3. "More Options" 클릭
4. "Update Token Info" 선택
5. 로고 업로드: `docs/logo/png/AKC-Icon-256.png`
6. 토큰 정보 입력
7. Submit 클릭

**체크리스트**:
- [ ] BscScan 계정 생성 완료
- [ ] 컨트랙트 주소 확인
- [ ] AKC-Icon-256.png 준비
- [ ] 토큰 정보 준비 (이름, 심볼, 웹사이트)
- [ ] 제출 완료
- [ ] 승인 확인

---

### 2️⃣ CoinMarketCap

```
╔═══════════════════════════════════════════════════╗
║          CoinMarketCap 등록                        ║
╠═══════════════════════════════════════════════════╣
║  시기:    배포 후 2-3일                           ║
║  파일:    AKC-Icon-200.png                        ║
║  크기:    200x200 픽셀                            ║
║  형식:    PNG                                      ║
║  승인:    1-2주                                    ║
╚═══════════════════════════════════════════════════╝
```

**제출 방법**:
1. https://coinmarketcap.com/request/ 접속
2. "Add New Cryptocurrency" 선택
3. 필수 정보 입력:
   - Token Name: AKASSECT
   - Symbol: AKC
   - Contract Address: [배포된 주소]
   - Blockchain: BNB Smart Chain (BEP20)
   - Logo: `docs/logo/png/AKC-Icon-200.png`
   - Website: [프로젝트 웹사이트]
   - Whitepaper: [백서 URL]
4. Submit

**체크리스트**:
- [ ] CMC 계정 생성
- [ ] AKC-Icon-200.png 준비
- [ ] 프로젝트 웹사이트 준비
- [ ] 백서 준비 (선택)
- [ ] Telegram/Discord 링크
- [ ] 제출 완료
- [ ] 승인 대기

---

### 3️⃣ CoinGecko

```
╔═══════════════════════════════════════════════════╗
║          CoinGecko 등록                            ║
╠═══════════════════════════════════════════════════╣
║  시기:    배포 후 2-3일                           ║
║  파일:    AKC-Icon-200.png                        ║
║  크기:    200x200 픽셀                            ║
║  형식:    PNG                                      ║
║  승인:    1-2주                                    ║
╚═══════════════════════════════════════════════════╝
```

**제출 방법**:
1. https://www.coingecko.com/request-form
2. "List New Asset" 선택
3. 정보 입력:
   - Token Name: AKASSECT
   - Symbol: AKC
   - Contract: [주소]
   - Network: BNB Smart Chain
   - Logo: `docs/logo/png/AKC-Icon-200.png`
4. Submit

**체크리스트**:
- [ ] CoinGecko 계정
- [ ] AKC-Icon-200.png 준비
- [ ] 프로젝트 정보
- [ ] 제출 완료
- [ ] 승인 대기

---

### 4️⃣ PancakeSwap

```
╔═══════════════════════════════════════════════════╗
║          PancakeSwap 로고                          ║
╠═══════════════════════════════════════════════════╣
║  시기:    배포 후 1주일                           ║
║  파일:    AKC-Icon-256.png                        ║
║  크기:    256x256 픽셀                            ║
║  형식:    PNG                                      ║
║  승인:    3-7일                                    ║
╚═══════════════════════════════════════════════════╝
```

**제출 방법** (GitHub):
1. Fork: https://github.com/pancakeswap/token-list
2. 로고 파일 추가:
   ```bash
   cp docs/logo/png/AKC-Icon-256.png \
      pancakeswap-token-list/tokens/0x[CONTRACT_ADDRESS].png
   ```
3. tokens.json 수정:
   ```json
   {
     "name": "AKASSECT",
     "symbol": "AKC",
     "address": "0x[CONTRACT_ADDRESS]",
     "chainId": 56,
     "decimals": 18,
     "logoURI": "https://tokens.pancakeswap.finance/images/0x[ADDRESS].png"
   }
   ```
4. Pull Request 생성

**체크리스트**:
- [ ] GitHub 계정
- [ ] PancakeSwap 리포지토리 Fork
- [ ] AKC-Icon-256.png 추가
- [ ] tokens.json 수정
- [ ] Pull Request 생성
- [ ] 승인 대기

---

### 5️⃣ Trust Wallet

```
╔═══════════════════════════════════════════════════╗
║          Trust Wallet 로고                         ║
╠═══════════════════════════════════════════════════╣
║  시기:    배포 후 2-4주                           ║
║  파일:    AKC-Icon-256.png                        ║
║  크기:    256x256 픽셀                            ║
║  형식:    PNG                                      ║
║  승인:    1-2주                                    ║
╚═══════════════════════════════════════════════════╝
```

**제출 방법** (GitHub):
1. Fork: https://github.com/trustwallet/assets
2. 디렉토리 생성:
   ```bash
   blockchains/smartchain/assets/0x[CONTRACT_ADDRESS]/
   ```
3. 파일 추가:
   - `logo.png` (AKC-Icon-256.png)
   - `info.json`
4. Pull Request

**체크리스트**:
- [ ] Trust Wallet 리포지토리 Fork
- [ ] 디렉토리 생성
- [ ] logo.png 추가
- [ ] info.json 작성
- [ ] Pull Request
- [ ] 승인 대기

---

## 🎯 로고 제출 타임라인

```
Day 0 (배포일):
├─ ✅ 메인넷 배포
└─ ✅ BscScan 소스 검증

Day 0 (배포 1시간 후):
└─ ⚡ BscScan 로고 제출 (최우선!)

Day 2-3:
├─ 📝 CoinMarketCap 신청
└─ 📝 CoinGecko 신청

Week 1:
└─ 🥞 PancakeSwap PR 생성

Week 2-4:
└─ 👛 Trust Wallet PR 생성

승인 대기:
├─ BscScan: 1-2시간 ✅
├─ CMC: 1-2주
├─ CoinGecko: 1-2주
├─ PancakeSwap: 3-7일
└─ Trust Wallet: 1-2주
```

---

## ✅ 로고 파일 검증

### 파일 크기 체크

```bash
# 256x256 파일 확인
file docs/logo/png/AKC-Icon-256.png

# 200x200 파일 확인
file docs/logo/png/AKC-Icon-200.png

# 고해상도 확인
file docs/logo/png/AKC-Logo-1024.png
```

**예상 결과**:
```
AKC-Icon-256.png: PNG image data, 256 x 256, 8-bit...
AKC-Icon-200.png: PNG image data, 200 x 200, 8-bit...
AKC-Logo-1024.png: PNG image data, 1024 x 1024, 8-bit...
```

---

## 📝 필수 정보 준비

### 토큰 기본 정보

```
Token Name:        AKASSECT
Symbol:            AKC
Total Supply:      300,000,000 AKC
Decimals:          18
Contract Address:  [배포 후 입력]
Network:           BNB Smart Chain (BEP20)
Chain ID:          56
```

### 프로젝트 정보

```
Website:           [프로젝트 웹사이트]
Whitepaper:        [백서 URL]
Documentation:     [문서 URL]
GitHub:            [GitHub 리포지토리]
Telegram:          [텔레그램 채널]
Twitter/X:         [@계정]
Discord:           [Discord 서버]
```

---

## 🚨 주의사항

```
╔═══════════════════════════════════════════════════╗
║          로고 제출 주의사항                        ║
╠═══════════════════════════════════════════════════╣
║  1. 정확한 크기 사용                              ║
║     → 각 플랫폼별 요구사항 준수                   ║
║                                                    ║
║  2. PNG 형식만                                     ║
║     → JPG, GIF 불가                               ║
║                                                    ║
║  3. 투명 배경 권장                                ║
║     → 다양한 배경에 적용 가능                     ║
║                                                    ║
║  4. 고품질 유지                                    ║
║     → 최소 72 DPI 이상                            ║
║                                                    ║
║  5. 컨트랙트 주소 정확히                          ║
║     → 오타 시 등록 실패                           ║
╚═══════════════════════════════════════════════════╝
```

---

## 📊 최종 체크리스트

```
로고 파일 준비:
[ ] AKC-Icon-256.png (256x256) ✅
[ ] AKC-Icon-200.png (200x200) ✅
[ ] AKC-Logo-1024.png (1024x1024) ✅

플랫폼 계정:
[ ] BscScan 계정 생성
[ ] CoinMarketCap 계정
[ ] CoinGecko 계정
[ ] GitHub 계정
[ ] Trust Wallet assets Fork

프로젝트 정보:
[ ] 웹사이트 준비
[ ] 백서 작성
[ ] 소셜 미디어 링크
[ ] 문서 준비

배포 후 즉시:
[ ] 컨트랙트 배포 완료
[ ] BscScan 소스 검증
[ ] BscScan 로고 제출 (1시간 내!)

1주일 내:
[ ] CoinMarketCap 신청
[ ] CoinGecko 신청
[ ] PancakeSwap PR

1개월 내:
[ ] Trust Wallet PR
[ ] 기타 플랫폼
```

---

## 🎉 예상 결과

```
1-2시간 후:
✅ BscScan에 로고 표시

1-2주 후:
✅ CoinMarketCap 등록
✅ CoinGecko 등록

1개월 후:
✅ PancakeSwap 로고
✅ Trust Wallet 로고
✅ 모든 주요 플랫폼 로고 표시 완료!
```

---

**작성일**: 2025-11-01  
**상태**: ✅ **로고 배포 체크리스트 완비**  
**로고 파일**: ✅ **모두 준비 완료**
