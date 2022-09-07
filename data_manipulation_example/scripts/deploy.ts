import { ethers } from 'hardhat';

async function main() {

  const NumericBitmap = await ethers.getContractFactory('NumericBitmap');
  const numericBitmap = await NumericBitmap.deploy();
  await numericBitmap.deployed();

  console.info(`Deployed NumericBitmap to ${numericBitmap.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
