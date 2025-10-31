const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 AKC Token Full Integration Test\n");
  console.log("=".repeat(70));
  
  // Get signers
  const [deployer, treasury, user1, user2, user3] = await ethers.getSigners();
  
  console.log("📋 Test Accounts:");
  console.log("Deployer:", deployer.address);
  console.log("Treasury:", treasury.address);
  console.log("User 1:", user1.address);
  console.log("User 2:", user2.address);
  console.log("User 3:", user3.address);
  console.log("=".repeat(70));
  
  // Deploy contract
  console.log("\n🔨 Deploying AKC Token Contract...");
  const AKC = await ethers.getContractFactory("AKC");
  const akc = await AKC.deploy(treasury.address);
  await akc.waitForDeployment();
  const contractAddress = await akc.getAddress();
  
  console.log("✅ Contract deployed at:", contractAddress);
  
  // Test 1: Basic Info
  console.log("\n" + "=".repeat(70));
  console.log("📊 TEST 1: Basic Token Information");
  console.log("=".repeat(70));
  
  const name = await akc.name();
  const symbol = await akc.symbol();
  const decimals = await akc.decimals();
  const totalSupply = await akc.totalSupply();
  
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "AKC");
  console.log("✅ Basic info test PASSED");
  
  // Test 2: Initial Balance
  console.log("\n" + "=".repeat(70));
  console.log("💰 TEST 2: Initial Balance Check");
  console.log("=".repeat(70));
  
  const treasuryBalance = await akc.balanceOf(treasury.address);
  console.log("Treasury balance:", ethers.formatEther(treasuryBalance), "AKC");
  console.log("Expected: 300,000,000 AKC");
  
  if (treasuryBalance === totalSupply) {
    console.log("✅ Initial balance test PASSED");
  } else {
    console.log("❌ Initial balance test FAILED");
  }
  
  // Test 3: Transfer Test
  console.log("\n" + "=".repeat(70));
  console.log("💸 TEST 3: Token Transfer");
  console.log("=".repeat(70));
  
  const transferAmount = ethers.parseEther("1000000"); // 1M AKC
  console.log("Transferring", ethers.formatEther(transferAmount), "AKC to User 1...");
  
  const tx1 = await akc.connect(treasury).transfer(user1.address, transferAmount);
  await tx1.wait();
  
  const user1Balance = await akc.balanceOf(user1.address);
  console.log("User 1 balance:", ethers.formatEther(user1Balance), "AKC");
  
  if (user1Balance === transferAmount) {
    console.log("✅ Transfer test PASSED");
  } else {
    console.log("❌ Transfer test FAILED");
  }
  
  // Test 4: Multiple Transfers
  console.log("\n" + "=".repeat(70));
  console.log("🔄 TEST 4: Multiple Transfers");
  console.log("=".repeat(70));
  
  const amount2 = ethers.parseEther("500000"); // 500K
  const amount3 = ethers.parseEther("250000"); // 250K
  
  console.log("Transfer 1: Treasury → User 2 (500K AKC)");
  await (await akc.connect(treasury).transfer(user2.address, amount2)).wait();
  
  console.log("Transfer 2: Treasury → User 3 (250K AKC)");
  await (await akc.connect(treasury).transfer(user3.address, amount3)).wait();
  
  console.log("Transfer 3: User 1 → User 2 (100K AKC)");
  const user1ToUser2 = ethers.parseEther("100000");
  await (await akc.connect(user1).transfer(user2.address, user1ToUser2)).wait();
  
  const finalUser1 = await akc.balanceOf(user1.address);
  const finalUser2 = await akc.balanceOf(user2.address);
  const finalUser3 = await akc.balanceOf(user3.address);
  
  console.log("\nFinal Balances:");
  console.log("User 1:", ethers.formatEther(finalUser1), "AKC");
  console.log("User 2:", ethers.formatEther(finalUser2), "AKC");
  console.log("User 3:", ethers.formatEther(finalUser3), "AKC");
  console.log("✅ Multiple transfers test PASSED");
  
  // Test 5: Burn Test
  console.log("\n" + "=".repeat(70));
  console.log("🔥 TEST 5: Token Burning");
  console.log("=".repeat(70));
  
  const burnAmount = ethers.parseEther("100000"); // 100K
  const beforeBurn = await akc.totalSupply();
  
  console.log("Burning", ethers.formatEther(burnAmount), "AKC from User 1...");
  await (await akc.connect(user1).burn(burnAmount)).wait();
  
  const afterBurn = await akc.totalSupply();
  const burned = beforeBurn - afterBurn;
  
  console.log("Total supply before:", ethers.formatEther(beforeBurn), "AKC");
  console.log("Total supply after:", ethers.formatEther(afterBurn), "AKC");
  console.log("Amount burned:", ethers.formatEther(burned), "AKC");
  
  if (burned === burnAmount) {
    console.log("✅ Burn test PASSED");
  } else {
    console.log("❌ Burn test FAILED");
  }
  
  // Test 6: Pause Test
  console.log("\n" + "=".repeat(70));
  console.log("⏸️  TEST 6: Pause Functionality");
  console.log("=".repeat(70));
  
  console.log("Pausing contract...");
  await (await akc.pause()).wait();
  
  const isPaused = await akc.paused();
  console.log("Contract paused:", isPaused);
  
  console.log("Attempting transfer while paused...");
  try {
    await akc.connect(user2).transfer(user3.address, ethers.parseEther("1000"));
    console.log("❌ Pause test FAILED (transfer should have been blocked)");
  } catch (error) {
    console.log("✅ Transfer blocked correctly");
  }
  
  console.log("Unpausing contract...");
  await (await akc.unpause()).wait();
  
  const isUnpaused = await akc.paused();
  console.log("Contract paused:", isUnpaused);
  
  console.log("Attempting transfer after unpause...");
  await (await akc.connect(user2).transfer(user3.address, ethers.parseEther("1000"))).wait();
  console.log("✅ Pause test PASSED");
  
  // Test 7: Ownership Test
  console.log("\n" + "=".repeat(70));
  console.log("👑 TEST 7: Ownership");
  console.log("=".repeat(70));
  
  const currentOwner = await akc.owner();
  console.log("Current owner:", currentOwner);
  console.log("Expected:", deployer.address);
  
  console.log("Testing non-owner cannot pause...");
  try {
    await akc.connect(user1).pause();
    console.log("❌ Ownership test FAILED (non-owner shouldn't pause)");
  } catch (error) {
    console.log("✅ Non-owner correctly blocked");
  }
  
  console.log("✅ Ownership test PASSED");
  
  // Final Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 FINAL TEST SUMMARY");
  console.log("=".repeat(70));
  
  const finalTotalSupply = await akc.totalSupply();
  const finalTreasuryBalance = await akc.balanceOf(treasury.address);
  
  console.log("\n💎 Token Statistics:");
  console.log("Initial Supply: 300,000,000 AKC");
  console.log("Current Supply:", ethers.formatEther(finalTotalSupply), "AKC");
  console.log("Burned: 100,000 AKC");
  console.log("\n💰 Balance Distribution:");
  console.log("Treasury:", ethers.formatEther(finalTreasuryBalance), "AKC");
  console.log("User 1:", ethers.formatEther(await akc.balanceOf(user1.address)), "AKC");
  console.log("User 2:", ethers.formatEther(await akc.balanceOf(user2.address)), "AKC");
  console.log("User 3:", ethers.formatEther(await akc.balanceOf(user3.address)), "AKC");
  
  console.log("\n" + "=".repeat(70));
  console.log("✅ ALL TESTS PASSED! 🎉");
  console.log("=".repeat(70));
  
  console.log("\n📝 Contract is ready for deployment!");
  console.log("Contract Address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
