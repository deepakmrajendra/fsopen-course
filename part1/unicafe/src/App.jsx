import { useState } from 'react'

const Header = ({text}) => <><h1>{text}</h1></>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Display = ({text, metric}) => {
  // console.log(text, metric)
  return <p>{text} {metric}</p>
}

const Statistics = (props) => {

  const { good, neutral, bad } = props.states;

  // console.log("good", good)
  // console.log("neutral", neutral)
  // console.log("bad", bad)

  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>
  }

  // Calculate stats dynamically based on current state
  const total = good + neutral + bad
  const average = ((good * 1) + (neutral * 0) + (bad * -1)) / (good + neutral + bad)
  const positive = (good / (good + neutral + bad)) * 100

  // console.log(total, average, positive)

  const stats = [
    { name: 'good', metric: good },
    { name: 'neutral', metric: neutral },
    { name: 'bad', metric: bad },
    { name: 'all', metric: total },
    { name: 'average', metric: average },
    { name: 'positive', metric: positive + ' %'},
  ]

  // console.log(stats)

  return (
    <>
      <Display text={stats[0].name} metric={stats[0].metric} />
      <Display text={stats[1].name} metric={stats[1].metric} />
      <Display text={stats[2].name} metric={stats[2].metric} />
      <Display text={stats[3].name} metric={stats[3].metric} />
      <Display text={stats[4].name} metric={stats[4].metric} />
      <Display text={stats[5].name} metric={stats[5].metric} />
    </>
  )

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const states = {good, neutral, bad}

  // console.log(states)

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics states = {states} />
    </div> 
  )
}

export default App