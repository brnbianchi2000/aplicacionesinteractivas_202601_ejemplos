import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const nombre = "Ana";
  const ok = true;
  const items = ["a", "b","c"];

  return (
    <>
      <h1>Hola Mundo</h1>
      {/*<p>Hola {nombre}</p>*/}
      <p>{ok ? "Todo bien" : "Hay un error"}</p>
      <ul>
        {items.map((texto, i) => (
          <li key={i}>{texto}</li>
        ))}
      </ul>
    </>
  )
}

export default App
