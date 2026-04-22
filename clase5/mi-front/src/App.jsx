import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Saludo from './components/Saludo'
import ListaPersonas from './components/ListaPersonas'

function App() {
  //const nombre = "Ana";
  //const ok = true;
  //const items = ["a", "b","c"];
  const nombre = "Maria"
  return (
    <>
      <ListaPersonas />
      {/* 
      <Saludo nombre={nombre} />
      <Saludo nombre="Carlos" />
      <Saludo nombre="Raul" />
      <h1>Titulo</h1>
      <h1>Titulo</h1>
      <p>Hola {nombre}</p>
      <p>{ok ? "Todo bien" : "Hay un error"}</p>
      <ul>
        {items.map((texto, i) => (
          <li key={i}>{texto}</li>
        ))}
      </ul>
      <div style={{ padding: 16, backgroundColor: "#f0f0f0" }}>Contenido</div>
      */}

    </>
  )
}

export default App
