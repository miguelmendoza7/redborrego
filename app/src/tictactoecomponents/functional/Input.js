import React from 'react';

const Input = (props) => {
    const {name, placeholder, value, onChange} = props
    return (
        <input autoComplete='off' className="mb-4 mt-3 input-name col-10 col-sm-8 col-md-7 col-lg-5 col-xl-4" type="text" name={name} id={name} placeholder={placeholder} value={value} onChange={onChange}/>
    );
}

export default Input;