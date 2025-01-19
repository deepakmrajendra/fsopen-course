import { useState } from 'react'

const Header = ({text}) => <><h1>{text}</h1></>

const Display = ({ text, votes }) => {
  return (
    <div>
      <p>{text}</p>
      {votes !== undefined && <p>Votes: {votes}</p>}
    </div>
  );
};

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(8).fill(0))

  const setRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const incrementVote = () => {
    const updatedVotes = [...votes]
    updatedVotes[selected] += 1 // Increment the vote for the currently selected anecdote
    setVotes(updatedVotes)
  }

  const highestVoteIndex = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Display text={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={incrementVote} text="vote" />
      <Button onClick={setRandomAnecdote} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      <Display text={anecdotes[highestVoteIndex]} votes={votes[highestVoteIndex]} />
    </div>
  )
}

export default App