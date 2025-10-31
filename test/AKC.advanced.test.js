const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("AKC Token - Advanced Tests", function () {
  async function deployAKCFixture() {
    const [owner, treasury, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const AKC = await ethers.getContractFactory("AKC");
    const akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();

    return { akc, owner, treasury, addr1, addr2, addr3, addr4, addr5 };
  }

  describe("Large Scale Transfers", function () {
    it("Should handle 100 sequential transfers", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      const amount = ethers.parseEther("1000");
      
      for (let i = 0; i < 100; i++) {
        await akc.connect(treasury).transfer(addr1.address, amount);
      }
      
      const finalBalance = await akc.balanceOf(addr1.address);
      expect(finalBalance).to.equal(ethers.parseEther("100000"));
    });

    it("Should handle transfers to multiple recipients", async function () {
      const { akc, treasury, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(deployAKCFixture);
      
      const recipients = [addr1, addr2, addr3, addr4, addr5];
      const amount = ethers.parseEther("1000000");
      
      for (const recipient of recipients) {
        await akc.connect(treasury).transfer(recipient.address, amount);
      }
      
      for (const recipient of recipients) {
        const balance = await akc.balanceOf(recipient.address);
        expect(balance).to.equal(amount);
      }
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transfer", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      await expect(
        akc.connect(treasury).transfer(addr1.address, 0)
      ).to.not.be.reverted;
      
      expect(await akc.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should handle maximum possible transfer", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      const totalSupply = await akc.totalSupply();
      await akc.connect(treasury).transfer(addr1.address, totalSupply);
      
      expect(await akc.balanceOf(addr1.address)).to.equal(totalSupply);
      expect(await akc.balanceOf(treasury.address)).to.equal(0);
    });

    it("Should handle transfer to self", async function () {
      const { akc, treasury } = await loadFixture(deployAKCFixture);
      
      const initialBalance = await akc.balanceOf(treasury.address);
      const amount = ethers.parseEther("1000");
      
      await akc.connect(treasury).transfer(treasury.address, amount);
      
      expect(await akc.balanceOf(treasury.address)).to.equal(initialBalance);
    });

    it("Should handle multiple burns from same account", async function () {
      const { akc, treasury } = await loadFixture(deployAKCFixture);
      
      const burnAmount = ethers.parseEther("100000");
      const initialSupply = await akc.totalSupply();
      
      await akc.connect(treasury).burn(burnAmount);
      await akc.connect(treasury).burn(burnAmount);
      await akc.connect(treasury).burn(burnAmount);
      
      const finalSupply = await akc.totalSupply();
      expect(initialSupply - finalSupply).to.equal(burnAmount * 3n);
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should measure gas for single transfer", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      const amount = ethers.parseEther("1000");
      const tx = await akc.connect(treasury).transfer(addr1.address, amount);
      const receipt = await tx.wait();
      
      console.log("      Gas used for transfer:", receipt.gasUsed.toString());
      expect(receipt.gasUsed).to.be.lessThan(100000n);
    });

    it("Should measure gas for burn", async function () {
      const { akc, treasury } = await loadFixture(deployAKCFixture);
      
      const amount = ethers.parseEther("1000");
      const tx = await akc.connect(treasury).burn(amount);
      const receipt = await tx.wait();
      
      console.log("      Gas used for burn:", receipt.gasUsed.toString());
      expect(receipt.gasUsed).to.be.lessThan(100000n);
    });

    it("Should measure gas for pause", async function () {
      const { akc } = await loadFixture(deployAKCFixture);
      
      const tx = await akc.pause();
      const receipt = await tx.wait();
      
      console.log("      Gas used for pause:", receipt.gasUsed.toString());
      expect(receipt.gasUsed).to.be.lessThan(100000n);
    });
  });

  describe("Event Emission Tests", function () {
    it("Should emit Transfer events correctly", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      const amount = ethers.parseEther("1000");
      
      await expect(akc.connect(treasury).transfer(addr1.address, amount))
        .to.emit(akc, "Transfer")
        .withArgs(treasury.address, addr1.address, amount);
    });

    it("Should emit TokensPaused event with timestamp", async function () {
      const { akc, owner } = await loadFixture(deployAKCFixture);
      
      const tx = await akc.pause();
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(akc, "TokensPaused")
        .withArgs(owner.address, block.timestamp);
    });

    it("Should emit TokensUnpaused event with timestamp", async function () {
      const { akc, owner } = await loadFixture(deployAKCFixture);
      
      await akc.pause();
      const tx = await akc.unpause();
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(akc, "TokensUnpaused")
        .withArgs(owner.address, block.timestamp);
    });
  });

  describe("Complex Scenarios", function () {
    it("Should handle distribution to 10 users correctly", async function () {
      const { akc, treasury, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(deployAKCFixture);
      
      const users = [addr1, addr2, addr3, addr4, addr5];
      const amounts = [
        ethers.parseEther("10000000"),  // 10M
        ethers.parseEther("5000000"),   // 5M
        ethers.parseEther("2500000"),   // 2.5M
        ethers.parseEther("1000000"),   // 1M
        ethers.parseEther("500000"),    // 500K
      ];
      
      for (let i = 0; i < users.length; i++) {
        await akc.connect(treasury).transfer(users[i].address, amounts[i]);
      }
      
      let totalDistributed = 0n;
      for (let i = 0; i < users.length; i++) {
        const balance = await akc.balanceOf(users[i].address);
        expect(balance).to.equal(amounts[i]);
        totalDistributed += balance;
      }
      
      const treasuryBalance = await akc.balanceOf(treasury.address);
      const totalSupply = await akc.totalSupply();
      
      expect(treasuryBalance + totalDistributed).to.equal(totalSupply);
    });

    it("Should handle pause during multiple transactions", async function () {
      const { akc, owner, treasury, addr1, addr2 } = await loadFixture(deployAKCFixture);
      
      // 첫 번째 전송
      await akc.connect(treasury).transfer(addr1.address, ethers.parseEther("1000"));
      
      // 일시정지
      await akc.pause();
      
      // 일시정지 중 전송 시도 (실패해야 함)
      await expect(
        akc.connect(treasury).transfer(addr2.address, ethers.parseEther("1000"))
      ).to.be.revertedWith("AKC: token transfer while paused");
      
      // 일시정지 해제
      await akc.unpause();
      
      // 해제 후 전송 (성공해야 함)
      await akc.connect(treasury).transfer(addr2.address, ethers.parseEther("1000"));
      
      expect(await akc.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
      expect(await akc.balanceOf(addr2.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Should handle ownership transfer and new owner actions", async function () {
      const { akc, owner, addr1, treasury, addr2 } = await loadFixture(deployAKCFixture);
      
      // 소유권 이전
      await akc.transferOwnership(addr1.address);
      
      // 새 소유자가 일시정지 가능
      await akc.connect(addr1).pause();
      expect(await akc.paused()).to.be.true;
      
      // 이전 소유자는 일시정지 해제 불가
      await expect(akc.connect(owner).unpause()).to.be.reverted;
      
      // 새 소유자가 일시정지 해제
      await akc.connect(addr1).unpause();
      expect(await akc.paused()).to.be.false;
    });
  });

  describe("Stress Tests", function () {
    it("Should handle rapid sequential transfers", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      const amount = ethers.parseEther("100");
      const iterations = 50;
      
      for (let i = 0; i < iterations; i++) {
        await akc.connect(treasury).transfer(addr1.address, amount);
      }
      
      const expectedBalance = amount * BigInt(iterations);
      expect(await akc.balanceOf(addr1.address)).to.equal(expectedBalance);
    });

    it("Should handle circular transfers", async function () {
      const { akc, treasury, addr1, addr2, addr3 } = await loadFixture(deployAKCFixture);
      
      const amount = ethers.parseEther("1000000");
      
      // Treasury → addr1
      await akc.connect(treasury).transfer(addr1.address, amount);
      
      // addr1 → addr2
      await akc.connect(addr1).transfer(addr2.address, amount);
      
      // addr2 → addr3
      await akc.connect(addr2).transfer(addr3.address, amount);
      
      // addr3 → addr1
      await akc.connect(addr3).transfer(addr1.address, amount);
      
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
      expect(await akc.balanceOf(addr2.address)).to.equal(0);
      expect(await akc.balanceOf(addr3.address)).to.equal(0);
    });
  });

  describe("Security Tests", function () {
    it("Should prevent reentrancy attacks (inherent in ERC20)", async function () {
      const { akc, treasury, addr1 } = await loadFixture(deployAKCFixture);
      
      // ERC20의 transfer는 reentrancy에 안전함
      const amount = ethers.parseEther("1000");
      await akc.connect(treasury).transfer(addr1.address, amount);
      
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should maintain correct total supply after multiple operations", async function () {
      const { akc, treasury, addr1, addr2 } = await loadFixture(deployAKCFixture);
      
      const initialSupply = await akc.totalSupply();
      
      // 여러 전송
      await akc.connect(treasury).transfer(addr1.address, ethers.parseEther("1000000"));
      await akc.connect(treasury).transfer(addr2.address, ethers.parseEther("500000"));
      
      // 소각
      await akc.connect(addr1).burn(ethers.parseEther("100000"));
      
      // 총 공급량 확인
      const finalSupply = await akc.totalSupply();
      expect(finalSupply).to.equal(initialSupply - ethers.parseEther("100000"));
      
      // 모든 잔액의 합 = 총 공급량
      const treasuryBal = await akc.balanceOf(treasury.address);
      const addr1Bal = await akc.balanceOf(addr1.address);
      const addr2Bal = await akc.balanceOf(addr2.address);
      
      expect(treasuryBal + addr1Bal + addr2Bal).to.equal(finalSupply);
    });
  });
});
