import "./App.css"
import React, { useRef, useState } from "react"
import Graph from "./Graph"

function App() {
  const users = useRef()
  const [error, setError] = useState()
  const [output, setOutput] = useState()
  const [loading, setLoading] = useState(false)

  async function handleClick(e) {
    setError()
    setLoading(true)
    e.preventDefault()
    if (!users.current.value) {
      setError("Please enter some value")
      return
    }

    const vals = users.current.value.replace(" ", "").split(",")

    let result = [],
      order = 0

    for (let i = 0; i < vals.length; i++) {
      order++
      let user = vals[i],
        languages = {},
        counter = 0

      await fetch(`https://api.github.com/users/${user}/repos`)
        .then((response) => response.json())
        .then((data) => {
          data.forEach((item) => {
            const count = languages[item.language]
            if (count) {
              languages[item.language] = count + 1
            } else {
              languages[item.language] = 1
              counter++
            }
          })
        })
        .catch((error) => setError(error.message))

      result.push({
        order: order,
        author: user,
        languages: languages,
        count: counter,
      })
    }

    setLoading(false)
    setOutput(result)
  }

  function handleFill(e) {
    e.preventDefault()
    users.current.value =
      "Eudemon,sindresorhus,996icu,kamranahmedse,donnemartin,jwasham,getify,sebastianbergmann,JakeWharton,justjavac"
  }

  function handleSort(e) {
    e.preventDefault()
    let sorted = []
    switch (e.target.value) {
      case "order":
        sorted = [...output].sort((a, b) => a.order - b.order)
        break
      case "name":
        sorted = [...output].sort((a, b) => {
          if (a.author < b.author) return -1
          if (a.author > b.author) return 1
          return 0
        })
        break
      default:
        sorted = [...output].sort((a, b) => b.count - a.count)
        break
    }
    setOutput(sorted)
  }

  return (
    <div className="App-header flex-vertical">
      {error ? <div className="warning">{error}</div> : null}
      <form className="flex-horizontal">
        <textarea
          className="form-textarea border"
          placeholder="Enter list of gihub users, separated by comma (,)"
          cols="30"
          rows="5"
          ref={users}
        ></textarea>
        <div className="flex-vertical">
          <button className="form-button border" onClick={handleFill}>
            Fill it for me
          </button>
          <button
            className="form-button border"
            type="submit"
            onClick={handleClick}
          >
            Analyze
          </button>
        </div>
      </form>

      <div className="options">
        {loading ? (
          <div className="loading">Loading</div>
        ) : output ? (
          <>
            <label for="sort">Sort By:</label>
            <select id="sort" onChange={handleSort}>
              <option value="order">Order</option>
              <option value="name">Name</option>
              <option value="language">Languages</option>
            </select>
          </>
        ) : null}
      </div>

      <div className="graph flex-horizontal">
        {output
          ? output.map((item) => {
              return (
                <div key={item.order} className="flex-vertical">
                  <div>{item.author}</div>
                  <Graph chart={item.languages} />
                </div>
              )
            })
          : null}{" "}
      </div>
    </div>
  )
}

export default App
