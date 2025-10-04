import React from 'react';

const Input = ({value, onChange, placeholder, type = 'text', style}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', ...style}}
  />
);

export default Input;
