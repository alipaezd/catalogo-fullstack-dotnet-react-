import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
// 1. IMPORTAR EL ICONO DE BASURA
import { FaEdit, FaTrash } from 'react-icons/fa' 
import Swal from 'sweetalert2'
const API_URL = "http://localhost:5000/api/Productos";

export function Home() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerProductos = async () => {
    try {
      const url = busqueda ? `${API_URL}?buscar=${busqueda}` : API_URL;
      const res = await axios.get(url);
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { obtenerProductos(); }, [busqueda]);

  // 2. LÓGICA DE ELIMINAR 
  const eliminarProducto = async (id) => {
    // Confirmación de SweetAlert2
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgba(235, 83, 83, 1)', 
        cancelButtonColor: '#56aaf8bd',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
        });
  if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido borrado.',
          'success'
        );
        
        obtenerProductos(); 
      } catch (error) {
        Swal.fire(
          'Error',
          'No se pudo eliminar el producto.',
          'error'
        );
      }
    }
    };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Listado de Productos</h2>
      
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control shadow-sm" 
            placeholder="🔍 Buscar..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id}>
                  <td className="fw-bold">{prod.sku}</td>
                  <td>{prod.nombre}</td>
                  <td className="text-success fw-bold">${prod.precio}</td>
                  <td>
                    <span className={`badge ${prod.stock > 5 ? 'bg-secondary' : 'bg-danger'}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {prod.categoria?.nombre || "N/A"}
                    </span>
                  </td>
                  
                  <td className="text-center">
                    <Link to={`/editar/${prod.id}`} className="btn btn-warning btn-sm text-dark me-2">
                      <FaEdit />
                    </Link>

                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarProducto(prod.id)} // Pasamos el ID
                    >
                      <FaTrash />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}