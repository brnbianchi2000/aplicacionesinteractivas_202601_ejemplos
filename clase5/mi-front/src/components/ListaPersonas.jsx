
export default function ListaPersonas({personas}) {
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
