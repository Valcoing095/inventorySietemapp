import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from 'react-router-dom';
const Informes = () => {

    // const navigate = useNavigate();
    
    
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Informes</h1>
      <div className="row justify-content-center">
        {/* Card Equipos */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Centro de costos</h5>
              <p className="card-text">Se genera informe para determinar el total de equipos por area y cuanto es su costo.</p>
              <Link to="/informeCentrocosto" className="btn btn-primary">Ir a informe</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informes;
