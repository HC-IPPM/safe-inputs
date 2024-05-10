import React from 'react';
import type {
  FormikHelpers,
  FieldProps} from 'formik';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { FormControl, FormLabel, Button, Center } from '@chakra-ui/react';

import { Trans } from '@lingui/macro';

interface ExcelUploadFormValues {
  file: File | null;
}

interface ExcelUploadFormProps {
  onSubmit: (file: File) => void;
}

const validationSchema = Yup.object().shape({
  file: Yup.mixed()
    .required('Please select a file')
    .test('fileFormat', 'Invalid file format', (value) => {
      return (
        value &&
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(value.type)
      );
    }),
});

const ExcelUploadForm: React.FC<ExcelUploadFormProps> = ({ onSubmit }) => {
  const initialValues: ExcelUploadFormValues = {
    file: null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(
        values: ExcelUploadFormValues,
        actions: FormikHelpers<ExcelUploadFormValues>,
      ) => {
        onSubmit(values.file!);
        actions.setSubmitting(false);
      }}
    >
      {({ setFieldValue, isSubmitting, errors }) => (
        <Form>
          <FormControl
            isInvalid={!!errors.file}
            isRequired
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <FormLabel>
              <Trans>Choose a spreadsheet to upload</Trans>
            </FormLabel>
            <Center>
              <Field name="file">
                {({ field, form }: FieldProps) => (
                  <input
                    type="file"
                    onChange={(event) => {
                      form.setFieldValue(
                        field.name,
                        event.currentTarget.files![0],
                      );
                    }}
                  />
                )}
              </Field>
            </Center>
            <ErrorMessage name="file" component="div" />
            <Center>
              <Button
                type="submit"
                bgColor="#26374a"
                color="#ffffff"
                mt={4}
                isLoading={isSubmitting}
              >
                <Trans>Upload</Trans>
              </Button>
            </Center>
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default ExcelUploadForm;
