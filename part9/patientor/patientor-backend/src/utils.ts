// import { NewPatientEntry, Gender } from './types';
import { Gender } from './types';
import { z } from 'zod';

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseName = (name: unknown): string => {
//   if (!isString(name)) {
//     throw new Error('Incorrect Name format - should be a string');
//   }
//   return name;
// };

// const parseSsn = (ssn: unknown): string => {
//   if (!isString(ssn)) {
//     throw new Error('Incorrect SSN format - should be a string');
//   }
//   return ssn;
// };

// const parseOccupation = (occupation: unknown): string => {
//   if (!isString(occupation)) {
//     throw new Error('Incorrect Occupation format - should be a string');
//   }
//   return occupation;
// };

// const isDate = (dateOfBirth: string): boolean => {
//   return Boolean(Date.parse(dateOfBirth));
// };

// const parseDateOfBirth = (dateOfBirth: unknown): string => {
//   if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
//       throw new Error('Incorrect date format: ' + dateOfBirth);
//   }
//   return dateOfBirth;
// };

// const isGender = (param: string): param is Gender => {
//   return Object.values(Gender).map(v => v.toString()).includes(param);
// };

// const parseGender = (gender: unknown): Gender => {
//   if (!isString(gender) || !isGender(gender)) {
//       throw new Error('Incorrect gender: ' + gender);
//   }
//   return gender;
// };

// const toNewPatientEntry = (object: unknown): NewPatientEntry => {
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }
//   if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
//     const newEntry: NewPatientEntry = {
//       name: parseName(object.name),
//       dateOfBirth: parseDateOfBirth(object.dateOfBirth),
//       ssn: parseSsn(object.ssn),
//       gender: parseGender(object.gender),
//       occupation: parseOccupation(object.occupation)
//     };
//     return newEntry;
//   }
//   throw new Error('Incorrect data: some fields are missing');
// };

// export default toNewPatientEntry;

const NewEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

export default NewEntrySchema;