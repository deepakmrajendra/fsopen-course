interface HeaderProps {
  courseName: string;
}

const Header = ({ courseName }: HeaderProps) => (
  <h1>{courseName}</h1>
);

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseDesc extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBaseDesc {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBaseDesc {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartBaseDesc {
  requirements: string[];
  kind: "special";
}

// Union type for all course parts
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface PartProps {
  coursePart: CoursePart;
}

// Exhaustive switch-case based component
const Part = ({ coursePart }: PartProps) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong>
          <div><em>{coursePart.description}</em></div>
        </>
      );
    case "group":
      return (
        <>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong>
          <div>project exercises {coursePart.groupProjectCount}</div>
        </>
      );
    case "background":
      return (
        <>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong>
          <div><em>{coursePart.description}</em></div>
          <div>submit to {coursePart.backgroundMaterial}</div>
        </>
      );
    case "special":
      return (
        <>
          <b>{coursePart.name} {coursePart.exerciseCount}</b>
          <div><i>{coursePart.description}</i></div>
          <div>required skills: {coursePart.requirements.join(', ')}</div>
        </>
    );
    default:
      return assertNever(coursePart);
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => (
  <div>
    {courseParts.map((part, index) => (
      <div key={index} style={{ marginBottom: "1em" }}>
        <Part coursePart={part} />
      </div>
    ))}
  </div>
);

const Total = ({ courseParts }: ContentProps) => {
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return <p>Number of exercises {totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      kind: "basic"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://fake-exercise-submit.made-up-url.dev",
      kind: "background"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );

};

export default App;