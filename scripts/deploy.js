const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 AKC Token Deployment Starting...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "BNB\n");
  
  // 🚨 CRITICAL: Treasury address MUST be set in .env
  const treasury = process.env.TREASURY_ADDRESS;
  
  // Validate treasury address exists
  if (!treasury) {
    throw new Error("❌ CRITICAL: TREASURY_ADDRESS not set in .env file!\n   300,000,000 AKC will be lost if not set!");
  }
  
  // Validate treasury address format
  if (!ethers.isAddress(treasury)) {
    throw new Error("❌ CRITICAL: Invalid TREASURY_ADDRESS format!");
  }
  
  // Warning if treasury is same as deployer
  if (treasury.toLowerCase() === deployer.address.toLowerCase()) {
    console.log("\n⚠️  WARNING: Treasury is same as deployer address!");
    console.log("   Is this intentional?");
  }
  
  // Triple verification display
  console.log("\n🔐 CRITICAL: Treasury Address Verification");
  console.log("=" .repeat(70));
  console.log("Treasury: ", treasury);
  console.log("=" .repeat(70));
  console.log("\n⚠️  This address will receive 300,000,000 AKC!");
  console.log("⚠️  This CANNOT be changed after deployment!");
  console.log("\n✅ Confirm this address is CORRECT!");
  console.log("   Press Ctrl+C to cancel within 15 seconds...\n");
  
  // 15 second pause for verification
  await new Promise(resolve => setTimeout(resolve, 15000));
  
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
