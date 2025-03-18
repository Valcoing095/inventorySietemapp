import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { VITE_API_URL } from "../../configenv";
import "bootstrap/dist/css/bootstrap.min.css";

const API_CONTRATOS = `${VITE_API_URL}/equipmentInventory/api/contratos/`;

const ContratoList = () => {
  const [contratos, setContratos] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroNumero, setFiltroNumero] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRenovacion, setMostrarRenovacion] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  
  const [nuevoContrato, setNuevoContrato] = useState({ 
    proveedor: "", 
    num_contrato: "", 
    cantidad_equipos: "", 
    fecha_inicio: "", 
    fecha_fin: "", 
    estado: "" 
  });

  const [nuevoContratoRenovado, setNuevoContratoRenovado] = useState({ 
    fecha_inicio: "", 
    fecha_fin: "" 
  });

  useEffect(() => {
    axios.get(API_CONTRATOS)
      .then(response => {
        const contratosActualizados = response.data.map(contrato => ({
          ...contrato,
          estado: new Date(contrato.fecha_fin) < new Date() ? "Finalizado" : contrato.estado || "Activo"
        }));
        setContratos(contratosActualizados);
      })
      .catch(error => console.error("Error al cargar contratos:", error));
  }, []);

  const handleFiltroChange = (e, setFiltro) => setFiltro(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoContrato({ ...nuevoContrato, [name]: value });
  };

  const handleRenovacionChange = (e) => {
    const { name, value } = e.target;
    setNuevoContratoRenovado({ ...nuevoContratoRenovado, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_CONTRATOS, nuevoContrato)
      .then(response => {
        setContratos([...contratos, response.data]);
        setMostrarModal(false);
        setNuevoContrato({ proveedor: "", num_contrato: "", cantidad_equipos: "", fecha_inicio: "", fecha_fin: "", estado: "" });
      })
      .catch(error => console.error("Error al agregar contrato:", error));
  };

  const handleRenovarContrato = () => {
    if (!contratoSeleccionado) return;

    const fechaFinNueva = new Date(nuevoContratoRenovado.fecha_fin);
    const estadoActualizado = fechaFinNueva < new Date() ? "Finalizado" : "Renovado";

    const datosRenovacion = {
      ...nuevoContratoRenovado,
      estado: estadoActualizado
    };

    axios.patch(`${API_CONTRATOS}${contratoSeleccionado.id}/`, datosRenovacion)
      .then(response => {
        setContratos(contratos.map(c => 
          c.id === contratoSeleccionado.id ? { ...c, ...response.data } : c
        ));
        setMostrarRenovacion(false);
        setContratoSeleccionado(null);
      })
      .catch(error => console.error("Error al renovar contrato:", error));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Contratos</h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Filtrar por Proveedor" value={filtroProveedor} onChange={(e) => handleFiltroChange(e, setFiltroProveedor)} />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Filtrar por Número de Contrato" value={filtroNumero} onChange={(e) => handleFiltroChange(e, setFiltroNumero)} />
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={() => setMostrarModal(true)}>Agregar Contrato</button>

      {/* Tabla de Contratos */}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Proveedor</th>
            <th>Número de Contrato</th>
            <th>Cantidad de Equipos</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Finalización</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contratos
            .filter(c =>
              (filtroProveedor ? c.proveedor.includes(filtroProveedor) : true) &&
              (filtroNumero ? c.num_contrato.includes(filtroNumero) : true)
            )
            .map((contrato) => (
              <tr key={contrato.id}>
                <td>{contrato.proveedor}</td>
                <td>{contrato.num_contrato}</td>
                <td>{contrato.cantidad_equipos || "No asignado"}</td>
                <td>{contrato.fecha_inicio || "No asignada"}</td>
                <td>{contrato.fecha_fin || "No asignada"}</td>
                <td className={contrato.estado === "Finalizado" ? "text-danger" : "text-success"}>
                  {contrato.estado || "No definido"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => { setContratoSeleccionado(contrato); setMostrarRenovacion(true); }}>
                    Renovar Contrato
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* Modal para agregar contrato */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Contrato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input type="text" className="form-control mb-2" placeholder="Proveedor" name="proveedor" value={nuevoContrato.proveedor} onChange={handleChange} required />
            <input type="text" className="form-control mb-2" placeholder="Número de Contrato" name="num_contrato" value={nuevoContrato.num_contrato} onChange={handleChange} required />
            <Button type="submit" className="btn btn-success mt-3">Guardar</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal para renovar contrato */}
      <Modal show={mostrarRenovacion} onHide={() => setMostrarRenovacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Renovar Contrato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <input type="date" className="form-control mb-2" name="fecha_inicio" value={nuevoContratoRenovado.fecha_inicio} onChange={handleRenovacionChange} required />
            <input type="date" className="form-control mb-2" name="fecha_fin" value={nuevoContratoRenovado.fecha_fin} onChange={handleRenovacionChange} required />
            <Button className="btn btn-success mt-3" onClick={handleRenovarContrato}>Renovar</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ContratoList;
