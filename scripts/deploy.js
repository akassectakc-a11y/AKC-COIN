const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 AKC Token Deployment Starting...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "BNB\n");
  
  // Treasury address (use deployer if not set)
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("🏦 Treasury address:", treasury);
  
  // Deploy AKC Token
  console.log("\n⏳ Deploying AKC Token Contract...");
  const AKC = await ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasury);
  
  await akc.waitForDeployment();
  const contractAddress = await akc.getAddress();
  
  console.log("\n✅ AKC Token Deployed Successfully!");
  console.log("=" .repeat(60));
  console.log("📍 Contract Address:", contractAddress);
  console.log("🏦 Treasury Address:", treasury);
  console.log("💎 Total Supply: 300,000,000 AKC");
  console.log("=" .repeat(60));
  
  // Verify token info
  const name = await akc.name();
  const symbol = await akc.symbol();
  const decimals = await akc.decimals();
  const totalSupply = await akc.totalSupply();
  
  console.log("\n📊 Token Information:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals);
  console.log("   Total Supply:", ethers.formatEther(totalSupply), "AKC");
  
  console.log("\n🔗 Next Steps:");
  console.log("1. Verify contract on BscScan");
  console.log("2. Update LBank application with contract address");
  console.log("3. Add to CoinGecko and CoinMarketCap");
  
  console.log("\n📝 Save this information:");
  console.log("Contract:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).chainId === 56n ? "BSC Mainnet" : "BSC Testnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
