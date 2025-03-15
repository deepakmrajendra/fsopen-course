import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
// import toNewPatientEntry from '../utils';
import NewEntrySchema from '../utils';

import { z } from 'zod';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry } from "../types";

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitivePatientEntriees());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

// router.post('/', (req, res) => {
//   try{
//     const newPatientEntry = toNewPatientEntry(req.body);
//     const addedEntry = patientService.addPatient(newPatientEntry);
//     res.json(addedEntry);
//   } catch (error: unknown) {
//     let errorMessage = 'Something went wrong.';
//     if (error instanceof Error) {
//       errorMessage += ' Error: ' + error.message;
//     }
//     res.status(400).send(errorMessage);
//   }
// });

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<PatientEntry>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;