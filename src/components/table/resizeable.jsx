"use client";

import React from "react";
import { useTable, useResizeColumns, useBlockLayout } from "react-table";
import styled from "styled-components";

import { columns } from "@/assets/data";

// const Styles = styled.div`
//   .table {
//     display: inline-block;
//     border-spacing: 0;
//     .tr {
//       :last-child {
//         .td {
//           border-bottom: 0;
//         }
//       }
//     }
//     .th,
//     .td {
//       margin: 0;
//       padding: 0.5rem;
//       border: 1.5px solid #f2f2f2;
//       :last-child {
//         border-right: 0;
//       }
//     }
//     .th {
//       background-color: #0000000d;
//       border-color: #f2f2f2;
//       text-align: left;
//       font-weight: bold;
//     }
//   }
//   .resizer {
//     display: inline-block;
//     background: #1879ff;
//     width: 1px;
//     height: 100%;
//     position: absolute;
//     right: 0;
//     top: 0;
//     transform: translateX(50%);
//     z-index: 1;
//     ${"" /* prevents from scrolling while dragging on touch devices */}
//     touch-action:none;

//     &.isResizing {
//       background: red;
//     }
//   }
// `;

function ResizableTable({}) {
  const data = React.useMemo(
    () => [
      {
        col1: "Hello World",
        col2: "Hello World",
      },
      {
        col2: "Hello World",
      },
      {
        col3: "Hello World",
      },
      // Add as many data rows as you need
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useBlockLayout,
      useResizeColumns
    );

  return (
    <>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render("Header")}
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? "isResizing" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className="td">
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ResizableTable;
