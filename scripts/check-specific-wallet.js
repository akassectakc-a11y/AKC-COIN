const { ethers } = require("ethers");

async function checkSpecificWallet() {
  console.log("🔍 특정 프라이빗키 지갑 확인...\n");

  try {
    // BSC 메인넷 프로바이더
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.binance.org");
    
    // 지정된 프라이빗키
    const privateKey = "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456";
    
    // 지갑 생성
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = wallet.address;
    
    console.log(`📍 프라이빗키: ${privateKey}`);
    console.log(`📍 지갑 주소: ${address}`);
    
    // 잔액 확인
    const balance = await provider.getBalance(address);
    const balanceBNB = ethers.formatEther(balance);
    
    console.log(`💰 현재 잔액: ${balanceBNB} BNB`);
    console.log(`💰 Wei 단위: ${balance.toString()}`);
    
    // 네트워크 정보
    const network = await provider.getNetwork();
    console.log(`🌐 네트워크: ${network.name} (Chain ID: ${network.chainId})`);
    
    // 트랜잭션 카운트
    const txCount = await provider.getTransactionCount(address);
    console.log(`📊 트랜잭션 수: ${txCount}`);
    
    // 배포 가능 여부
    const minRequired = ethers.parseEther("0.005");
    const recommended = ethers.parseEther("0.01");
    
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

    // .env 파일의 키와 비교
    require("dotenv").config();
    const envPrivateKey = process.env.PRIVATE_KEY;
    
    console.log("\n🔐 키 비교:");
    console.log(`   .env 파일 키: ${envPrivateKey}`);
    console.log(`   확인 중인 키: ${privateKey}`);
    console.log(`   일치 여부: ${envPrivateKey === privateKey ? '✅ 일치' : '❌ 불일치'}`);

  } catch (error) {
    console.error("❌ 지갑 확인 중 오류:", error.message);
  }
}

checkSpecificWallet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  });
