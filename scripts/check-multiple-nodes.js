const { ethers } = require("ethers");

async function checkMultipleNodes() {
  console.log("🔍 여러 노드에서 잔액 확인...\n");

  const address = "0x7EFC167B6cD7b0C02bE7065f37e5446563a11034";
  
  // 여러 BSC RPC 노드들
  const rpcUrls = [
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org", 
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.defibit.io"
  ];

  for (let i = 0; i < rpcUrls.length; i++) {
    try {
      console.log(`📡 노드 ${i + 1}: ${rpcUrls[i]}`);
      
      const provider = new ethers.JsonRpcProvider(rpcUrls[i]);
      const balance = await provider.getBalance(address);
      const balanceBNB = ethers.formatEther(balance);
      const blockNumber = await provider.getBlockNumber();
      
      console.log(`   잔액: ${balanceBNB} BNB`);
      console.log(`   블록: ${blockNumber}`);
      console.log(`   Wei: ${balance.toString()}`);
      console.log("");
      
    } catch (error) {
      console.log(`   ❌ 오류: ${error.message}\n`);
    }
  }
}

checkMultipleNodes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  });
