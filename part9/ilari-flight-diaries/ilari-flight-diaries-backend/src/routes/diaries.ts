import express, { Request, Response, NextFunction } from 'express';
import diaryService from '../services/diaryService';
// import toNewEntrySchema from '../utils';
import NewEntrySchema from '../utils';

import { z } from 'zod';
import { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry } from "../types";

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => { 
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

// router.post('/', newDiaryParser, (req, res) => {
//   try{
//     // const newDiaryEntry = toNewDiaryEntry(req.body);
//     const newDiaryEntry = NewEntrySchema.parse(req.body);
//     const addedEntry = diaryService.addDiary(newDiaryEntry);
//     res.json(addedEntry);
//   } catch (error: unknown) {
//     // let errorMessage = 'Something went wrong.';
//     // if (error instanceof Error) {
//     //   errorMessage += ' Error: ' + error.message;
//     // }
//     // res.status(400).send(errorMessage);
//     if (error instanceof z.ZodError) {
//       res.status(400).send({ error: error.issues });
//     } else {
//       res.status(400).send({ error: 'unknown error' });
//     }
//   }
// });

router.post('/', newDiaryParser, (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
  const addedEntry = diaryService.addDiary(req.body);
  res.json(addedEntry);
});

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));
  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.use(errorMiddleware);

export default router;