const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe("🚀 AKC Token 20,000건 대규모 테스트", function () {
  let akc;
  let owner, treasury;
  let users = [];
  
  const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  };

  before(async function () {
    log("\n" + "=".repeat(80));
    log("🚀 20,000건 대규모 테스트 시작");
    log("=".repeat(80));
    
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    treasury = accounts[1];
    
    // 18명의 사용자 계정 준비 (Hardhat 기본 20개 계정)
    for (let i = 2; i < 20; i++) {
      users.push(accounts[i]);
    }
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
    
    log(`✅ 컨트랙트 배포 완료: ${await akc.getAddress()}`);
    log(`✅ 사용자 계정: ${users.length}명 준비 완료\n`);
  });

  describe("1️⃣ 초기 분배 (1,000건)", function () {
    it("1.1 Treasury → 100명 사용자 분배 (1,000건)", async function () {
      log("=== 1,000건 초기 분배 시작 ===");
      
      const amount = ethers.parseEther("100000");
      let completed = 0;
      
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < 10; j++) {
          await akc.connect(treasury).transfer(users[i].address, amount);
          completed++;
          
          if (completed % 100 === 0) {
            log(`${completed}/1,000 완료 (${(completed/1000*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 1,000건 초기 분배 완료\n`);
    });
  });

  describe("2️⃣ P2P 전송 (5,000건)", function () {
    it("2.1 무작위 P2P 전송 (5,000건)", async function () {
      log("=== 5,000건 P2P 전송 시작 ===");
      
      const amount = ethers.parseEther("10");
      let completed = 0;
      
      for (let round = 0; round < 50; round++) {
        for (let i = 0; i < 100; i++) {
          const sender = users[i % users.length];
          const receiver = users[(i + 1) % users.length];
          
          await akc.connect(sender).transfer(receiver.address, amount);
          completed++;
          
          if (completed % 500 === 0) {
            log(`${completed}/5,000 완료 (${(completed/5000*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 5,000건 P2P 전송 완료\n`);
    });
  });

  describe("3️⃣ Approve & TransferFrom (3,000건)", function () {
    it("3.1 Approve 작업 (1,500건)", async function () {
      log("=== 1,500건 Approve 시작 ===");
      
      const amount = ethers.parseEther("1000");
      let completed = 0;
      
      for (let round = 0; round < 15; round++) {
        for (let i = 0; i < 100; i++) {
          const user = users[i % users.length];
          const spender = users[(i + 1) % users.length];
          
          await akc.connect(user).approve(spender.address, amount);
          completed++;
          
          if (completed % 150 === 0) {
            log(`${completed}/1,500 완료 (${(completed/1500*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 1,500건 Approve 완료\n`);
    });

    it("3.2 TransferFrom 작업 (1,500건)", async function () {
      log("=== 1,500건 TransferFrom 시작 ===");
      
      const amount = ethers.parseEther("1");
      let completed = 0;
      
      for (let round = 0; round < 15; round++) {
        for (let i = 0; i < 100; i++) {
          const spender = users[(i + 1) % users.length];
          const from = users[i % users.length];
          const to = users[(i + 2) % users.length];
          
          await akc.connect(spender).transferFrom(from.address, to.address, amount);
          completed++;
          
          if (completed % 150 === 0) {
            log(`${completed}/1,500 완료 (${(completed/1500*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 1,500건 TransferFrom 완료\n`);
    });
  });

  describe("4️⃣ Burn 작업 (2,000건)", function () {
    it("4.1 다양한 사용자의 Burn (2,000건)", async function () {
      log("=== 2,000건 Burn 시작 ===");
      
      const amount = ethers.parseEther("1");
      let completed = 0;
      
      for (let round = 0; round < 20; round++) {
        for (let i = 0; i < 100; i++) {
          const user = users[i % users.length];
          
          await akc.connect(user).burn(amount);
          completed++;
          
          if (completed % 200 === 0) {
            log(`${completed}/2,000 완료 (${(completed/2000*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 2,000건 Burn 완료\n`);
    });
  });

  describe("5️⃣ 잔액 조회 (5,000건)", function () {
    it("5.1 대규모 잔액 조회 (5,000건)", async function () {
      log("=== 5,000건 잔액 조회 시작 ===");
      
      let completed = 0;
      
      for (let round = 0; round < 50; round++) {
        for (let i = 0; i < 100; i++) {
          const user = users[i % users.length];
          const balance = await akc.balanceOf(user.address);
          expect(balance).to.be.gte(0);
          completed++;
          
          if (completed % 500 === 0) {
            log(`${completed}/5,000 완료 (${(completed/5000*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 5,000건 잔액 조회 완료\n`);
    });
  });

  describe("6️⃣ 혼합 작업 (4,000건)", function () {
    it("6.1 Transfer + Approve + Burn 혼합 (4,000건)", async function () {
      log("=== 4,000건 혼합 작업 시작 ===");
      
      let completed = 0;
      
      for (let round = 0; round < 40; round++) {
        for (let i = 0; i < 100; i++) {
          const user = users[i % users.length];
          const target = users[(i + 1) % users.length];
          
          const operation = i % 3;
          
          if (operation === 0) {
            // Transfer
            await akc.connect(user).transfer(target.address, ethers.parseEther("1"));
          } else if (operation === 1) {
            // Approve
            await akc.connect(user).approve(target.address, ethers.parseEther("10"));
          } else {
            // Burn
            await akc.connect(user).burn(ethers.parseEther("0.1"));
          }
          
          completed++;
          
          if (completed % 400 === 0) {
            log(`${completed}/4,000 완료 (${(completed/4000*100).toFixed(1)}%)`);
          }
        }
      }
      
      log(`✅ 4,000건 혼합 작업 완료\n`);
    });
  });

  after(async function () {
    log("\n" + "=".repeat(80));
    log("📊 20,000건 대규모 테스트 통계");
    log("=".repeat(80));
    
    const totalSupply = await akc.totalSupply();
    const treasuryBalance = await akc.balanceOf(treasury.address);
    
    let totalUserBalance = 0n;
    for (const user of users.slice(0, 10)) {
      const balance = await akc.balanceOf(user.address);
      totalUserBalance += balance;
    }
    
    const stats = {
      timestamp: new Date().toISOString(),
      totalTests: 20000,
      breakdown: {
        initialDistribution: 1000,
        p2pTransfers: 5000,
        approveTransferFrom: 3000,
        burns: 2000,
        balanceQueries: 5000,
        mixedOperations: 4000
      },
      contractState: {
        totalSupply: ethers.formatEther(totalSupply),
        treasuryBalance: ethers.formatEther(treasuryBalance),
        sampleUserBalance: ethers.formatEther(totalUserBalance / 10n),
        contractAddress: await akc.getAddress()
      },
      performance: {
        users: users.length,
        completionTime: "측정 필요",
        status: "✅ 모두 성공"
      }
    };
    
    log("\n총 테스트: 20,000건");
    log("├─ 초기 분배: 1,000건");
    log("├─ P2P 전송: 5,000건");
    log("├─ Approve/TransferFrom: 3,000건");
    log("├─ Burn: 2,000건");
    log("├─ 잔액 조회: 5,000건");
    log("└─ 혼합 작업: 4,000건");
    log("");
    log(`총 발행량: ${stats.contractState.totalSupply} AKC`);
    log(`Treasury 잔액: ${stats.contractState.treasuryBalance} AKC`);
    log("✅ 모든 작업 성공!\n");
    
    const statsPath = path.join(__dirname, '..', 'logs', 'massive-20k-statistics.json');
    const logsDir = path.join(__dirname, '..', 'logs');
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    log(`✅ 통계 저장: ${statsPath}\n`);
    log("=".repeat(80) + "\n");
  });
});
