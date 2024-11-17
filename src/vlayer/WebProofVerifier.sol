// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {WebProofProver} from "./WebProofProver.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

contract WebProofVerifier is Verifier {
    address public prover;
    // Values for the proof
    address public successAddress;
    address public failureAddress;
    int256 public athleteId;
    int256 public maxTime;
    uint256 public deadline;

    constructor(
        address _prover,
        address _successAddress,
        address _failureAddress,
        int256 _athleteId,
        int256 _maxTime,
        uint256 _deadline
    ) {
        prover = _prover;
        successAddress = _successAddress;
        failureAddress = _failureAddress;
        athleteId = _athleteId;
        maxTime = _maxTime;
        deadline = _deadline;
    }

    function timeoutClaim() public {
        // If the deadline has passed, anyone can call this function to send funds to the failureAddress
        require(block.timestamp > deadline, "Deadline not reached");
        (bool success, ) = failureAddress.call{value: address(this).balance}(
            ""
        );
        require(success, "Failed to send Ether");
    }

    function verify(
        Proof calldata,
        int256 time,
        int256 athleteId
    ) public onlyVerified(prover, WebProofProver.main.selector) {
        // If proof is valid, send funds to successAddress
        require(time <= maxTime, "Time is greater than maxTime");
        require(athleteId == athleteId, "Athlete ID does not match");
        successAddress.call{value: address(this).balance}("");
    }

    fallback() external payable {}
}
