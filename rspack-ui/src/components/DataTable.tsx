import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import {
    Tr,
    Th,
    Td,
    Tbody,
    Thead,
    Table,
    TableContainer,
    Button,
    Box
} from "@chakra-ui/react";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    RowData
} from '@tanstack/react-table'

import { Pagination } from "@dts-stn/service-canada-design-system";
import TableCell from "./TableCell.tsx";
import { RowError, validateData } from "../schema/utils.ts";

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

    useEffect(() => {
        setRowErrors(validateData(data))
    }, [data])

    const updateData = (rowIndex: number, columnId: string, value: any) => {
        setData(old => old.map((row, index) => {
            if (index === rowIndex) {
                const oldValue = old[rowIndex][columnId];
                if(typeof oldValue === 'number') {
                    value = parseInt(value)
                }
                return {
                    ...old[rowIndex]!,
                    [columnId]: value,
                }
            }
            return row;
        }));
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        meta: {
            updateData,
            rowErrors
        },
        defaultColumn: {
            cell: TableCell,
        }
    });

    const VERIFY_JSON_FORMAT_MUTATION = gql`
        mutation verifyJsonFormat($testSheet: JSON!) {
            verifyJsonFormat(sheetData: $testSheet)
        }
    `;

    const [publishData, { loading, error, data: resultData }] = useMutation(VERIFY_JSON_FORMAT_MUTATION);

    const handleButtonClick = async () => {
        publishData({ variables: { testSheet: data } });
    };

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
            <Box as="br" />
            <Box as="br" />
            <Button
                bg="#26374a"
                color="#FFFFFF"
                _hover={{ bg: '#0000DD' }}
                onClick={handleButtonClick}
            >
                {rowErrors.some(error => !error.valid) ? "Upload Data With Errors" : "Upload Data"}
            </Button>
            <Box as="br" />
            <Box as="br" />
            {loading && <pre>Publishing Data....</pre>}
            {resultData && <pre style={{maxHeight: "20rem", overflowY: "scroll"}}>{JSON.stringify(resultData, null, 2)}</pre>}
            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
        </>
    )
}

export default DataTable;
