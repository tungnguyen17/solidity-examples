import { ethers } from 'hardhat';

async function main() {

  const MasterCopy = await ethers.getContractFactory('MessageValidator');
  const masterCopy = await MasterCopy.deploy();
  await masterCopy.deployed();

  console.info(`Deployed MessageValidator to ${masterCopy.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
