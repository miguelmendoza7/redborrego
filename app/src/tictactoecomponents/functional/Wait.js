import React from 'react';
import { Link } from 'react-router-dom';

const Wait = ({room, display}) => {



    return (
        <div className='wait' style={{display:display?'flex':'none'}}>
            <h1 className="wait-message">Esperando a que el jugador se conecte...</h1>
            <div className="copy">
                <h1 className='copy-message'>ID de la partida:</h1>
                <div className='copy-container'>
                    <div  className='copy-area'>{room}</div>
                    <Link to="/">
                    <button className="btn btn-danger">Abandonar</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Wait;