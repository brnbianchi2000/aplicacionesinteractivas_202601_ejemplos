import { useState } from "react";

export default function EcoInput() {
  // const [texto, setTexto] = useState("");
  // Es equivalente a
  const par = useState("");
  const texto = par[0];
  const setTexto = par[1];

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Escribí algo</h2>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe aquí..."
        style={{ padding: 8, width: "100%", maxWidth: 320 }}
      />
      <p style={{ marginTop: 8 }}>
        <strong>Texto:</strong> {texto || "(vacío)"}
      </p>
    </section>
  );
}
