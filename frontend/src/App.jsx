import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { CrearProducto } from './pages/CrearProducto'
import { EditarProducto } from './pages/EditarProducto' // <--- Importar

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear" element={<CrearProducto />} />
        <Route path="/editar/:id" element={<EditarProducto />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App