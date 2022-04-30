import React from 'react';

const ChoiceButton = ({type, choice, label, onChoice}) => {
    return (
        <div className={`col-10 col-sm-6 col-lg-3 mt-3  btn btn-${type}`} onClick={onChoice.bind(this, choice)}>{label}</div>
    );
}

export default ChoiceButton;