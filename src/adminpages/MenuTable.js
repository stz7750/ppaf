import React from 'react';
import { useTable, useExpanded } from 'react-table';

const MenuTable = ({ menus, onSelectMenu, onDeleteMenu }) => {
  const data = React.useMemo(() => menus, [menus]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Menu Name',
        accessor: 'menuName',
        Cell: ({ row, value }) => (
          <span
            style={{ paddingLeft: `${row.depth * 2}rem` }}
            onClick={() => row.toggleRowExpanded()}>
            {row.canExpand ? (row.isExpanded ? '▼' : '▶') : ' '} {value}
          </span>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => onSelectMenu(row.original)}>Edit</button>
            <button onClick={() => onDeleteMenu(row.original.menuId)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onSelectMenu, onDeleteMenu],
  );

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
