import { Input, Tooltip } from '@chakra-ui/react';
import type { ErrorObject } from 'ajv';
import { useEffect, useState } from 'react';

import type { RowError } from 'src/schema/utils.ts';
import { constructErrorMessage } from 'src/schema/utils.ts';

const isErrorCell = (rowError: RowError | undefined, header: string) => {
  if (!rowError || !rowError.errors || rowError.valid) {
    return false;
  }

  const match = rowError.errors.find(
    (error: ErrorObject) =>
      error.instancePath.substring(1) === header ||
      error.params.missingProperty === header,
  );

  return match && constructErrorMessage(match);
};

const TableCell = ({
  getValue,
  row: { index },
  column: { id },
  updateData,
  rowErrors,
}: {
  getValue: () => any;
  row: {
    index: number;
  };
  column: {
    id: string;
  };
  updateData: (rowIndex: number, columnId: string, value: any) => void;
  rowErrors: RowError[];
}): JSX.Element => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const rowError = rowErrors[index];
  const isError = isErrorCell(rowError, id);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => updateData(index, id, value);
  return (
    <Tooltip isDisabled={!isError} label={isError} placement="bottom">
      <Input
        border={isError ? '1px solid red' : 'none'}
        value={value}
        width="auto"
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    </Tooltip>
  );
};

export default TableCell;
