import { useState, useEffect } from 'react';
import { NonSensitiveDiaryEntry  } from "./types";
import diaryService from './services/diaries';
import AddDiaryEntry from './components/AddDiaryEntry';
import DiaryListPage from './components/DiaryListPage';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  const refreshDiaryEntries = () => {
    diaryService.getAllDairies().then(data => {
      setDiaries(data);
    });
  };

  useEffect(() => {
    refreshDiaryEntries();
  }, []);

  return (
    <div>
      <h2>Add new entry</h2>
      <AddDiaryEntry onDiaryAdded={refreshDiaryEntries} />
      <DiaryListPage diaries={diaries} />
    </div>
  )
};

export default App;