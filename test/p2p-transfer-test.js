const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe("👥 AKC Token P2P 사용자 간 전송 테스트", function () {
  let akc, owner, treasury, alice, bob, charlie, david, eve;
  const logFile = path.join(__dirname, '..', 'logs', 'p2p-transfer-test.log');
  let results = { total: 0, passed: 0, failed: 0, tests: [] };

  function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(line.trim());
    try {
      fs.appendFileSync(logFile, line);
    } catch (err) {}
  }

  function updateStats(test, passed) {
    results.total++;
    passed ? results.passed++ : results.failed++;
    results.tests.push({ test, passed, timestamp: new Date().toISOString() });
  }

  before(async function () {
    console.log('\n' + '='.repeat(80));
    console.log('👥 AKC Token P2P 사용자 간 전송 테스트');
    console.log('='.repeat(80) + '\n');
    
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(logFile, `P2P Transfer Test - ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`);
    
    [owner, treasury, alice, bob, charlie, david, eve] = await ethers.getSigners();
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
    
    log(`✅ 컨트랙트 배포 완료: ${await akc.getAddress()}`);
    log(`사용자 계정: Alice, Bob, Charlie, David, Eve`);
  });

  after(function () {
    console.log('\n' + '='.repeat(80));
    console.log('📊 P2P 전송 최종 통계');
    console.log('='.repeat(80));
    console.log(`총: ${results.total}, 성공: ${results.passed} (${(results.passed/results.total*100).toFixed(2)}%), 실패: ${results.failed}`);
    console.log('='.repeat(80) + '\n');
    
    const statsFile = path.join(__dirname, '..', 'logs', 'p2p-transfer-statistics.json');
    fs.writeFileSync(statsFile, JSON.stringify(results, null, 2));
    log(`✅ 통계 저장: ${statsFile}`);
  });

  describe("1️⃣ 기본 P2P 전송", function () {
    it("1.1 초기 잔액 분배 (Treasury → Users)", async function () {
      log('\n=== 초기 잔액 분배 ===');
      
      const initialAmount = ethers.parseEther("10000");
      const users = [alice, bob, charlie, david, eve];
      
      for (const user of users) {
        await akc.connect(treasury).transfer(user.address, initialAmount);
        const balance = await akc.balanceOf(user.address);
        log(`${user.address.substring(0,10)}...: ${ethers.formatEther(balance)} AKC`);
      }
      
      log('✅ 모든 사용자에게 10,000 AKC 분배 완료');
      updateStats('초기 잔액 분배', true);
    });

    it("1.2 Alice → Bob 단순 전송", async function () {
      log('\n=== Alice → Bob 전송 ===');
      
      const amount = ethers.parseEther("100");
      
      const aliceBefore = await akc.balanceOf(alice.address);
      const bobBefore = await akc.balanceOf(bob.address);
      
      await akc.connect(alice).transfer(bob.address, amount);
      
      const aliceAfter = await akc.balanceOf(alice.address);
      const bobAfter = await akc.balanceOf(bob.address);
      
      log(`Alice: ${ethers.formatEther(aliceBefore)} → ${ethers.formatEther(aliceAfter)} AKC`);
      log(`Bob: ${ethers.formatEther(bobBefore)} → ${ethers.formatEther(bobAfter)} AKC`);
      
      expect(aliceAfter).to.equal(aliceBefore - amount);
      expect(bobAfter).to.equal(bobBefore + amount);
      
      log('✅ Alice → Bob 전송 성공');
      updateStats('Alice → Bob', true);
    });

    it("1.3 Bob → Charlie 연속 전송", async function () {
      log('\n=== Bob → Charlie 전송 ===');
      
      const amount = ethers.parseEther("50");
      
      const bobBefore = await akc.balanceOf(bob.address);
      const charlieBefore = await akc.balanceOf(charlie.address);
      
      await akc.connect(bob).transfer(charlie.address, amount);
      
      const bobAfter = await akc.balanceOf(bob.address);
      const charlieAfter = await akc.balanceOf(charlie.address);
      
      log(`Bob: ${ethers.formatEther(bobBefore)} → ${ethers.formatEther(bobAfter)} AKC`);
      log(`Charlie: ${ethers.formatEther(charlieBefore)} → ${ethers.formatEther(charlieAfter)} AKC`);
      
      expect(bobAfter).to.equal(bobBefore - amount);
      expect(charlieAfter).to.equal(charlieBefore + amount);
      
      log('✅ Bob → Charlie 전송 성공');
      updateStats('Bob → Charlie', true);
    });
  });

  describe("2️⃣ 체인 전송 (A → B → C → D)", function () {
    it("2.1 4단계 체인 전송", async function () {
      log('\n=== 4단계 체인 전송 ===');
      
      const amount = ethers.parseEther("25");
      
      // Alice → Bob
      log('Step 1: Alice → Bob (25 AKC)');
      await akc.connect(alice).transfer(bob.address, amount);
      
      // Bob → Charlie
      log('Step 2: Bob → Charlie (25 AKC)');
      await akc.connect(bob).transfer(charlie.address, amount);
      
      // Charlie → David
      log('Step 3: Charlie → David (25 AKC)');
      await akc.connect(charlie).transfer(david.address, amount);
      
      // David → Eve
      log('Step 4: David → Eve (25 AKC)');
      await akc.connect(david).transfer(eve.address, amount);
      
      log('✅ 4단계 체인 전송 완료');
      updateStats('4단계 체인', true);
    });

    it("2.2 체인 전송 후 잔액 확인", async function () {
      log('\n=== 체인 전송 후 잔액 확인 ===');
      
      const users = [
        { name: 'Alice', account: alice },
        { name: 'Bob', account: bob },
        { name: 'Charlie', account: charlie },
        { name: 'David', account: david },
        { name: 'Eve', account: eve }
      ];
      
      let totalBalance = 0n;
      
      for (const { name, account } of users) {
        const balance = await akc.balanceOf(account.address);
        totalBalance += balance;
        log(`${name}: ${ethers.formatEther(balance)} AKC`);
      }
      
      log(`총 잔액: ${ethers.formatEther(totalBalance)} AKC`);
      expect(totalBalance).to.equal(ethers.parseEther("50000")); // 5명 × 10,000
      
      log('✅ 총 잔액 일치 확인');
      updateStats('잔액 무결성', true);
    });
  });

  describe("3️⃣ 순환 전송", function () {
    it("3.1 원형 순환 전송 (A → B → C → A)", async function () {
      log('\n=== 원형 순환 전송 ===');
      
      const amount = ethers.parseEther("10");
      
      const aliceInitial = await akc.balanceOf(alice.address);
      const bobInitial = await akc.balanceOf(bob.address);
      const charlieInitial = await akc.balanceOf(charlie.address);
      
      log('초기 잔액:');
      log(`Alice: ${ethers.formatEther(aliceInitial)} AKC`);
      log(`Bob: ${ethers.formatEther(bobInitial)} AKC`);
      log(`Charlie: ${ethers.formatEther(charlieInitial)} AKC`);
      
      // Alice → Bob
      await akc.connect(alice).transfer(bob.address, amount);
      log('✅ Alice → Bob (10 AKC)');
      
      // Bob → Charlie
      await akc.connect(bob).transfer(charlie.address, amount);
      log('✅ Bob → Charlie (10 AKC)');
      
      // Charlie → Alice (순환 완료)
      await akc.connect(charlie).transfer(alice.address, amount);
      log('✅ Charlie → Alice (10 AKC)');
      
      const aliceFinal = await akc.balanceOf(alice.address);
      const bobFinal = await akc.balanceOf(bob.address);
      const charlieFinal = await akc.balanceOf(charlie.address);
      
      log('\n최종 잔액:');
      log(`Alice: ${ethers.formatEther(aliceFinal)} AKC`);
      log(`Bob: ${ethers.formatEther(bobFinal)} AKC`);
      log(`Charlie: ${ethers.formatEther(charlieFinal)} AKC`);
      
      // 순환이므로 초기 잔액과 동일해야 함
      expect(aliceFinal).to.equal(aliceInitial);
      expect(bobFinal).to.equal(bobInitial);
      expect(charlieFinal).to.equal(charlieInitial);
      
      log('✅ 순환 전송 후 잔액 복원 확인');
      updateStats('원형 순환', true);
    });

    it("3.2 복잡한 순환 (5명)", async function () {
      log('\n=== 5명 복잡 순환 ===');
      
      const amount = ethers.parseEther("5");
      
      // 5명 원형 순환
      await akc.connect(alice).transfer(bob.address, amount);
      await akc.connect(bob).transfer(charlie.address, amount);
      await akc.connect(charlie).transfer(david.address, amount);
      await akc.connect(david).transfer(eve.address, amount);
      await akc.connect(eve).transfer(alice.address, amount);
      
      log('✅ 5명 원형 순환 완료');
      updateStats('5명 순환', true);
    });
  });

  describe("4️⃣ 동시 다발 전송", function () {
    it("4.1 여러 사용자가 동시에 전송", async function () {
      log('\n=== 동시 다발 전송 ===');
      
      const amount = ethers.parseEther("1");
      
      // 5개 트랜잭션 동시 실행
      const txs = await Promise.all([
        akc.connect(alice).transfer(bob.address, amount),
        akc.connect(bob).transfer(charlie.address, amount),
        akc.connect(charlie).transfer(david.address, amount),
        akc.connect(david).transfer(eve.address, amount),
        akc.connect(eve).transfer(alice.address, amount)
      ]);
      
      // 모든 트랜잭션 완료 대기
      await Promise.all(txs.map(tx => tx.wait()));
      
      log('✅ 5개 동시 전송 완료');
      updateStats('동시 전송', true);
    });

    it("4.2 크로스 전송 (교차 전송)", async function () {
      log('\n=== 크로스 전송 ===');
      
      const amount = ethers.parseEther("2");
      
      // Alice ↔ Bob, Charlie ↔ David 동시 교차
      await Promise.all([
        akc.connect(alice).transfer(bob.address, amount),
        akc.connect(bob).transfer(alice.address, amount),
        akc.connect(charlie).transfer(david.address, amount),
        akc.connect(david).transfer(charlie.address, amount)
      ]);
      
      log('✅ 4개 크로스 전송 완료');
      updateStats('크로스 전송', true);
    });
  });

  describe("5️⃣ 대량 P2P 전송", function () {
    it("5.1 100회 연속 P2P 전송", async function () {
      log('\n=== 100회 P2P 전송 ===');
      
      const amount = ethers.parseEther("0.1");
      const users = [alice, bob, charlie, david, eve];
      
      for (let i = 0; i < 100; i++) {
        const sender = users[i % users.length];
        const receiver = users[(i + 1) % users.length];
        
        await akc.connect(sender).transfer(receiver.address, amount);
        
        if ((i + 1) % 20 === 0) {
          log(`${i + 1}/100 완료`);
        }
      }
      
      log('✅ 100회 P2P 전송 완료');
      updateStats('100회 P2P', true);
    });

    it("5.2 최종 잔액 검증", async function () {
      log('\n=== 최종 잔액 검증 ===');
      
      const users = [
        { name: 'Alice', account: alice },
        { name: 'Bob', account: bob },
        { name: 'Charlie', account: charlie },
        { name: 'David', account: david },
        { name: 'Eve', account: eve }
      ];
      
      let totalBalance = 0n;
      
      for (const { name, account } of users) {
        const balance = await akc.balanceOf(account.address);
        totalBalance += balance;
        log(`${name}: ${ethers.formatEther(balance)} AKC`);
      }
      
      log(`\n총 잔액: ${ethers.formatEther(totalBalance)} AKC`);
      expect(totalBalance).to.equal(ethers.parseEther("50000"));
      
      log('✅ 총 잔액 무결성 유지');
      updateStats('최종 검증', true);
    });
  });

  describe("6️⃣ 극한 시나리오", function () {
    it("6.1 거의 모든 잔액 전송", async function () {
      log('\n=== 거의 모든 잔액 전송 ===');
      
      const aliceBalance = await akc.balanceOf(alice.address);
      const almostAll = aliceBalance - ethers.parseEther("100"); // 100 AKC만 남기고 (이후 테스트용)
      
      log(`Alice 잔액: ${ethers.formatEther(aliceBalance)} AKC`);
      log(`전송 금액: ${ethers.formatEther(almostAll)} AKC`);
      
      await akc.connect(alice).transfer(bob.address, almostAll);
      
      const aliceAfter = await akc.balanceOf(alice.address);
      log(`Alice 남은 잔액: ${ethers.formatEther(aliceAfter)} AKC`);
      
      expect(aliceAfter).to.equal(ethers.parseEther("100"));
      log('✅ 거의 모든 잔액 전송 성공');
      updateStats('거의 모든 잔액', true);
    });

    it("6.2 연속 소액 전송 (50회)", async function () {
      log('\n=== 50회 소액 전송 ===');
      
      const tinyAmount = ethers.parseEther("0.01");
      
      for (let i = 0; i < 50; i++) {
        await akc.connect(bob).transfer(charlie.address, tinyAmount);
      }
      
      log('✅ 50회 소액 전송 완료 (0.01 AKC × 50)');
      updateStats('50회 소액', true);
    });

    it("6.3 다대다 전송 패턴", async function () {
      log('\n=== 다대다 전송 ===');
      
      const amount = ethers.parseEther("0.5");
      
      // 모든 사용자가 모든 다른 사용자에게 전송
      const users = [alice, bob, charlie, david, eve];
      
      for (const sender of users) {
        for (const receiver of users) {
          if (sender.address !== receiver.address) {
            await akc.connect(sender).transfer(receiver.address, amount);
          }
        }
      }
      
      log('✅ 다대다 전송 완료 (5×4 = 20 전송)');
      updateStats('다대다', true);
    });
  });

  describe("7️⃣ 이벤트 확인", function () {
    it("7.1 Transfer 이벤트 발생 확인", async function () {
      log('\n=== Transfer 이벤트 확인 ===');
      
      const amount = ethers.parseEther("100");
      
      const tx = await akc.connect(alice).transfer(bob.address, amount);
      const receipt = await tx.wait();
      
      // Transfer 이벤트 찾기
      const transferEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'Transfer'
      );
      
      expect(transferEvent).to.not.be.undefined;
      
      log(`✅ Transfer 이벤트 발생 확인`);
      log(`From: ${transferEvent.args[0]}`);
      log(`To: ${transferEvent.args[1]}`);
      log(`Amount: ${ethers.formatEther(transferEvent.args[2])} AKC`);
      
      updateStats('이벤트 발생', true);
    });
  });

  describe("8️⃣ 가스 효율성", function () {
    it("8.1 P2P 전송 가스 측정", async function () {
      log('\n=== P2P 전송 가스 ===');
      
      const amount = ethers.parseEther("10");
      
      const tx = await akc.connect(charlie).transfer(david.address, amount);
      const receipt = await tx.wait();
      
      log(`가스 사용: ${receipt.gasUsed.toString()}`);
      log(`가스 가격: ${ethers.formatUnits(receipt.gasPrice || tx.gasPrice, 'gwei')} Gwei`);
      
      const gasCost = receipt.gasUsed * (receipt.gasPrice || tx.gasPrice);
      log(`비용: ${ethers.formatEther(gasCost)} BNB`);
      
      expect(receipt.gasUsed).to.be.lessThan(100000n);
      log('✅ P2P 전송 가스 효율적');
      updateStats('가스 효율', true);
    });
  });
});
