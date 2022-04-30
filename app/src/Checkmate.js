import { Link } from "react-router-dom";
import { AuthContext } from "./Auth.js";
import React, { useContext } from "react";


function Checkmate({history}){

    const { currentUser } = useContext(AuthContext);


    if (currentUser) {
        if (currentUser._delegate.uid === "eUQeAWWwIoQ0dvwoZRSwfIJtG5r2"){
          history.push({ pathname: `/admin`})
        }
      }
return(
    <div>
        <nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">
<Link to="/">

    <div className="navbar-brand navbar-title" >Red Borrego</div>
    </Link>
        <Link to="/">
    <button className="navbar-brand navbar-button">Inicio</button> 
    </Link>


  </div>
</nav>

    </div>

);
}

export default Checkmate