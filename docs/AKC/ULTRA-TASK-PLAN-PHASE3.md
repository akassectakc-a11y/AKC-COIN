# 🚀 AKC Token 초고도 세부 작업 계획서 - Phase 3

> **배포 및 검증 단계**
> 예상 소요 시간: **1시간 30분**
> 담당: Blockchain Dev, DevOps

---

## 📋 Phase 3 목표
- 로컬 네트워크에 AKC 토큰 배포
- 배포 검증 및 Treasury 잔액 확인
- BlockScout에서 컨트랙트 확인
- 배포 정보 문서화

---

## Task 3.1: 사전 배포 체크 (10분)

### Step 3.1.1: 네트워크 연결 확인 (3분)
```bash
# 실행 시간: 180초
# BNB 로컬 노드 상태 확인
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_blockNumber",
    "params":[],
    "id":1
  }'
```

**체크포인트:**
- ✅ HTTP 200 응답
- ✅ blockNumber 결과 반환
- ✅ 최신 블록 생성 확인

### Step 3.1.2: 배포자 계정 잔액 확인 (4분)
```bash
# 실행 시간: 240초
cd /repo/ainova/akc-token/apps/akc-contract

# .env 파일 존재 확인
cat .env | grep TREASURY_ADDRESS
cat .env | grep PRIVATE_KEY

# 배포자 잔액 조회
pnpm hardhat console --network local
```

```javascript
// Hardhat console에서 실행
const [deployer] = await ethers.getSigners();
const balance = await deployer.getBalance();
console.log(`배포자: ${deployer.address}`);
console.log(`잔액: ${ethers.utils.formatEther(balance)} BNB`);
```

**체크포인트:**
- ✅ `.env` 파일 TREASURY_ADDRESS 설정 완료
- ✅ `.env` 파일 PRIVATE_KEY 설정 완료
- ✅ 배포자 잔액 > 0 BNB

### Step 3.1.3: 컨트랙트 재컴파일 (3분)
```bash
# 실행 시간: 180초
pnpm hardhat clean
pnpm hardhat compile
```

**체크포인트:**
- ✅ 컴파일 성공 (0 errors, 0 warnings)
- ✅ `artifacts/contracts/AKC.sol/AKC.json` 생성
- ✅ ABI 및 Bytecode 생성 확인

---

## Task 3.2: 컨트랙트 배포 (15분)

### Step 3.2.1: 배포 실행 (10분)
```bash
# 실행 시간: 600초
cd /repo/ainova/akc-token/apps/akc-contract
pnpm hardhat run scripts/deploy.ts --network local
```

**예상 출력:**
```
🚀 AKC Token 배포 시작...
📝 Treasury: 0x1234567890123456789012345678901234567890
👤 배포자: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
💰 배포자 잔액: 10000.0 BNB

⏳ 컨트랙트 배포 중...
✅ AKC 배포 완료: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📊 총 발행량: 300,000,000 AKC

💾 배포 정보 저장: deployments/local/AKC.json
```

**체크포인트:**
- ✅ 배포 트랜잭션 성공
- ✅ 컨트랙트 주소 반환
- ✅ `deployments/local/AKC.json` 파일 생성

### Step 3.2.2: 배포 정보 확인 (3분)
```bash
# 실행 시간: 180초
cat deployments/local/AKC.json | jq '.'
```

**체크포인트:**
- ✅ `contractAddress` 필드 존재
- ✅ `treasuryAddress` 필드 존재
- ✅ `transactionHash` 필드 존재
- ✅ `abi` 배열 존재

### Step 3.2.3: 환경변수에 컨트랙트 주소 추가 (2분)
```bash
# 실행 시간: 120초
AKC_ADDRESS=$(cat deployments/local/AKC.json | jq -r '.contractAddress')
echo "AKC_CONTRACT_ADDRESS=$AKC_ADDRESS" >> .env
```

**체크포인트:**
- ✅ `.env` 파일에 `AKC_CONTRACT_ADDRESS` 추가

---

## Task 3.3: 배포 검증 (20분)

### Step 3.3.1: 토큰 기본 정보 확인 (8분)
```bash
# 실행 시간: 480초
pnpm hardhat console --network local
```

```javascript
// Hardhat console에서 실행
const AKC = await ethers.getContractFactory("AKC");
const akc = AKC.attach(process.env.AKC_CONTRACT_ADDRESS);

// 1. 이름 확인
const name = await akc.name();
console.log(`이름: ${name}`); // "AINOVA Key Coin"

// 2. 심볼 확인
const symbol = await akc.symbol();
console.log(`심볼: ${symbol}`); // "AKC"

// 3. 소수점 확인
const decimals = await akc.decimals();
console.log(`Decimals: ${decimals}`); // 18

// 4. 총 발행량 확인
const totalSupply = await akc.totalSupply();
console.log(`총 발행량: ${ethers.utils.formatEther(totalSupply)} AKC`);
// "300000000.0"
```

**체크포인트:**
- ✅ name = "AINOVA Key Coin"
- ✅ symbol = "AKC"
- ✅ decimals = 18
- ✅ totalSupply = 300,000,000 * 10^18

### Step 3.3.2: Treasury 잔액 확인 (5분)
```javascript
// 실행 시간: 300초
// Hardhat console에서 계속
const treasuryAddress = process.env.TREASURY_ADDRESS;
const balance = await akc.balanceOf(treasuryAddress);
console.log(`Treasury 주소: ${treasuryAddress}`);
console.log(`Treasury 잔액: ${ethers.utils.formatEther(balance)} AKC`);
// "300000000.0"
```

**체크포인트:**
- ✅ Treasury 잔액 = 300,000,000 AKC
- ✅ Treasury가 전체 발행량 보유

### Step 3.3.3: Owner 확인 (4분)
```javascript
// 실행 시간: 240초
// Hardhat console에서 계속
const owner = await akc.owner();
const [deployer] = await ethers.getSigners();
console.log(`Owner: ${owner}`);
console.log(`Deployer: ${deployer.address}`);
console.log(`일치 여부: ${owner === deployer.address}`);
```

**체크포인트:**
- ✅ owner = deployer.address
- ✅ Ownable 기능 정상 작동

### Step 3.3.4: Pause 상태 확인 (3분)
```javascript
// 실행 시간: 180초
// Hardhat console에서 계속
const paused = await akc.paused();
console.log(`Paused: ${paused}`); // false
```

**체크포인트:**
- ✅ paused = false (정상 전송 가능 상태)

---

## Task 3.4: BlockScout 익스플로러 연동 (15분)

### Step 3.4.1: BlockScout 접속 확인 (3분)
```bash
# 실행 시간: 180초
curl http://localhost:4000/api/v2/stats
```

**체크포인트:**
- ✅ HTTP 200 응답
- ✅ total_blocks > 0

### Step 3.4.2: 컨트랙트 주소 검색 (5분)
```bash
# 실행 시간: 300초
AKC_ADDRESS=$(cat deployments/local/AKC.json | jq -r '.contractAddress')

# 브라우저에서 열기
open "http://localhost:4000/address/${AKC_ADDRESS}"
```

**체크포인트:**
- ✅ BlockScout에서 컨트랙트 주소 조회 가능
- ✅ 컨트랙트 생성 트랜잭션 확인
- ✅ Balance 표시 확인

### Step 3.4.3: 배포 트랜잭션 확인 (4분)
```bash
# 실행 시간: 240초
TX_HASH=$(cat deployments/local/AKC.json | jq -r '.transactionHash')

# 브라우저에서 열기
open "http://localhost:4000/tx/${TX_HASH}"
```

**체크포인트:**
- ✅ 트랜잭션 상태: Success
- ✅ From 주소 = Deployer
- ✅ To 주소 = null (컨트랙트 생성)
- ✅ Input Data 확인

### Step 3.4.4: Minted 이벤트 확인 (3분)
```bash
# 실행 시간: 180초
# BlockScout에서 Logs 탭 확인
# 브라우저에서 수동 확인
```

**체크포인트:**
- ✅ Minted 이벤트 존재
- ✅ to = Treasury 주소
- ✅ amount = 300,000,000 * 10^18

---

## Task 3.5: 간단한 전송 테스트 (15분)

### Step 3.5.1: Test 계정으로 전송 (8분)
```javascript
// 실행 시간: 480초
// Hardhat console에서 실행
const AKC = await ethers.getContractFactory("AKC");
const akc = AKC.attach(process.env.AKC_CONTRACT_ADDRESS);

// Treasury 계정으로 연결
const treasuryKey = process.env.PRIVATE_KEY;
const treasuryWallet = new ethers.Wallet(treasuryKey, ethers.provider);
const akcWithTreasury = akc.connect(treasuryWallet);

// Test 계정 1로 1,000 AKC 전송
const accounts = JSON.parse(
  require('fs').readFileSync('../../ops/chains/bnb-local/accounts.json', 'utf8')
);
const testAccount1 = accounts[1].address; // test-account-1

const amount = ethers.utils.parseEther("1000");
const tx = await akcWithTreasury.transfer(testAccount1, amount);
const receipt = await tx.wait();

console.log(`✅ 전송 완료: ${receipt.transactionHash}`);
console.log(`받는 사람: ${testAccount1}`);
console.log(`전송량: 1,000 AKC`);
```

**체크포인트:**
- ✅ 전송 트랜잭션 성공
- ✅ receipt.status = 1

### Step 3.5.2: 잔액 확인 (4분)
```javascript
// 실행 시간: 240초
// Hardhat console에서 계속
const balance = await akc.balanceOf(testAccount1);
console.log(`Test 계정 1 잔액: ${ethers.utils.formatEther(balance)} AKC`);
// "1000.0"

const treasuryBalance = await akc.balanceOf(treasuryWallet.address);
console.log(`Treasury 잔액: ${ethers.utils.formatEther(treasuryBalance)} AKC`);
// "299999000.0"
```

**체크포인트:**
- ✅ Test 계정 1 잔액 = 1,000 AKC
- ✅ Treasury 잔액 = 299,999,000 AKC

### Step 3.5.3: BlockScout에서 전송 확인 (3분)
```bash
# 실행 시간: 180초
# 브라우저에서 testAccount1 주소 검색
open "http://localhost:4000/address/${testAccount1}"
```

**체크포인트:**
- ✅ Transactions 탭에 전송 내역 표시
- ✅ Token Transfers 확인
- ✅ Balance = 1,000 AKC

---

## Task 3.6: 배포 문서 작성 (15분)

### Step 3.6.1: DEPLOYMENT-LOG.md 생성 (10분)
```markdown
# 파일: /repo/ainova/akc-token/docs/AKC/DEPLOYMENT-LOG.md
# 실행 시간: 600초

# AKC Token 배포 로그

## 배포 정보

- **배포일시**: 2025-10-31 19:30:00 KST
- **네트워크**: BNB Local (Chain ID: 1337)
- **컨트랙트 주소**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **배포 트랜잭션**: `0xabc123...`
- **배포자**: `0xdef456...`
- **Treasury**: `0x789abc...`

## 토큰 스펙

- **이름**: AINOVA Key Coin
- **심볼**: AKC
- **Decimals**: 18
- **총 발행량**: 300,000,000 AKC

## 초기 배포 상태

| 항목 | 값 |
|------|-----|
| Treasury 잔액 | 300,000,000 AKC |
| Owner | 0xdef456... |
| Paused | false |

## 검증 결과

- ✅ 토큰 기본 정보 확인 완료
- ✅ Treasury 잔액 검증 완료
- ✅ BlockScout 연동 확인
- ✅ 전송 테스트 성공

## 테스트 전송

- **수신자**: test-account-1 (0x111222...)
- **전송량**: 1,000 AKC
- **트랜잭션**: `0x333444...`
- **결과**: SUCCESS

## 다음 단계

- Phase 4: 대량 전송 테스트
- Phase 5: 보안 감사 및 최적화
```

**체크포인트:**
- ✅ `DEPLOYMENT-LOG.md` 파일 생성
- ✅ 모든 배포 정보 기록

### Step 3.6.2: README 업데이트 (5분)
```markdown
# 파일: /repo/ainova/akc-token/README.md (추가)
# 실행 시간: 300초

## 빠른 시작

### 1. 사설망 실행
```bash
cd ops/chains/bnb-local
docker compose up -d
```

### 2. BlockScout 실행
```bash
cd ops/blockscout
docker compose up -d
```

### 3. 컨트랙트 배포
```bash
cd apps/akc-contract
pnpm install
pnpm hardhat run scripts/deploy.ts --network local
```

### 4. 배포 확인
- BlockScout: http://localhost:4000
- 컨트랙트 주소: `deployments/local/AKC.json` 참조
```

**체크포인트:**
- ✅ README.md 빠른 시작 섹션 추가

---

## Phase 3 완료 체크리스트

### 최종 검증 (5분)
```bash
# 실행 시간: 300초
# 1. 배포 파일 확인
ls -lh deployments/local/AKC.json

# 2. 문서 확인
ls -lh docs/AKC/DEPLOYMENT-LOG.md

# 3. BlockScout 최종 확인
curl http://localhost:4000/api/v2/addresses/${AKC_ADDRESS}

# 4. 네트워크 상태 확인
docker ps | grep akc
```

### 완료 항목
- ✅ 사전 배포 체크 (10분)
- ✅ 컨트랙트 배포 실행 (15분)
- ✅ 배포 검증 (20분)
- ✅ BlockScout 익스플로러 연동 (15분)
- ✅ 간단한 전송 테스트 (15분)
- ✅ 배포 문서 작성 (15분)

### 산출물
- ✅ `deployments/local/AKC.json` (배포 정보)
- ✅ `docs/AKC/DEPLOYMENT-LOG.md` (배포 로그)
- ✅ README.md 업데이트 (빠른 시작 가이드)
- ✅ BlockScout에서 컨트랙트 확인 가능
- ✅ 전송 테스트 트랜잭션 1건

### 검증 결과
- ✅ 컨트랙트 주소 정상 배포
- ✅ Treasury 300,000,000 AKC 보유
- ✅ Owner 권한 정상
- ✅ Pause 기능 정상
- ✅ Transfer 기능 정상

### 총 소요 시간: **1시간 30분**

### 다음 단계
**Phase 4: 대량 전송 테스트** (예상 2시간)
