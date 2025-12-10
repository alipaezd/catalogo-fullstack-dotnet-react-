import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRef } from 'react' 

const API_URL = "http://localhost:5000/api/Auditoria";

export function Navbar() {
  const fileInputRef = useRef(null); 

  // Función cuando el usuario selecciona un archivo
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    Swal.fire({ title: 'Analizando con Python...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      let timerInterval;
      Swal.fire({
        title: 'Resultado de Analisis Python',
        html: res.data+" <b></b> ",
        timer: 10000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          window.location.reload(); 
        }
      });


    } catch (error) {
      Swal.fire('Error', 'Falló el analisis', 'error');
    }
    
    // Limpiar input para poder subir el mismo archivo de nuevo si se quiere
    e.target.value = null;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">📦 Catálogo App</Link>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
  
            <li className="nav-item me-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                />
                
                <button 
                  className="btn btn-warning text-dark fw-bold" 
                  onClick={() => fileInputRef.current.click()}
                >
                  Auditar CSV
                </button>
            </li>
            {/* -------------------------- */}

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-light text-primary ms-2 px-3 fw-bold" to="/crear">
                + Crear Producto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}