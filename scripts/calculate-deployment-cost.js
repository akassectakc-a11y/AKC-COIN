const { ethers } = require("hardhat");

async function calculateDeploymentCost() {
  console.log("================================================================================");
  console.log("💰 AKC Token 메인넷 배포 비용 계산");
  console.log("================================================================================\n");

  try {
    // 컨트랙트 팩토리 가져오기
    const AKC = await ethers.getContractFactory("AKC");
    
    // 가상의 Treasury 주소 (계산용) - 올바른 체크섬
    const dummyTreasury = ethers.getAddress("0x742d35cc6635c0532925a3b8d8c9c8e4c8b4c8d1");
    
    // 배포 트랜잭션 생성 (실제 배포하지 않음)
    const deployTransaction = await AKC.getDeployTransaction(dummyTreasury);
    
    console.log("📋 컨트랙트 정보:");
    console.log(`   이름: AKC (AKASSECT)`);
    console.log(`   타입: ERC20 + Burnable + Pausable + Ownable`);
    console.log(`   총 발행량: 300,000,000 AKC`);
    console.log(`   바이트코드 크기: ${Math.floor(deployTransaction.data.length / 2)} bytes\n`);

    // 가스 추정
    const gasEstimate = await ethers.provider.estimateGas(deployTransaction);
    console.log("⛽ 가스 사용량 추정:");
    console.log(`   예상 가스: ${gasEstimate.toString()} gas`);
    console.log(`   가스 (포맷): ${ethers.formatUnits(gasEstimate, 0)} gas\n`);

    // BSC 메인넷 가스 가격들
    const gasPrices = {
      slow: ethers.parseUnits("3", "gwei"),    // 3 Gwei
      standard: ethers.parseUnits("5", "gwei"), // 5 Gwei  
      fast: ethers.parseUnits("10", "gwei")     // 10 Gwei
    };

    console.log("💸 배포 비용 계산 (BSC 메인넷):");
    console.log("================================================================================");

    for (const [speed, gasPrice] of Object.entries(gasPrices)) {
      const gasCost = gasEstimate * gasPrice;
      const gasCostBNB = ethers.formatEther(gasCost);
      
      console.log(`\n🚀 ${speed.toUpperCase()} 속도 (${ethers.formatUnits(gasPrice, "gwei")} Gwei):`);
      console.log(`   가스비: ${gasCostBNB} BNB`);
      
      // BNB 가격별 USD/KRW 계산
      const bnbPrices = [500, 600, 700]; // USD
      
      for (const bnbPrice of bnbPrices) {
        const costUSD = parseFloat(gasCostBNB) * bnbPrice;
        const costKRW = costUSD * 1330; // 1 USD = 1330 KRW 가정
        
        console.log(`   BNB $${bnbPrice}: $${costUSD.toFixed(2)} (₩${Math.floor(costKRW).toLocaleString()})`);
      }
    }

    console.log("\n================================================================================");
    console.log("📊 권장 준비 금액");
    console.log("================================================================================");

    const recommendedGas = gasEstimate * BigInt(2); // 2배 여유분
    const standardGasPrice = gasPrices.standard;
    const recommendedCost = recommendedGas * standardGasPrice;
    const recommendedBNB = ethers.formatEther(recommendedCost);

    console.log(`\n💡 권장 준비 금액 (여유분 포함):`);
    console.log(`   BNB: ${recommendedBNB} BNB`);
    console.log(`   USD (BNB $600): $${(parseFloat(recommendedBNB) * 600).toFixed(2)}`);
    console.log(`   KRW: ₩${Math.floor(parseFloat(recommendedBNB) * 600 * 1330).toLocaleString()}`);

    console.log(`\n⚠️  주의사항:`);
    console.log(`   • 네트워크 혼잡도에 따라 가스 가격 변동`);
    console.log(`   • BNB 가격 변동성 고려 필요`);
    console.log(`   • 배포 실패 시에도 가스비 소모`);
    console.log(`   • 컨트랙트 검증 시 추가 트랜잭션 필요`);

    // JSON 형태로 결과 저장
    const result = {
      contract: {
        name: "AKC",
        symbol: "AKC", 
        totalSupply: "300000000",
        bytecodeSize: Math.floor(deployTransaction.data.length / 2)
      },
      gasEstimate: gasEstimate.toString(),
      costs: {
        slow: {
          gasPrice: "3",
          bnb: ethers.formatEther(gasEstimate * gasPrices.slow),
          usd_600: parseFloat(ethers.formatEther(gasEstimate * gasPrices.slow)) * 600,
          krw: parseFloat(ethers.formatEther(gasEstimate * gasPrices.slow)) * 600 * 1330
        },
        standard: {
          gasPrice: "5", 
          bnb: ethers.formatEther(gasEstimate * gasPrices.standard),
          usd_600: parseFloat(ethers.formatEther(gasEstimate * gasPrices.standard)) * 600,
          krw: parseFloat(ethers.formatEther(gasEstimate * gasPrices.standard)) * 600 * 1330
        },
        fast: {
          gasPrice: "10",
          bnb: ethers.formatEther(gasEstimate * gasPrices.fast), 
          usd_600: parseFloat(ethers.formatEther(gasEstimate * gasPrices.fast)) * 600,
          krw: parseFloat(ethers.formatEther(gasEstimate * gasPrices.fast)) * 600 * 1330
        }
      },
      recommended: {
        bnb: recommendedBNB,
        usd_600: parseFloat(recommendedBNB) * 600,
        krw: parseFloat(recommendedBNB) * 600 * 1330
      },
      timestamp: new Date().toISOString()
    };

    // 결과를 파일로 저장
    const fs = require('fs');
    fs.writeFileSync('./deployment-cost-analysis.json', JSON.stringify(result, null, 2));
    
    console.log(`\n✅ 상세 분석 결과가 'deployment-cost-analysis.json'에 저장되었습니다.`);

  } catch (error) {
    console.error("❌ 배포 비용 계산 중 오류:", error.message);
  }
}

calculateDeploymentCost()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 스크립트 실행 실패:", error);
    process.exit(1);
  });
