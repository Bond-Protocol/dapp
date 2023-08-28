import * as React from 'react'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import axios from "axios";

function SignInButton({
                          onSuccess,
                          onError,
                      }: {
    onSuccess: (args: { address: string }) => void
    onError: (args: { error: Error }) => void
}) {
    const [state, setState] = React.useState<{
        loading?: boolean
        nonce?: string
    }>({});

    const { address } = useAccount()
    const { chain } = useNetwork()
    const { signMessageAsync } = useSignMessage()

    const signIn = async () => {
        try {
            const chainId = chain?.id
            if (!address || !chainId) return
            const nonceRes = await axios.get(`http://localhost:8080/auth/nonce`)

            setState((x) => ({ ...x, loading: true }))
            // Create SIWE message with pre-fetched nonce and sign with wallet
            const message = new SiweMessage({
                domain: "bondprotocol.finance",
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: "https://bondprotocol.finance",
                version: '1',
                chainId,
                nonce: nonceRes.data,
            })

            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })

            const verify = await axios.post(
                `http://localhost:8080/auth/sign_in`,
                {
                message: message.prepareMessage(),
                signature: signature
            },
                {
                headers: {
                    'Content-Type': 'application/json',
                    'x-chain-id': chainId.toString(),
                    'x-aggregator': "",
                    'x-settlement': "",
                },
            })

            sessionStorage.setItem("access_token", verify.data.access_token);
            sessionStorage.setItem("refresh_token", verify.data.refresh_token)

            setState((x) => ({ ...x, loading: false }))
            onSuccess({ address })
        } catch (error) {
            console.log(error)
            setState((x) => ({ ...x, loading: false, nonce: undefined }))
        }
    }

    return (
        <button disabled={state.loading} onClick={signIn}>
            Sign-In with Ethereum
        </button>
    )
}

export function Profile() {
    const { isConnected } = useAccount()
    const { chain } = useNetwork()
    const { address } = useAccount()

    const [state, setState] = React.useState<{
        address?: string
        error?: Error
        loading?: boolean
    }>({})

    const testToken = async () => {
        const chainId = chain?.id
        if (!chainId || !address) return

        try {
            const testRes = await axios.get(`http://localhost:8080/auth/test/` + address, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`,
                    'x-chain-id': chainId.toString(),
                    'x-aggregator': "",
                    'x-settlement': "",
                },
            });
        } catch (e) {
            console.log(e);
        }

        try {
            const testRes2 = await axios.get(`http://localhost:8080/auth/test/0x0000000000000000000000000000000000000000`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`,
                    'x-chain-id': chainId.toString(),
                    'x-aggregator': "",
                    'x-settlement': "",
                },
            });
        } catch (e) {
            console.log(e);
        }
    }

    const refreshToken = () => {
        const chainId = chain?.id
        if (!chainId || !address) return

        void axios.get(`http://localhost:8080/auth/refresh`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("refresh_token")}`,
                'x-chain-id': chainId.toString(),
                'x-aggregator': "",
                'x-settlement': "",
            },
        }).then((result) => {
            sessionStorage.setItem("access_token", result.data.access_token);
            sessionStorage.setItem("refresh_token", result.data.refresh_token)
        });
    }

    if (isConnected) {
        return (
            <div>
                {state.address ? (
                    <div>
                        <div>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem("access_token");
                                sessionStorage.removeItem("refresh_token");
                                setState({})
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                    </div>
                ) : (
                    <SignInButton
                        onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
                        onError={({ error }) => setState((x) => ({ ...x, error }))}
                    />
                )}
                <div>
                    <button
                        onClick={() => testToken()}
                    >
                        Test
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => refreshToken()}
                    >
                        Refresh
                    </button>
                </div>
            </div>
        )
    }

    return <div>{/* Connect wallet content goes here */}</div>
}