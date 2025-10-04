import React from 'react';

const DataTable = ({columns = [], data = []}) => {
  return (
    <table style={{width: '100%', borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee'}}>
              {c.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-slate-50">
            {columns.map((c) => (
              <td key={c.key} style={{padding: '0.5rem', borderBottom: '1px solid #fafafa'}}>
                {row[c.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
