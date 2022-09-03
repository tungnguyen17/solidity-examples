//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.12;

contract MessageValidator {

  function checkSignature(
    bytes32 dataHash_,
    bytes memory signature_
  ) public view returns (bool) {

    require(signature_.length == 65, "Invalid signature");

    address signer;
    uint8 v;
    bytes32 r;
    bytes32 s;
    (v, r, s) = signatureSplit(signature_);
    if (v == 0) {
      // If v is 0 then it is a contract signature
      // Not supported
      return false;
    } else if (v == 1) {
      // If v is 1 then it is an approved hash
      // When handling approved hashes the address of the approver is encoded into r
      signer = address(uint160(uint256(r)));
      // Hashes are automatically approved by the sender of the message or when they have been pre-approved via a separate transaction
    } else if (v > 30) {
      // If v > 30 then default va (27,28) has been adjusted for eth_sign flow
      // To support eth_sign and similar we adjust v and hash the messageHash with the Ethereum message prefix before applying ecrecover
      signer = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash_)), v - 4, r, s);
    } else {
      // Default is the ecrecover flow with the provided data hash
      // Use ecrecover with the messageHash for EOA signatures
      signer = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash_)), v, r, s);
    }
    return msg.sender == signer;
  }

  /// @dev divides bytes signature into `uint8 v, bytes32 r, bytes32 s`.
  /// @notice Make sure to perform a bounds check for @param pos, to avoid out of bounds access on @param signatures
  /// @param signature_ concatenated rsv signatures
  function signatureSplit(
    bytes memory signature_
  ) internal pure returns (
    uint8 v,
    bytes32 r,
    bytes32 s
  ) {
    // The signature format is a compact form of:
    //   {bytes32 r}{bytes32 s}{uint8 v}
    // Compact means, uint8 is not padded to 32 bytes.
    // solhint-disable-next-line no-inline-assembly
    assembly {
      r := mload(add(signature_, 0x20))
      s := mload(add(signature_, 0x40))
      // Here we are loading the last 32 bytes, including 31 bytes
      // of 's'. There is no 'mload8' to do this.
      //
      // 'byte' is not working due to the Solidity parser, so lets
      // use the second best option, 'and'
      v := and(mload(add(signature_, 0x41)), 0xff)
    }
  }

  function toBytes(bytes32 data) public pure returns (bytes memory) {
    return bytes.concat(data);
  }
}
