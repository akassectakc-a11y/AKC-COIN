const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🔍 Checking wallet balance...\n");
  console.log("Wallet:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceBNB = ethers.formatEther(balance);
  
  console.log("Balance:", balanceBNB, "BNB");
  
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
  
  if (parseFloat(balanceBNB) === 0) {
    console.log("\n⚠️  No BNB found!");
    console.log("📝 Get Testnet BNB from:");
    console.log("   https://testnet.bnbchain.org/faucet-smart");
  } else if (parseFloat(balanceBNB) < 0.01) {
    console.log("\n⚠️  Low balance! You might need more BNB");
  } else {
    console.log("\n✅ Balance is sufficient for deployment!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
