const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('💰 AKC Token 메인넷 배포 가스비 추정');
  console.log('='.repeat(80) + '\n');

  // Treasury 주소
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || "0x6CE8903FD7dA2ec919450544f305708BB8A19a1f";
  
  console.log('📋 배포 정보:');
  console.log(`   Treasury: ${TREASURY_ADDRESS}`);
  console.log(`   Network: BSC Mainnet (ChainID: 56)\n`);

  // 컨트랙트 팩토리 가져오기
  const AKC = await ethers.getContractFactory("AKC");
  
  console.log('⏳ 배포 가스 추정 중...\n');

  // 배포 트랜잭션 예상 가스 측정
  const deployTransaction = AKC.getDeployTransaction(TREASURY_ADDRESS);
  
  // 가스 추정
  const [deployer] = await ethers.getSigners();
  const estimatedGas = await ethers.provider.estimateGas({
    data: deployTransaction.data,
    from: deployer.address
  });

  console.log('📊 가스 사용량:');
  console.log(`   배포 예상 가스: ${estimatedGas.toString()} gas\n`);

  // BSC 가스 가격 시나리오
  const gasPriceScenarios = {
    low: ethers.parseUnits('3', 'gwei'),      // 3 Gwei (한가)
    average: ethers.parseUnits('5', 'gwei'),  // 5 Gwei (보통)
    high: ethers.parseUnits('10', 'gwei'),    // 10 Gwei (혼잡)
    peak: ethers.parseUnits('20', 'gwei')     // 20 Gwei (피크)
  };

  // BNB 가격 (USD)
  const bnbPrice = 600; // $600

  console.log('💵 가스비 계산 (시나리오별):\n');

  const results = {};

  for (const [scenario, gasPrice] of Object.entries(gasPriceScenarios)) {
    const costInWei = estimatedGas * gasPrice;
    const costInBNB = Number(ethers.formatEther(costInWei));
    const costInUSD = costInBNB * bnbPrice;

    results[scenario] = {
      gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
      estimatedGas: estimatedGas.toString(),
      costInBNB: costInBNB.toFixed(6),
      costInUSD: costInUSD.toFixed(2)
    };

    const scenarioName = {
      low: '한가 시간',
      average: '평균 시간',
      high: '혼잡 시간',
      peak: '피크 시간'
    }[scenario];

    console.log(`   ${scenarioName} (${ethers.formatUnits(gasPrice, 'gwei')} Gwei):`);
    console.log(`   ├─ 가스: ${estimatedGas.toString()}`);
    console.log(`   ├─ BNB: ${costInBNB.toFixed(6)} BNB`);
    console.log(`   └─ USD: $${costInUSD.toFixed(2)}\n`);
  }

  // 권장 가스 가격
  console.log('✅ 권장 배포 조건:\n');
  console.log(`   시간: 새벽 2-6시 (한국 시간)`);
  console.log(`   가스 가격: 3-5 Gwei`);
  console.log(`   예상 비용: $${results.low.costInUSD} - $${results.average.costInUSD}`);
  console.log(`   권장 BNB: 0.01 BNB (안전 마진 포함)\n`);

  // 비교 분석
  console.log('📈 비용 비교:\n');
  
  const lowCost = parseFloat(results.low.costInUSD);
  const peakCost = parseFloat(results.peak.costInUSD);
  const savings = peakCost - lowCost;
  const savingsPercent = ((savings / peakCost) * 100).toFixed(1);

  console.log(`   최저 비용: $${results.low.costInUSD} (3 Gwei)`);
  console.log(`   최고 비용: $${results.peak.costInUSD} (20 Gwei)`);
  console.log(`   절약 가능: $${savings.toFixed(2)} (${savingsPercent}%)\n`);

  // 추가 비용 예상
  console.log('📋 추가 예상 비용:\n');
  
  const verificationGas = 50000n; // 검증 예상 가스
  const averageGasPrice = gasPriceScenarios.average;
  
  const verificationCost = Number(ethers.formatEther(verificationGas * averageGasPrice)) * bnbPrice;
  const initialTransfers = 3; // 초기 전송 3회 (테스트용)
  const transferGas = 53613n; // 실제 측정된 Transfer 가스
  const transferCost = Number(ethers.formatEther(transferGas * averageGasPrice)) * bnbPrice * initialTransfers;

  console.log(`   소스 검증: ~$${verificationCost.toFixed(2)}`);
  console.log(`   초기 전송 (3회): ~$${transferCost.toFixed(2)}`);
  console.log(`   ────────────────────────────`);
  console.log(`   배포 총비용: ~$${(parseFloat(results.average.costInUSD) + verificationCost + transferCost).toFixed(2)}\n`);

  // 시간대별 가스 가격 통계
  console.log('⏰ 시간대별 권장 가스 가격 (BSC 기준):\n');
  console.log(`   새벽 (02:00-06:00): 3-4 Gwei   ✅ 최적!`);
  console.log(`   오전 (06:00-12:00): 4-6 Gwei   ✅ 좋음`);
  console.log(`   오후 (12:00-18:00): 5-8 Gwei   ⚠️  보통`);
  console.log(`   저녁 (18:00-24:00): 6-12 Gwei  ⚠️  혼잡`);
  console.log(`   심야 (00:00-02:00): 4-7 Gwei   ✅ 좋음\n`);

  // 결과 저장
  const report = {
    timestamp: new Date().toISOString(),
    network: 'BSC Mainnet',
    treasury: TREASURY_ADDRESS,
    estimatedGas: estimatedGas.toString(),
    bnbPrice: bnbPrice,
    scenarios: results,
    recommendations: {
      bestTime: '새벽 2-6시 (한국 시간)',
      recommendedGasPrice: '3-5 Gwei',
      estimatedCost: `$${results.low.costInUSD} - $${results.average.costInUSD}`,
      recommendedBNB: '0.01 BNB'
    },
    additionalCosts: {
      verification: `$${verificationCost.toFixed(2)}`,
      initialTransfers: `$${transferCost.toFixed(2)}`,
      total: `$${(parseFloat(results.average.costInUSD) + verificationCost + transferCost).toFixed(2)}`
    }
  };

  const reportPath = path.join(__dirname, '..', 'logs', 'deployment-gas-estimate.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('='.repeat(80));
  console.log(`💾 상세 보고서 저장: ${reportPath}`);
  console.log('='.repeat(80) + '\n');

  // 최종 요약
  console.log('🎯 최종 요약:\n');
  console.log(`   ✅ 최저 배포 비용: $${results.low.costInUSD} (3 Gwei)`);
  console.log(`   ✅ 권장 배포 시간: 새벽 2-6시`);
  console.log(`   ✅ 권장 BNB 준비: 0.01 BNB`);
  console.log(`   ✅ 예상 총비용: ~$${(parseFloat(results.average.costInUSD) + verificationCost + transferCost).toFixed(2)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
