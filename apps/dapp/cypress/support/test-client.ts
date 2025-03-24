import {
  type TestClient,
  type WalletActions,
  type PublicActions,
  createTestClient,
  http,
  walletActions,
  publicActions,
  testActions,
  formatUnits,
} from "viem";
import { baseSepolia, foundry } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

type ExtendedTestClient = TestClient & WalletActions & PublicActions;

export const TEST_PRIVATE_KEY =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
export const testAccount = privateKeyToAccount(TEST_PRIVATE_KEY);

const testClient = createTestClient({
  mode: "anvil",
  chain: { ...foundry, id: baseSepolia.id },
  account: privateKeyToAccount(TEST_PRIVATE_KEY),
  transport: http(),
})
  .extend(walletActions)
  .extend(publicActions); // fix this type

export { testClient };
