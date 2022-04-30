import React, { useCallback, useContext} from "react";
import { withRouter } from "react-router";
import firebaseconfig from "./firebase.js";
import { AuthContext } from "./Auth.js";
import { Link } from "react-router-dom";
import translate from "translate";
import Verify from "./VerifyUser.js";

translate.engine = "google"; 
translate.key = process.env.GOOGLE_KEY;




const Login = ({ history }) => {

  const [loader, setLoader] = React.useState(true);


  const setLoaderFunctionTrue = () => {
    document.getElementById('login').style.opacity="100%";
    setLoader(true)
  }
  const setLoaderFunctionFalse = () => {
    document.getElementById('login').style.opacity="60%";

    setLoader(false)
  }
  

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      setLoaderFunctionFalse()
      const { email, password } = event.target.elements;
      try {
        await firebaseconfig
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
            history.push({ pathname: `/`})

          
          
           

      } catch (error) {
        setLoaderFunctionTrue(true)
          alert(await translate(error.message, "es"))
      }
    },
    [history]
  );



 


  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
   Verify(currentUser._delegate.uid)
  }




  return (
    <div>
      <div  hidden={loader} className="loader"></div>
    <div id="login" className=" jumbotron vertical-center">

    <div className="container">
  
    <div className="text-center">
      <Link to="/">
      <h2 className="redborrego-text">Red Borrego</h2>

      </Link>


<div className="registro">Inicio de sesión</div>


</div>
      <div className="row">
      <div className="col-lg-3 col-md-2"></div>


      <div className="col-lg-6 col-md-8">
      <form onSubmit={handleLogin}>
      <label className="sign-up-label">Correo electrónico: </label>
      <input         autoComplete="off" className="col-12 input-name" name="email"  required type="email" placeholder="Escriba aquí su correo electrónico" />
      <label className="sign-up-label">Contraseña: </label>
      <input  className="col-12 input-name" name="password" type="password" required  placeholder="Escriba aquí su contraseña" />

      <div className="d-flex justify-content-center ">
      <button  className="continue-button btn btn-lg " id="boton" type="submit">Continuar</button>
      </div>


      </form>
      <div className="text-center sign-up-label mt-4">¿No tienes cuenta? <Link to="/registro"><b className="register-a">Registrate aquí</b></Link></div>

      </div>
      <div className="col-lg-3 col-md-2"></div>
      </div>

      </div>
      </div>
      </div>
  );
};

export default withRouter(Login);



