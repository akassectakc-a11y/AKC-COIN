const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AKC Token", function () {
  let akc;
  let owner;
  let treasury;
  let addr1;
  let addr2;
  
  const TOTAL_SUPPLY = ethers.parseEther("300000000"); // 300 million

  beforeEach(async function () {
    [owner, treasury, addr1, addr2] = await ethers.getSigners();
    
    const AKC = await ethers.getContractFactory("AKC");
    akc = await AKC.deploy(treasury.address);
    await akc.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct token name and symbol", async function () {
      expect(await akc.name()).to.equal("AKASSECT");
      expect(await akc.symbol()).to.equal("AKC");
    });

    it("Should have 18 decimals", async function () {
      expect(await akc.decimals()).to.equal(18);
    });

    it("Should mint total supply to treasury", async function () {
      const treasuryBalance = await akc.balanceOf(treasury.address);
      expect(treasuryBalance).to.equal(TOTAL_SUPPLY);
    });

    it("Should have correct total supply", async function () {
      expect(await akc.totalSupply()).to.equal(TOTAL_SUPPLY);
    });

    it("Should set the right owner", async function () {
      expect(await akc.owner()).to.equal(owner.address);
    });

    it("Should reject zero address as treasury", async function () {
      const AKC = await ethers.getContractFactory("AKC");
      await expect(
        AKC.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("AKC: treasury is zero address");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("1000");
      await akc.connect(treasury).transfer(addr1.address, amount);
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const amount = ethers.parseEther("1");
      await expect(
        akc.connect(addr1).transfer(treasury.address, amount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        akc.connect(treasury).transfer(addr1.address, amount)
      ).to.emit(akc, "Transfer")
       .withArgs(treasury.address, addr1.address, amount);
    });

    it("Should update balances after transfer", async function () {
      const amount = ethers.parseEther("1000");
      const initialTreasuryBalance = await akc.balanceOf(treasury.address);
      
      await akc.connect(treasury).transfer(addr1.address, amount);
      
      expect(await akc.balanceOf(treasury.address)).to.equal(initialTreasuryBalance - amount);
      expect(await akc.balanceOf(addr1.address)).to.equal(amount);
    });
  });

  describe("Burning", function () {
    it("Should burn tokens and reduce total supply", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialSupply = await akc.totalSupply();
      
      await akc.connect(treasury).burn(burnAmount);
      
      expect(await akc.totalSupply()).to.equal(initialSupply - burnAmount);
      expect(await akc.balanceOf(treasury.address)).to.equal(TOTAL_SUPPLY - burnAmount);
    });

    it("Should emit Transfer event to zero address on burn", async function () {
      const burnAmount = ethers.parseEther("1000");
      await expect(
        akc.connect(treasury).burn(burnAmount)
      ).to.emit(akc, "Transfer")
       .withArgs(treasury.address, ethers.ZeroAddress, burnAmount);
    });

    it("Should fail to burn more than balance", async function () {
      await expect(
        akc.connect(addr1).burn(ethers.parseEther("1"))
      ).to.be.reverted;
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause token transfers", async function () {
      await akc.pause();
      expect(await akc.paused()).to.be.true;

      await akc.unpause();
      expect(await akc.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      await akc.pause();
      
      await expect(
        akc.connect(treasury).transfer(addr1.address, ethers.parseEther("1000"))
      ).to.be.revertedWith("AKC: token transfer while paused");
    });

    it("Should emit TokensPaused event", async function () {
      const tx = await akc.pause();
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(akc, "TokensPaused")
        .withArgs(owner.address, block.timestamp);
    });

    it("Should emit TokensUnpaused event", async function () {
      await akc.pause();
      const tx = await akc.unpause();
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(akc, "TokensUnpaused")
        .withArgs(owner.address, block.timestamp);
    });

    it("Should only allow owner to pause", async function () {
      await expect(
        akc.connect(addr1).pause()
      ).to.be.reverted;
    });

    it("Should only allow owner to unpause", async function () {
      await akc.pause();
      await expect(
        akc.connect(addr1).unpause()
      ).to.be.reverted;
    });

    it("Should allow transfers after unpause", async function () {
      await akc.pause();
      await akc.unpause();
      
      const amount = ethers.parseEther("1000");
      await expect(
        akc.connect(treasury).transfer(addr1.address, amount)
      ).to.not.be.reverted;
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await akc.transferOwnership(addr1.address);
      expect(await akc.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(
        akc.connect(addr1).transferOwnership(addr2.address)
      ).to.be.reverted;
    });

    it("Should allow new owner to pause", async function () {
      await akc.transferOwnership(addr1.address);
      await expect(
        akc.connect(addr1).pause()
      ).to.not.be.reverted;
    });
  });
});
