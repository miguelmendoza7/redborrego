import React from 'react';
import ChoiceButton from './ChoiceButton'

const Choice = ({ onChoice}) => {
    return (
        <>
        <div className='text-center margin'>
            <ChoiceButton onChoice={onChoice} type='primary' choice='new' label='Crear partida'/> 
            <br />
            <ChoiceButton onChoice={onChoice} type='secondary' choice='join' label='Unirse a una partida'/> 
        </div>
        </>
    );
}

export default Choice;