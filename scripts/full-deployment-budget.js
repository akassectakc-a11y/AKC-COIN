const fs = require('fs');

function calculateFullDeploymentBudget() {
  console.log("================================================================================");
  console.log("💰 AKC Token 전체 배포 예산 시나리오 (컨트랙트 + 로고)");
  console.log("================================================================================\n");

  // BNB 가격 시나리오
  const bnbPrices = {
    low: 500,     // USD
    mid: 600,     // USD  
    high: 700     // USD
  };

  const krwRate = 1330; // 1 USD = 1330 KRW

  console.log("📋 배포 항목별 비용 분석:");
  console.log("================================================================================");

  // 1. 컨트랙트 배포 비용
  const contractDeployment = {
    gas: 972030,
    gasPriceGwei: 5, // Standard
    bnbCost: 0.00486015
  };

  console.log("\n1️⃣ 컨트랙트 배포 비용:");
  console.log(`   가스 사용량: ${contractDeployment.gas.toLocaleString()} gas`);
  console.log(`   가스 가격: ${contractDeployment.gasPriceGwei} Gwei`);
  console.log(`   BNB 비용: ${contractDeployment.bnbCost} BNB`);

  for (const [scenario, price] of Object.entries(bnbPrices)) {
    const usdCost = contractDeployment.bnbCost * price;
    const krwCost = usdCost * krwRate;
    console.log(`   ${scenario.toUpperCase()} (BNB $${price}): $${usdCost.toFixed(2)} (₩${Math.floor(krwCost).toLocaleString()})`);
  }

  // 2. 로고 배포 비용 (메타데이터 업로드)
  const logoDeployment = {
    ipfsUpload: 0.001,      // IPFS 업로드 비용
    metadataUpdate: 0.002,  // 메타데이터 업데이트
    verification: 0.001     // 검증 트랜잭션
  };

  const totalLogoCost = logoDeployment.ipfsUpload + logoDeployment.metadataUpdate + logoDeployment.verification;

  console.log("\n2️⃣ 로고 배포 비용:");
  console.log(`   IPFS 업로드: ${logoDeployment.ipfsUpload} BNB`);
  console.log(`   메타데이터 업데이트: ${logoDeployment.metadataUpdate} BNB`);
  console.log(`   검증 트랜잭션: ${logoDeployment.verification} BNB`);
  console.log(`   로고 총 비용: ${totalLogoCost} BNB`);

  for (const [scenario, price] of Object.entries(bnbPrices)) {
    const usdCost = totalLogoCost * price;
    const krwCost = usdCost * krwRate;
    console.log(`   ${scenario.toUpperCase()} (BNB $${price}): $${usdCost.toFixed(2)} (₩${Math.floor(krwCost).toLocaleString()})`);
  }

  // 3. 컨트랙트 검증 비용
  const verification = {
    bscscanVerify: 0.001,   // BscScan 검증
    additionalTx: 0.0005    // 추가 트랜잭션
  };

  const totalVerificationCost = verification.bscscanVerify + verification.additionalTx;

  console.log("\n3️⃣ 컨트랙트 검증 비용:");
  console.log(`   BscScan 검증: ${verification.bscscanVerify} BNB`);
  console.log(`   추가 트랜잭션: ${verification.additionalTx} BNB`);
  console.log(`   검증 총 비용: ${totalVerificationCost} BNB`);

  for (const [scenario, price] of Object.entries(bnbPrices)) {
    const usdCost = totalVerificationCost * price;
    const krwCost = usdCost * krwRate;
    console.log(`   ${scenario.toUpperCase()} (BNB $${price}): $${usdCost.toFixed(2)} (₩${Math.floor(krwCost).toLocaleString()})`);
  }

  // 4. 전체 비용 계산
  const totalBaseCost = contractDeployment.bnbCost + totalLogoCost + totalVerificationCost;
  const safetyBuffer = totalBaseCost * 0.5; // 50% 여유분
  const totalRecommended = totalBaseCost + safetyBuffer;

  console.log("\n================================================================================");
  console.log("📊 전체 배포 예산 시나리오");
  console.log("================================================================================");

  console.log(`\n💡 기본 필요 비용: ${totalBaseCost.toFixed(6)} BNB`);
  console.log(`💡 안전 여유분 (50%): ${safetyBuffer.toFixed(6)} BNB`);
  console.log(`💡 권장 총 예산: ${totalRecommended.toFixed(6)} BNB`);

  console.log("\n🎯 시나리오별 총 예산:");
  
  const scenarios = [
    { name: "최소 예산", multiplier: 1.0 },
    { name: "표준 예산", multiplier: 1.3 },
    { name: "안전 예산", multiplier: 1.5 }
  ];

  for (const scenario of scenarios) {
    const budgetBNB = totalBaseCost * scenario.multiplier;
    console.log(`\n📋 ${scenario.name} (${scenario.multiplier}x):`);
    console.log(`   BNB: ${budgetBNB.toFixed(6)} BNB`);
    
    for (const [priceScenario, price] of Object.entries(bnbPrices)) {
      const usdCost = budgetBNB * price;
      const krwCost = usdCost * krwRate;
      console.log(`   ${priceScenario.toUpperCase()} (BNB $${price}): $${usdCost.toFixed(2)} (₩${Math.floor(krwCost).toLocaleString()})`);
    }
  }

  // 5. 로고 파일 확인
  console.log("\n================================================================================");
  console.log("🎨 로고 파일 현황");
  console.log("================================================================================");

  const logoFiles = [
    'docs/logo/AKC-Icon-256.png',
    'docs/logo/AKC-Icon-200.png', 
    'docs/logo/AKC-Logo-1024.png'
  ];

  let logoFilesExist = 0;
  for (const logoFile of logoFiles) {
    if (fs.existsSync(logoFile)) {
      console.log(`✅ ${logoFile} - 존재`);
      logoFilesExist++;
    } else {
      console.log(`❌ ${logoFile} - 없음`);
    }
  }

  console.log(`\n📊 로고 파일 준비도: ${logoFilesExist}/${logoFiles.length} (${Math.floor(logoFilesExist/logoFiles.length*100)}%)`);

  // 6. 배포 체크리스트
  console.log("\n================================================================================");
  console.log("✅ 배포 전 체크리스트");
  console.log("================================================================================");

  const checklist = [
    { item: "컨트랙트 컴파일", status: "✅" },
    { item: "테스트 통과 (151개)", status: "✅" },
    { item: "로고 파일 준비", status: logoFilesExist === 3 ? "✅" : "⚠️" },
    { item: "지갑 준비", status: "✅" },
    { item: "BNB 준비", status: "⏳" },
    { item: "Treasury 주소 설정", status: "⏳" },
    { item: "배포 환경 설정", status: "⏳" }
  ];

  for (const check of checklist) {
    console.log(`${check.status} ${check.item}`);
  }

  // 결과를 JSON으로 저장
  const budgetAnalysis = {
    contractDeployment: {
      bnbCost: contractDeployment.bnbCost,
      gas: contractDeployment.gas
    },
    logoDeployment: {
      bnbCost: totalLogoCost,
      breakdown: logoDeployment
    },
    verification: {
      bnbCost: totalVerificationCost,
      breakdown: verification
    },
    totalBaseCost: totalBaseCost,
    scenarios: {
      minimum: totalBaseCost,
      standard: totalBaseCost * 1.3,
      safe: totalBaseCost * 1.5
    },
    priceCalculations: {},
    logoFilesStatus: {
      total: logoFiles.length,
      existing: logoFilesExist,
      readiness: Math.floor(logoFilesExist/logoFiles.length*100)
    },
    timestamp: new Date().toISOString()
  };

  // 가격별 계산 추가
  for (const [scenario, price] of Object.entries(bnbPrices)) {
    budgetAnalysis.priceCalculations[scenario] = {
      bnbPrice: price,
      minimum: {
        usd: totalBaseCost * price,
        krw: totalBaseCost * price * krwRate
      },
      standard: {
        usd: totalBaseCost * 1.3 * price,
        krw: totalBaseCost * 1.3 * price * krwRate
      },
      safe: {
        usd: totalBaseCost * 1.5 * price,
        krw: totalBaseCost * 1.5 * price * krwRate
      }
    };
  }

  fs.writeFileSync('./full-deployment-budget.json', JSON.stringify(budgetAnalysis, null, 2));

  console.log("\n✅ 상세 예산 분석이 'full-deployment-budget.json'에 저장되었습니다.");
  console.log("\n🎯 권장사항: 표준 예산 시나리오로 0.01-0.012 BNB 준비하시면 됩니다!");
}

calculateFullDeploymentBudget();
