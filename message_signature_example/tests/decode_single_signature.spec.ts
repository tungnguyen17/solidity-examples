import hre from 'hardhat';
import { expect } from 'chai';
import {
  MessageValidator,
  MessageValidator__factory
} from '../types';
import { ethers } from 'ethers'

describe('message_signature_test', function() {

  let MessageValidator: MessageValidator__factory;
  let messageValidatorAddress: string;

  this.beforeAll(async function() {
    MessageValidator = await hre.ethers.getContractFactory('MessageValidator');
    const messageValidator: MessageValidator = await MessageValidator.deploy();
    await messageValidator.deployed();
    messageValidatorAddress = messageValidator.address;
  })

  it('wrong_signer', async function() {

    const [signer1, signer2] = await hre.ethers.getSigners();

    const param1: number = 256;

    const hash = ethers.utils.solidityKeccak256(
      ["uint256"],
      [param1],
    );
    const hashBytes = ethers.utils.arrayify(hash);
    const signature = await signer1.signMessage(hashBytes);

    const messageValidator = MessageValidator.attach(messageValidatorAddress);
    const isSuccess = await messageValidator.connect(signer2)
      .checkSignature(
        hashBytes,
        signature,
      );
    expect(isSuccess).is.false;
  })

  it('precomputed_hash_1', async function() {
    const messageValidator = MessageValidator.attach(messageValidatorAddress);
    await precomputedHash(
      messageValidator,
      ["uint256"],
      ["256"],
    )
  })

  it('precomputed_hash_2', async function() {
    const messageValidator = MessageValidator.attach(messageValidatorAddress);
    await precomputedHash(
      messageValidator,
      ["uint256", "address"],
      ["128", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"],
    )
  })
})

async function precomputedHash(
  messageValidator: MessageValidator,
  types: string[],
  params: any[],
) {
  const [signer] = await hre.ethers.getSigners();

  const hash = ethers.utils.solidityKeccak256(
    types,
    params,
  );
  const hashBytes = ethers.utils.arrayify(hash);
  const signature = await signer.signMessage(hashBytes);

  const isSuccess = await messageValidator.connect(signer)
    .checkSignature(
      hashBytes,
      signature,
    );
  expect(isSuccess).is.true;
}
