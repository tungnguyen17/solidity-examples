import hre from 'hardhat';
import { expect } from 'chai';
import {
  ERC20,
  ERC20__factory,
  Factory,
  Factory__factory
} from '../types';

describe('minimal_deployment_test', function() {

  let MasterCopy: ERC20__factory;
  let masterCopyAddress: string;
  let CloneFactory: Factory__factory;
  let cloneFactoryAddress: string;

  this.beforeAll(async function() {
    MasterCopy = await hre.ethers.getContractFactory('ERC20');
    const masterCopy: ERC20 = await MasterCopy.deploy('Master Copy', 'MASTER');
    await masterCopy.deployed();
    masterCopyAddress = masterCopy.address;

    CloneFactory = await hre.ethers.getContractFactory('Factory');
    const cloneFactory: Factory = await CloneFactory.deploy(masterCopyAddress);
    await cloneFactory.deployed();
    cloneFactoryAddress = cloneFactory.address;
  })

  it('check master copy name and symbol', async function() {
    const masterCopy: ERC20 = MasterCopy.attach(masterCopyAddress);
    const tokenName = await masterCopy.name();

    expect(tokenName).equal('Master Copy');
  })

  it('check clone copy name and symbol', async function() {
    const cloneFactory: Factory = CloneFactory.attach(cloneFactoryAddress);

    const deployTx = await cloneFactory.deploy('Custom Token', 'CUSTOM');
    const deployTxR = await deployTx.wait();

    const customTokenAddress = deployTxR.logs[1].topics[1].replace('0x000000000000000000000000', '0x');
    const customToken: ERC20 = MasterCopy.attach(customTokenAddress);

    const tokenName = await customToken.name();

    expect(tokenName).equal('Custom Token');
  })
})
