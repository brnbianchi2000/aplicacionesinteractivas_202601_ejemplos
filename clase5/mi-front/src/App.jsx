import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Saludo from './components/Saludo'
import ListaPersonas from './components/ListaPersonas'
import EcoInput from './components/EcoInput'
import Contador from './components/Contador'
import FormularioPersona from './components/FormularioPersona'

const inicial = [
  { id: 1, nombre: "Ana", rol: "USER" },
  { id: 2, nombre: "Luis", rol: "ADMIN" },
  ];

function App() {
  //const nombre = "Ana";
  //const ok = true;
  //const items = ["a", "b","c"];
  //const nombre = "Maria"
  const [personas, setPersonas] = useState(inicial);

  function agregarPersona(nueva) {
    setPersonas((prev) => [...prev, nueva]);
  }

  const siguienteId =
    personas.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  return (
    <>
      <ListaPersonas personas={personas} />
      <FormularioPersona onAgregar={agregarPersona} siguienteId={siguienteId} />

      {/* 
      <Contador />
      <EcoInput />
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
