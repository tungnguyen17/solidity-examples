import hre from 'hardhat';
import { expect } from 'chai';
import {
  NumericBitmap,
  NumericBitmap__factory
} from '../types';

describe('manipulate_double_bitmap_test', function() {

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
      [1, 6, 3, 7],
      [[0, 202], [1, 0], [2, 0], [3, 0]],
    );
  })

  it('check_only_indexes__2', async function() {
    const numericBitmap: NumericBitmap = await NumericBitmap.deploy();
    await numericBitmap.deployed();

    await check_indexes(
      numericBitmap,
      [256, 6, 515, 3, 7, 65536],
      [[0, 200], [1, 1], [2, 8], [3, 0], [256, 1]],
    );
  })
})

async function check_indexes(
  numericBitmap: NumericBitmap,
  indexes: number[],
  expectedValues: [number, number][],
) {
  for(var index of indexes) {
    await numericBitmap.writeDoubleBitmap(
      index,
      true,
    );
  }
  for(var index of indexes) {
    const state = await numericBitmap.readDoubleBitmap(
      index,
    );
    expect(state).is.true;
  }
  for(var expectedValue of expectedValues) {
    const rawBitmapValue = await numericBitmap.doubleBitmapValue(expectedValue[0]);
    expect(rawBitmapValue).is.equal(expectedValue[1]);
  }
}
