// import { NewDiaryEntry, Weather, Visibility } from './types';
import { Weather, Visibility } from './types';
import { z } from 'zod';

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseComment = (comment: unknown): string => {
//   if (!isString(comment)) {
//     throw new Error('Incorrect or missing comment');
//   }
//   return comment;
// };

// const parseComment = (comment: unknown): string => {
//   return z.string().parse(comment);
// };

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };

// const parseDate = (date: unknown): string => {
//   if (!isString(date) || !isDate(date)) {
//       throw new Error('Incorrect or missing date: ' + date);
//   }
//   return date;
// };

// // const isWeather = (str: string): str is Weather => {
// //   return ['sunny', 'rainy', 'cloudy', 'stormy'].includes(str);
// // };

// const isWeather = (param: string): param is Weather => {
//   return Object.values(Weather).map(v => v.toString()).includes(param);
// };

// const parseWeather = (weather: unknown): Weather => {
//   if (!isString(weather) || !isWeather(weather)) {
//       throw new Error('Incorrect or missing weather: ' + weather);
//   }
//   return weather;
// };

// const isVisibility = (param: string): param is Visibility => {
//   return Object.values(Visibility).map(v => v.toString()).includes(param);
// };

// const parseVisibility = (visibility: unknown): Visibility => {
//   if (!isString(visibility) || !isVisibility(visibility)) {
//       throw new Error('Incorrect or missing visibility: ' + visibility);
//   }
//   return visibility;
// };

const NewEntrySchema = z.object({
  weather: z.nativeEnum(Weather),
  visibility: z.nativeEnum(Visibility),
  date: z.string().date(),
  comment: z.string().optional()
});

// const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }
//   if ('comment' in object && 'date' in object && 'weather' in object && 'visibility' in object) {
//     const newEntry: NewDiaryEntry = {
//       // comment: parseComment(object.comment),
//       // comment: z.string().parse(object.comment),
//       comment: z.string().optional().parse(object.comment),
//       // date: parseDate(object.date),
//       date: z.string().date().parse(object.date),
//       // weather: parseWeather(object.weather),
//       weather: z.nativeEnum(Weather).parse(object.weather),
//       // visibility: parseVisibility(object.visibility)
//       visibility: z.nativeEnum(Visibility).parse(object.visibility)
//     };
//     return newEntry;
//   }
//   throw new Error('Incorrect data: some fields are missing');
// };

// export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
//   return newEntrySchema.parse(object);
// };

export default NewEntrySchema;