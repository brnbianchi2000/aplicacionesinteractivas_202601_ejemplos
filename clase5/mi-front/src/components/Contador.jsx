import { useState } from "react";

export default function Contador() {
  const [n, setN] = useState(0);

  return (
    <div style={{ marginTop: 24 }}>
      <p>Valor: {n}</p>
      <button type="button" onClick={() => setN(n + 1)}>
        +1
      </button>
      <button type="button" onClick={() => setN(0)} style={{ marginLeft: 8 }}>
        Reset
      </button>
    </div>
  );
}
