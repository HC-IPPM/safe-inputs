
import React, { ReactNode, useRef, useState } from "react";

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    Button,
    Icon,
    Center,
} from "@chakra-ui/react";

import { Trans } from "@lingui/macro";

import { useForm, UseFormRegisterReturn } from 'react-hook-form'

import { FcDataSheet } from 'react-icons/fc';

import { ParseEvent } from "../worker";

type FileUploadProps = {
    register: UseFormRegisterReturn
    accept?: string
    multiple?: boolean
    children?: ReactNode
}

const FileUpload = (props: FileUploadProps) => {
    const { register, accept, multiple, children } = props
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { ref, ...rest } = register as { ref: (instance: HTMLInputElement | null) => void }

    const handleClick = () => inputRef.current?.click()

    return (
        <InputGroup onClick={handleClick}>
            <input
                type={'file'}
                multiple={multiple || false}
                hidden
                accept={accept}
                {...rest}
                ref={(e) => {
                    ref(e)
                    inputRef.current = e
                }}
            />
            <>
                {children}
            </>
        </InputGroup>
    )
}


type FormValues = {
    file_: FileList
}

export default function InputForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

    const onSubmit = handleSubmit((data) => console.log('On Submit: ', data))

    const validateFiles = (value: FileList) => {
        if (value.length < 1) {
            return 'Files is required'
        }
        for (const file of Array.from(value)) {
            const fsMb = file.size / (1024 * 1024)
            const MAX_FILE_SIZE = 10
            if (fsMb > MAX_FILE_SIZE) {
                return 'Max file size 10mb'
            }
        }
        return true
    }

    return (
        <form onSubmit={onSubmit}>
            <FormControl
                isInvalid={!!errors.file_}
                isRequired
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}
            >
                <FormLabel>
                    <Trans>
                        Choose a spreadsheet to upload
                    </Trans>
                </FormLabel>
                <Center>
                    <FileUpload
                        accept="
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
application/vnd.ms-excel,
.xlsb,
.ods
"
                        multiple
                        register={register('file_', { validate: validateFiles })}
                    >
                        <Button
                            leftIcon={<Icon as={FcDataSheet} />}
                            style={{
                                backgroundColor: '#26374a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                            }}
                        >
                            <Trans>
                                Upload
                            </Trans>
                        </Button>
                    </FileUpload>
                    <FormErrorMessage>
                        {errors.file_ && errors?.file_.message}
                    </FormErrorMessage>
                </Center>
                <Center>
                    <button
                        style={{
                            backgroundColor: '#26374a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                        }}
                        onSubmit={onSubmit}
                    >
                        <Trans>
                            Submit
                        </Trans>
                    </button>

                </Center>
            </FormControl >
        </form>
    )
}