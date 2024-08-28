import type { ErrorObject } from 'ajv';
import Ajv from 'ajv';

import schema from './schema.json';

export interface RowError {
  valid: boolean;
  errors: ErrorObject<any>[] | null | undefined;
}

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export const validateData = (data: any[]) => {
  const errors: RowError[] = [];
  data.forEach((row: any) => {
    const valid = validate(row);
    errors.push({ valid, errors: validate.errors });
  });
  return errors;
};

const fieldTypes: string[] = Object.values(schema.properties).map((value) => {
  if (Array.isArray(value.type)) return value.type[0];
  return value.type;
});

export const headers: { header: string; type: string }[] = Object.keys(
  schema.properties,
).map((header, index) => ({
  header,
  type: fieldTypes[index],
}));

export const constructErrorMessage = (error: ErrorObject): string => {
  switch (error.keyword) {
    case 'type':
      return `${error.instancePath} must be of type ${error.params.type}.`;

    case 'enum':
      return `${
        error.instancePath
      } must be one of the following values: ${error.params.allowedValues?.join(
        ', ',
      )}.`;

    case 'required':
      return `${
        error.instancePath || error.params.missingProperty
      } is required.`;

    case 'additionalProperties':
      return `${error.instancePath} does not allow the property '${error.params.additionalProperty}'.`;

    case 'pattern':
      return `${error.instancePath} should match the regular expression: ${error.params.pattern}`;

    case 'const':
      return `${error.instancePath} should be ${error.params.allowedValue} due to other fields`;

    case 'minimum':
      return `${error.instancePath} ${error.message}`;

    default:
      return `${error.instancePath} does not satisfy the schema requirements.`;
  }
};

export interface User {
  email: string;
  created_at?: number;
  second_last_login_at?: number;
  last_login_at?: number;
}

export interface ColumnDef {
  header: string;
  name: string;
  datatype: string;
  conditions: {
    condition_type: string
    parameters: string[]
  }[]
}
export interface Collection  {
  id: string;
  stable_key?: string;
  major_ver: number;
  minor_ver: number;
  is_current_version: boolean;
  created_by: User;
  created_at: number;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  is_locked: boolean;
  owners: User[];
  uploaders: User[];
  column_defs: ColumnDef[];
};
