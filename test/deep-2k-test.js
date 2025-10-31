const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe("🔬 AKC 심층 다양성 테스트 (2,000회)", function () {
  let akc, owner, treasury, user1, user2, user3;
  const logFile = path.join(__dirname, '..', 'logs', 'deep-2k-test.log');
  let stats = { total: 0, passed: 0, failed: 0, categories: {} };

  function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(line.trim());
    fs.appendFileSync(logFile, line);
  }

  function update(cat, pass) {
    stats.total++;
    pass ? stats.passed++ : stats.failed++;
    if (!stats.categories[cat]) stats.categories[cat] = { total: 0, passed: 0, failed: 0 };
    stats.categories[cat].total++;
    pass ? stats.categories[cat].passed++ : stats.categories[cat].failed++;
  }

  before(async function () {
    console.log('\n' + '='.repeat(80));
    console.log('🔬 AKC 심층 테스트 2,000회');
    console.log('='.repeat(80) + '\n');
    
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(logFile, `Deep 2K Test - ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`);
    
    [owner, treasury, user1, user2, user3] = await ethers.getSigners();
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
    log(`✅ 컨트랙트 배포: ${await akc.getAddress()}`);
  });

  after(function () {
    console.log('\n' + '='.repeat(80));
    console.log('📊 최종 통계');
    console.log('='.repeat(80));
    console.log(`총: ${stats.total}, 성공: ${stats.passed} (${(stats.passed/stats.total*100).toFixed(2)}%), 실패: ${stats.failed}`);
    console.log('='.repeat(80) + '\n');
    fs.writeFileSync(path.join(__dirname, '..', 'logs', 'deep-2k-statistics.json'), JSON.stringify(stats, null, 2));
  });

  it("1. 다양한 금액 전송 (200회)", async function () {
    const cat = "다양한금액";
    log(`\n${cat} 시작...`);
    const amounts = ["0.001", "1", "10", "100", "1000", "10000", "50000", "100000"];
    for (let i = 0; i < 200; i++) {
      try {
        const amt = ethers.parseEther(amounts[i % amounts.length]);
        await akc.connect(treasury).transfer(user1.address, amt);
        await akc.connect(user1).transfer(treasury.address, amt);
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("2. 왕복 전송 (200회)", async function () {
    const cat = "왕복전송";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        const amt = ethers.parseEther("100");
        await akc.connect(treasury).transfer(user1.address, amt);
        await akc.connect(user1).transfer(user2.address, amt);
        await akc.connect(user2).transfer(treasury.address, amt);
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("3. Approve & TransferFrom (200회)", async function () {
    const cat = "승인전송";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        const amt = ethers.parseEther("10");
        await akc.connect(treasury).transfer(user1.address, amt);
        await akc.connect(user1).approve(user2.address, amt);
        await akc.connect(user2).transferFrom(user1.address, user3.address, amt);
        await akc.connect(user3).transfer(treasury.address, amt);
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); log(`실패: ${e.message}`, true); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("4. Burn 다양한 금액 (200회)", async function () {
    const cat = "소각";
    log(`\n${cat} 시작...`);
    const amounts = ["1", "10", "100", "1000", "10000"];
    for (let i = 0; i < 200; i++) {
      try {
        const amt = ethers.parseEther(amounts[i % amounts.length]);
        await akc.connect(treasury).transfer(user1.address, amt);
        await akc.connect(user1).burn(amt);
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("5. Pause/Unpause (200회)", async function () {
    const cat = "일시정지";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        await akc.connect(owner).pause();
        await expect(akc.connect(treasury).transfer(user1.address, ethers.parseEther("1")))
          .to.be.revertedWith("AKC: token transfer while paused");
        await akc.connect(owner).unpause();
        await akc.connect(treasury).transfer(user1.address, ethers.parseEther("1"));
        await akc.connect(user1).transfer(treasury.address, ethers.parseEther("1"));
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { await akc.connect(owner).unpause(); update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("6. 잔액 부족 에러 (200회)", async function () {
    const cat = "잔액부족";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        const amt = ethers.parseEther("50");
        await akc.connect(treasury).transfer(user1.address, amt);
        await expect(akc.connect(user1).transfer(user2.address, ethers.parseEther("100")))
          .to.be.revertedWith("ERC20: transfer amount exceeds balance");
        await akc.connect(user1).transfer(treasury.address, amt);
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("7. 0 주소 에러 (200회)", async function () {
    const cat = "0주소";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        await expect(akc.connect(treasury).transfer(ethers.ZeroAddress, ethers.parseEther("1")))
          .to.be.revertedWith("ERC20: transfer to the zero address");
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("8. Allowance 초과 (200회)", async function () {
    const cat = "승인초과";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        await akc.connect(treasury).transfer(user1.address, ethers.parseEther("50"));
        await akc.connect(user1).approve(user2.address, ethers.parseEther("30"));
        await expect(akc.connect(user2).transferFrom(user1.address, user3.address, ethers.parseEther("50")))
          .to.be.revertedWith("ERC20: insufficient allowance");
        await akc.connect(user1).transfer(treasury.address, ethers.parseEther("50"));
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("9. 권한 없는 Pause (200회)", async function () {
    const cat = "권한없음";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        await expect(akc.connect(user1).pause())
          .to.be.revertedWith("Ownable: caller is not the owner");
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });

  it("10. 복합 시나리오 (200회)", async function () {
    const cat = "복합";
    log(`\n${cat} 시작...`);
    for (let i = 0; i < 200; i++) {
      try {
        const amt = ethers.parseEther("100");
        await akc.connect(treasury).transfer(user1.address, amt);
        await akc.connect(user1).approve(user2.address, ethers.parseEther("50"));
        await akc.connect(user2).transferFrom(user1.address, user3.address, ethers.parseEther("50"));
        await akc.connect(user1).burn(ethers.parseEther("25"));
        await akc.connect(user1).transfer(treasury.address, ethers.parseEther("25"));
        await akc.connect(user3).transfer(treasury.address, ethers.parseEther("50"));
        update(cat, true);
        if ((i+1) % 40 === 0) log(`${cat}: ${i+1}/200`);
      } catch (e) { update(cat, false); }
    }
    log(`${cat} 완료: ${stats.categories[cat].passed}/200`);
  });
});
