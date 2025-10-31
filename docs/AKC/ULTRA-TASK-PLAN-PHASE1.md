# 🚀 AKC Token 초고도 세부 작업 계획서 - Phase 1

> **기반 인프라 구축 단계**
> 예상 소요 시간: **3시간 45분**
> 담당: DevOps, Blockchain Dev

---

## 📋 Phase 1 목표
- 로컬 BNB 사설망 구축 완료
- 200개 계정 자동 생성
- BlockScout 익스플로러 연동
- 개발 환경 완전 구축

---

## Task 1.1: 프로젝트 디렉터리 구조 생성 (15분)

### Step 1.1.1: 루트 디렉터리 생성 (2분)
```bash
# 실행 시간: 120초
mkdir -p /repo/ainova/akc-token
cd /repo/ainova/akc-token
git init
```

**체크포인트:**
- ✅ `/repo/ainova/akc-token` 디렉터리 존재
- ✅ `.git` 초기화 완료

### Step 1.1.2: apps 디렉터리 구조 생성 (3분)
```bash
# 실행 시간: 180초
mkdir -p apps/akc-contract/{contracts,scripts,test,deployments/local}
touch apps/akc-contract/{package.json,hardhat.config.ts,.env.example}
```

**체크포인트:**
- ✅ `apps/akc-contract/contracts/` 디렉터리 존재
- ✅ `apps/akc-contract/scripts/` 디렉터리 존재
- ✅ `apps/akc-contract/test/` 디렉터리 존재

### Step 1.1.3: ops 디렉터리 구조 생성 (3분)
```bash
# 실행 시간: 180초
mkdir -p ops/chains/bnb-local/keystore
mkdir -p ops/blockscout/env
touch ops/chains/bnb-local/{genesis.json,accounts.json,config.toml,docker-compose.yml}
touch ops/blockscout/docker-compose.yml
```

**체크포인트:**
- ✅ `ops/chains/bnb-local/` 디렉터리 존재
- ✅ `ops/blockscout/` 디렉터리 존재

### Step 1.1.4: assets 및 docs 디렉터리 생성 (2분)
```bash
# 실행 시간: 120초
mkdir -p assets/akc
mkdir -p assets-cdn/akc
mkdir -p metadata
mkdir -p docs/AKC/reports
mkdir -p var/log/ainova/akc
```

**체크포인트:**
- ✅ `assets/akc/` 디렉터리 존재
- ✅ `docs/AKC/` 디렉터리 존재
- ✅ `var/log/ainova/akc/` 디렉터리 존재

### Step 1.1.5: CI/CD 디렉터리 생성 (2분)
```bash
# 실행 시간: 120초
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

**체크포인트:**
- ✅ `.github/workflows/` 디렉터리 존재

### Step 1.1.6: 디렉터리 구조 검증 (3분)
```bash
# 실행 시간: 180초
tree -L 4 /repo/ainova/akc-token > /tmp/akc-structure.txt
```

**체크포인트:**
- ✅ 모든 디렉터리 구조 확인 완료
- ✅ `tree` 명령 실행 결과 저장 완료

---

## Task 1.2: Node.js 개발 환경 구축 (20분)

### Step 1.2.1: Node.js 버전 확인 및 설치 (5분)
```bash
# 실행 시간: 300초
node --version  # v18.20.4 확인
# 필요시 nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install 18.20.4
nvm use 18.20.4
```

**체크포인트:**
- ✅ Node.js v18.20.4 설치 완료
- ✅ `node --version` 출력 확인

### Step 1.2.2: pnpm 설치 및 확인 (3분)
```bash
# 실행 시간: 180초
npm install -g pnpm@latest
pnpm --version  # >=9 확인
```

**체크포인트:**
- ✅ pnpm 9.x 이상 설치 완료
- ✅ `pnpm --version` 출력 확인

### Step 1.2.3: package.json 작성 (5분)
```json
# 파일: /repo/ainova/akc-token/apps/akc-contract/package.json
# 실행 시간: 300초
{
  "name": "akc-contract",
  "version": "1.0.0",
  "description": "AKASSECT (AKC) BEP-20 Token",
  "main": "index.js",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy": "hardhat run scripts/deploy.ts --network local",
    "test-transfer": "ts-node scripts/test-transfer.ts"
  },
  "keywords": ["BEP-20", "AKC", "Token"],
  "author": "AINOVA",
  "license": "MIT",
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^2.0.0",
    "@nomiclabs/hardhat-ethers": "^2.2.3",
    "@openzeppelin/contracts": "^4.9.3",
    "hardhat": "^2.17.0",
    "ethers": "^5.7.2",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.0",
    "@types/node": "^20.5.0"
  }
}
```

**체크포인트:**
- ✅ `package.json` 파일 생성 완료
- ✅ 모든 필수 의존성 정의 완료

### Step 1.2.4: 의존성 설치 (7분)
```bash
# 실행 시간: 420초
cd /repo/ainova/akc-token/apps/akc-contract
pnpm install
```

**체크포인트:**
- ✅ `node_modules/` 디렉터리 생성 완료
- ✅ `pnpm-lock.yaml` 파일 생성 완료
- ✅ 설치 완료 메시지 확인

---

## Task 1.3: BNB 사설망 계정 생성 (30분)

### Step 1.3.1: 계정 생성 스크립트 작성 (10분)
```javascript
# 파일: /repo/ainova/akc-token/ops/chains/bnb-local/generate-accounts.js
# 실행 시간: 600초
const { ethers } = require('ethers');
const fs = require('fs');

async function generateAccounts(count = 200) {
  const accounts = [];
  const treasury = ethers.Wallet.createRandom();
  
  accounts.push({
    role: 'treasury',
    address: treasury.address,
    privateKey: treasury.privateKey,
    balance: ethers.utils.parseEther('1000000000').toString() // 10억 BNB
  });
  
  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    accounts.push({
      role: `test-account-${i + 1}`,
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance: ethers.utils.parseEther('10000').toString() // 1만 BNB
    });
  }
  
  fs.writeFileSync(
    './accounts.json',
    JSON.stringify(accounts, null, 2)
  );
  
  console.log(`✅ ${accounts.length}개 계정 생성 완료`);
  console.log(`📝 Treasury: ${treasury.address}`);
}

generateAccounts(200);
```

**체크포인트:**
- ✅ `generate-accounts.js` 파일 생성 완료
- ✅ 스크립트 문법 검증 완료

### Step 1.3.2: 계정 생성 실행 (15분)
```bash
# 실행 시간: 900초
cd /repo/ainova/akc-token/ops/chains/bnb-local
node generate-accounts.js
```

**체크포인트:**
- ✅ `accounts.json` 파일 생성 완료
- ✅ 201개 계정 (Treasury 1개 + Test 200개) 확인
- ✅ 모든 계정에 privateKey, address 존재

### Step 1.3.3: 계정 검증 (5분)
```bash
# 실행 시간: 300초
cat accounts.json | jq 'length'  # 201 확인
cat accounts.json | jq '.[0].role'  # "treasury" 확인
cat accounts.json | jq '.[1].role'  # "test-account-1" 확인
```

**체크포인트:**
- ✅ 계정 개수 201개 확인
- ✅ Treasury 계정 존재 확인
- ✅ 각 계정 balance 필드 존재

---

## Task 1.4: Genesis 파일 생성 (25분)

### Step 1.4.1: genesis.json 템플릿 작성 (15분)
```json
# 파일: /repo/ainova/akc-token/ops/chains/bnb-local/genesis.json
# 실행 시간: 900초
{
  "config": {
    "chainId": 1337,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0
  },
  "difficulty": "0x400",
  "gasLimit": "0x8000000",
  "alloc": {}
}
```

**체크포인트:**
- ✅ `genesis.json` 기본 구조 생성
- ✅ chainId 1337 설정 완료

### Step 1.4.2: alloc 자동 생성 스크립트 작성 (7분)
```javascript
# 파일: /repo/ainova/akc-token/ops/chains/bnb-local/update-genesis.js
# 실행 시간: 420초
const fs = require('fs');

const accounts = JSON.parse(fs.readFileSync('./accounts.json', 'utf8'));
const genesis = JSON.parse(fs.readFileSync('./genesis.json', 'utf8'));

accounts.forEach(account => {
  genesis.alloc[account.address.toLowerCase()] = {
    balance: account.balance
  };
});

fs.writeFileSync('./genesis.json', JSON.stringify(genesis, null, 2));
console.log(`✅ ${accounts.length}개 계정 alloc 추가 완료`);
```

**체크포인트:**
- ✅ `update-genesis.js` 파일 생성 완료

### Step 1.4.3: alloc 생성 실행 (3분)
```bash
# 실행 시간: 180초
cd /repo/ainova/akc-token/ops/chains/bnb-local
node update-genesis.js
```

**체크포인트:**
- ✅ `genesis.json` alloc 섹션 업데이트 완료
- ✅ 201개 주소 alloc 확인

---

## Task 1.5: Docker Compose 구성 (35분)

### Step 1.5.1: BNB 노드 docker-compose.yml 작성 (20분)
```yaml
# 파일: /repo/ainova/akc-token/ops/chains/bnb-local/docker-compose.yml
# 실행 시간: 1200초
version: '3.8'

services:
  geth:
    image: ethereum/client-go:v1.13.0
    container_name: akc-bnb-local
    ports:
      - "8545:8545"
      - "8546:8546"
      - "30303:30303"
    volumes:
      - ./genesis.json:/genesis.json
      - ./data:/root/.ethereum
    command:
      - --networkid=1337
      - --http
      - --http.addr=0.0.0.0
      - --http.port=8545
      - --http.api=eth,net,web3,personal,admin,debug
      - --http.corsdomain=*
      - --ws
      - --ws.addr=0.0.0.0
      - --ws.port=8546
      - --ws.api=eth,net,web3,personal,admin,debug
      - --ws.origins=*
      - --allow-insecure-unlock
      - --nodiscover
      - --maxpeers=0
      - --mine
      - --miner.threads=1
      - --miner.etherbase=0x0000000000000000000000000000000000000000
    restart: unless-stopped
```

**체크포인트:**
- ✅ `docker-compose.yml` 파일 생성 완료
- ✅ 포트 8545, 8546 매핑 확인

### Step 1.5.2: Docker 네트워크 및 볼륨 검증 (5분)
```bash
# 실행 시간: 300초
docker network ls
docker volume ls
```

**체크포인트:**
- ✅ Docker 실행 가능 확인

### Step 1.5.3: 사설망 초기화 및 실행 (10분)
```bash
# 실행 시간: 600초
cd /repo/ainova/akc-token/ops/chains/bnb-local
docker compose up -d
docker logs akc-bnb-local --tail 50
```

**체크포인트:**
- ✅ 컨테이너 `akc-bnb-local` 실행 중
- ✅ RPC 포트 8545 Listen 확인
- ✅ 블록 생성 로그 확인

---

## Task 1.6: BlockScout 익스플로러 구성 (40분)

### Step 1.6.1: BlockScout docker-compose.yml 작성 (25분)
```yaml
# 파일: /repo/ainova/akc-token/ops/blockscout/docker-compose.yml
# 실행 시간: 1500초
version: '3.8'

services:
  db:
    image: postgres:14
    container_name: akc-blockscout-db
    environment:
      POSTGRES_DB: blockscout
      POSTGRES_USER: blockscout
      POSTGRES_PASSWORD: blockscout_pass
    volumes:
      - blockscout-db-data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: akc-blockscout-redis
    restart: unless-stopped

  blockscout:
    image: blockscout/blockscout:latest
    container_name: akc-blockscout
    depends_on:
      - db
      - redis
    environment:
      DATABASE_URL: postgresql://blockscout:blockscout_pass@db:5432/blockscout
      REDIS_URL: redis://redis:6379
      ETHEREUM_JSONRPC_VARIANT: geth
      ETHEREUM_JSONRPC_HTTP_URL: http://host.docker.internal:8545
      ETHEREUM_JSONRPC_WS_URL: ws://host.docker.internal:8546
      CHAIN_ID: 1337
      NETWORK: AKC Local
      SUBNETWORK: BNB Chain
      LOGO: /images/akc-logo.png
      COIN: BNB
    ports:
      - "4000:4000"
    restart: unless-stopped

volumes:
  blockscout-db-data:
```

**체크포인트:**
- ✅ BlockScout `docker-compose.yml` 생성 완료
- ✅ PostgreSQL, Redis, BlockScout 서비스 정의 완료

### Step 1.6.2: BlockScout 실행 (10분)
```bash
# 실행 시간: 600초
cd /repo/ainova/akc-token/ops/blockscout
docker compose up -d
docker logs akc-blockscout --tail 100
```

**체크포인트:**
- ✅ 컨테이너 `akc-blockscout` 실행 중
- ✅ PostgreSQL 연결 성공 로그 확인
- ✅ 포트 4000 Listen 확인

### Step 1.6.3: BlockScout 웹 접속 확인 (5분)
```bash
# 실행 시간: 300초
curl http://localhost:4000
```

**체크포인트:**
- ✅ HTTP 200 응답 확인
- ✅ 웹 브라우저에서 `http://localhost:4000` 접속 가능

---

## Task 1.7: 환경변수 파일 생성 (10분)

### Step 1.7.1: .env.example 작성 (5분)
```bash
# 파일: /repo/ainova/akc-token/apps/akc-contract/.env.example
# 실행 시간: 300초
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0x...
CHAIN_ID=1337
CONFIRMATIONS=1
TREASURY_ADDRESS=0x...
```

**체크포인트:**
- ✅ `.env.example` 파일 생성 완료

### Step 1.7.2: 실제 .env 파일 생성 (5분)
```bash
# 실행 시간: 300초
cd /repo/ainova/akc-token/apps/akc-contract
cp .env.example .env

# accounts.json에서 treasury 정보 추출
TREASURY_KEY=$(cat ../../ops/chains/bnb-local/accounts.json | jq -r '.[0].privateKey')
TREASURY_ADDR=$(cat ../../ops/chains/bnb-local/accounts.json | jq -r '.[0].address')

# .env 파일 업데이트
sed -i "s|PRIVATE_KEY=.*|PRIVATE_KEY=$TREASURY_KEY|" .env
sed -i "s|TREASURY_ADDRESS=.*|TREASURY_ADDRESS=$TREASURY_ADDR|" .env
```

**체크포인트:**
- ✅ `.env` 파일 생성 완료
- ✅ Treasury 개인키 및 주소 설정 완료
- ✅ `.gitignore`에 `.env` 추가 완료

---

## Task 1.8: Hardhat 설정 (20분)

### Step 1.8.1: hardhat.config.ts 작성 (15분)
```typescript
# 파일: /repo/ainova/akc-token/apps/akc-contract/hardhat.config.ts
# 실행 시간: 900초
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    local: {
      url: process.env.RPC_URL || "http://127.0.0.1:8545",
      chainId: parseInt(process.env.CHAIN_ID || "1337"),
      accounts: [process.env.PRIVATE_KEY || ""]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
```

**체크포인트:**
- ✅ `hardhat.config.ts` 파일 생성 완료
- ✅ Solidity 0.8.4 버전 설정 완료
- ✅ local 네트워크 설정 완료

### Step 1.8.2: TypeScript 설정 (5분)
```json
# 파일: /repo/ainova/akc-token/apps/akc-contract/tsconfig.json
# 실행 시간: 300초
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

**체크포인트:**
- ✅ `tsconfig.json` 파일 생성 완료

---

## Phase 1 완료 체크리스트

### 인프라 검증 (5분)
```bash
# 실행 시간: 300초
# BNB 노드 상태 확인
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# BlockScout 상태 확인
curl http://localhost:4000/api/v2/stats

# 디렉터리 구조 최종 확인
tree -L 3 /repo/ainova/akc-token
```

### 완료 항목
- ✅ 프로젝트 디렉터리 구조 생성 (15분)
- ✅ Node.js 개발 환경 구축 (20분)
- ✅ 201개 계정 생성 (30분)
- ✅ Genesis 파일 생성 (25분)
- ✅ BNB 사설망 Docker 구성 및 실행 (35분)
- ✅ BlockScout 익스플로러 구성 및 실행 (40분)
- ✅ 환경변수 파일 생성 (10분)
- ✅ Hardhat 설정 완료 (20분)
- ✅ 인프라 검증 (5분)

### 총 소요 시간: **3시간 45분**

### 다음 단계
**Phase 2: 스마트 컨트랙트 개발** (예상 2시간 30분)
