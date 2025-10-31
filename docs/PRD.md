# 🪙 AINOVA **AKC Token** — BEP‑20 Internal Test **PRD.md**

> 문서 유형: **PRD (Product Requirements Document)**
> 리포지토리 루트: `/repo/ainova/akc-token/`
> 작성일: 2025-10-31
> 담당: Blockchain Dev (Eric), DevOps, QA, Design

---

## 1. 프로젝트 개요

**프로젝트명:** AKC (AKASSECT)
**토큰 표준:** BEP‑20 (BSC 호환, ERC‑20 인터페이스)
**총 발행량:** `300,000,000 AKC`
**소수점:** `18`
**심볼:** `AKC`
**테스트 단계:** 내부 네트워크 (BNB Local JSON 기반)
**배포 범위:** 로컬 사설망 전용 → BSC Testnet → BSC Mainnet (추후)

### 1.1 산출물(Deliverables)

* 스마트 컨트랙트: `/apps/akc-contract/contracts/AKC.sol`
* 배포 스크립트: `/apps/akc-contract/scripts/deploy.ts`
* 대량 전송 스크립트: `/apps/akc-contract/scripts/test-transfer.ts`
* 테스트 코드: `/apps/akc-contract/test/akc.spec.ts`
* 내부 체인 구성: `/ops/chains/bnb-local/` (genesis, accounts.json, docker-compose)
* 익스플로러(BlockScout): `/ops/blockscout/`
* 토큰 메타데이터: `/assets/metadata/AKC.json`
* 토큰 로고: `/assets/akc/logo.png`
* 문서/로그: `/docs/AKC/` (본 문서 포함), `/var/log/ainova/akc/`

---

## 2. 목표와 성공 기준

| 구분    | 목표                                 | 성공 기준(KPI)                                                 |
| ----- | ---------------------------------- | ---------------------------------------------------------- |
| 컨트랙트  | BEP‑20 규격, Mint/Burn/Pause/Ownable | 슬리더/미쓰릴 정적분석 주요 경고 0건, 유닛테스트 95%+ 커버리지                     |
| 전송성능  | 수백 동시 트랜잭션 안정                      | 500tx/배치 실패율 < 0.1%, 평균 Gas < 55,000                       |
| 운영    | 내부 체인 + 익스플로러                      | 사설망에서 블록/이벤트 실시간 확인 가능                                     |
| 표시/메타 | 로고/메타데이터 일관성                       | `/assets/metadata/AKC.json` · `/assets/akc/logo.png` 참조 일치 |

---

## 3. 범위(Scope)

### 3.1 포함 범위

* 사설 BNB 체인 구성 및 계정 200개+ 자동생성
* AKC 컨트랙트 배포/검증/가스최적화
* 동시 전송 테스트(단일/배치/병렬 큐)
* 로고/메타데이터 정의 및 내부 표준화 문서화
* BlockScout 로컬 연동으로 트랜잭션 가시화

### 3.2 제외 범위(현 단계)

* 외부 거래소 상장/유동성 생성
* 메인넷 배포 및 퍼블릭 로고 제출(추후)

---

## 4. 아키텍처 & 디렉터리 구조

```
/repo/ainova/akc-token/
├── apps/
│   └── akc-contract/
│       ├── contracts/
│       │   └── AKC.sol
│       ├── scripts/
│       │   ├── deploy.ts
│       │   └── test-transfer.ts
│       ├── test/
│       │   └── akc.spec.ts
│       ├── hardhat.config.ts
│       ├── package.json
│       └── .env.example
├── ops/
│   ├── chains/
│   │   └── bnb-local/
│   │       ├── genesis.json
│   │       ├── accounts.json
│   │       ├── config.toml
│   │       ├── keystore/ (자동 생성)
│   │       └── docker-compose.yml
│   └── blockscout/
│       ├── docker-compose.yml
│       └── env/
├── assets/
│   └── akc/
│       └── logo.png
├── assets-cdn/
│   └── akc/
│       └── logo@256.png
├── metadata/
│   └── AKC.json
├── docs/
│   └── AKC/
│       ├── PRD.md  ← (본 문서)
│       ├── LOGO-GUIDE.md
│       ├── TEST-PLAN.md
│       └── RUNBOOK.md
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 5. 환경 & 설정

### 5.1 런타임/툴체인

* Node.js: `v18.20.4`
* pnpm: `>=9`
* Solidity: `^0.8.4`
* Hardhat: `^2.x`
* Ganache(옵션) / geth(사설망) / Anvil(대체 가능)
* OpenZeppelin Contracts: `^4.x`
* Slither / Mythril / Echidna (선택)

### 5.2 환경변수 파일

* 예시: `/apps/akc-contract/.env`

```
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0x...
CHAIN_ID=1337
CONFIRMATIONS=1
```

* 템플릿: `/apps/akc-contract/.env.example`

### 5.3 내부 체인 구성 파일

* 제네시스: `/ops/chains/bnb-local/genesis.json`
* 계정/밸런스: `/ops/chains/bnb-local/accounts.json`
* 노드 설정: `/ops/chains/bnb-local/config.toml`
* 도커: `/ops/chains/bnb-local/docker-compose.yml`

---

## 6. 기능 요구사항

### 6.1 컨트랙트 스펙

* 파일: `/apps/akc-contract/contracts/AKC.sol`
* 상속: `ERC20`, `ERC20Burnable`, `Pausable`, `Ownable`
* 필수 기능

  * `constructor(uint256 initialSupply, address treasury)`
  * `mint(address to, uint256 amount)` (onlyOwner)
  * `burn(uint256 amount)`
  * `pause()` / `unpause()` (onlyOwner)
  * 이벤트: `Minted`, `Paused`, `Unpaused`
* 초기 발행량: `300_000_000 * 10**18` to Treasury
* 트레저리 주소: `/ops/chains/bnb-local/accounts.json` 내 `treasury` 키 참조

### 6.2 배포 스크립트

* 파일: `/apps/akc-contract/scripts/deploy.ts`
* 동작: 컴파일 → 배포 → 주소/ABI 저장(`/apps/akc-contract/deployments/local/AKC.json`)

### 6.3 대량 전송/부하 테스트

* 파일: `/apps/akc-contract/scripts/test-transfer.ts`
* 입력: `--concurrency 50 --tx 500 --mode batch`
* 로그: `/var/log/ainova/akc/transfer-YYYYMMDD.log`
* 메트릭: 평균/최대 가스, 실패율, 평균 확정시간

### 6.4 로고/메타데이터

* 로고: `/assets/akc/logo.png` (원본), `/assets-cdn/akc/logo@256.png` (배포)
* 메타: `/metadata/AKC.json`
* 내부 익스플로러/지갑 미리보기에서 참조 경로 일관성 유지

---

## 7. 비기능 요구사항

### 7.1 보안

* 비공개키: Vault 저장(`/infra/vault/kv/ainova/akc/private-keys`)
* CI 비밀: GitHub Actions → OIDC + 환경비밀 `/settings/secrets/actions`
* 접근제어: 사설망만 허용(방화벽, VPN), RPC 노출 금지

### 7.2 성능/확장성

* 배치 트랜잭션 큐: BullMQ or async-pool, `concurrency` 가변
* 노드 스케일: `/ops/chains/bnb-local/docker-compose.yml` 내 `replicas`로 조정

### 7.3 관측성

* 익스플로러: `/ops/blockscout/`
* 로그보관: `/var/log/ainova/akc/` 7일 롤링
* 대시보드(옵션): `/ops/grafana/` (Prometheus 지표)

---

## 8. 테스트 계획(개요)

> 상세 시나리오: `/docs/AKC/TEST-PLAN.md` 참조

### 8.1 준비

* 사설망 가동: `docker compose -f /ops/chains/bnb-local/docker-compose.yml up -d`
* 익스플로러 가동: `docker compose -f /ops/blockscout/docker-compose.yml up -d`
* 컨트랙트 설치/컴파일: `pnpm -C /apps/akc-contract install && pnpm -C /apps/akc-contract hardhat compile`

### 8.2 유닛/통합 테스트

* 실행: `pnpm -C /apps/akc-contract test`
* 커버리지: `> 95%` 목표, 결과물 `/apps/akc-contract/coverage/`

### 8.3 부하/대량 전송

* 명령: `pnpm -C /apps/akc-contract ts-node scripts/test-transfer.ts --tx 500 --concurrency 50 --mode batch`
* 리포트: `/docs/AKC/reports/transfer-report-YYYYMMDD.md`

---

## 9. 운영 절차(Runbook 요약)

> 상세 절차: `/docs/AKC/RUNBOOK.md` 참조

1. 사설망/익스플로러 기동
2. 배포 키 주입:`/apps/akc-contract/.env`
3. 배포 실행: `pnpm -C /apps/akc-contract hardhat run scripts/deploy.ts --network local`
4. 주소/ABI 공유: `/apps/akc-contract/deployments/local/AKC.json`
5. 대량 전송 테스트 실행 및 로그 수집
6. 가스/성능 리포트 업로드: `/docs/AKC/reports/`

---

## 10. **부록(Reserved)**

> 요청하신 대로 본 섹션은 **부록 전용**으로 남겨둡니다. 후속 작성 시 아래 초안 목차에 맞춰 채웁니다.

* 10.1 용어집(Glossary) — *작성 예정*
* 10.2 로고/브랜드 가이드 세부 규격 — *작성 예정*
* 10.3 메타데이터/아이콘 호환 매트릭스(지갑·익스플로러별) — *작성 예정*
* 10.4 퍼블릭 제출 체크리스트(BSC Testnet/Mainnet) — *작성 예정*
* 10.5 사고 대응 플레이북(Security & Incident) — *작성 예정*

---

### 부록 참고 경로(초안 링크 모음)

* `/docs/AKC/LOGO-GUIDE.md` — 로고 파일 명명/규격/검수 체크리스트
* `/docs/AKC/TEST-PLAN.md` — 테스트 시나리오·케이스·기대값 매트릭스
* `/docs/AKC/RUNBOOK.md` — 표준 운영/배포/롤백 절차
* `/assets/akc/logo.png` — 원본 로고(투명 PNG 256×256)
* `/assets-cdn/akc/logo@256.png` — CDN 배포용 리사이즈
* `/metadata/AKC.json` — 토큰 메타데이터(JSON)
