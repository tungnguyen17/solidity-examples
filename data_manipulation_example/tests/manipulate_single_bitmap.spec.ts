import hre from 'hardhat';
import { expect } from 'chai';
import {
  NumericBitmap,
  NumericBitmap__factory
} from '../types';
import { ethers } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('check_multiple_signatures_test', function() {

  let NumericBitmap: NumericBitmap__factory;
  let numericBitmapAddress: string;

  this.beforeAll(async function() {
    NumericBitmap = await hre.ethers.getContractFactory('NumericBitmap');
    const numericBitmap: NumericBitmap = await NumericBitmap.deploy();
    await numericBitmap.deployed();
    numericBitmapAddress = numericBitmap.address;
  })

  it('check_only_indexes__1', async function() {
    const numericBitmap: NumericBitmap = await NumericBitmap.deploy();
    await numericBitmap.deployed();

    await check_indexes(
      numericBitmap,
      [0, 2, 4],
      21,
    );
  })

  it('check_only_indexes__2', async function() {
    const numericBitmap: NumericBitmap = await NumericBitmap.deploy();
    await numericBitmap.deployed();

    await check_indexes(
      numericBitmap,
      [1, 6, 3, 7],
      202,
    );
  })
})

async function check_indexes(
  numericBitmap: NumericBitmap,
  indexes: number[],
  expectedValue: number,
) {
  for(var index of indexes) {
    await numericBitmap.writeSingleBitmap(
      index,
      true,
    );
  }
  for(var index of indexes) {
    const state = await numericBitmap.readSingleBitmap(
      index,
    );
    expect(state).is.true;
  }
  const rawBitmapValue = await numericBitmap.singleBitmapValue();
  expect(rawBitmapValue).is.equal(expectedValue);
}
