"use client";

import { useMemo, createContext, useContext } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

function WalletContextInner({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet"),
    [],
  );

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletContextInner>{children}</WalletContextInner>
      </WalletProvider>
    </ConnectionProvider>
  );
}
