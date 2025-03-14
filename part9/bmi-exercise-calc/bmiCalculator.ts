interface BmiInputs {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiInputs => {
  if (args.length !== 4 || isNaN(Number(args[2])) || isNaN(Number(args[3]))) {
    throw new Error('Wrong command line arguments. Usage: npm run calculateBmi <height in cm> <weight in kg>');
  } else {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  }
};

const calculateBmi = (heightCm: number, weightKg: number): string => {
  const heightM = heightCm / 100;               // Convert height from cm to meters
  const bmi = weightKg / (heightM * heightM);   // BMI formula

  // Determine the BMI category
  if (bmi < 18.5) return "Underweight";
  else if (bmi >= 18.5 && bmi <= 24.9) return "Normal range";
  else if (bmi >= 25 && bmi <= 29.9) return "Overweight";
  else return "Obese";
};

// // Call the function with hard-coded parameters and print the result
// console.log(calculateBmi(180, 74)); // Expected output: "Normal range"

// Only parse command-line arguments if the file is run directly
if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

// Export function so it can be imported in other modules (e.g., `index.ts`)
export { calculateBmi };