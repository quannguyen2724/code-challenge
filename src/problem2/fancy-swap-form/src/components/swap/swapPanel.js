import React, { useState, useEffect } from 'react';
import {
  TextField,
  Popover,
  styled,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RepeatIcon from '@mui/icons-material/Repeat';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import tokenList from './tokenPrices.json';
import TokenModal from './modal/tokenModal';
import { useWallet } from '../../context/WalletContext';

const NumericTextField = styled(TextField)`
  border: 1px solid #383433;
  &.MuiFormControl-root {
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: center;
  }

  /* Hide spinner controls for Webkit browsers (Chrome, Safari, newer versions of Opera) */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Hide spinner controls for Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    background-color: transparent;
  }
`;

const StyledToggleButton = styled(ToggleButton)`
  background-color: transparent;
  color: white;
  padding: 8px 16px;
  border: none;
  font-weight: bold;
  &.Mui-selected {
    border-radius: 10px;
    background-color: #f9f7f5;
    color: #1f1c19;
    &:hover {
      background-color: #f9f7f5;
    }
  }
  &:hover {
    border-radius: 10px;
    background-color: #484443;
  }
`;

const SwapPanel = () => {
  const { isConnected, connect } = useWallet();
  const [slippage, setSlippage] = useState(0);
  const [tokenOneAmount, setTokenOneAmount] = useState();
  const [tokenTwoAmount, setTokenTwoAmount] = useState();
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpenTokenModal, setIsOpenTokenModal] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [oldTokenName, setOldTokenName] = useState('null');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (tokenOneAmount !== 0) {
      setTokenTwoAmount(tokenOneAmount * (tokenOne.price / tokenTwo.price));
    }
  }, [tokenOne, tokenOneAmount, tokenTwo]);

  const switchTokens = () => {
    setTokenOneAmount(tokenTwoAmount);
    setTokenOne(tokenTwo);
    setTokenTwo(tokenOne);
  };

  const openModal = (asset, tokenName) => {
    setChangeToken(asset);
    setOldTokenName(tokenName);
    setIsOpenTokenModal(true);
  };

  const modifyToken = (i) => {
    if (oldTokenName === tokenList[i].currency) {
      switchTokens();
    } else {
      if (changeToken === 1) {
        setTokenOne(tokenList[i]);
      }
      if (changeToken === 2) {
        setTokenTwo(tokenList[i]);
      }
    }
    setOldTokenName('');
    setIsOpenTokenModal(false);
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleChangeSlippage = (_, newSlippage) => setSlippage(newSlippage);
  const isSwapDisabled = !isConnected || !tokenOneAmount || tokenOneAmount <= 0;
  const handleSwap = () => {
    if (!isSwapDisabled) {
      const success = Math.random() < 0.5;

      if (success) {
        setNotification({ message: 'Swap successful!', type: 'success' });
      } else {
        setNotification({
          message: 'Swap failed. Please try again.',
          type: 'error',
        });
      }
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  return (
    <>
      <TokenModal
        isOpen={isOpenTokenModal}
        onClose={() => setIsOpenTokenModal(false)}
        modifyToken={modifyToken}
      />
      <div className="w-[500px] drop-shadow-[0_4px_32px_rgba(207,182,151,0.08)] bg-[#0D0703] border-[#383433] min-h-[300px] p-[30px] flex flex-col justify-start items-start rounded-2xl gap-2 border-[1px] text-[#e7e8ed]">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="font-bold text-lg">Swap</span>
          <SettingsOutlinedIcon
            className="text-[#e7e8ed] text-[24px] transition-all duration-300 cursor-pointer"
            onClick={handleClick}
          />
          <StyledPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className="bg-[#0D0703] border-[#383433] border-[1px] mt-1 p-4 rounded-xl">
              <div className="text-[#EAE8E6] font-bold mb-2">
                Slippage Tolerance
              </div>
              <ToggleButtonGroup
                value={slippage}
                exclusive
                onChange={handleChangeSlippage}
                aria-label="price selection"
                className="bg-[#1F1C19] p-1 rounded-xl flex gap-1"
              >
                <StyledToggleButton value="5" aria-label="5%">
                  5%
                </StyledToggleButton>
                <StyledToggleButton value="10" aria-label="10%">
                  10%
                </StyledToggleButton>
                <StyledToggleButton value="15" aria-label="15%">
                  15%
                </StyledToggleButton>
              </ToggleButtonGroup>
            </div>
          </StyledPopover>
        </div>
        <div className="relative w-full">
          <NumericTextField
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            className="!h-[72px] bg-none mb-[5px] text-[35px] rounded-t-xl w-full"
            placeholder="0"
            type="number"
            value={tokenOneAmount}
            onChange={(e) => {
              setTokenOneAmount(e.target.value);
            }}
            inputProps={{ maxLength: 12 }}
            sx={{
              '& .MuiInputBase-input': {
                color: '#AFACAC',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '0 15px',
                '&:focus': {
                  outline: 'none',
                },
              },
              '& .MuiFormControl-root MuiTextField-root ': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          />
          <NumericTextField
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            className="!h-[72px] bg-none mb-[5px] text-[35px] rounded-b-xl w-full"
            placeholder="0"
            type="number"
            value={tokenTwoAmount}
            sx={{
              '& .MuiInputBase-input': {
                color: '#AFACAC',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '0 15px',
                cursor: 'not-allowed',
                '&:focus': {
                  outline: 'none',
                },
              },
              '& .MuiFormControl-root MuiTextField-root ': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          />
          <div
            className="bg-[#0D0703] hover:bg-[#383433] cursor-pointer w-[25px] h-[25px] flex items-center justify-center rounded-lg absolute top-[60px] left-[206px] border-[1px] border-[#383433] transition-all duration-300"
            onClick={switchTokens}
          >
            <RepeatIcon className="!text-xs" />
          </div>
          <div
            className="absolute min-w-[50px] h-[30px] top-[16px] text-[D0CDCD] hover:bg-[#383433] border-[#383433] border-[1px] right-5 rounded-full flex justify-start items-center gap-[5px] font-bold text-[17px] pr-2 cursor-pointer"
            onClick={() => openModal(1, tokenTwo.currency)}
          >
            <img
              src={require(`./assets/${tokenOne.currency}.svg`)}
              alt="assetOneLogo"
              className="h-[22px] ml-[5px]"
            />
            {tokenOne.currency}
            <ExpandMoreIcon />
          </div>
          {tokenOneAmount > 0 && (
            <div className="absolute min-w-[50px] h-[30px] top-[51px] text-xs right-6 text-[17px] text-[#AFACAC]">
              {`${(tokenOneAmount * tokenOne.price).toFixed(2)}$`}
            </div>
          )}

          <div
            className="absolute min-w-[50px] h-[30px] border-[#383433] text-[D0CDCD] hover:bg-[#383433] border-[1px] top-[88px] right-5 rounded-full flex justify-start items-center gap-[5px] font-bold text-[17px] pr-2 cursor-pointer"
            onClick={() => openModal(2, tokenOne.currency)}
          >
            <img
              src={require(`./assets/${tokenTwo.currency}.svg`)}
              alt="assetOneLogo"
              className="h-[22px] ml-[5px]"
            />
            {tokenTwo.currency}
            <ExpandMoreIcon />
          </div>
          {tokenOneAmount > 0 && (
            <div className="absolute min-w-[50px] h-[30px] top-[123px] text-xs right-6 text-[17px] text-[#AFACAC]">
              {`${(tokenTwoAmount * tokenTwo.price).toFixed(2)}$`}
            </div>
          )}
        </div>
        <div className="text-[#EAE8E6] bg-[#1F1C19] p-3 rounded-xl flex justify-between items-center w-full text-sm font-medium">
          <div>Slippage Tolerance</div>
          <div>{slippage ? slippage : 0}%</div>
        </div>
        {notification && (
          <div
            className={` ${
              notification?.type === 'error' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {notification?.message}
          </div>
        )}

        <button
          onClick={isConnected ? handleSwap : connect}
          className={`mt-3 flex text-lg justify-center items-center w-full h-[44px] rounded-xl text-[#34332F] font-bold transition-all duration-300 ${
            !tokenOneAmount && isConnected
              ? `cursor-not-allowed bg-[#6e6969]`
              : `cursor-pointer bg-[#E2E0DD]`
          }`}
          disabled={!tokenOneAmount || isConnected}
        >
          {isConnected ? 'Swap' : 'Connect Wallet'}
        </button>
      </div>
    </>
  );
};

export default SwapPanel;
