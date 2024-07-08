// src/components/Header.js
import React from 'react';
import { useWallet } from '../../../context/WalletContext';

const Header = () => {
  const { isConnected, walletAddress, connect, disconnect } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0D0703] text-white p-4 flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold">Swap DApp</h1>
      {isConnected ? (
        <div className="flex items-center gap-4">
          <div className="bg-[#1F1C19] px-4 py-2 rounded-full">
            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
          </div>
          <button 
            onClick={disconnect}
            className="bg-[#E2E0DD] text-[#34332F] px-4 py-2 rounded-full font-bold hover:bg-[#D0CDCD] transition-colors duration-300"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={connect}
          className="bg-[#E2E0DD] text-[#34332F] px-4 py-2 rounded-full font-bold hover:bg-[#D0CDCD] transition-colors duration-300"
        >
          Connect Wallet
        </button>
      )}
    </header>
  );
};

export default Header;