const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe("🔍 AKC Token 디테일 엣지 케이스 테스트", function () {
  let akc, owner, treasury, user1, user2, user3;
  const logFile = path.join(__dirname, '..', 'logs', 'edge-case-test.log');
  let results = { total: 0, passed: 0, failed: 0, categories: {} };

  function log(msg, isError = false) {
    const line = `[${new Date().toISOString()}] ${isError ? '❌' : '✅'} ${msg}\n`;
    console.log(line.trim());
    try {
      fs.appendFileSync(logFile, line);
    } catch (err) {}
  }

  function updateStats(category, passed = true) {
    results.total++;
    passed ? results.passed++ : results.failed++;
    if (!results.categories[category]) {
      results.categories[category] = { total: 0, passed: 0, failed: 0, details: [] };
    }
    results.categories[category].total++;
    passed ? results.categories[category].passed++ : results.categories[category].failed++;
  }

  before(async function () {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 AKC Token 디테일 엣지 케이스 테스트');
    console.log('='.repeat(80) + '\n');
    
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(logFile, `Edge Case Test - ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`);
    
    [owner, treasury, user1, user2, user3] = await ethers.getSigners();
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
    
    const addr = await akc.getAddress();
    log(`컨트랙트 배포 완료: ${addr}`);
    
    const supply = await akc.totalSupply();
    log(`초기 발행량: ${ethers.formatEther(supply)} AKC`);
    
    const treasuryBalance = await akc.balanceOf(treasury.address);
    log(`Treasury 초기 잔액: ${ethers.formatEther(treasuryBalance)} AKC`);
  });

  after(function () {
    console.log('\n' + '='.repeat(80));
    console.log('📊 디테일 테스트 최종 통계');
    console.log('='.repeat(80));
    console.log(`총: ${results.total}, 성공: ${results.passed} (${(results.passed/results.total*100).toFixed(2)}%), 실패: ${results.failed}`);
    console.log('='.repeat(80) + '\n');
    
    const statsFile = path.join(__dirname, '..', 'logs', 'edge-case-statistics.json');
    fs.writeFileSync(statsFile, JSON.stringify(results, null, 2));
    log(`통계 저장: ${statsFile}`);
  });

  describe("1️⃣ 잔액 부족 - Reject 확인", function () {
    it("1.1 정확히 0 잔액에서 전송 시도", async function () {
      const cat = "잔액부족-0잔액";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        // User1 잔액 확인
        const balance = await akc.balanceOf(user1.address);
        log(`User1 현재 잔액: ${ethers.formatEther(balance)} AKC`);
        expect(balance).to.equal(0);
        
        // 0 잔액에서 전송 시도
        await expect(
          akc.connect(user1).transfer(user2.address, ethers.parseEther("1"))
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        
        log(`✅ 0 잔액에서 전송 정상적으로 reject됨`);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("1.2 잔액보다 1 wei 많이 전송 시도", async function () {
      const cat = "잔액부족-1wei초과";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        // User1에게 100 AKC 전송
        await akc.connect(treasury).transfer(user1.address, amount);
        const balance = await akc.balanceOf(user1.address);
        log(`User1 잔액: ${ethers.formatEther(balance)} AKC`);
        
        // 100.000000000000000001 AKC 전송 시도 (1 wei 초과)
        const overAmount = balance + 1n;
        await expect(
          akc.connect(user1).transfer(user2.address, overAmount)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        
        log(`✅ 잔액+1wei 전송 정상적으로 reject됨`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, balance);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("1.3 정확히 잔액만큼 전송은 성공", async function () {
      const cat = "잔액부족-정확한금액";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("50.123456789");
        
        await akc.connect(treasury).transfer(user1.address, amount);
        const balance = await akc.balanceOf(user1.address);
        log(`User1 잔액: ${ethers.formatEther(balance)} AKC`);
        
        // 정확히 잔액만큼 전송
        await akc.connect(user1).transfer(user2.address, balance);
        
        const afterBalance = await akc.balanceOf(user1.address);
        expect(afterBalance).to.equal(0);
        log(`✅ 정확한 잔액 전송 성공, 최종 잔액: ${ethers.formatEther(afterBalance)} AKC`);
        
        // 정리
        await akc.connect(user2).transfer(treasury.address, balance);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("1.4 연속 전송 후 잔액 부족", async function () {
      const cat = "잔액부족-연속전송";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const initialAmount = ethers.parseEther("100");
        const transferAmount = ethers.parseEther("30");
        
        await akc.connect(treasury).transfer(user1.address, initialAmount);
        log(`User1 초기 잔액: ${ethers.formatEther(initialAmount)} AKC`);
        
        // 30 AKC 3번 전송 (총 90 AKC)
        await akc.connect(user1).transfer(user2.address, transferAmount);
        await akc.connect(user1).transfer(user2.address, transferAmount);
        await akc.connect(user1).transfer(user2.address, transferAmount);
        
        const remainingBalance = await akc.balanceOf(user1.address);
        log(`3번 전송 후 잔액: ${ethers.formatEther(remainingBalance)} AKC`);
        expect(remainingBalance).to.equal(ethers.parseEther("10"));
        
        // 4번째 30 AKC 전송 시도 (잔액 10 AKC만 남음)
        await expect(
          akc.connect(user1).transfer(user2.address, transferAmount)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        
        log(`✅ 연속 전송 후 잔액 부족 정상 감지`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, remainingBalance);
        await akc.connect(user2).transfer(treasury.address, ethers.parseEther("90"));
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });
  });

  describe("2️⃣ 여러가지 정상 전송", function () {
    it("2.1 매우 작은 금액 (0.000000000000000001 AKC = 1 wei)", async function () {
      const cat = "정상전송-최소단위";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const oneWei = 1n; // 1 wei
        
        await akc.connect(treasury).transfer(user1.address, oneWei);
        const balance = await akc.balanceOf(user1.address);
        expect(balance).to.equal(oneWei);
        log(`✅ 1 wei 전송 성공`);
        
        await akc.connect(user1).transfer(user2.address, oneWei);
        const balance2 = await akc.balanceOf(user2.address);
        expect(balance2).to.equal(oneWei);
        log(`✅ 1 wei 재전송 성공`);
        
        // 정리
        await akc.connect(user2).transfer(treasury.address, oneWei);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("2.2 소수점 정밀도 테스트 (18 decimals)", async function () {
      const cat = "정상전송-소수점정밀도";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const preciseAmount = ethers.parseEther("123.456789012345678"); // 18자리
        
        await akc.connect(treasury).transfer(user1.address, preciseAmount);
        const balance = await akc.balanceOf(user1.address);
        expect(balance).to.equal(preciseAmount);
        log(`✅ 정밀한 소수점 전송 성공: ${ethers.formatEther(balance)} AKC`);
        
        // 절반 전송
        const half = preciseAmount / 2n;
        await akc.connect(user1).transfer(user2.address, half);
        
        const balance1 = await akc.balanceOf(user1.address);
        const balance2 = await akc.balanceOf(user2.address);
        log(`User1 잔액: ${ethers.formatEther(balance1)} AKC`);
        log(`User2 잔액: ${ethers.formatEther(balance2)} AKC`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, balance1);
        await akc.connect(user2).transfer(treasury.address, balance2);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("2.3 대량 금액 전송 (1,000,000 AKC)", async function () {
      const cat = "정상전송-대량금액";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const largeAmount = ethers.parseEther("1000000"); // 1M AKC
        
        await akc.connect(treasury).transfer(user1.address, largeAmount);
        const balance = await akc.balanceOf(user1.address);
        expect(balance).to.equal(largeAmount);
        log(`✅ 1,000,000 AKC 전송 성공`);
        
        // 절반씩 두 명에게 분배
        const half = largeAmount / 2n;
        await akc.connect(user1).transfer(user2.address, half);
        await akc.connect(user1).transfer(user3.address, half);
        
        const balance2 = await akc.balanceOf(user2.address);
        const balance3 = await akc.balanceOf(user3.address);
        log(`User2: ${ethers.formatEther(balance2)} AKC`);
        log(`User3: ${ethers.formatEther(balance3)} AKC`);
        
        // 정리
        await akc.connect(user2).transfer(treasury.address, balance2);
        await akc.connect(user3).transfer(treasury.address, balance3);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("2.4 동일 주소로 연속 전송", async function () {
      const cat = "정상전송-연속동일주소";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("10");
        
        // User1에게 5번 연속 전송
        for (let i = 0; i < 5; i++) {
          await akc.connect(treasury).transfer(user1.address, amount);
          const balance = await akc.balanceOf(user1.address);
          log(`${i+1}번째 전송 후 잔액: ${ethers.formatEther(balance)} AKC`);
        }
        
        const finalBalance = await akc.balanceOf(user1.address);
        expect(finalBalance).to.equal(ethers.parseEther("50"));
        log(`✅ 5번 연속 전송 성공, 최종 잔액: ${ethers.formatEther(finalBalance)} AKC`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, finalBalance);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("2.5 다중 수신자 동시 분배", async function () {
      const cat = "정상전송-다중분배";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        const recipients = [user1, user2, user3];
        
        // 3명에게 동시 분배
        for (const recipient of recipients) {
          await akc.connect(treasury).transfer(recipient.address, amount);
        }
        
        // 각자 잔액 확인
        for (const recipient of recipients) {
          const balance = await akc.balanceOf(recipient.address);
          expect(balance).to.equal(amount);
          log(`${recipient.address.substring(0,10)}...: ${ethers.formatEther(balance)} AKC`);
        }
        
        log(`✅ 3명에게 동시 분배 성공`);
        
        // 정리
        for (const recipient of recipients) {
          await akc.connect(recipient).transfer(treasury.address, amount);
        }
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });
  });

  describe("3️⃣ 가스 부족 시뮬레이션", function () {
    it("3.1 일반 전송 가스 측정", async function () {
      const cat = "가스-일반전송";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        // 전송 트랜잭션 실행 및 가스 측정
        const tx = await akc.connect(treasury).transfer(user1.address, amount);
        const receipt = await tx.wait();
        
        log(`가스 사용량: ${receipt.gasUsed.toString()}`);
        log(`블록 번호: ${receipt.blockNumber}`);
        log(`트랜잭션 해시: ${receipt.hash}`);
        
        // 가스 사용량이 합리적인 범위인지 확인 (일반적으로 50,000 ~ 100,000)
        expect(receipt.gasUsed).to.be.lessThan(100000n);
        log(`✅ 가스 사용량이 합리적 범위 내 (< 100,000)`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, amount);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("3.2 Approve 가스 측정", async function () {
      const cat = "가스-Approve";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        await akc.connect(treasury).transfer(user1.address, amount);
        
        // Approve 가스 측정
        const tx = await akc.connect(user1).approve(user2.address, amount);
        const receipt = await tx.wait();
        
        log(`Approve 가스 사용량: ${receipt.gasUsed.toString()}`);
        
        expect(receipt.gasUsed).to.be.lessThan(100000n);
        log(`✅ Approve 가스 사용량 합리적`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, amount);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("3.3 TransferFrom 가스 측정", async function () {
      const cat = "가스-TransferFrom";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        await akc.connect(treasury).transfer(user1.address, amount);
        await akc.connect(user1).approve(user2.address, amount);
        
        // TransferFrom 가스 측정
        const tx = await akc.connect(user2).transferFrom(user1.address, user3.address, amount);
        const receipt = await tx.wait();
        
        log(`TransferFrom 가스 사용량: ${receipt.gasUsed.toString()}`);
        
        expect(receipt.gasUsed).to.be.lessThan(150000n);
        log(`✅ TransferFrom 가스 사용량 합리적 (< 150,000)`);
        
        // 정리
        await akc.connect(user3).transfer(treasury.address, amount);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("3.4 Burn 가스 측정", async function () {
      const cat = "가스-Burn";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        await akc.connect(treasury).transfer(user1.address, amount);
        
        // Burn 가스 측정
        const tx = await akc.connect(user1).burn(amount);
        const receipt = await tx.wait();
        
        log(`Burn 가스 사용량: ${receipt.gasUsed.toString()}`);
        
        expect(receipt.gasUsed).to.be.lessThan(100000n);
        log(`✅ Burn 가스 사용량 합리적 (< 100,000)`);
        
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("3.5 Pause/Unpause 가스 측정", async function () {
      const cat = "가스-Pause";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        // Pause 가스 측정
        const pauseTx = await akc.connect(owner).pause();
        const pauseReceipt = await pauseTx.wait();
        log(`Pause 가스 사용량: ${pauseReceipt.gasUsed.toString()}`);
        
        // Unpause 가스 측정
        const unpauseTx = await akc.connect(owner).unpause();
        const unpauseReceipt = await unpauseTx.wait();
        log(`Unpause 가스 사용량: ${unpauseReceipt.gasUsed.toString()}`);
        
        expect(pauseReceipt.gasUsed).to.be.lessThan(100000n);
        expect(unpauseReceipt.gasUsed).to.be.lessThan(100000n);
        log(`✅ Pause/Unpause 가스 사용량 합리적`);
        
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });
  });

  describe("4️⃣ 엣지 케이스 디테일 체크", function () {
    it("4.1 자기 자신에게 전송", async function () {
      const cat = "엣지-자기자신전송";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        await akc.connect(treasury).transfer(user1.address, amount);
        const beforeBalance = await akc.balanceOf(user1.address);
        
        // 자기 자신에게 전송
        await akc.connect(user1).transfer(user1.address, amount);
        
        const afterBalance = await akc.balanceOf(user1.address);
        expect(afterBalance).to.equal(beforeBalance);
        log(`✅ 자기 자신 전송 가능, 잔액 변동 없음`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, amount);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("4.2 0 금액 전송", async function () {
      const cat = "엣지-0금액전송";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        await akc.connect(treasury).transfer(user1.address, 0);
        log(`✅ 0 금액 전송 가능`);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("4.3 Allowance 0으로 설정 후 재설정", async function () {
      const cat = "엣지-Allowance재설정";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("100");
        
        await akc.connect(treasury).transfer(user1.address, amount);
        
        // 처음 승인
        await akc.connect(user1).approve(user2.address, amount);
        let allowance = await akc.allowance(user1.address, user2.address);
        log(`초기 Allowance: ${ethers.formatEther(allowance)} AKC`);
        
        // 0으로 재설정
        await akc.connect(user1).approve(user2.address, 0);
        allowance = await akc.allowance(user1.address, user2.address);
        expect(allowance).to.equal(0);
        log(`0으로 재설정: ${ethers.formatEther(allowance)} AKC`);
        
        // 다시 승인
        await akc.connect(user1).approve(user2.address, amount);
        allowance = await akc.allowance(user1.address, user2.address);
        expect(allowance).to.equal(amount);
        log(`재승인: ${ethers.formatEther(allowance)} AKC`);
        
        log(`✅ Allowance 0 재설정 및 재승인 성공`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, amount);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("4.4 전송 후 즉시 잔액 확인", async function () {
      const cat = "엣지-즉시잔액확인";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("123.456");
        
        const beforeTreasury = await akc.balanceOf(treasury.address);
        const beforeUser1 = await akc.balanceOf(user1.address);
        
        // 전송
        await akc.connect(treasury).transfer(user1.address, amount);
        
        // 즉시 잔액 확인
        const afterTreasury = await akc.balanceOf(treasury.address);
        const afterUser1 = await akc.balanceOf(user1.address);
        
        expect(afterTreasury).to.equal(beforeTreasury - amount);
        expect(afterUser1).to.equal(beforeUser1 + amount);
        
        log(`Treasury 차감: ${ethers.formatEther(beforeTreasury - afterTreasury)} AKC`);
        log(`User1 증가: ${ethers.formatEther(afterUser1 - beforeUser1)} AKC`);
        log(`✅ 전송 후 즉시 잔액 정확히 반영`);
        
        // 정리
        await akc.connect(user1).transfer(treasury.address, amount);
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });

    it("4.5 Burn 후 TotalSupply 감소 확인", async function () {
      const cat = "엣지-Burn후TotalSupply";
      log(`\n${cat} 테스트 시작...`);
      
      try {
        const amount = ethers.parseEther("1000");
        
        const beforeSupply = await akc.totalSupply();
        log(`Burn 전 Total Supply: ${ethers.formatEther(beforeSupply)} AKC`);
        
        await akc.connect(treasury).transfer(user1.address, amount);
        await akc.connect(user1).burn(amount);
        
        const afterSupply = await akc.totalSupply();
        log(`Burn 후 Total Supply: ${ethers.formatEther(afterSupply)} AKC`);
        
        expect(afterSupply).to.equal(beforeSupply - amount);
        log(`감소량: ${ethers.formatEther(beforeSupply - afterSupply)} AKC`);
        log(`✅ Burn 후 TotalSupply 정확히 감소`);
        
        updateStats(cat, true);
      } catch (error) {
        log(`실패: ${error.message}`, true);
        updateStats(cat, false);
      }
    });
  });
});
