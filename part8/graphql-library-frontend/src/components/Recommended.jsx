import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommended = ({ show }) => {
  if (!show) {
    return null
  }

  // Fetch logged-in user details
  const { loading: loadingMe, data: dataMe } = useQuery(ME)

  // Always call the second query, but handle the loading and missing data in rendering
  const favoriteGenre = dataMe?.me?.favoriteGenre || ""

  const { loading: loadingBooks, data: dataBooks } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,  // This prevents execution if genre is empty
  })

  if (loadingMe || loadingBooks) {
    return <div>loading...</div>
  }

  if (!favoriteGenre) {
    return <div>No favorite genre found.</div>
  }

  const books = dataBooks?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended