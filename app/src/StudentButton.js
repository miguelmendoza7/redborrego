import React, {useEffect} from 'react'
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";
import firebaseconfig from './firebase';


const StudentButton = (props) => {
    const [modal, setModal] = React.useState(false);
    const [students, setStudents] = React.useState([]);

    const db = firebaseconfig.firestore();

    function openModal (){
        setModal(true)
        }
        
        function closeModal (){
          setModal(false)
        }
        
        useEffect(() => {
            const searchImage = async () => {
           
            const campusCollectionPrices = await db.collection('pases').doc(props.campus).collection(props.price).doc(props.id).collection('alumnos').onSnapshot((snapshot) => {
              setStudents(snapshot.docs.map((doc) => (doc.data()))
             )});
    
    
              
            };
            searchImage();
          }, []);

    return (
        <>
          <Modal  onHide={closeModal} show={modal}>
         
         <ModalHeader><h2>Alumnos</h2>
         
         </ModalHeader>
         <ModalBody>
         { students.map((student) => {
      return (
      <div key={student.id} className=" mb-2 ">
          <div>{student.name}</div>
         </div>

      )

    }) 
    }
         </ModalBody>
         <div className="row text-center">
                  <div className="col-6 mb-3">
                  <button class="btn btn-danger col-11" onClick={() => closeModal()}>Cerrar</button>
                  </div>
                  <div className="col-6">
                 
                      
                  
                      
                  </div>

                  </div>

       </Modal>
    
        <div>
            <button onClick={() => openModal()}  className="btn btn-primary">Alumnos</button>
        </div>
        </>
    )
}

export default StudentButton