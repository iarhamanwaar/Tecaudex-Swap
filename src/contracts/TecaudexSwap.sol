pragma solidity ^0.5.0;

import "./Token.sol";

contract TecaudexSwap {
    string public name = "TecaudexSwap Instant Exchange";
    Token public token;
    uint public rate = 50;

    event TokenPurchased(address account, address token, uint amount, uint rate);

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}