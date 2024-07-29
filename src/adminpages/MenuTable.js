import React, { useMemo } from 'react';
import { useTable, useExpanded } from 'react-table';

const MenuTable = ({ menus, onSelectMenu, onDeleteMenu }) => {
  const data = useMemo(() => menus, [menus]);

  const columns = [
    {
      Header: 'Menu Name',
      accessor: 'menuName',
      Cell: ({ row, value }) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? '👇' : '👉'} {value}
        </span>
      ),
    },
    { Header: 'Menu Path', accessor: 'menuPath' },
    { Header: 'Path', accessor: 'path' },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      { columns, data },
      useExpanded, // Use the useExpanded plugin hook
    );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MenuTable;
