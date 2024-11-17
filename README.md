# StraVault: Social Strava Challenges

StraVault leverages **vlayer's web proofs** to enable users to create and participate in social bets and challenges on Strava segments.  Built for the EthGlobal Bangkok 2024 Hackathon.

## How It Works

### Challenge Setup
Each challenge consists of:
1. **Strava User ID**: The athlete's Strava account.
2. **Strava Segment**: The segment the athlete must complete.
3. **Target Time**: The time the athlete must achieve on the segment.
4. **Deadline**: The time limit for completing the challenge.
5. **Addresses**:
   - **Success Address**: Where funds are sent if the challenge is completed successfully.
   - **Failure Address**: Where funds are sent if the challenge is not completed.

### Validation and Fund Claiming
To claim funds, the user must:
1. Generate a **web proof** using vlayer.
2. Submit the proof to the contract for validation.
3. Upon successful validation, funds are sent to the **success address**. If the deadline expires without a valid proof, funds are sent to the **failure address**.

## Key Components

### Backend
- **Web Proofs**: Customized vlayer web proof templates expanded to support Strava proofs.
- **Solidity Contracts**: Modified vlayer verifier and prover contracts to integrate Strava proof logic. Funds are locked until a valid proof is submitted or the deadline expires.

### Frontend
A Next.js prototype frontend is available at:  
👉 [straVault-frontend](https://github.com/tms7331/straVault-frontend)

- The frontend uses a modified version of `proof.ts` from the vlayer template to make the `@vlayer/sdk` library compatible with Next.js.
- **Note**: The frontend currently relies on the prover running locally.

## Running Locally

To run the project locally, follow these steps:

1. **Start local testnets:**
   ```bash
   anvil
   vlayer serve
   ```

2. **Build the smart contracts:**
   ```bash
   forge build
   ```

3. **Run the WebSocket proxy:**
   Refer to the [vlayer documentation](https://book.vlayer.xyz/javascript/web-proofs.html) for more details.
   ```bash
   websocat --binary -v ws-l:0.0.0.0:55688 tcp:strava.com:443
   ```

4. **Deploy the smart contracts:**
   From the `vlayer` directory, execute:
   ```bash
   bun run deploy:dev
   bun run dev
   ```

5. **Test the proof locally:**
   Open:
   ```plaintext
   http://localhost:5174/
   ```

6. **Run the Next.js frontend:**
   Clone and run the frontend from the repository:  
   👉 [straVault-frontend](https://github.com/tms7331/straVault-frontend)

---

## Next Steps
This project is a proof of concept for integrating Strava-based social bets with vlayer web proofs. Contributions and suggestions are welcome! 🎉 

Feel free to fork, explore, and extend StraVault.