// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.7.3/API/interfaces/IERC20Permit.sol";

contract Vault {
    IERC20Permit public immutable token;

    constructor(address _token) {
        token = IERC20Permit(_token);
    }

    function deposit(uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
    }

    function depositWithPermit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        token.transferFrom(msg.sender, address(this), amount);
    }
}
