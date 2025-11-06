const { ethers } = require("ethers");

async function checkTransaction() {
  console.log("🔍 트랜잭션 상태 확인...\n");

  try {
    // BSC 메인넷 프로바이더
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.binance.org");
    
    // 트랜잭션 해시
    const txHash = "0xde8a9f3609286810f50203905abc244aa76b837169983084a08b46168051f83b";
    
    console.log(`📍 트랜잭션 해시: ${txHash}`);
    
    // 트랜잭션 정보 가져오기
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      console.log("❌ 트랜잭션을 찾을 수 없습니다. 아직 블록체인에 기록되지 않았을 수 있습니다.");
      return;
    }
    
    console.log("\n📊 트랜잭션 정보:");
    console.log(`   From: ${tx.from}`);
    console.log(`   To: ${tx.to}`);
    console.log(`   Value: ${ethers.formatEther(tx.value)} BNB`);
    console.log(`   Gas Price: ${ethers.formatUnits(tx.gasPrice, "gwei")} Gwei`);
    console.log(`   Gas Limit: ${tx.gasLimit.toString()}`);
    console.log(`   Nonce: ${tx.nonce}`);
    
    // 트랜잭션 영수증 확인
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      console.log("\n⏳ 트랜잭션이 아직 마이닝되지 않았습니다. 대기 중...");
    } else {
      console.log("\n✅ 트랜잭션 영수증:");
      console.log(`   Status: ${receipt.status === 1 ? '✅ 성공' : '❌ 실패'}`);
      console.log(`   Block Number: ${receipt.blockNumber}`);
      console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
      console.log(`   Confirmations: ${receipt.confirmations || 'N/A'}`);
      
      if (receipt.status === 1) {
        console.log("\n🎉 트랜잭션이 성공적으로 완료되었습니다!");
        
        // 받는 주소 잔액 확인
        const balance = await provider.getBalance(tx.to);
        console.log(`💰 받는 주소 현재 잔액: ${ethers.formatEther(balance)} BNB`);
      } else {
        console.log("\n❌ 트랜잭션이 실패했습니다.");
      }
    }
    
    // 네트워크 정보
    const network = await provider.getNetwork();
    console.log(`\n🌐 네트워크: ${network.name} (Chain ID: ${network.chainId})`);
    
  } catch (error) {
    console.error("❌ 트랜잭션 확인 중 오류:", error.message);
  }
}

checkTransaction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  });
