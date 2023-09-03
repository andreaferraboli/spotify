import React from 'react';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useHistory } from 'react-router-dom';

function NavigationButtons() {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoForward = () => {
    history.goForward();
  };

  return (
    <div>
      <Button onClick={handleGoBack} startIcon={<ArrowBackIcon />}>
        Indietro
      </Button>
      <Button onClick={handleGoForward} endIcon={<ArrowForwardIcon />}>
        Avanti
      </Button>
    </div>
  );
}

export default NavigationButtons;
