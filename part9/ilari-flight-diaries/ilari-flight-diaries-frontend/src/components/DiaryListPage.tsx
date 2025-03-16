import { NonSensitiveDiaryEntry } from '../types';

interface DiaryListPageProps {
  diaries: NonSensitiveDiaryEntry[];
}

const DiaryListPage = ({ diaries }: DiaryListPageProps) => {
  return (
    <div>
      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id} style={{ marginBottom: '1rem' }}>
          <strong>{diary.date}</strong><br />
          visibility: {diary.visibility}<br />
          weather: {diary.weather}
        </div>
      ))}
    </div>
  );
};

export default DiaryListPage;