//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenHolder {
  using SafeERC20 for IERC20;

  function withdraw(address token, address to, uint256 amount) external returns (bool) {
    IERC20(token).transfer(to, amount);
    return true;
  }

  function safeWithdraw(address token, address to, uint256 amount) external returns (bool) {
    IERC20(token).safeTransfer(to, amount);
    return true;
  }
}
