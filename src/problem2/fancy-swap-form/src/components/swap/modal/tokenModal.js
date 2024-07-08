import React from 'react';
import { Modal, Box, styled, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import tokenList from '../tokenPrices.json';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 600,
  background: '#0D0703',
  border: '1px solid #383433',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 10px;
  top: 10px;
  color: #afacac;
`;

const TokenModal = ({ isOpen, onClose, modifyToken }) => {
  const renderTokenList = tokenList.map((e, i) => (
    <div
      className="flex justify-start items-center pl-5 py-2.5 cursor-pointer hover:bg-[#1F1C19] text-[#AFACAC] rounded-xl mr-2"
      key={i}
      onClick={() => modifyToken(i)}
    >
      <img
        src={require(`../assets/${e.currency}.svg`)}
        alt={e.currency}
        className="w-10 h-10"
      />
      <div>
        <div className="ml-2.5 text-base font-medium">{e.currency}</div>
        <div className="ml-2.5 text-sm font-light">{e.price.toFixed(2)}$</div>
      </div>
    </div>
  ));

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      
    >
      <Box sx={style}>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <div className="relative h-[500px] mt-8">
          <div className="max-h-full overflow-auto">{renderTokenList}</div>
        </div>
      </Box>
    </Modal>
  );
};

export default TokenModal;
