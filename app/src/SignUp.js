import React, { useCallback } from 'react';
import { withRouter } from "react-router";
import firebaseconfig from "./firebase";
import translate from "translate";
import "./SignUp.css"
import { Link } from "react-router-dom";


translate.engine = "google"; 
translate.key = process.env.GOOGLE_KEY;


const SignUp = ({ history }) => {

  const [loader, setLoader] = React.useState(true);


  const setLoaderFunctionTrue = () => {
    document.getElementById('signup').style.opacity="100%";
    setLoader(true)
  }
  const setLoaderFunctionFalse = () => {
    document.getElementById('signup').style.opacity="60%";

    setLoader(false)
  }


  
  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    setLoaderFunctionFalse()
    const { email, password, password2, name } = event.target.elements;
    const campus = document.getElementById('campus').value
    if (password.value !== password2.value){
      alert('Confirme que su contraseña coincida en ambos campos de texto.')
      setLoaderFunctionTrue()

    }

    else if(campus === "Seleccione aquí su campus"){
      alert('Seleccione su campus.')
      setLoaderFunctionTrue()

    }
    else {
   

    try {
        await firebaseconfig

        .auth()
        .createUserWithEmailAndPassword(email.value, password.value).then(function (user) {
            const db = firebaseconfig.firestore();
            db.collection("info").doc(user.user._delegate.uid).set({name: name.value, email: email.value, puntos: 0, vidas: 0, gemas: 0, campus: campus});
            history.push({ pathname: '/'})

          })
         



        
      
      
    }  catch (error) {
      setLoaderFunctionTrue(true)

      alert(await translate(error.message, "es"));
    }}
  }, [history]);

 
  return (
    <div>

<div  hidden={loader} className="loader"></div>

    <div id="signup" className="jumbotron vertical-center">
    <div className="container">
      <div className="text-center">

      <Link to="/">
      <h2 className="redborrego-text">Red Borrego</h2>

      </Link>
<div className="registro">Registro</div>


</div>
      <div className="row">
      <div className="col-lg-3 col-md-2"></div>
      <div className="col-lg-6 col-md-8">


      <form onSubmit={handleSignUp}>
      <label className="sign-up-label">Nombre: </label>
      <input         autoComplete="off" className="col-12 input-name" name="name" type="name" required placeholder="Escriba aquí su nombre" />
      <label className="sign-up-label">Correo electrónico: </label>
      <input         autoComplete="off"  className="col-12 input-name" name="email" type="email" required placeholder="Escriba aquí su correo electrónico" />
      <label className="sign-up-label">Contraseña: </label>
      <input  className="col-12 input-name" name="password" type="password"  required placeholder="Escriba aquí su contraseña" />
      <label className="sign-up-label">Confirmar contraseña: </label>
      <input  className="col-12 input-name mb-3" id="password2" name="password2" type="password"  required placeholder="Escriba aquí su contraseña" />

      <label className="sign-up-label">Seleccionar campus: </label>
      <select required type="text" autoComplete="off" class="custom-select col-12 input-name " id="campus" name="campus">
<option className="disabled-option" selected={true} disabled="true" >Seleccione aquí su campus</option>
<option >Campus Laguna</option>
</select>

      <div className="d-flex justify-content-center ">
      <button className=" continue-button btn btn-lg " id="boton" type="submit" >Continuar</button>
      </div>
      
      </form>

      </div>
      <div className="col-lg-3"></div>
      </div>
      </div>

      </div>
      </div>
  );

};







export default withRouter(SignUp);