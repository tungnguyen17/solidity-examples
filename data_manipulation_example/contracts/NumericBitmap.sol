//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.12;

contract NumericBitmap {

  uint256 private _singleBitmap;

  function singleBitmapValue()
    public view returns (uint256)
  {
    return _singleBitmap;
  }

  function readSingleBitmap(
    uint8 index_
  ) external view returns (bool) {
    uint256 bitValue = _singleBitmap & (1 << index_);
    return bitValue > 0;
  }

  function writeSingleBitmap(
    uint8 index_,
    bool state_
  ) external {
    uint256 valueToWrite = state_ ? 1 : 0;
    _singleBitmap = _singleBitmap | (valueToWrite << index_);
  }
}
