import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import IDEPage from "./pages/IDEPage/IDEPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IDEPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
