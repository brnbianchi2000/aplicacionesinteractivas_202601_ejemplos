import { useState } from "react";

export default function FormularioPersona({ onAgregar, siguienteId }) {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("USER");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    onAgregar({ id: siguienteId, nombre: nombre.trim(), rol });
    setNombre("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button type="submit">Agregar</button>
    </form>
  );
}
