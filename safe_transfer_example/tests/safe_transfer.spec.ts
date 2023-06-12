import { Signer } from 'ethers';
import hhe from 'hardhat';
import { TokenHolder } from '../typechain-types';
import { expect } from 'chai';

describe('safe_transfer_test', function() {

  let owner: Signer;
  let ownerAddress: string;
  let sut: TokenHolder;

  before(async function() {
    const signers = await hhe.ethers.getSigners();
    owner = signers[0];
    ownerAddress = await signers[0].getAddress();
    const sutFactory = await hhe.ethers.getContractFactory('TokenHolder');
    sut = await sutFactory.deploy();
    await sut.deployed();
  })

  it('withdraw legacy token failed', async function () {
    const usdtTokenFactory = await hhe.ethers.getContractFactory('LegacyERC20');
    const usdtToken = await usdtTokenFactory.connect(owner).deploy('Tether USD', 'USDT', 6);
    await usdtToken.deployed();

    await usdtToken.connect(owner).mint(sut.address, '1000000000');

    await expect(sut.withdraw(usdtToken.address, ownerAddress, '500000000'))
      .to.be.reverted;
  });

  it('safe withdraw legacy token successful', async function () {
    const usdtTokenFactory = await hhe.ethers.getContractFactory('LegacyERC20');
    const usdtToken = await usdtTokenFactory.connect(owner).deploy('Tether USD', 'USDT', 6);
    await usdtToken.deployed();

    await usdtToken.connect(owner).mint(sut.address, '1000000000');

    await expect(await sut.safeWithdraw(usdtToken.address, ownerAddress, '500000000'))
      .changeTokenBalance(usdtToken, ownerAddress, '500000000');
  });

  it('withdraw standard token success', async function () {
    const usdcTokenFactory = await hhe.ethers.getContractFactory('ERC20');
    const usdcToken = await usdcTokenFactory.connect(owner).deploy('Circle USD', 'USDC', 6);
    await usdcToken.deployed();

    await usdcToken.connect(owner).mint(sut.address, '1000000000');

    await expect(await sut.withdraw(usdcToken.address, ownerAddress, '700000000'))
      .changeTokenBalance(usdcToken, ownerAddress, '700000000');
  });

  it('safe withdraw standard token success', async function () {
    const usdcTokenFactory = await hhe.ethers.getContractFactory('ERC20');
    const usdcToken = await usdcTokenFactory.connect(owner).deploy('Circle USD', 'USDC', 6);
    await usdcToken.deployed();

    await usdcToken.connect(owner).mint(sut.address, '1000000000');

    await expect(await sut.safeWithdraw(usdcToken.address, ownerAddress, '700000000'))
      .changeTokenBalance(usdcToken, ownerAddress, '700000000');
  });
});
