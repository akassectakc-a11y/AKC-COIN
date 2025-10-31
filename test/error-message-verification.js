const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🔍 에러 메시지 검증 테스트", function () {
  let akc, owner, treasury, user1;

  before(async function () {
    [owner, treasury, user1] = await ethers.getSigners();
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
  });

  describe("1. Pause 에러 메시지 확인", function () {
    it("실제 에러 메시지 출력", async function () {
      await akc.connect(owner).pause();
      
      try {
        await akc.connect(treasury).transfer(user1.address, ethers.parseEther("1"));
        console.log("❌ 에러가 발생하지 않음!");
      } catch (error) {
        console.log("\n✅ 실제 에러 메시지:");
        console.log("   Message:", error.message);
        console.log("   Reason:", error.reason);
        
        // 에러 메시지 패턴 확인
        if (error.message.includes("Pausable: paused")) {
          console.log("   → 'Pausable: paused' 포함됨");
        }
        if (error.message.includes("AKC: token transfer while paused")) {
          console.log("   → 'AKC: token transfer while paused' 포함됨");
        }
      }
      
      await akc.connect(owner).unpause();
    });

    it("expect().to.be.reverted (메시지 없음) 테스트", async function () {
      await akc.connect(owner).pause();
      
      await expect(
        akc.connect(treasury).transfer(user1.address, ethers.parseEther("1"))
      ).to.be.reverted;
      
      console.log("✅ to.be.reverted (메시지 체크 없음) 성공");
      
      await akc.connect(owner).unpause();
    });

    it("expect().to.be.revertedWith('Pausable: paused') 테스트", async function () {
      await akc.connect(owner).pause();
      
      try {
        await expect(
          akc.connect(treasury).transfer(user1.address, ethers.parseEther("1"))
        ).to.be.revertedWith("Pausable: paused");
        console.log("✅ 'Pausable: paused' 매칭 성공");
      } catch (error) {
        console.log("❌ 'Pausable: paused' 매칭 실패");
        console.log("   에러:", error.message);
      }
      
      await akc.connect(owner).unpause();
    });

    it("expect().to.be.revertedWith('AKC: token transfer while paused') 테스트", async function () {
      await akc.connect(owner).pause();
      
      try {
        await expect(
          akc.connect(treasury).transfer(user1.address, ethers.parseEther("1"))
        ).to.be.revertedWith("AKC: token transfer while paused");
        console.log("✅ 'AKC: token transfer while paused' 매칭 성공");
      } catch (error) {
        console.log("❌ 'AKC: token transfer while paused' 매칭 실패");
        console.log("   에러:", error.message);
      }
      
      await akc.connect(owner).unpause();
    });
  });

  describe("2. TransferFrom 잔액 부족 확인", function () {
    it("잔액 없는 계정에서 transferFrom 시도", async function () {
      const amount = ethers.parseEther("1");
      
      // user1은 잔액 0
      const balance = await akc.balanceOf(user1.address);
      console.log("\n✅ user1 잔액:", ethers.formatEther(balance), "AKC");
      
      // approve는 성공
      await akc.connect(user1).approve(treasury.address, amount);
      console.log("✅ approve 성공 (잔액 없어도 가능)");
      
      // transferFrom 시도
      try {
        await akc.connect(treasury).transferFrom(user1.address, owner.address, amount);
        console.log("❌ transferFrom이 성공함 (이상함!)");
      } catch (error) {
        console.log("✅ transferFrom 실패 (정상)");
        console.log("   에러:", error.message.substring(0, 100));
        
        if (error.message.includes("insufficient")) {
          console.log("   → 'insufficient' 포함됨 (잔액 부족 에러)");
        }
      }
    });

    it("잔액 있는 계정에서 transferFrom 성공", async function () {
      const amount = ethers.parseEther("10");
      
      // treasury에서 user1에게 전송
      await akc.connect(treasury).transfer(user1.address, amount);
      console.log("\n✅ user1에게 10 AKC 전송 완료");
      
      const balance = await akc.balanceOf(user1.address);
      console.log("✅ user1 잔액:", ethers.formatEther(balance), "AKC");
      
      // approve
      await akc.connect(user1).approve(treasury.address, amount);
      console.log("✅ approve 완료");
      
      // transferFrom 시도
      await akc.connect(treasury).transferFrom(user1.address, owner.address, amount);
      console.log("✅ transferFrom 성공!");
      
      const newBalance = await akc.balanceOf(user1.address);
      console.log("✅ user1 최종 잔액:", ethers.formatEther(newBalance), "AKC");
    });
  });

  describe("3. Treasury 잔액 대량 전송 테스트", function () {
    it("대량 전송 시뮬레이션 (100회)", async function () {
      const initialBalance = await akc.balanceOf(treasury.address);
      console.log("\n✅ Treasury 초기 잔액:", ethers.formatEther(initialBalance), "AKC");
      
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < 100; i++) {
        try {
          const amount = ethers.parseEther("1000000"); // 1M AKC
          await akc.connect(treasury).transfer(user1.address, amount);
          successCount++;
          
          // 다시 돌려받기
          await akc.connect(user1).transfer(treasury.address, amount);
        } catch (error) {
          failCount++;
          if (failCount === 1) {
            console.log(`\n⚠️  ${i+1}번째에서 첫 실패 발생`);
            console.log("   에러:", error.message.substring(0, 80));
          }
          break;
        }
      }
      
      console.log(`\n📊 결과: 성공 ${successCount}회, 실패 ${failCount}회`);
      
      const finalBalance = await akc.balanceOf(treasury.address);
      console.log("✅ Treasury 최종 잔액:", ethers.formatEther(finalBalance), "AKC");
    });
  });
});
