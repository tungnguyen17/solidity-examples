// SPDX-License-Identifier: Apache-2.0

import "./MasterCopy.sol";

pragma solidity ^0.8.12;

contract Factory {

  address private _implementation;

  event Deployed(address indexed implementation);

  constructor(
    address implementation_
  ) {
    _implementation = implementation_;
  }

  function getImplementation() public view returns (address) {
    return _implementation;
  }

  function deploy(
    string memory name,
    string memory symbol
  ) public returns (address result) {
    bytes20 targetBytes = bytes20(_implementation);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(clone, 0x14), targetBytes)
      mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, clone, 0x37)
    }

    MasterCopy(result).init(name, symbol);
    emit Deployed(result);
  }
}
