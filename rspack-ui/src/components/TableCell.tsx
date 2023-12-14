
import React, { useEffect, useState } from "react";
import { Table } from '@tanstack/react-table'
import { Input, Tooltip } from "@chakra-ui/react";
import { ErrorObject } from 'ajv';
import { RowError, constructErrorMessage } from "../schema/utils";

type TableCellProps = {
    getValue: () => any;
    row: {
        index: number;
    };
    column: {
        id: string;
    };
    table: Table<any>;
};

const isErrorCell = (rowError: RowError | undefined, header: string,) => {
    if (!rowError || !rowError.errors || rowError.valid) {
        return false;
    }

    const match = rowError.errors.find((error: ErrorObject) =>
        (error.instancePath.substring(1) === header)
        || (error.params.missingProperty === header))

    return match && constructErrorMessage(match);
};

const TableCell: React.FC<TableCellProps> = ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)
    const rowError = table.options.meta?.rowErrors[index]
    const isError = isErrorCell(rowError, id);
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
    }
    return (
        <Tooltip isDisabled={!isError} label={isError} placement="bottom">
            <Input
                border={isError ? '1px solid red' : 'none'}
                value={value}
                width="auto"
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
            />
        </Tooltip>
    )
}

export default TableCell;