import React, { useEffect, useRef, useState } from "react";

import {
    Tr,
    Th,
    Td,
    Tbody,
    Thead,
    Table,
    TableContainer
} from "@chakra-ui/react";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    RowData
} from '@tanstack/react-table'

import { Pagination } from "@dts-stn/service-canada-design-system";
import TableCell from "./TableCell";
import { RowError, validateData } from "../schema/utils";
import { db } from '../schema/model';

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
        rowErrors: RowError[]
    }
}

interface DataTableProps {
    initialData: any[];
}

const DataTable: React.FC<DataTableProps> = ({ initialData }) => {
    const columns: any[] = Object.keys(initialData[0]).map((header) => ({
        id: header,
        accessorFn: (row: any) => row[header],
    }));
    const [data, setData] = useState(initialData);
    const [rowErrors, setRowErrors] = useState<RowError[]>([]);
    const isInitialRender = useRef(true);

    useEffect(() => {
        setRowErrors(validateData(data))
        if(isInitialRender) {
            db.cases.bulkPut(data);
            isInitialRender.current = false;
        }
    }, [data])

    const updateData = (rowIndex: number, columnId: string, value: any) => {
        setData(old => old.map((row, index) => {
            if (index === rowIndex) {
                const newRow = {
                    ...old[rowIndex]!,
                    [columnId]: value,
                };
                    db.cases.put(newRow);
                    return newRow;
            }
            return row;
        }));
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            updateData,
            rowErrors
        },
        defaultColumn: {
            cell: TableCell,
        }
    });

    return (
        <>
            <TableContainer>
                <Table>
                    <Thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <Th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (<Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>)
                                })}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Pagination
                className="pagination-bar"
                currentPage={table.getState().pagination.pageIndex + 1}
                totalCount={table.getCoreRowModel().rows.length}
                pageSize={10}
                onPageChange={(page: number) => table.setPageIndex(page - 1)}
                browser
            />
        </>
    )
}

export default DataTable;
