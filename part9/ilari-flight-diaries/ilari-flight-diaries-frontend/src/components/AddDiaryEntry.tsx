import { useState } from 'react';
import axios from 'axios';
import diaryService from '../services/diaries';
import { NewDiaryEntry, Weather, Visibility } from '../types';

interface AddDiaryEntryProps {
  onDiaryAdded: () => void;
}

const AddDiaryEntry = ({ onDiaryAdded }: AddDiaryEntryProps) => {
  const [date, setDate] = useState('');
  // const [visibility, setVisibility] = useState('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  // const [weather, setWeather] = useState('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const createDiaryEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!date || !weather || !visibility) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    // const newEntry: NewDiaryEntry = {
    //   date: date,
    //   weather: weather as Weather,
    //   visibility: visibility as Visibility,
    //   comment,
    // };

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    try {
      await diaryService.createDiary(newEntry);
      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
      setErrorMessage('');

      // Inform the parent component of the newly created diary
      onDiaryAdded();

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data && typeof error.response.data === 'object') {
          setErrorMessage(JSON.stringify(error.response.data));
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Something went wrong.');
      }
    }
  };

  return (
    <form onSubmit={createDiaryEntry}>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <div>
        <label>date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* <div>
        visibility: 
        <input value={visibility} onChange={(e) => setVisibility(e.target.value)} />
      </div> */}
      <div>
        <label>visibility: </label>
        {Object.values(Visibility).map(vis => (
          <label key={vis}>
            <input
              type="radio"
              name="visibility"
              value={vis}
              checked={visibility === vis}
              onChange={() => setVisibility(vis)}
            />
            {vis}
          </label>
        ))}
      </div>

      {/* <div>
        weather:
        <input value={weather} onChange={(e) => setWeather(e.target.value)} />
      </div> */}
      <div>
        <label>weather: </label>
        {Object.values(Weather).map(wth => (
          <label key={wth}>
            <input
              type="radio"
              name="weather"
              value={wth}
              checked={weather === wth}
              onChange={() => setWeather(wth)}
            />
            {wth}
          </label>
        ))}
      </div>

      <div>
        <label>comment:</label>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>

      <button type="submit">add</button>
      {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>}
    </form>
  );
};

export default AddDiaryEntry;