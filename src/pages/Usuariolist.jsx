import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_USUARIOS = "http://127.0.0.1:8000/equipmentInventory/api/usuarios/";
const API_SEDES = "http://127.0.0.1:8000/equipmentInventory/api/sedes/";
const API_DEPARTAMENTOS = "http://127.0.0.1:8000/equipmentInventory/api/departamentos/";

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", correo: "", empresa_sede: "", departamento: "" });

  useEffect(() => {
    axios.get(API_USUARIOS).then(response => setUsuarios(response.data)).catch(error => console.error("Error al cargar usuarios:", error));
    axios.get(API_SEDES).then(response => setSedes(response.data)).catch(error => console.error("Error al cargar sedes:", error));
    axios.get(API_DEPARTAMENTOS).then(response => setDepartamentos(response.data)).catch(error => console.error("Error al cargar departamentos:", error));
  }, []);

  const handleFiltroChange = (e, setFiltro) => setFiltro(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_USUARIOS, nuevoUsuario)
      .then(() => {
        setMostrarModal(false);
        setNuevoUsuario({ nombre: "", correo: "", empresa_sede: "", departamento: "" });
      })
      .catch(error => console.error("Error al agregar usuario:", error));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Usuarios</h2>
      <div className="row mb-3">
        <div className="col-md-4"><input type="text" className="form-control" placeholder="Filtrar por Nombre" value={filtroNombre} onChange={(e) => handleFiltroChange(e, setFiltroNombre)} /></div>
        <div className="col-md-4"><input type="text" className="form-control" placeholder="Filtrar por Correo" value={filtroCorreo} onChange={(e) => handleFiltroChange(e, setFiltroCorreo)} /></div>
        <div className="col-md-4"><input type="text" className="form-control" placeholder="Filtrar por Empresa" value={filtroEmpresa} onChange={(e) => handleFiltroChange(e, setFiltroEmpresa)} /></div>
      </div>
      <button className="btn btn-primary mb-3" onClick={() => setMostrarModal(true)}>Agregar Usuario</button>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th><th>Correo</th><th>Empresa</th><th>Sede</th><th>Área</th><th>Departamento</th><th>Usuario Dominio</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.filter(u => (filtroNombre ? u.nombre.includes(filtroNombre) : true) && (filtroCorreo ? u.correo.includes(filtroCorreo) : true) && (filtroEmpresa ? u.empresa_nombre.includes(filtroEmpresa) : true))
            .map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.empresa_nombre}</td>
                <td>{usuario.sede_nombre}</td>
                <td>{usuario.area}</td>
                <td>{usuario.departamento_nombre}</td>
                <td>{usuario.username_ad}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {mostrarModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Usuario</h5>
                <button type="button" className="close" onClick={() => setMostrarModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input type="text" className="form-control mb-2" placeholder="Nombre" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} required />
                  <input type="email" className="form-control mb-2" placeholder="Correo" name="correo" value={nuevoUsuario.correo} onChange={handleChange} required />
                  <input type="text" className="form-control mb-2" placeholder="Cargo" name="cargo" value={nuevoUsuario.cargo} onChange={handleChange} required />
                  <input type="text" className="form-control mb-2" placeholder="Usuario de dominio" name="username_ad" value={nuevoUsuario.username_ad} onChange={handleChange} required />
                  <select className="form-control mb-2" name="empresa_sede" value={nuevoUsuario.empresa_sede} onChange={handleChange} required>
                    <option value="">Seleccione una Sede</option>
                    {sedes.map(sede => <option key={sede.id} value={sede.id}>{sede.nombre}</option>)}
                  </select>
                  <select className="form-control mb-2" name="departamento" value={nuevoUsuario.departamento} onChange={handleChange} required>
                    <option value="">Seleccione un Departamento</option>
                    {departamentos.map(dep => <option key={dep.id} value={dep.id}>{dep.nombre}</option>)}
                  </select>
                  <button type="submit" className="btn btn-success mt-3">Guardar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioList;
