import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' 
import Swal from 'sweetalert2'

const API_URL = "http://localhost:5000/api/Productos";

export function CrearProducto() {
  const navigate = useNavigate(); 
  
  const categorias = [
    { id: 1, nombre: "Electrónica" },
    { id: 2, nombre: "Hogar" },
    { id: 3, nombre: "Ropa" }
  ];

  const [form, setForm] = useState({
    nombre: "", sku: "", precio: "", stock: "", categoriaId: 1
  });

  const crear = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        categoriaId: parseInt(form.categoriaId)
      });
      Swal.fire({
        title: "Creado CON ÉXITO",
        icon: "success",
      });
      navigate("/"); 
    } catch (error) {

      Swal.fire({
        title: "Error: " + (error.response?.data || error.message),
        icon: "error",
      });
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Nuevo Producto</h4>
            </div>
            <div className="card-body">
              <form onSubmit={crear}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" name="nombre" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">SKU</label>
                  <input className="form-control" name="sku" onChange={handleChange} required />
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label>Precio</label>
                    <input type="number" className="form-control" name="precio" onChange={handleChange} required />
                  </div>
                  <div className="col">
                    <label>Stock</label>
                    <input type="number" className="form-control" name="stock" onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" name="categoriaId" onChange={handleChange}>
                    {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Guardar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}