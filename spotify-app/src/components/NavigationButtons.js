import React from 'react';
import Button from '@mui/material/Button';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {useNavigate} from 'react-router-dom';
import "../styles/navbar.css";

function NavigationButtons(props) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Naviga all'indietro nella cronologia
        props.currentAudioElement?.pause()
        props.setCurrentAudioElement(null)
    };

    const handleGoForward = () => {
        navigate(1); // Naviga avanti nella cronologia
        props.currentAudioElement?.pause()
        props.setCurrentAudioElement(null)
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button onClick={handleGoBack} startIcon={<ArrowBackIosRoundedIcon/>} className='history-icon'
                    style={{flex: 1}}>
            </Button>
            <Button onClick={handleGoForward} endIcon={<ArrowForwardIosRoundedIcon/>} className='history-icon'
                    style={{flex: 1}}>
            </Button>
        </div>

    );
}

export default NavigationButtons;
