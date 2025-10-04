import React from 'react';

const Table = ({columns = [], data = []}) => {
  return (
    <table style={{width: '100%', borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{textAlign: 'left', borderBottom: '1px solid #eee', padding: '0.5rem'}}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key} style={{padding: '0.5rem', borderBottom: '1px solid #fafafa'}}>
                {row[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
