import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CuadrosTexto } from './components/CuadrosTexto';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className='container'>
  <h1>Formulario de Registro de Empleados <strong>Vigitecol Ltda.</strong></h1>
  <button className='btn btn-success'>Iniciar</button>
  <CuadrosTexto 
  tamanoinput="col-md-6"
  titulolabel="Ejemplo Label:" 
  tipoinput="number" 
  nombreinput="num1" 
  idinput="num1" 
  placeholderinput="Ejemplo de Placeholder" 
  />
</div>
);