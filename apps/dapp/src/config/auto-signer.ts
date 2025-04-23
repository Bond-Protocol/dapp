import { WalletClient } from "wagmi";
import { baseSepolia, foundry } from "viem/chains";
import { custom, createWalletClient, Address } from "viem";
import { Connector } from "wagmi";
import { injectAutoSignerProvider } from "@axis-finance/auto-signer-provider";
import { privateKeyToAccount } from "viem/accounts";

export const ANVIL_RPC_URL = "http://127.0.0.1:8545";
const PRIVATE_KEY =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const chain = baseSepolia;

export class AutoSignerConnector extends Connector {
  readonly id = "autoSigner";
  readonly name = "Auto-Signer";
  readonly ready = true;
  readonly connector: Connector;

  private walletClient: WalletClient;

  constructor(config = { chains: [], options: {} }) {
    super(config);
    injectAutoSignerProvider({
      debug: false,
      chain,
      rpcUrl: ANVIL_RPC_URL,
      privateKey: PRIVATE_KEY,
    });

    this.walletClient = createWalletClient({
      account: privateKeyToAccount(PRIVATE_KEY),
      chain: { ...foundry, chainId: baseSepolia.id },
      transport: custom(window.ethereum!),
    });

    this.connector = this;
  }

  createConnector() {
    return this;
  }

  async connect() {
    const accounts = await this.walletClient.requestAddresses();
    return {
      account: accounts[0],
      chain: { id: baseSepolia.id, unsupported: false },
    };
  }

  async disconnect() {
    throw new Error("Disconnect is not implemented");
  }

  async getAccount() {
    const accounts = await this.walletClient.getAddresses();
    return accounts[0];
  }

  async getChainId() {
    return this.walletClient.chain.id;
  }

  async getProvider() {
    return window.ethereum;
  }

  async getWalletClient() {
    return this.walletClient;
  }

  async isAuthorized() {
    try {
      const accounts = await this.walletClient.getAddresses();
      return !!accounts.length;
    } catch {
      return false;
    }
  }

  onAccountsChanged(accounts: Address[]) {
    if (accounts.length === 0) this.emit("disconnect");
    else this.emit("change", { account: accounts[0] });
  }

  onChainChanged(chainId: number | string) {
    const id = Number(chainId);
    this.emit("change", {
      chain: { id, unsupported: this.isChainUnsupported(id) },
    });
  }

  onDisconnect() {
    this.emit("disconnect");
  }
}

export const autoSignerWallet = {
  id: "AutoSigner",
  name: "AutoSigner",
  iconUrl: "",
  iconBackground: "",
  createConnector: () => new AutoSignerConnector(),
};
