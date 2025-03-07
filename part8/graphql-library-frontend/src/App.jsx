import { useState, useEffect } from "react"
import { useApolloClient } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from "./components/Notify"
import Recommended from "./components/Recommended"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("library-user-token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  // Logout function
  const logout = () => {
    setToken(null)
    localStorage.removeItem("library-user-token")
    client.resetStore()
  }

  // Display error messages
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {page === "authors" && <Authors show={true} />}
      {page === "books" && <Books show={true} />}
      {page === "add" && token && <NewBook show={true} setError={notify}/>}
      {page === "recommend" && token && <Recommended show={true} />}
      {page === "login" && !token && (
        <LoginForm setToken={setToken} setError={notify} />
      )}
    </div>
  )
}

export default App
