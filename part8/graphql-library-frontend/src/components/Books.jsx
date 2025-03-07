import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  if (!props.show) {
    return null
  }

  // State to track the selected genre
  const [selectedGenre, setSelectedGenre] = useState(null)

  // const result = useQuery(ALL_BOOKS)
  const { loading, data, refetch } = useQuery(ALL_BOOKS)

  // if (result.loading) {
  if (loading) {
    return <div>loading...</div>
  }

  // const books = result.data.allBooks
  const books = data?.allBooks || []

  // Extract all unique genres from books
  const allGenres = [...new Set(books.flatMap(book => book.genres))]

  // Filter books based on the selected genre
  // const filteredBooks = selectedGenre
  // ? books.filter(book => book.genres.includes(selectedGenre))
  // : books

  const { loading: loadingfilteredBooks, data: filteredData } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,  // This prevents execution if genre is empty
  })

  if (loadingfilteredBooks) {
    return <div>loading...</div>
  }

  // Use filtered books if available, otherwise show all books
  const filteredBooks = filteredData?.allBooks || books

  return (
    <div>
      <h2>Books in {selectedGenre ? selectedGenre : 'all genres'}</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {allGenres.map((genre) => (
          // <button key={genre} onClick={() => setSelectedGenre(genre)}>
          <button
            key={genre}
            onClick={() => {
              setSelectedGenre(genre)
              refetch() // Refetch books when a genre is selected
            }}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
