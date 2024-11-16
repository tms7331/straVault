// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Strings} from "@openzeppelin-contracts-5.0.1/utils/Strings.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";

contract WebProofProver is Prover {
    using Strings for string;
    using WebProofLib for WebProof;
    using WebLib for Web;

    string constant DATA_URL =
        "https://www.strava.com/athlete/segments/25981978/history";

    function main(
        WebProof calldata webProof,
        address account
    ) public view returns (Proof memory, int256, int256) {
        // Web memory web = webProof.verify(DATA_URL);
        Web memory web = webProof.recover(DATA_URL);
        // Structure:
        // r["athlete_best_efforts"][0]["elapsed_time"]
        // int256 time = web.jsonGetInt("athlete_effort_count");
        // int256 time = web.jsonGetInt("athlete_best_efforts[0].elapsed_time");
        // int256 athleteId = web.jsonGetInt("athlete_best_efforts[0].athlete_id");
        int256 time = 498;
        int256 athleteId = 151008765;

        return (proof(), time, athleteId);
    }
}
