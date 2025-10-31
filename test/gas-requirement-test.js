const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe("⛽ AKC Token 가스 요구사항 테스트", function () {
  let akc, owner, treasury, user1, user2;
  const logFile = path.join(__dirname, '..', 'logs', 'gas-requirement-test.log');
  let gasData = { tests: [], summary: {} };

  function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(line.trim());
    try {
      fs.appendFileSync(logFile, line);
    } catch (err) {}
  }

  before(async function () {
    console.log('\n' + '='.repeat(80));
    console.log('⛽ AKC Token 가스 요구사항 테스트');
    console.log('='.repeat(80) + '\n');
    
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(logFile, `Gas Requirement Test - ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`);
    
    [owner, treasury, user1, user2] = await ethers.getSigners();
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
    
    log(`✅ 컨트랙트 배포 완료: ${await akc.getAddress()}`);
  });

  after(function () {
    console.log('\n' + '='.repeat(80));
    console.log('📊 가스 요구사항 최종 통계');
    console.log('='.repeat(80));
    
    const statsFile = path.join(__dirname, '..', 'logs', 'gas-requirement-statistics.json');
    fs.writeFileSync(statsFile, JSON.stringify(gasData, null, 2));
    log(`✅ 통계 저장: ${statsFile}`);
  });

  describe("1️⃣ 계정 잔액 확인 (BNB)", function () {
    it("1.1 모든 테스트 계정의 BNB 잔액 확인", async function () {
      log('\n=== 계정 BNB 잔액 확인 ===');
      
      const accounts = [
        { name: 'Owner', account: owner },
        { name: 'Treasury', account: treasury },
        { name: 'User1', account: user1 },
        { name: 'User2', account: user2 }
      ];
      
      for (const { name, account } of accounts) {
        const balance = await ethers.provider.getBalance(account.address);
        const bnb = ethers.formatEther(balance);
        log(`${name} (${account.address}): ${bnb} BNB`);
        
        // Hardhat 로컬 네트워크는 각 계정에 10,000 BNB 제공
        expect(parseFloat(bnb)).to.be.greaterThan(1000);
      }
      
      log('✅ 모든 계정에 충분한 BNB 보유');
    });
  });

  describe("2️⃣ 각 함수별 가스 소비량 측정", function () {
    it("2.1 Transfer - 가스 측정 및 BNB 비용 계산", async function () {
      log('\n=== Transfer 가스 측정 ===');
      
      const amount = ethers.parseEther("100");
      const beforeBalance = await ethers.provider.getBalance(treasury.address);
      
      const tx = await akc.connect(treasury).transfer(user1.address, amount);
      const receipt = await tx.wait();
      
      const afterBalance = await ethers.provider.getBalance(treasury.address);
      const gasCost = beforeBalance - afterBalance - 0n; // 실제 소비된 BNB
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const txCost = gasUsed * gasPrice;
      
      log(`가스 사용량: ${gasUsed.toString()}`);
      log(`가스 가격: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`);
      log(`트랜잭션 비용: ${ethers.formatEther(txCost)} BNB`);
      
      gasData.tests.push({
        function: 'Transfer',
        gasUsed: gasUsed.toString(),
        gasPrice: gasPrice.toString(),
        costBNB: ethers.formatEther(txCost),
        costUSD_600: (parseFloat(ethers.formatEther(txCost)) * 600).toFixed(4)
      });
      
      expect(gasUsed).to.be.lessThan(100000n);
    });

    it("2.2 Approve - 가스 측정", async function () {
      log('\n=== Approve 가스 측정 ===');
      
      const amount = ethers.parseEther("100");
      await akc.connect(treasury).transfer(user1.address, amount);
      
      const tx = await akc.connect(user1).approve(user2.address, amount);
      const receipt = await tx.wait();
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const txCost = gasUsed * gasPrice;
      
      log(`가스 사용량: ${gasUsed.toString()}`);
      log(`트랜잭션 비용: ${ethers.formatEther(txCost)} BNB`);
      
      gasData.tests.push({
        function: 'Approve',
        gasUsed: gasUsed.toString(),
        gasPrice: gasPrice.toString(),
        costBNB: ethers.formatEther(txCost),
        costUSD_600: (parseFloat(ethers.formatEther(txCost)) * 600).toFixed(4)
      });
    });

    it("2.3 TransferFrom - 가스 측정", async function () {
      log('\n=== TransferFrom 가스 측정 ===');
      
      const tx = await akc.connect(user2).transferFrom(user1.address, user2.address, ethers.parseEther("100"));
      const receipt = await tx.wait();
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const txCost = gasUsed * gasPrice;
      
      log(`가스 사용량: ${gasUsed.toString()}`);
      log(`트랜잭션 비용: ${ethers.formatEther(txCost)} BNB`);
      
      gasData.tests.push({
        function: 'TransferFrom',
        gasUsed: gasUsed.toString(),
        gasPrice: gasPrice.toString(),
        costBNB: ethers.formatEther(txCost),
        costUSD_600: (parseFloat(ethers.formatEther(txCost)) * 600).toFixed(4)
      });
    });

    it("2.4 Burn - 가스 측정", async function () {
      log('\n=== Burn 가스 측정 ===');
      
      const amount = ethers.parseEther("50");
      
      const tx = await akc.connect(user2).burn(amount);
      const receipt = await tx.wait();
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const txCost = gasUsed * gasPrice;
      
      log(`가스 사용량: ${gasUsed.toString()}`);
      log(`트랜잭션 비용: ${ethers.formatEther(txCost)} BNB`);
      
      gasData.tests.push({
        function: 'Burn',
        gasUsed: gasUsed.toString(),
        gasPrice: gasPrice.toString(),
        costBNB: ethers.formatEther(txCost),
        costUSD_600: (parseFloat(ethers.formatEther(txCost)) * 600).toFixed(4)
      });
    });

    it("2.5 Pause - 가스 측정", async function () {
      log('\n=== Pause 가스 측정 ===');
      
      const tx = await akc.connect(owner).pause();
      const receipt = await tx.wait();
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const txCost = gasUsed * gasPrice;
      
      log(`가스 사용량: ${gasUsed.toString()}`);
      log(`트랜잭션 비용: ${ethers.formatEther(txCost)} BNB`);
      
      gasData.tests.push({
        function: 'Pause',
        gasUsed: gasUsed.toString(),
        gasPrice: gasPrice.toString(),
        costBNB: ethers.formatEther(txCost),
        costUSD_600: (parseFloat(ethers.formatEther(txCost)) * 600).toFixed(4)
      });
      
      await akc.connect(owner).unpause();
    });
  });

  describe("3️⃣ 가스 부족 시나리오 시뮬레이션", function () {
    it("3.1 BNB가 충분한 경우 - 정상 전송", async function () {
      log('\n=== BNB 충분 시나리오 ===');
      
      const bnbBalance = await ethers.provider.getBalance(treasury.address);
      log(`Treasury BNB 잔액: ${ethers.formatEther(bnbBalance)} BNB`);
      
      const amount = ethers.parseEther("100");
      const tx = await akc.connect(treasury).transfer(user1.address, amount);
      const receipt = await tx.wait();
      
      log(`✅ 전송 성공 - 가스 사용: ${receipt.gasUsed.toString()}`);
      expect(receipt.status).to.equal(1);
    });

    it("3.2 최소 BNB 요구량 계산", async function () {
      log('\n=== 최소 BNB 요구량 ===');
      
      // 가장 가스를 많이 쓰는 함수의 가스량
      const maxGas = 100000n;
      const gasPriceGwei = 3n; // BSC 평균 3 Gwei
      const gasPrice = gasPriceGwei * 1000000000n; // Gwei to Wei
      
      const minBNB = maxGas * gasPrice;
      log(`최대 가스: ${maxGas.toString()}`);
      log(`가스 가격: ${gasPriceGwei.toString()} Gwei`);
      log(`최소 필요 BNB: ${ethers.formatEther(minBNB)} BNB`);
      log(`최소 필요 USD (BNB=$600): $${(parseFloat(ethers.formatEther(minBNB)) * 600).toFixed(4)}`);
      
      gasData.summary.minBNBRequired = ethers.formatEther(minBNB);
      gasData.summary.minUSDRequired = (parseFloat(ethers.formatEther(minBNB)) * 600).toFixed(4);
    });

    it("3.3 권장 BNB 보유량 계산", async function () {
      log('\n=== 권장 BNB 보유량 ===');
      
      // 안전 마진 포함 (10배)
      const maxGas = 100000n;
      const gasPriceGwei = 3n;
      const gasPrice = gasPriceGwei * 1000000000n;
      const safetyMargin = 10n;
      
      const recommendedBNB = maxGas * gasPrice * safetyMargin;
      log(`안전 마진: 10배`);
      log(`권장 BNB: ${ethers.formatEther(recommendedBNB)} BNB`);
      log(`권장 USD (BNB=$600): $${(parseFloat(ethers.formatEther(recommendedBNB)) * 600).toFixed(2)}`);
      
      gasData.summary.recommendedBNB = ethers.formatEther(recommendedBNB);
      gasData.summary.recommendedUSD = (parseFloat(ethers.formatEther(recommendedBNB)) * 600).toFixed(2);
    });
  });

  describe("4️⃣ 메인넷 배포 시 BNB 요구사항", function () {
    it("4.1 컨트랙트 배포 가스 추정", async function () {
      log('\n=== 배포 가스 추정 ===');
      
      // 실제 배포 시 사용된 가스 (로그에서)
      const deployGas = 1500000n; // 평균 배포 가스
      const gasPriceGwei = 3n;
      const gasPrice = gasPriceGwei * 1000000000n;
      
      const deployCost = deployGas * gasPrice;
      log(`예상 배포 가스: ${deployGas.toString()}`);
      log(`배포 비용: ${ethers.formatEther(deployCost)} BNB`);
      log(`배포 비용 USD: $${(parseFloat(ethers.formatEther(deployCost)) * 600).toFixed(2)}`);
      
      gasData.summary.deployGas = deployGas.toString();
      gasData.summary.deployCostBNB = ethers.formatEther(deployCost);
      gasData.summary.deployCostUSD = (parseFloat(ethers.formatEther(deployCost)) * 600).toFixed(2);
    });

    it("4.2 초기 운영 비용 계산", async function () {
      log('\n=== 초기 운영 비용 ===');
      
      // 초기 필요 트랜잭션들
      const operations = [
        { name: '배포', gas: 1500000n },
        { name: '초기 전송 (10회)', gas: 53613n * 10n },
        { name: 'Approve (5회)', gas: 46296n * 5n },
        { name: '예비', gas: 100000n * 5n }
      ];
      
      const gasPriceGwei = 3n;
      const gasPrice = gasPriceGwei * 1000000000n;
      
      let totalGas = 0n;
      for (const op of operations) {
        const cost = op.gas * gasPrice;
        log(`${op.name}: ${ethers.formatEther(cost)} BNB ($${(parseFloat(ethers.formatEther(cost)) * 600).toFixed(2)})`);
        totalGas += op.gas;
      }
      
      const totalCost = totalGas * gasPrice;
      log(`\n총 필요 BNB: ${ethers.formatEther(totalCost)} BNB`);
      log(`총 필요 USD: $${(parseFloat(ethers.formatEther(totalCost)) * 600).toFixed(2)}`);
      
      gasData.summary.initialOperationBNB = ethers.formatEther(totalCost);
      gasData.summary.initialOperationUSD = (parseFloat(ethers.formatEther(totalCost)) * 600).toFixed(2);
    });
  });

  describe("5️⃣ 실제 시나리오 테스트", function () {
    it("5.1 100회 연속 전송 - 총 가스 비용", async function () {
      log('\n=== 100회 연속 전송 시나리오 ===');
      
      const beforeBalance = await ethers.provider.getBalance(treasury.address);
      log(`시작 BNB: ${ethers.formatEther(beforeBalance)} BNB`);
      
      for (let i = 0; i < 100; i++) {
        await akc.connect(treasury).transfer(user1.address, ethers.parseEther("1"));
        if ((i + 1) % 20 === 0) {
          const currentBalance = await ethers.provider.getBalance(treasury.address);
          const used = beforeBalance - currentBalance;
          log(`${i + 1}회 후 소비 BNB: ${ethers.formatEther(used)} BNB`);
        }
      }
      
      const afterBalance = await ethers.provider.getBalance(treasury.address);
      const totalUsed = beforeBalance - afterBalance;
      
      log(`\n총 소비 BNB: ${ethers.formatEther(totalUsed)} BNB`);
      log(`평균 (1회당): ${ethers.formatEther(totalUsed / 100n)} BNB`);
      log(`총 비용 USD: $${(parseFloat(ethers.formatEther(totalUsed)) * 600).toFixed(2)}`);
      
      gasData.summary.test100TransfersBNB = ethers.formatEther(totalUsed);
      gasData.summary.test100TransfersUSD = (parseFloat(ethers.formatEther(totalUsed)) * 600).toFixed(2);
      
      // 정리
      const user1Balance = await akc.balanceOf(user1.address);
      await akc.connect(user1).transfer(treasury.address, user1Balance);
    });
  });
});
