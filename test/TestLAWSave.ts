import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Save Contracts", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySaveContractInstance() {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token")
    const token = await Token.deploy()

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(token.target);

    return { token, saveERC20, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should reverth with a message when amount to deposit is 0", async function () {
      const { token, saveERC20 } = await loadFixture(deploySaveContractInstance);
      const depositTx = saveERC20.deposit(0);
      await expect(depositTx).to.be.rejectedWith("can't save zero value")
    });

    it("Should successfully deposit token", async function () {
      const { token, saveERC20 } = await loadFixture(deploySaveContractInstance);
      await token.approve(saveERC20.target, 200)
      const depositTx = await saveERC20.deposit(100)
      const balance = await saveERC20.checkContractBalance()
      expect(balance).to.equal(100);
    });

    // it("Should withdraw and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.target)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  

});
