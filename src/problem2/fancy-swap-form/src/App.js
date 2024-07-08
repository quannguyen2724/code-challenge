import './App.css';
import Swap from './components/swap/swapPanel';
import BackGround from './assets/background.jpg';
import Header from './components/swap/header/header';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <Header />
        <div
          className="flex h-full w-full justify-center items-center p-5"
          style={{
            backgroundImage: `url(${BackGround})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Swap />
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
