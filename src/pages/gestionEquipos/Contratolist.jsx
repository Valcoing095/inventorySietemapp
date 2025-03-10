import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
// import * as XLSX from "xlsx";
import {VITE_API_URL} from "../../configenv"
import "bootstrap/dist/css/bootstrap.min.css";
const API_CONTRATOS = `${VITE_API_URL}/equipmentInventory/api/contratos/`;

const ContratoList = () => {
  const [contratos, setContratos] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroNumero, setFiltroNumero] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [nuevoContrato, setNuevoContrato] = useState({ proveedor: "", num_contrato: "" });

  useEffect(() => {
    axios.get(API_CONTRATOS)
      .then(response => setContratos(response.data))
      .catch(error => console.error("Error al cargar contratos:", error));
  }, []);

  const handleFiltroChange = (e, setFiltro) => setFiltro(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoContrato({ ...nuevoContrato, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_CONTRATOS, nuevoContrato)
      .then(response => {
        setContratos([...contratos, response.data]);
        setMostrarModal(false);
        setNuevoContrato({ proveedor: "", num_contrato: "" });
      })
      .catch(error => console.error("Error al agregar contrato:", error));
  };

  const handleEliminarContrato = () => {
    axios.delete(`${API_CONTRATOS}${contratoSeleccionado.id}/`)
      .then(() => {
        setContratos(contratos.filter(c => c.id !== contratoSeleccionado.id));
        setMostrarConfirmacion(false);
        setContratoSeleccionado(null);
      })
      .catch(error => console.error("Error al eliminar contrato:", error));
  };

//   const handleExportarExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(contratos);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Contratos");
//     XLSX.writeFile(wb, "contratos.xlsx");
//   };

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
      {/* <button className="btn btn-success mb-3 mx-2" onClick={handleExportarExcel}>Exportar a Excel</button> */}

      {/* Tabla de Contratos */}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Proveedor</th>
            <th>Número de Contrato</th>
            <th>Numero de Equipos</th>
            <th>Fecha de renovación</th>
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
                <td></td>
                <td></td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => { setContratoSeleccionado(contrato); setMostrarConfirmacion(true); }}>Eliminar</button>
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

      {/* Modal de confirmación antes de eliminar contrato */}
      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar este contrato?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleEliminarContrato}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContratoList;
