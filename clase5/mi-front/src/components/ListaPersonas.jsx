import BotonEliminar from './BotonEliminar';

export default function ListaPersonas({personas, onEliminar, onEditar}) {
  return (
    <section>
      <h2>Personas</h2>
      <ul>
        {personas.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            {p.nombre} — {p.rol}
            <button 
              onClick={() => onEditar(p)}
              style={{ marginLeft: 10, cursor: 'pointer' }}
            >
              Editar
            </button>
            <BotonEliminar id={p.id} onEliminar={onEliminar} />
          </li>
        ))}
      </ul>
    </section>
  );
}
