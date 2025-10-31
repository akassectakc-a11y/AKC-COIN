const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Wallet Configuration Check\n");
  console.log("=" .repeat(60));
  console.log("Deployer Address:", deployer.address);
  console.log("Treasury Address:", process.env.TREASURY_ADDRESS);
  console.log("=" .repeat(60));
  
  if (deployer.address.toLowerCase() === process.env.TREASURY_ADDRESS.toLowerCase()) {
    console.log("\n✅ Deployer and Treasury are the SAME address");
    console.log("   Tokens will be minted to the deployer's address");
  } else {
    console.log("\n📝 Deployer and Treasury are DIFFERENT addresses");
    console.log("   Tokens will be minted to treasury:", process.env.TREASURY_ADDRESS);
  }
  
  console.log("\n🔍 Checking balances...");
  
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log("\nDeployer balance:", ethers.formatEther(deployerBalance), "BNB");
  
  if (deployer.address.toLowerCase() !== process.env.TREASURY_ADDRESS.toLowerCase()) {
    try {
      const treasuryBalance = await ethers.provider.getBalance(process.env.TREASURY_ADDRESS);
      console.log("Treasury balance:", ethers.formatEther(treasuryBalance), "BNB");
    } catch (error) {
      console.log("Treasury balance: Unable to check");
    }
  }
  
  const network = await ethers.provider.getNetwork();
  console.log("\nNetwork:", network.name, "(Chain ID:", network.chainId.toString() + ")");
  
  console.log("\n💡 Notes:");
  if (parseFloat(ethers.formatEther(deployerBalance)) === 0) {
    console.log("⚠️  Deployer needs BNB for gas fees!");
    console.log("   Send BNB to:", deployer.address);
  } else if (parseFloat(ethers.formatEther(deployerBalance)) < 0.01) {
    console.log("⚠️  Deployer has low BNB, might need more");
  } else {
    console.log("✅ Deployer has sufficient BNB for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
