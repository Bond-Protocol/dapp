const defaultStatement = "Sign in with Ethereum to the Bond Protocol app.";

/** Creates a SIWE compatible message*/
export function createSignInMessage(message: {
  address: string;
  domain: string;
  uri: string;
  version: string;
  nonce: string;
  chainId: string | number;
  statement?: string;
}) {
  const domain = `${message.domain} wants you to sign in with your Ethereum account:\n${message.address}`;

  const statement = message.statement ?? defaultStatement;

  const URI = `URI: ${message.uri}`;
  const version = `Version: ${message.version}`;
  const chainId = `Chain ID: ${message.chainId}`;
  const nonce = `Nonce: ${message.nonce}`;
  const issuedAt = `Issued At: ${new Date().toISOString()}`;

  const content = [URI, version, chainId, nonce, issuedAt].join("\n");
  return [domain, statement, content].join("\n\n");
}
