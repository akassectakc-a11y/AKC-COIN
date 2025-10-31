const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe("📊 AKC Token 20,000개 다양한 패턴 종합 테스트", function () {
  let akc, owner, treasury, users;
  const logFile = path.join(__dirname, '..', 'logs', 'comprehensive-20k-diverse.log');
  const detailLogFile = path.join(__dirname, '..', 'logs', 'comprehensive-20k-detail.json');
  
  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    startTime: new Date().toISOString(),
    categories: {},
    detailLogs: []
  };

  function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(logFile, logMessage);
  }

  function logDetail(category, test, amount, from, to, status, gasUsed = null, error = null) {
    const detail = {
      timestamp: new Date().toISOString(),
      category,
      test,
      amount: amount ? ethers.formatEther(amount) : null,
      from,
      to,
      status,
      gasUsed: gasUsed ? gasUsed.toString() : null,
      error
    };
    testResults.detailLogs.push(detail);
  }

  function updateStats(category, passed = true) {
    testResults.total++;
    passed ? testResults.passed++ : testResults.failed++;
    
    if (!testResults.categories[category]) {
      testResults.categories[category] = { 
        total: 0, 
        passed: 0, 
        failed: 0,
        patterns: []
      };
    }
    testResults.categories[category].total++;
    passed ? testResults.categories[category].passed++ : testResults.categories[category].failed++;
  }

  before(async function () {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AKC Token 20,000개 다양한 패턴 종합 테스트');
    console.log('='.repeat(80) + '\n');
    
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    
    fs.writeFileSync(logFile, `20K Diverse Pattern Test - ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`);
    
    const signers = await ethers.getSigners();
    [owner, treasury, ...users] = signers;
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
    
    log(`✅ 컨트랙트 배포: ${await akc.getAddress()}`);
    log(`Treasury: ${treasury.address}`);
    log(`테스트 사용자: ${users.length}명`);
  });

  after(function () {
    testResults.endTime = new Date().toISOString();
    testResults.duration = (new Date() - new Date(testResults.startTime)) / 1000;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 20K 다양한 패턴 최종 통계');
    console.log('='.repeat(80));
    console.log(`총: ${testResults.total}, 성공: ${testResults.passed} (${(testResults.passed/testResults.total*100).toFixed(2)}%), 실패: ${testResults.failed}`);
    console.log(`소요 시간: ${testResults.duration.toFixed(2)}초`);
    console.log('='.repeat(80) + '\n');
    
    // JSON 상세 로그
    fs.writeFileSync(detailLogFile, JSON.stringify(testResults, null, 2));
    
    // 통계 JSON
    const statsFile = path.join(__dirname, '..', 'logs', 'comprehensive-20k-statistics.json');
    fs.writeFileSync(statsFile, JSON.stringify({
      summary: {
        total: testResults.total,
        passed: testResults.passed,
        failed: testResults.failed,
        successRate: (testResults.passed/testResults.total*100).toFixed(2) + '%',
        duration: testResults.duration.toFixed(2) + 's',
        startTime: testResults.startTime,
        endTime: testResults.endTime
      },
      categories: testResults.categories
    }, null, 2));
    
    log(`✅ 상세 로그: ${detailLogFile}`);
    log(`✅ 통계: ${statsFile}`);
  });

  describe("💰 다양한 금액 패턴 (5,000개)", function () {
    const amounts = [
      "0.000001", "0.00001", "0.0001", "0.001", "0.01", "0.1",
      "1", "5", "10", "50", "100", "500", "1000", "5000",
      "1.23", "9.99", "12.34", "99.99", "123.456", "999.999",
      "10000", "50000", "100000", "500000", "1000000"
    ];

    it("다양한 금액 5,000회 전송", async function () {
      this.timeout(600000);
      const category = "다양한금액";
      log(`\n${category} 테스트 시작...`);
      
      for (let i = 0; i < 5000; i++) {
        try {
          const amount = ethers.parseEther(amounts[i % amounts.length]);
          const recipient = users[i % users.length];
          
          const tx = await akc.connect(treasury).transfer(recipient.address, amount);
          const receipt = await tx.wait();
          
          logDetail(category, `전송-${i+1}`, amount, treasury.address, recipient.address, 'success', receipt.gasUsed);
          updateStats(category, true);
          
          if ((i + 1) % 500 === 0) {
            log(`${category}: ${i + 1}/5000 완료`);
          }
        } catch (error) {
          logDetail(category, `전송-${i+1}`, null, treasury.address, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/5000`);
    });
  });

  describe("🔄 사용자 간 P2P 패턴 (3,000개)", function () {
    it("사용자 간 다양한 P2P 전송 3,000회", async function () {
      this.timeout(600000);
      const category = "P2P전송";
      log(`\n${category} 테스트 시작...`);
      
      const amounts = ["0.1", "1", "10", "50", "100"];
      
      for (let i = 0; i < 3000; i++) {
        try {
          const amount = ethers.parseEther(amounts[i % amounts.length]);
          const sender = users[i % users.length];
          const recipient = users[(i + 1) % users.length];
          
          const tx = await akc.connect(sender).transfer(recipient.address, amount);
          const receipt = await tx.wait();
          
          logDetail(category, `P2P-${i+1}`, amount, sender.address, recipient.address, 'success', receipt.gasUsed);
          updateStats(category, true);
          
          if ((i + 1) % 300 === 0) {
            log(`${category}: ${i + 1}/3000 완료`);
          }
        } catch (error) {
          logDetail(category, `P2P-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/3000`);
    });
  });

  describe("🔥 Burn 다양한 패턴 (2,000개)", function () {
    it("다양한 금액 Burn 2,000회", async function () {
      this.timeout(600000);
      const category = "Burn";
      log(`\n${category} 테스트 시작...`);
      
      const burnAmounts = ["0.1", "1", "5", "10", "50", "100", "500", "1000"];
      
      for (let i = 0; i < 2000; i++) {
        try {
          const amount = ethers.parseEther(burnAmounts[i % burnAmounts.length]);
          const user = users[i % users.length];
          
          const tx = await akc.connect(user).burn(amount);
          const receipt = await tx.wait();
          
          logDetail(category, `Burn-${i+1}`, amount, user.address, 'BURN', 'success', receipt.gasUsed);
          updateStats(category, true);
          
          if ((i + 1) % 200 === 0) {
            log(`${category}: ${i + 1}/2000 완료`);
          }
        } catch (error) {
          logDetail(category, `Burn-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/2000`);
    });
  });

  describe("✅ Approve & TransferFrom 패턴 (3,000개)", function () {
    it("Approve 패턴 1,500회", async function () {
      this.timeout(600000);
      const category = "Approve";
      log(`\n${category} 테스트 시작...`);
      
      const amounts = ["1", "10", "100", "1000", "10000"];
      
      for (let i = 0; i < 1500; i++) {
        try {
          const amount = ethers.parseEther(amounts[i % amounts.length]);
          const approver = users[i % users.length];
          const spender = users[(i + 1) % users.length];
          
          const tx = await akc.connect(approver).approve(spender.address, amount);
          const receipt = await tx.wait();
          
          logDetail(category, `Approve-${i+1}`, amount, approver.address, spender.address, 'success', receipt.gasUsed);
          updateStats(category, true);
          
          if ((i + 1) % 150 === 0) {
            log(`${category}: ${i + 1}/1500 완료`);
          }
        } catch (error) {
          logDetail(category, `Approve-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/1500`);
    });

    it("TransferFrom 패턴 1,500회", async function () {
      this.timeout(600000);
      const category = "TransferFrom";
      log(`\n${category} 테스트 시작...`);
      
      const amounts = ["0.5", "1", "5", "10", "50"];
      
      for (let i = 0; i < 1500; i++) {
        try {
          const amount = ethers.parseEther(amounts[i % amounts.length]);
          const owner = users[i % users.length];
          const spender = users[(i + 1) % users.length];
          const recipient = users[(i + 2) % users.length];
          
          // Approve first
          await akc.connect(treasury).transfer(owner.address, amount);
          await akc.connect(owner).approve(spender.address, amount);
          
          const tx = await akc.connect(spender).transferFrom(owner.address, recipient.address, amount);
          const receipt = await tx.wait();
          
          logDetail(category, `TransferFrom-${i+1}`, amount, owner.address, recipient.address, 'success', receipt.gasUsed);
          updateStats(category, true);
          
          if ((i + 1) % 150 === 0) {
            log(`${category}: ${i + 1}/1500 완료`);
          }
        } catch (error) {
          logDetail(category, `TransferFrom-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/1500`);
    });
  });

  describe("⏸️ Pause/Unpause 패턴 (2,000개)", function () {
    it("Pause 상태 테스트 2,000회", async function () {
      this.timeout(600000);
      const category = "Pause";
      log(`\n${category} 테스트 시작...`);
      
      for (let i = 0; i < 2000; i++) {
        try {
          await akc.connect(owner).pause();
          
          try {
            await akc.connect(treasury).transfer(users[0].address, ethers.parseEther("1"));
            logDetail(category, `Pause-${i+1}`, null, null, null, 'failed', null, 'Should have reverted');
            updateStats(category, false);
          } catch (error) {
            if (error.message.includes("paused")) {
              logDetail(category, `Pause-${i+1}`, null, null, null, 'success', null, null);
              updateStats(category, true);
            } else {
              logDetail(category, `Pause-${i+1}`, null, null, null, 'failed', null, error.message);
              updateStats(category, false);
            }
          }
          
          await akc.connect(owner).unpause();
          
          if ((i + 1) % 200 === 0) {
            log(`${category}: ${i + 1}/2000 완료`);
          }
        } catch (error) {
          await akc.connect(owner).unpause();
          logDetail(category, `Pause-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/2000`);
    });
  });

  describe("🔁 순환 전송 패턴 (2,000개)", function () {
    it("순환 전송 2,000회", async function () {
      this.timeout(600000);
      const category = "순환전송";
      log(`\n${category} 테스트 시작...`);
      
      const amounts = ["0.1", "1", "5", "10"];
      
      for (let i = 0; i < 2000; i++) {
        try {
          const amount = ethers.parseEther(amounts[i % amounts.length]);
          const user1 = users[i % users.length];
          const user2 = users[(i + 1) % users.length];
          const user3 = users[(i + 2) % users.length];
          
          await akc.connect(user1).transfer(user2.address, amount);
          await akc.connect(user2).transfer(user3.address, amount);
          await akc.connect(user3).transfer(user1.address, amount);
          
          logDetail(category, `순환-${i+1}`, amount, user1.address, user1.address, 'success', null);
          updateStats(category, true);
          
          if ((i + 1) % 200 === 0) {
            log(`${category}: ${i + 1}/2000 완료`);
          }
        } catch (error) {
          logDetail(category, `순환-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/2000`);
    });
  });

  describe("🎯 복합 시나리오 패턴 (3,000개)", function () {
    it("복합 시나리오 3,000회", async function () {
      this.timeout(600000);
      const category = "복합시나리오";
      log(`\n${category} 테스트 시작...`);
      
      const amounts = ["1", "5", "10", "50"];
      
      for (let i = 0; i < 3000; i++) {
        try {
          const amount = ethers.parseEther(amounts[i % amounts.length]);
          const user1 = users[i % users.length];
          const user2 = users[(i + 1) % users.length];
          const user3 = users[(i + 2) % users.length];
          
          await akc.connect(treasury).transfer(user1.address, amount * 3n);
          await akc.connect(user1).approve(user2.address, amount);
          await akc.connect(user2).transferFrom(user1.address, user3.address, amount);
          await akc.connect(user1).burn(amount);
          await akc.connect(user1).transfer(treasury.address, amount);
          
          logDetail(category, `복합-${i+1}`, amount, user1.address, 'multi', 'success', null);
          updateStats(category, true);
          
          if ((i + 1) % 300 === 0) {
            log(`${category}: ${i + 1}/3000 완료`);
          }
        } catch (error) {
          logDetail(category, `복합-${i+1}`, null, null, null, 'failed', null, error.message);
          updateStats(category, false);
        }
      }
      
      log(`${category} 완료: ${testResults.categories[category].passed}/3000`);
    });
  });
});
