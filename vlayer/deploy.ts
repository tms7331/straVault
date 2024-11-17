import proverSpec from "../out/WebProofProver.sol/WebProofProver";
import verifierSpec from "../out/WebProofVerifier.sol/WebProofVerifier";
import {
  deployVlayerContracts,
  writeEnvVariables,
  getConfig,
} from "@vlayer/sdk/config";


/*
address _successAddress,
address _failureAddress,
int256 _athleteId,
int256 _maxTime,
uint256 _deadline
*/

const successAddress = "0xC52178a1b28AbF7734b259c27956acBFd67d4636";
const failureAddress = "0x0000000000000000000000000000000000000000";
const maxTime = 500;
const athleteId = 151008765;
// One week from now
const deadline = 1732379995;

const verifierArgs = [
  successAddress,
  failureAddress,
  athleteId,
  maxTime,
  deadline
];

const { prover, verifier } = await deployVlayerContracts({
  proverSpec,
  verifierSpec,
  verifierArgs
});

const config = getConfig();

writeEnvVariables(".env", {
  VITE_PROVER_ADDRESS: prover,
  VITE_VERIFIER_ADDRESS: verifier,
  VITE_CHAIN_NAME: config.chainName,
  VITE_PROVER_URL: config.proverUrl,
  VITE_JSON_RPC_URL: config.jsonRpcUrl,
  VITE_PRIVATE_KEY: config.privateKey,
});
