import { isNotNumber } from "./utils/validationUtils";

interface ExerciseInputs {
  targetExerciseHours: number;
  dailyExerciseHours: number[];
}

const parseArguments = (args: string[]): ExerciseInputs => {
  if (args.length < 2 || args.some(isNotNumber)) {
    throw new Error('Wrong command line arguments. Usage: npm run calculateExercises <target> <exercise hours...>');
  } else {
    return {
      targetExerciseHours: Number(args[0]),
      dailyExerciseHours: args.slice(1).map(Number)
    };
  }
};

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
  
const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  const periodLength = dailyHours.length; // Total days
  const trainingDays = dailyHours.filter(hours => hours > 0).length; // Days with exercise
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0); // Sum of all hours
  const average = totalHours / periodLength; // Calculate average hours
  const success = average >= target; // Whether the target was reached

  // Determine rating based on how close the average is to the target
  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "Great job! You've met or exceeded the target.";
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = "Not too bad but could be better.";
  } else {
    rating = 1;
    ratingDescription = "You need to exercise more!";
  }

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};
  
// // Call the function with hard-coded values and print the result
// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));

// Only parse command-line arguments if the file is run directly
if (require.main === module) {
  try {
    const { targetExerciseHours, dailyExerciseHours } = parseArguments(process.argv.slice(2));
    console.log(calculateExercises(dailyExerciseHours, targetExerciseHours));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export { calculateExercises };