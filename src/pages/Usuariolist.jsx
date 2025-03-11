import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { VITE_API_URL } from "../configenv";

const API_USUARIOS = `${VITE_API_URL}/equipmentInventory/api/usuarios/`;
const API_SEDES = `${VITE_API_URL}/equipmentInventory/api/empresa-sedes/`;
const API_DEPARTAMENTOS = `${VITE_API_URL}/equipmentInventory/api/departamentos/`;
const API_CARGA_MASIVA = `${VITE_API_URL}/equipmentInventory/api/usuarios/carga_masiva_usuarios/`;

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    
    nombre: "",
    correo: "",
    empresa_sede: "",
    departamento: "",
  });

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

  

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleCargaMasiva = () => {
    if (!archivo) {
      alert("Por favor, selecciona un archivo Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);

    axios.post(API_CARGA_MASIVA, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(response => {
        alert(response.data.mensaje);
        setMostrarModalCarga(false);
        setArchivo(null);
        axios.get(API_USUARIOS).then(res => setUsuarios(res.data));
      })
      .catch(error => console.error("Error en la carga masiva:", error));
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEditar(true);
  };

  const handleActualizarUsuario = (e) => {
    e.preventDefault();
    axios.patch(`${API_USUARIOS}${usuarioSeleccionado.id}/`, usuarioSeleccionado)
      .then(() => {
        setMostrarModalEditar(false);
        setUsuarioSeleccionado(null);
        // cargarDatos(); // Recarga la lista de usuarios
      })
      .catch(error => console.error("Error al actualizar usuario:", error));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Usuarios</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Filtrar por Nombre" value={filtroNombre} onChange={(e) => handleFiltroChange(e, setFiltroNombre)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Filtrar por Correo" value={filtroCorreo} onChange={(e) => handleFiltroChange(e, setFiltroCorreo)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Filtrar por Empresa" value={filtroEmpresa} onChange={(e) => handleFiltroChange(e, setFiltroEmpresa)} />
        </div>
      </div>

      <button className="btn btn-primary mb-3 me-2" onClick={() => setMostrarModal(true)}>Agregar Usuario</button>
      <button className="btn btn-success mb-3" onClick={() => setMostrarModalCarga(true)}>Carga Masiva</button>

      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th><th>Correo</th><th>Empresa</th><th>Sede</th><th>Área</th><th>Departamento</th><th>Usuario Dominio</th><th>Acción</th>
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
                <td> <button className="btn btn-warning btn-sm" onClick={() => handleEditarUsuario(usuario)}>Editar</button></td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal para agregar usuario manualmente */}
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
                  <input type="text" className="form-control mb-2" placeholder="Usuario Directorio activo" name="username_ad" value={nuevoUsuario.username_ad} onChange={handleChange} required />

                  <select className="form-control mb-2" name="empresa_sede" value={nuevoUsuario.empresa_sede} onChange={handleChange} required>
                    <option value="">Seleccione una Sede</option>
                    {sedes.map(sede => <option key={sede.id} value={sede.id}>{sede.empresa_nombre} - {sede.sede_nombre}</option>)}
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

      {/* Modal para carga masiva */}
      {mostrarModalCarga && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Carga Masiva de Usuarios</h5>
                <button type="button" className="close" onClick={() => setMostrarModalCarga(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <input type="file" className="form-control mb-2" accept=".xlsx" onChange={handleArchivoChange} />
                <button className="btn btn-success mt-3" onClick={handleCargaMasiva}>Cargar</button>
              </div>
            </div>
          </div>
        </div>
      )}

  {mostrarModalEditar && usuarioSeleccionado && (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button type="button" className="close" onClick={() => setMostrarModalEditar(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleActualizarUsuario}>
              <input type="text" className="form-control mb-2" placeholder="Nombre" name="nombre" value={usuarioSeleccionado.nombre} onChange={handleChange} required />
              <input type="email" className="form-control mb-2" placeholder="Correo" name="correo" value={usuarioSeleccionado.correo} onChange={handleChange} required />
              <input type="text" className="form-control mb-2" placeholder="Usuario directorio activo" name="username_ad" value={usuarioSeleccionado.username_ad} onChange={handleChange} required />
              <select className="form-control mb-2" name="empresa_sede" value={nuevoUsuario.empresa_sede} onChange={handleChange} required>
                <option value="">Seleccione una Sede</option>
                {sedes.map(sede => <option key={sede.id} value={sede.id}>{sede.empresa_nombre} - {sede.sede_nombre}</option>)}
              </select>
              <select className="form-control mb-2" name="departamento" value={nuevoUsuario.departamento} onChange={handleChange} required>
                <option value="">Seleccione un Departamento</option>
                {departamentos.map(dep => <option key={dep.id} value={dep.id}>{dep.nombre}</option>)}
              </select>
              <button type="submit" className="btn btn-success mt-3">Actualizar</button>
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
