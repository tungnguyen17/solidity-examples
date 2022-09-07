//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.12;

contract NumericBitmap {

  uint256 private _singleBitmap;
  mapping(uint256 => uint256) private _doubleBitmap;

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

  function doubleBitmapValue(
    uint256 slot_
  ) public view returns (uint256)
  {
    return _doubleBitmap[slot_];
  }

  function readDoubleBitmap(
    uint256 index_
  ) external view returns (bool) {
    uint256 slot = index_ / 256;
    uint256 slotBitmap = _doubleBitmap[slot];
    uint256 slotIndex = index_ % 256;
    uint256 bitValue = slotBitmap & (1 << slotIndex);
    return bitValue > 0;
  }

  function writeDoubleBitmap(
    uint256 index_,
    bool state_
  ) external {
    uint256 slot = index_ / 256;
    uint256 slotBitmap = _doubleBitmap[slot];
    uint256 slotIndex = index_ % 256;
    uint256 valueToWrite = state_ ? 1 : 0;
    _doubleBitmap[slot] = slotBitmap | (valueToWrite << slotIndex);
  }
}
