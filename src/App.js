import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useEffect, useState } from 'react';

function App() {

  const baseUrl = "https://localhost:44353/api/gestores";
  const [data, setData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false); 
  const [openDelete, setOpenDelete] = useState(false);
  const [gestorSeleccionado, setGestorSeleccionado] = useState({
    id: "",
    nombre: "", 
    lanzamiento: "",
    desarrollador: ""
  });

  const abrirCerrarModalInsertar = () => {
    setOpen(!open);
  }

  const abrirCerrarModalEditar = () => {
    setOpenEdit(!openEdit);
  }

  const abrirCerrarModalDelete = () => {
    setOpenDelete(!openDelete);
  }

  const handleChange = e => {
    const { name, value } = e.target; 
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value
    });
  }

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      });
  }

  const peticionPost = async () => {
    delete gestorSeleccionado.id;
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios.post(baseUrl, gestorSeleccionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log(error);
      });
  }

  const peticionPut = async () => {
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios.put(baseUrl + "/" + gestorSeleccionado.id, gestorSeleccionado)
      .then(response => {
        var dataAux = data;
        dataAux.map(gestor => {
          if (gestor.id === gestorSeleccionado.id) {
            gestor.nombre = gestorSeleccionado.nombre;
            gestor.lanzamiento = gestorSeleccionado.lanzamiento;
            gestor.desarrollador = gestorSeleccionado.desarrollador;
          }
          return gestor;
        });
        setData([...dataAux]);
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      });
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + "/" + gestorSeleccionado.id)
      .then(response => {
        // Filtrar usando el ID del gestor que seleccionamos para eliminar
        setData(data.filter(gestor => gestor.id !== gestorSeleccionado.id));
        abrirCerrarModalDelete();
      }).catch(error => {
        console.log(error);
      });
  }

  const seleccionarGestor = (gestor, caso) => {
    setGestorSeleccionado(gestor);
    
    if (caso === "Editar") {
      abrirCerrarModalEditar();
    } else {
      abrirCerrarModalDelete(); 
    }
  }

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="App">
      <br /><br />
      <button onClick={() => abrirCerrarModalInsertar()} className='btn btn-success'>Insertar un nuevo gestor</button>
      <table className='table table-bordered mt-3'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(value => (
            <tr key={value.id}>
              <td>{value.id}</td>
              <td>{value.nombre}</td>
              <td>{value.lanzamiento}</td>
              <td>{value.desarrollador}</td>
              <td>
                <button className='btn btn-primary' onClick={() => seleccionarGestor(value, "Editar")}>Editar</button> {" "}
                <button className='btn btn-danger' onClick={() => seleccionarGestor(value, "Eliminar")}>Eliminar</button> {" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={open}>
        <ModalHeader>Insertar Gestor de la BD</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name='nombre' onChange={handleChange} />
            <label>Lanzamiento: </label>
            <br />
            <input type='text' className='form-control' name='lanzamiento' onChange={handleChange} />
            <label>Desarrollador: </label>
            <br />
            <input type='text' className='form-control' name='desarrollador' onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => peticionPost()}>Insertar</button> {" "}
          <button className='btn btn-danger' onClick={() => abrirCerrarModalInsertar()}>Cancelar</button> {" "}
        </ModalFooter>
      </Modal>

      <Modal isOpen={openEdit}>
        <ModalHeader>Editar Gestor de la BD</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>ID: </label>
            <br />
            <input type='text' className='form-control' readOnly value={gestorSeleccionado && gestorSeleccionado.id} />
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name='nombre' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre} />
            <label>Lanzamiento: </label>
            <br />
            <input type='text' className='form-control' name='lanzamiento' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.lanzamiento} />
            <label>Desarrollador: </label>
            <br />
            <input type='text' className='form-control' name='desarrollador' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.desarrollador} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => peticionPut()}>Editar</button> {" "}
          <button className='btn btn-danger' onClick={() => abrirCerrarModalEditar()}>Cancelar</button> {" "}
        </ModalFooter>
      </Modal>

      <Modal isOpen={openDelete}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar este elemento? <strong>{gestorSeleccionado && gestorSeleccionado.nombre}</strong>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => peticionDelete()}>
            Sí
          </button>
          <button className='btn btn-secondary' onClick={() => abrirCerrarModalDelete()}>
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;