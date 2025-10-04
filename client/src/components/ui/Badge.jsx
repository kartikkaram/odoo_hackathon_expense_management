import React from 'react';

const Badge = ({children, color = 'gray'}) => (
  <span style={{background: color, color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 6}}>
    {children}
  </span>
);

export default Badge;
