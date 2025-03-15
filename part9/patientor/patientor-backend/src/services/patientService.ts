import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry } from '../types';

const getPatientEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSensitivePatientEntriees = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
  }));
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
    getPatientEntries,
    getNonSensitivePatientEntriees,
    addPatient
};