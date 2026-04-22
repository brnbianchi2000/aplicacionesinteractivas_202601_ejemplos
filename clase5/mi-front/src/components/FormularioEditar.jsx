import { useState, useEffect } from "react";

export default function FormularioEditar({ persona, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(persona.nombre);
  const [rol, setRol] = useState(persona.rol);

  // Update internal state if person prop changes
  useEffect(() => {
    setNombre(persona.nombre);
    setRol(persona.rol);
  }, [persona]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    onGuardar({ ...persona, nombre: nombre.trim(), rol });
  }

  return (
    <section style={{ 
      marginTop: 20, 
      padding: 15, 
      border: '1px solid #ccc', 
      borderRadius: 8,
      backgroundColor: '#f9f9f9' 
    }}>
      <h3>Editando: {persona.nombre}</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit" style={{ marginRight: 8 }}>Guardar</button>
        <button type="button" onClick={onCancelar}>Cancelar</button>
      </form>
    </section>
  );
}
