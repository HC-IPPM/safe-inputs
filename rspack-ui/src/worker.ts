import { WorkBook } from 'xlsx';

export type SheetData = { sheetName: string; data: any }


interface ParseEventLoadingState {
    state: 'LOADING'
}

interface ParseEventDoneState {
    state: 'DONE'
    filename: string
    workbook: WorkBook
    sheets: SheetData[]
}

export type ParseEvent = { type: 'ParseEvent' } & (
    | ParseEventLoadingState
    | ParseEventDoneState
)