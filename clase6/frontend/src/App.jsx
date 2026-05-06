import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { ListaClientes } from './ListaClientes'

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))

  if (!token) {
    return <LoginForm onLoggedIn={setToken} />
  }

  return <ListaClientes token={token} />
}
export default App
