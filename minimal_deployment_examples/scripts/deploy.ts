import { ethers } from 'hardhat';

async function main() {

  const MasterCopy = await ethers.getContractFactory('ERC20');
  const masterCopy = await MasterCopy.deploy('MasterCopy', 'MAS');
  await masterCopy.deployed();

  console.info(`Deployed MasterCopy to ${masterCopy.address}`);

  const CloneFactory = await ethers.getContractFactory('Factory');
  const cloneFactory = await CloneFactory.deploy(masterCopy.address);
  await cloneFactory.deployed();

  console.info(`Deployed CloneFactory to ${cloneFactory.address}`);

  const currentImplementation = await cloneFactory.getImplementation();
  console.info(`Current implementation = ${currentImplementation}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
