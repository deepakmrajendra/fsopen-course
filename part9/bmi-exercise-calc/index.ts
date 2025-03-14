import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!');
});

// Ensure query parameters are required
// In order for the below to work, I had to downgrade @types/express from version 5 to version 4 by running the following command npm i -D @types/express@4
// Without downgrading you get the below error -
// The last overload gave the following error.
// Argument of type '(req: Request, res: Response) => express.Response<any, Record<string, any>>' is not assignable to parameter of type 'Application<Record<string, any>>'.
//   Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Response<...>' is missing the following properties from type 
//   'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
// More information is in this stackoverflow chat https://stackoverflow.com/questions/79071082/typescript-error-no-overload-matches-this-call-in-express-route-handler
app.get('/bmi', (req: Request, res: Response) => {

  if (!req.query.height || !req.query.weight){
    return res.status(400).json({ error: "height and weight are required" });
  }
  
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);
  return res.json({ weight, height, bmi });
});

// `/exercises` POST endpoint
app.post('/exercises', (req: Request, res: Response) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const body: any = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((hours) => isNaN(Number(hours))) ||
    isNaN(Number(target))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const result = calculateExercises(daily_exercises.map(Number), Number(target));
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
