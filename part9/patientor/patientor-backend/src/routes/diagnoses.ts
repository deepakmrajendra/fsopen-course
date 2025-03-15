import express, { Response } from 'express';
import diagnosisService from '../services/diagnosisService';
import { DiagnosisEntry } from "../types";

const router = express.Router();

router.get('/', (_req, res: Response<DiagnosisEntry[]>) => {
  res.send(diagnosisService.getDiagnosisEntries());
});

export default router;