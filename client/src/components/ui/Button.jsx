import React from 'react';

const Button = ({children, onClick, variant = 'primary', style}) => {
  const base = {padding: '0.5rem 1rem', borderRadius: 6, border: 'none'};
  const variants = {
    primary: {background: '#2563eb', color: '#fff'},
    secondary: {background: '#e5e7eb', color: '#111'},
  };

  return (
    <button onClick={onClick} style={{...base, ...(variants[variant] || variants.primary), ...style}}>
      {children}
    </button>
  );
};

export default Button;
