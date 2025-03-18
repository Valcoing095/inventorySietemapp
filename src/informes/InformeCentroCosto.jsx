import  { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Table, Button } from 'react-bootstrap';

const InformeCentroCosto = () => {
  const [datos, setDatos] = useState([]);

  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get('http://127.0.0.1:8000/equipmentInventory/api/equipos-por-area/');
      setDatos(respuesta.data);
      console.log(respuesta)
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const exportarAExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = { Sheets: { 'Datos': hoja }, SheetNames: ['Datos'] };
    const buffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    const archivo = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(archivo, 'InformeCentrosCosto.xlsx');
  };

  return (
    <div>
      <h1>Informe de Centros de Costo</h1>
      
      <div className="container mt-4">
        <Button onClick={obtenerDatos} className="mb-3 mx-2">Obtener Datos</Button>
        <Button onClick={exportarAExcel} disabled={datos.length === 0} className="mb-3">Exportar a Excel</Button>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Área</th>
              <th>Centro de Costo</th>
              <th>Total de Equipos</th>
              <th>Total de Costo</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(datos) ? (
              datos.map((item, index) => (
                <tr key={index}>
                  <td>{item?.area||"Sin asignar"}</td>
                  <td>{item?.centro_costo||"Sin asignar"}</td>
                  <td>{item.total_equipos}</td>
                  <td>{item.total_costo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay datos disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InformeCentroCosto;
