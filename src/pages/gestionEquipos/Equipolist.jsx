import { useEffect, useState } from "react";
import axios from "axios";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {VITE_API_URL} from "../../configenv"

const API_EQUIPOS = `${VITE_API_URL}//equipmentInventory/api/equipos/`;
const API_USUARIOS = `${VITE_API_URL}/equipmentInventory/api/usuarios-ad/`;
const API_CONTRATOS = `${VITE_API_URL}/equipmentInventory/api/contratos/`;
const API_CARGA_MASIVA = `${VITE_API_URL}/equipmentInventory/api/equipos/carga_masiva_equipos/`;


const EquipoList = () => {
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);

  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    serial: "",
    modelo: "",
    marca: "",
    tipo: "",
    asignarUsuario: false,
    usuario: "",
  });

  useEffect(() => {
    axios.get(API_EQUIPOS)
      .then(response =>{
        setEquipos(response.data)

        console.log("Serial:", response.data);
        console.log("Usuario:", response.data[10].usuario_info.empresa);
        console.log("Empresa del usuario:", response.data.usuario_info?.empresa || "No disponible")
      .catch(error => console.error("Error al cargar equipos:", error));
    // axios.get(API_USUARIOS).then(response => setUsuarios(response.data)).catch(error => console.error("Error al cargar usuarios:", error));
      })

      
    axios.get(API_USUARIOS)
    .then(response => {
      setUsuarios(response.data.usuarios);
      console.log("Usuarios:", response.data.usuarios); // 🔍 Verifica qué estructura tiene la respuesta
    })
    .catch(error => console.error("Error al cargar usuarios:", error));
    axios.get(API_CONTRATOS).then(response => setContratos(response.data)).catch(error => console.error("Error al cargar contratos:", error));
  }, []);

  const handleFiltroChange = (e, setFiltro) => setFiltro(e.target.value);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoEquipo({ ...nuevoEquipo, [name]: type === "checkbox" ? checked : value });
  };

  // 🟢 Función para abrir el modal de asignación de usuario
  const handleAbrirModalUsuario = (equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarModalUsuario(true);
  };

  // 🟠 Función para abrir el modal de confirmación antes de eliminar usuario
  const handleAbrirModalEliminar = (equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarConfirmacion(true);
  };

  // ✅ Asignar Usuario al equipo
  const handleAsignarUsuario = () => {
    if (!usuarioSeleccionado) return;

    axios.patch(`${API_EQUIPOS}${equipoSeleccionado.id}/`, { usuario: usuarioSeleccionado })
      .then(() => {
        setEquipos(equipos.map(e => e.id === equipoSeleccionado.id ? { ...e, usuario: usuarios.find(u => u.id == usuarioSeleccionado)?.nombre } : e));
        setMostrarModalUsuario(false);
        setEquipoSeleccionado(null);
        setUsuarioSeleccionado("");
      })
      .catch(error => console.error("Error al asignar usuario:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_EQUIPOS, nuevoEquipo)
      .then(() => {
        setMostrarModal(false);
        setNuevoEquipo({ serial: "", modelo: "", marca: "", tipo: "", asignarUsuario: false, usuario: "" });
      })
      .catch(error => console.error("Error al agregar equipo:", error));
  };


  // ❌ Eliminar Usuario del equipo
  const handleEliminarUsuario = () => {
    axios.patch(`${API_EQUIPOS}${equipoSeleccionado.id}/`, { usuario: null })
      .then(() => {
        setEquipos(equipos.map(e => e.id === equipoSeleccionado.id ? { ...e, usuario: "Sin usuario asignado" } : e));
        setMostrarConfirmacion(false);
        setEquipoSeleccionado(null);
      })
      .catch(error => console.error("Error al eliminar usuario:", error));
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Equipos</h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Filtrar por Empresa" value={filtroEmpresa} onChange={(e) => handleFiltroChange(e, setFiltroEmpresa)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Filtrar por Sede" value={filtroSede} onChange={(e) => handleFiltroChange(e, setFiltroSede)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Filtrar por Usuario" value={filtroUsuario} onChange={(e) => handleFiltroChange(e, setFiltroUsuario)} />
        </div>
      </div>
      {/* Botón agregar equipo */}
      <button className="btn btn-primary mb-3" onClick={() => setMostrarModal(true)}>Agregar Equipo</button>
      <button className="btn btn-success mb-3" onClick={() => setMostrarModalCarga(true)}>Carga Masiva</button>

      {/* Tabla de Equipos */}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Modelo</th>
            <th>Nombre</th>
            <th>Serial</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Sede</th>
            <th>Proveedor</th>
            <th>Contrato</th>
            <th>Costo Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equipos
            .filter(e =>
              (filtroEmpresa ? (e.usuario_info?.empresa || "").toLowerCase().includes(filtroEmpresa.toLowerCase()) : true) &&
              (filtroUsuario ? (e.usuario_info?.nombre || "").toLowerCase().includes(filtroUsuario.toLowerCase()) : true) &&
              (filtroSede ? (e.usuario_info?.sede || "").toLowerCase().includes(filtroSede.toLowerCase()) : true) 
            )
            .map((equipo) => (
              <tr key={equipo.id}>
                {/* Tooltip en la columna "Modelo" */}
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-${equipo.id}`}>
                      <strong>Modelo:</strong> {equipo.modelo} <br />
                      <strong>Serial:</strong> {equipo.serial} <br />
                      <strong>Marca:</strong> {equipo.marca} <br />
                      <strong>Tipo:</strong> {equipo.tipo} <br />
                      <strong>Procesador:</strong> {equipo.procesador} <br />
                      <strong>Ram:</strong> {equipo.ram}<br/>
                      <strong>Disco duro:</strong>{equipo.disco_duro}<br/>
                    </Tooltip>
                  }
                >
                  <td className="text-primary" style={{ cursor: "pointer" }}>
                    {equipo.modelo}
                  </td>
                </OverlayTrigger>
                <td>{equipo.nombre || "Sin asignar"}</td>
                <td>{equipo.serial}</td>
                <td>{equipo.usuario || "Sin usuario asignado"}</td>
                <td>{equipo.usuario_info?.nombre || "No disponible"}</td>
                <td>{equipo.usuario_info?.empresa || "No disponible"}</td> 
                <td>{equipo.usuario_info?.sede || "No disponible"}</td>
                <td>{equipo.contrato_proveedor}</td>
                <td>{equipo.contrato_numero}</td>
                <td>{equipo.costo_unitario}</td>
                <td>
                  {!equipo.usuario || equipo.usuario === "Sin usuario asignado" ? (
                    <button className="btn btn-sm btn-success" onClick={() => handleAbrirModalUsuario(equipo)}>Asignar Usuario</button>
                  ) : (
                    <button className="btn btn-sm btn-danger" onClick={() => handleAbrirModalEliminar(equipo)}>Eliminar Usuario</button>
                  )}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
          {/* Modal para agregar equipo */}
      {mostrarModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Equipo</h5>
                <button type="button" className="close" onClick={() => setMostrarModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input type="text" className="form-control mb-2" placeholder="Serial" name="serial" value={nuevoEquipo.serial} onChange={handleChange} required />
                  <input type="text" className="form-control mb-2" placeholder="Modelo" name="modelo" value={nuevoEquipo.modelo} onChange={handleChange} required />
                  <input type="text" className="form-control mb-2" placeholder="Marca" name="marca" value={nuevoEquipo.marca} onChange={handleChange} required />
                  <input type="text" className="form-control mb-2" placeholder="Tipo" name="tipo" value={nuevoEquipo.tipo} onChange={handleChange} required />
                  <select className="form-control mb-2" name="contrato" value={nuevoEquipo.contrato} onChange={handleChange} required>
                    <option value="">Seleccione un contrato</option>
                    {contratos.map(contrato => (
                      <option key={contrato.id} value={contrato.id}>{contrato.proveedor} - {contrato.num_contrato}</option>
                    ))}
                  </select>
            <input type="number" className="form-control mb-2" placeholder="Costo Unitario" name="costo_unitario" value={nuevoEquipo.costo_unitario} onChange={handleChange} required />
            
                  <button type="submit" className="btn btn-success mt-3">Guardar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {mostrarModalUsuario && equipoSeleccionado && (
        <Modal show={mostrarModalUsuario} onHide={() => setMostrarModalUsuario(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Asignar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Agregamos un input para filtrar usuarios */}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Buscar usuario por nombre o empresa..."
              value={filtroUsuario} // Evitar que sea undefined
              onChange={(e) => setFiltroUsuario(e.target.value)}
            />
            
            <select 
              className="form-control" 
              value={usuarioSeleccionado} 
              onChange={(e) => setUsuarioSeleccionado(e.target.value)} 
              required
            >
              <option value="">Seleccione un usuario</option>
              
              {usuarios
                .filter(user => {
                  const nombre = user.nombre?.toLowerCase() || ""; // Si es undefined, usar ""
                  const empresa = user.empresa?.toLowerCase() || "";
                  const filtro = filtroUsuario?.toLowerCase() || ""; // Si es undefined, usar ""
                  
                  return nombre.includes(filtro) || empresa.includes(filtro);
                })
                .map(user => (
                  <option key={user.user_AD} value={user.user_AD}>
                    {user.nombre} ({user.user_AD}) - {user.empresa}
                  </option>
                ))}
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModalUsuario(false)}>Cancelar</Button>
            <Button variant="success" onClick={handleAsignarUsuario}>Asignar</Button>
          </Modal.Footer>
        </Modal>
      )}


      {/* Modal de confirmación antes de eliminar usuario */}
      {mostrarConfirmacion && (
        <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Está seguro de eliminar el usuario asignado a este equipo?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleEliminarUsuario}>Eliminar</Button>
          </Modal.Footer>
        </Modal>
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
    </div>
  );
};

export default EquipoList;
