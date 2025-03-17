import { testAccount } from "./test-client";
import { mintToken } from "./transactions/mint-token";
import { formatCurrency } from "formatters";

const MINT_AMOUNT = "1000000";
const TEST_USDC_ADDRESS = "0x4c9d75fbdF764D05dF654340A48f85Bc0216F8AB";

async function scaffold() {
  const mintTokenResponse = await mintToken({
    userAddress: testAccount.address,
    tokenAddress: TEST_USDC_ADDRESS,
    amount: MINT_AMOUNT,
  });

  console.log(
    `Minted ${formatCurrency.dynamicFormatter(MINT_AMOUNT, false)} USDC to ${
      testAccount.address
    } at blocknumber ${mintTokenResponse.blockNumber}`
  );
}

scaffold();
