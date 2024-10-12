// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharityProjectDonation is ReentrancyGuard, Ownable {
    string public projectId;
    uint256 public totalFundsRaised;
    uint256 public uniqueDonorCount;

    mapping(address => uint256) public donorContributions;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        string message
    );
    event FundsWithdrawn(
        address indexed beneficiary,
        uint256 amount,
        string purpose
    );

    constructor(string memory _projectId) Ownable(msg.sender) {
        projectId = _projectId;
    }

    receive() external payable {
        _processDonation("");
    }

    function donate(string calldata message) external payable {
        _processDonation(message);
    }

    function _processDonation(string memory message) private {
        require(msg.value > 0, "Donation amount must be greater than 0");
        totalFundsRaised += msg.value;

        if (donorContributions[msg.sender] == 0) {
            uniqueDonorCount++;
        }
        donorContributions[msg.sender] += msg.value;

        emit DonationReceived(msg.sender, msg.value, message);
    }

    function withdrawFunds(
        uint256 amount,
        string calldata purpose
    ) external onlyOwner nonReentrant {
        require(
            amount <= address(this).balance,
            "Requested amount exceeds available funds"
        );
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Fund transfer failed");
        emit FundsWithdrawn(owner(), amount, purpose);
    }
}
