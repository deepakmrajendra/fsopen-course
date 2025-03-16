import axios from 'axios';
import { NonSensitiveDiaryEntry, DiaryEntry, NewDiaryEntry } from "../types";
// import { NonSensitiveDiaryEntry, DiaryEntry } from "./types";

import { apiBaseUrl } from "../constants";


// Fetch all diary entries from the backend
const getAllDairies = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(`${apiBaseUrl}/diaries`);
  return data;
};

// Send POST request to create a new diary entry
const createDiary = async (object: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(`${apiBaseUrl}/diaries`, object);
  return data;
};

export default { getAllDairies, createDiary };