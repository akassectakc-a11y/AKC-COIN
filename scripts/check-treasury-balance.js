const { ethers } = require("hardhat");

async function main() {
  const treasuryAddress = process.env.TREASURY_ADDRESS;
  
  console.log("🔍 Checking Treasury Balance...\n");
  console.log("Treasury Address:", treasuryAddress);
  
  try {
    const balance = await ethers.provider.getBalance(treasuryAddress);
    const balanceBNB = ethers.formatEther(balance);
    
    console.log("Balance:", balanceBNB, "BNB");
    
    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
    
    if (parseFloat(balanceBNB) === 0) {
      console.log("\n⚠️  No BNB found!");
      console.log("📝 Get Testnet BNB from:");
      console.log("   https://testnet.bnbchain.org/faucet-smart");
      console.log("   Address:", treasuryAddress);
    } else if (parseFloat(balanceBNB) < 0.01) {
      console.log("\n⚠️  Low balance!");
    } else {
      console.log("\n✅ Treasury has BNB!");
      console.log("💡 Note: This address will receive 300M AKC tokens");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
