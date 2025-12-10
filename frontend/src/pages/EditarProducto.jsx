import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom' // useParams sirve para leer el ID de la URL
import Swal from 'sweetalert2'

const API_URL = "http://localhost:5000/api/Productos";

export function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el ID de la URL (/editar/:id)

  const [categorias] = useState([
    { id: 1, nombre: "Electrónica" },
    { id: 2, nombre: "Hogar" },
    { id: 3, nombre: "Ropa" }
  ]);

  const [form, setForm] = useState({
    id: 0, nombre: "", sku: "", precio: "", stock: "", categoriaId: 1
  });

  // 1. CARGAR DATOS EXISTENTES (Al entrar a la página)
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        // Rellenamos el formulario con los datos que vinieron de la BD
        setForm({
            id: res.data.id,
            nombre: res.data.nombre,
            sku: res.data.sku,
            precio: res.data.precio,
            stock: res.data.stock,
            categoriaId: res.data.categoriaId
        });
      } catch (error) {

      Swal.fire({
        title: "Error al cargar producto",
        icon: "error",
      });
        navigate("/");
      }
    };
    cargarProducto();
  }, [id, navigate]);

  // 2. ENVIAR CAMBIOS (PUT)
  const editar = async (e) => {
    e.preventDefault();
    try {
      // Nota: En el PUT enviamos el ID en la URL y el objeto en el cuerpo
      await axios.put(`${API_URL}/${id}`, {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        categoriaId: parseInt(form.categoriaId)
      });
      Swal.fire({
        title: "Actualizado CON eXITO",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error: " + (error.response?.data || error.message),
        icon: "error",
      });    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-warning text-dark">
              <h4 className="mb-0 fw-bold">✏️ Editar Producto #{id}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={editar}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">SKU</label>
                  <input className="form-control" name="sku" value={form.sku} onChange={handleChange} required />
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Precio</label>
                    <input type="number" className="form-control" name="precio" value={form.precio} onChange={handleChange} required />
                  </div>
                  <div className="col">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" name="stock" value={form.stock} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                    {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Actualizar Cambios</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}