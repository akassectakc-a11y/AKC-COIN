const { ethers } = require("hardhat");

async function checkMainnetBalance() {
  console.log("🔍 BSC 메인넷 지갑 잔액 확인...\n");

  try {
    // BSC 메인넷 프로바이더 직접 연결
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.binance.org");
    
    // .env에서 프라이빗키 가져오기
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!privateKey) {
      console.log("❌ PRIVATE_KEY가 .env 파일에 설정되지 않았습니다.");
      return;
    }

    // 지갑 생성
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = wallet.address;
    
    console.log(`📍 지갑 주소: ${address}`);
    
    // 잔액 확인
    const balance = await provider.getBalance(address);
    const balanceBNB = ethers.formatEther(balance);
    
    console.log(`💰 현재 잔액: ${balanceBNB} BNB`);
    console.log(`💰 Wei 단위: ${balance.toString()}`);
    
    // 네트워크 정보 확인
    const network = await provider.getNetwork();
    console.log(`🌐 네트워크: ${network.name} (Chain ID: ${network.chainId})`);
    
    // 배포 가능 여부 확인
    const minRequired = ethers.parseEther("0.005"); // 최소 0.005 BNB
    const recommended = ethers.parseEther("0.01");  // 권장 0.01 BNB
    
    console.log("\n📊 배포 가능성 분석:");
    
    if (balance >= recommended) {
      console.log("✅ 충분한 잔액! 안전하게 배포 가능합니다.");
    } else if (balance >= minRequired) {
      console.log("⚠️  최소 잔액은 있지만 여유분이 부족합니다.");
    } else {
      console.log("❌ 잔액 부족! 배포 불가능합니다.");
    }
    
    console.log(`   최소 필요: 0.005 BNB`);
    console.log(`   권장 금액: 0.01 BNB`);
    console.log(`   현재 잔액: ${balanceBNB} BNB`);

    // 최근 트랜잭션 확인
    console.log("\n🔍 최근 트랜잭션 확인 중...");
    try {
      const latestBlock = await provider.getBlockNumber();
      console.log(`   최신 블록: ${latestBlock}`);
      
      // 트랜잭션 카운트 확인
      const txCount = await provider.getTransactionCount(address);
      console.log(`   트랜잭션 수: ${txCount}`);
      
      if (txCount === 0) {
        console.log("   ℹ️  이 지갑은 아직 트랜잭션 이력이 없습니다.");
      }
    } catch (error) {
      console.log("   ⚠️  트랜잭션 정보 확인 중 오류:", error.message);
    }

  } catch (error) {
    console.error("❌ 잔액 확인 중 오류:", error.message);
  }
}

checkMainnetBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  });
