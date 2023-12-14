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
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    schema_cases!: Table<SchemaCases>;
  
    constructor() {
      super('cases');
      this.version(1).stores({
        schema_cases: '&RegisterCaseNumber'
        // , Gender, PostalCode, DiagnosisDate, ICDOption, ICD9, ICD10, ChestXRay, IfAbnormal, CaseCriteria, Initial_Resistance, GenotypingResults, GenotypingSpoligotyping, MIRU, PreviousTreatmentCompleted, HIVStatus, Date_Of_HIV_Test, TravelTBCountry, HowLong, patientDiedBeforeDuring, DidPatientDie, DateOfDeath, CauseOfDeath, FirstEpisodeOfTB, PreviousDiagnosisYear'
      });
    }
  }
  
  export const db = new CasesDBModel();