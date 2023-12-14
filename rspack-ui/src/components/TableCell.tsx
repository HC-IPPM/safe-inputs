
import React, { useEffect, useState } from "react";
import {Table} from '@tanstack/react-table'

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

const TableCell: React.FC<TableCellProps> = ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
    }
    return (
        <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
        />
    )
}

export default TableCell;