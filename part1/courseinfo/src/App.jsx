const Header = (props) => {
  console.log(props)
  const name = props.course.name
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Part = (props) => {
  console.log(props)                // Check the structure of props in the console
  return (
    <>
      <p>{props.name} {props.exercises}</p>
    </>
  )
}

const Content = (props) => {
  console.log(props)                // Check the structure of props in the console
  const parts = props.course.parts  // Extract the parts array
  return (
    <>
      <Part name={parts[0].name} exercises={parts[0].exercises} />
      <Part name={parts[1].name} exercises={parts[1].exercises} />
      <Part name={parts[2].name} exercises={parts[2].exercises} />
    </>
  )
}

const Total = (props) => {
  console.log(props)               // Check the structure of props in the console
  const parts = props.course.parts // Extract the parts array
  return (
    <>
      <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App