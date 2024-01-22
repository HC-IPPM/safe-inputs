import Dexie, { Table } from 'dexie';

export interface SchemaCases {
    RegisterCaseNumber: number;
    Gender: string;
    PostalCode: string;
    DiagnosisDate: string;
    ICDOption: string;
    ICD9: string;
    ICD10: string;
    ChestXRay: string;
    IfAbnormal: string;
    CaseCriteria: string;
    Initial_Resistance: string;
    GenotypingResults: string | null;
    GenotypingSpoligotyping: string;
    MIRU: string;
    PreviousTreatmentCompleted: string | null;
    HIVStatus: string;
    Date_Of_HIV_Test: string;
    TravelTBCountry: string;
    HowLong?: number | null;
    patientDiedBeforeDuring: string;
    DidPatientDie: string | null;
    DateOfDeath: string;
    CauseOfDeath: string;
    FirstEpisodeOfTB: number;
    PreviousDiagnosisYear?: number | null;
  }
  

  export class CasesDBModel extends Dexie {
    cases!: Table<SchemaCases>;
  
    constructor() {
      super('tb');
      this.version(1).stores({
        cases: '&RegisterCaseNumber'
        // , Gender, PostalCode, DiagnosisDate, ICDOption, ICD9, ICD10, ChestXRay, IfAbnormal, CaseCriteria, Initial_Resistance, GenotypingResults, GenotypingSpoligotyping, MIRU, PreviousTreatmentCompleted, HIVStatus, Date_Of_HIV_Test, TravelTBCountry, HowLong, patientDiedBeforeDuring, DidPatientDie, DateOfDeath, CauseOfDeath, FirstEpisodeOfTB, PreviousDiagnosisYear'
      });
    }
  }
  
  export const db = new CasesDBModel();
// // import Dexie, { Table } from 'dexie';

// // export interface SchemaCases {
// //     RegisterCaseNumber: number;
// //     Gender: string;
// //     PostalCode: string;
// //     DiagnosisDate: string;
// //     ICDOption: string;
// //     ICD9: string;
// //     ICD10: string;
// //     ChestXRay: string;
// //     IfAbnormal: string;
// //     CaseCriteria: string;
// //     Initial_Resistance: string;
// //     GenotypingResults: string | null;
// //     GenotypingSpoligotyping: string;
// //     MIRU: string;
// //     PreviousTreatmentCompleted: string | null;
// //     HIVStatus: string;
// //     Date_Of_HIV_Test: string;
// //     TravelTBCountry: string;
// //     HowLong?: number | null;
// //     patientDiedBeforeDuring: string;
// //     DidPatientDie: string | null;
// //     DateOfDeath: string;
// //     CauseOfDeath: string;
// //     FirstEpisodeOfTB: number;
// //     PreviousDiagnosisYear?: number | null;
// //   }
  
// import Dexie from 'dexie';

// // Create a new Dexie database instance


// export const db = new Dexie('cases');

// // Define a function to dynamically create a table
// export const createTable = async (tables: string[]) => {
//   console.log(tables);
//   const schema = tables.reduce((accumulatedSchema: any, tableName: string) => {
//     accumulatedSchema[tableName] = '&RegisterCaseNumber';
//     return accumulatedSchema;
//   }, {})
//   await db.version(1).stores(schema);
//   console.log(db._allTables);
// };

// export const writeBulk = async (tableName: string, data: any) => {
//   console.log(db);
//   await db.table(tableName).bulkPut(data);
// }

// export const writeData = async (tableName: string, data: any) => {
//   await db.table(tableName).put(data);
// }

// export const getAllData = async () => {
//   const tables: string[] = Object.keys(db._allTables);
//   console.log(db._allTables);
//   const sheetData = await Promise.all(
//       tables.map(async (tableName) => {
//         const data = await db.table(tableName).toArray();
//         console.log(tableName)
//         return { sheetName: tableName, data };
//       })
//     );
//   return sheetData
// }

// import Dexie from 'dexie';

// class CasesDatabase extends Dexie {
//   schema: string[] = [];
//   constructor(databaseName: string) {
//     super(databaseName);
//     // Define the initial schema (version 1)
//     this.version(1).stores({
//       // Your initial table(s) and schema
//     });
//   }

//   // Example method to dynamically create a table
//   async createTable(tables: string[]) {
//     console.log(tables);

//     // Dynamically create schema based on input tables
//     const schema = tables.reduce((accumulatedSchema: any, tableName: string) => {
//       accumulatedSchema[tableName] = '&RegisterCaseNumber';
//       return accumulatedSchema;
//     }, {});

//     // Upgrade to version 2 and create tables dynamically
//     await this.version(2).stores(schema);

//     console.log(this._allTables);
//     return this;
//   }

//   async getAllData() {
//     const tables: string[] = Object.keys(this._allTables);
//   console.log(this._allTables);
//   const sheetData = await Promise.all(
//       tables.map(async (tableName) => {
//         const data = await this.table(tableName).toArray();
//         console.log(tableName)
//         return { sheetName: tableName, data };
//       })
//     );
//   return sheetData
//   }

//   writeBulk = async (tableName: string, data: any) => {
//     console.log(db);
//     await db.table(tableName).bulkPut(data);
//   }
  
//   writeData = async (tableName: string, data: any) => {
//     await db.table(tableName).put(data);
//   }

// }

// Create an instance of CasesDatabase
// export const db = new CasesDatabase('cases');
