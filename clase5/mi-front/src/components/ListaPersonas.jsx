const personas = [
  { id: 1, nombre: "Ana", rol: "USER" },
  { id: 2, nombre: "Luis", rol: "ADMIN" },
  { id: 3, nombre: "Marta", rol: "USER" },
];

export default function ListaPersonas() {
  return (
    <section>
      <h2>Personas</h2>
      <ul>
        {personas.map((p) => (
          <li key={p.id}>
            {p.nombre} — {p.rol}
          </li>
        ))}
      </ul>
    </section>
  );
}
