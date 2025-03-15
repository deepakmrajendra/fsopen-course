import { z } from 'zod';
import NewEntrySchema from './utils';

export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

// export type Gender = "male" | "female" | "other";

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string; // Keeping as string since it's an ISO date
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;

// export type NewPatientEntry = Omit<PatientEntry, 'id'>;
export type NewPatientEntry = z.infer<typeof NewEntrySchema>;