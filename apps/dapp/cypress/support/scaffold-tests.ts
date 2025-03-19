import { parseEther } from "viem";
import { testAccount, testClient } from "./test-client";
import { mintToken } from "./transactions/mint-token";
import { formatCurrency } from "formatters";
import { bond } from "./transactions/bond";

const MINT_AMOUNT = "1000000";
const TEST_USDC_ADDRESS = "0x4c9d75fbdF764D05dF654340A48f85Bc0216F8AB";
const TEST_ADDRESS = testAccount.address;

async function scaffold() {
  console.log(`Account: ${TEST_ADDRESS}`);

  await testClient.setBalance({
    address: TEST_ADDRESS,
    value: parseEther("10"),
  });
  console.log("Balance set to 10 Eth");

  await mintToken({
    userAddress: testAccount.address,
    tokenAddress: TEST_USDC_ADDRESS,
    amount: MINT_AMOUNT,
  });

  console.log(
    `Minted ${formatCurrency.dynamicFormatter(MINT_AMOUNT, false)} USDC`
  );

  //Purchase a bond to be used in claim test
  await bond({
    quoteTokenAddress: TEST_USDC_ADDRESS,
  });
}

scaffold();
