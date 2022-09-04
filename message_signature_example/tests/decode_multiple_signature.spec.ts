import hre from 'hardhat';
import { expect } from 'chai';
import {
  MessageValidator,
  MessageValidator__factory
} from '../types';
import { ethers } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('check_multiple_signatures_test', function() {

  let MessageValidator: MessageValidator__factory;
  let messageValidatorAddress: string;

  this.beforeAll(async function() {
    MessageValidator = await hre.ethers.getContractFactory('MessageValidator');
    const messageValidator: MessageValidator = await MessageValidator.deploy();
    await messageValidator.deployed();
    messageValidatorAddress = messageValidator.address;
  })

  it('precomputed_hash_1', async function() {
    const [signer] = await hre.ethers.getSigners();
    const messageValidator = MessageValidator.attach(messageValidatorAddress);
    await precomputedHash(
      messageValidator,
      ["uint256"],
      ["256"],
      [signer],
    )
  })

  it('precomputed_hash_2', async function() {
    const [signer1, signer2] = await hre.ethers.getSigners();
    const messageValidator = MessageValidator.attach(messageValidatorAddress);
    await precomputedHash(
      messageValidator,
      ["uint256", "address"],
      ["128", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"],
      [signer1, signer2],
    )
  })

  it('precomputed_hash_3', async function() {
    const [signer1, signer2, signer3] = await hre.ethers.getSigners();
    const messageValidator = MessageValidator.attach(messageValidatorAddress);
    await precomputedHash(
      messageValidator,
      ["uint256", "address"],
      ["128", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"],
      [signer1, signer2, signer3],
    )
  })
})

async function precomputedHash(
  messageValidator: MessageValidator,
  types: string[],
  params: any[],
  signers: SignerWithAddress[],
) {

  const hash = ethers.utils.solidityKeccak256(
    types,
    params,
  );
  const hashBytes = ethers.utils.arrayify(hash);
  const signatures = await Promise.all(signers.map(async signer => {
    const signature = await signer.signMessage(hashBytes);
    return signature.substring(2);
  }));
  const finalSignature = ethers.utils.arrayify('0x' + signatures.join(''));

  const addresses = signers.map(x => x.address);
  const count = await messageValidator.connect(signers[0])
    .checkSignatures(
      hashBytes,
      finalSignature,
      addresses,
    );
  expect(count).equals(signers.length);
}
