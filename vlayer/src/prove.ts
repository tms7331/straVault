import webProofProver from "../../out/WebProofProver.sol/WebProofProver";

import { foundry } from "viem/chains";

import {
  createVlayerClient,
  type WebProof,
  type Proof,
  isDefined,
} from "@vlayer/sdk";

import {
  createExtensionWebProofProvider,
  expectUrl,
  notarize,
  startPage,
} from "@vlayer/sdk/web_proof";

import { createContext } from "@vlayer/sdk/config";

import webProofVerifier from "../../out/WebProofVerifier.sol/WebProofVerifier";
import { Hex } from "viem";

const context: {
  webProof: WebProof | undefined;
  provingResult: [Proof, string, Hex] | undefined;
} = { webProof: undefined, provingResult: undefined };

const { chain, ethClient, account, proverUrl, confirmations } =
  await createContext({
    chainName: import.meta.env.VITE_CHAIN_NAME,
    proverUrl: import.meta.env.VITE_PROVER_URL,
    jsonRpcUrl: import.meta.env.VITE_JSON_RPC_URL,
    privateKey: import.meta.env.VITE_PRIVATE_KEY,
  });

const twitterUserAddress = account.address;

export async function setupRequestProveButton(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    // Default
    // const provider = createExtensionWebProofProvider();
    const provider = createExtensionWebProofProvider({
      wsProxyUrl: "ws://localhost:55688",
    })

    const webProof = await provider.getWebProof({
      proverCallCommitment: {
        address: import.meta.env.VITE_PROVER_ADDRESS,
        proverAbi: webProofProver.abi,
        chainId: foundry.id,
        functionName: "main",
        commitmentArgs: ["0x"],
      },
      logoUrl: "https://datawookie.dev/blog/2021/01/running-history-strava/card-strava.png",
      steps: [
        startPage("https://www.strava.com/login", "Go to strava login page"),
        expectUrl("https://www.strava.com/segments/25981978", "Log in"),
        // https://www.strava.com/athlete/segments/25981978/history
        notarize(
          "https://www.strava.com/athlete/segments/25981978/history",
          "GET",
          "Generate Proof of Strava activity",
        ),
      ],
    });

    const formattedJSON = JSON.stringify(webProof, null, 2);

    console.log("WebProof generated!");
    console.log(webProof);
    console.log(formattedJSON);

    context.webProof = webProof;
  });
}

export const setupVProverButton = (element: HTMLButtonElement) => {
  element.addEventListener("click", async () => {
    const notaryPubKey =
      "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExpX/4R4z40gI6C/j9zAM39u58LJu\n3Cx5tXTuqhhu/tirnBi5GniMmspOTEsps4ANnPLpMmMSfhJ+IFHbc3qVOA==\n-----END PUBLIC KEY-----\n";

    const webProof = {
      tls_proof: context.webProof,
      notary_pub_key: notaryPubKey,
    };
    const vlayer = createVlayerClient({
      url: proverUrl,
    });

    console.log("Generating proof...");
    const hash = await vlayer.prove({
      address: import.meta.env.VITE_PROVER_ADDRESS,
      functionName: "main",
      proverAbi: webProofProver.abi,
      args: [
        {
          webProofJson: JSON.stringify(webProof),
        },
        twitterUserAddress,
      ],
      chainId: chain.id,
    });
    const provingResult = await vlayer.waitForProvingResult(hash);
    console.log("Proof generated!", provingResult);
    context.provingResult = provingResult as [Proof, string, Hex];
  });
};

export const setupVerifyButton = (element: HTMLButtonElement) => {
  element.addEventListener("click", async () => {
    isDefined(context.provingResult, "Proving result is undefined");

    const txHash = await ethClient.writeContract({
      address: import.meta.env.VITE_VERIFIER_ADDRESS,
      abi: webProofVerifier.abi,
      functionName: "verify",
      args: context.provingResult,
      chain,
      account: account,
    });

    const verification = await ethClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations,
      retryCount: 60,
      retryDelay: 1000,
    });
    console.log("Verified!", verification);
  });
};