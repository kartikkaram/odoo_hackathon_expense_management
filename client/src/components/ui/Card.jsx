import React from 'react';

const Card = ({children, title}) => (
  <div style={{padding: '1rem', border: '1px solid #eee', borderRadius: 8, background: '#fff'}}>
    {title && <h3 style={{marginTop: 0}}>{title}</h3>}
    {children}
  </div>
);

export default Card;
