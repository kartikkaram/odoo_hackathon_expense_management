import React from 'react';

const Select = ({value, onChange, options = []}) => (
  <select value={value} onChange={onChange} style={{padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd'}}>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Select;
