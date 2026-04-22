
export default function BotonEliminar({ id, onEliminar }) {
  return (
    <button 
      onClick={() => onEliminar(id)}
      style={{ 
        marginLeft: '10px', 
        backgroundColor: '#ff4d4d', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        padding: '2px 8px'
      }}
    >
      Borrar
    </button>
  );
}
