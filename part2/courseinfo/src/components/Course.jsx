const Header = (props) => {
    console.log('Inside Header component', props)
    const name = props.course.name
    return <h2>{name}</h2>
}
  

const Part = ({name, exercises}) => {
    console.log('Inside Part component', name)
    console.log('Inside Part component', exercises)
    return <p>{name} {exercises}</p>
}
  

const Content = (props) => {
    console.log('Inside Content component', props)
    const parts = props.course.parts                                      // Extract the parts array
    return (
        <>
        {parts.map(part => 
        <Part key= {part.id} name={part.name} exercises={part.exercises} />
        )}
        </>
    )
}
  

const Total = (props) => {
    console.log(props)
    const parts = props.course.parts                                      // Extract the parts array
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return <p><strong>total of {total} exercises</strong></p>
}
  
const Course = ({course}) => {
    console.log('Inside Course component', course)
    return (
        <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
        </div>
    )
}

export default Course