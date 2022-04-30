import React from 'react';
import Input from './Input.js'
import ChoiceButton from './ChoiceButton'

const InputForm = (props) => {
    const {stepBack, onSubmit, onTyping, newGame, name, room} = props
    

    if (newGame){
        return (
            <div className="text-center container margin">
                <h3 className="text-white" value={name} >{name}</h3>
                <h5 className="mt-4 text-light">Reglas</h5>

                <div className="mt-3 text-light">- Ambos jugadores perderan un punto en energía al momento de ingresar una figura en la tabla.</div>
                <div className="mt-3 text-light">- Se puede abandonar la partida en cualquier punto de esta.</div>
                <div className="mt-3 mb-4 text-light">- Si no cuentas con energía suficiente, abandonarás la partida y serás redirigido a la página de inicio.</div>

               
               <div className="row">
                   <div  className="col-lg-3 col-md-2"></div>
                   <div  className="col-lg-3 col-md-4">
                    <ChoiceButton type='danger col-md-12 col-lg-12 col-xl-8' choice='back' onChoice={stepBack} label='Regresar'/>
                    </div >
                    <div  className="col-lg-3 col-md-4">
                    <ChoiceButton type='primary col-md-12 col-lg-12 col-xl-8' choice='submit' onChoice={onSubmit} label="Continuar"/>
                    </div>
                    <div className="col-lg-3 col-md-2"></div>
             </div>
            </div>
        );
    }else{
        return (
            <div className="text-center container margin">
             <h3 className="text-white" value={name} >{name}</h3>

                <Input 
                name='room'
                placeholder='ID de la partida...'
                onChange = {onTyping}
                value = {room}
                />
              <div className="row">
                   <div  className="col-lg-3 col-md-2"></div>
                   <div  className="col-lg-3 col-md-4">
                    <ChoiceButton type='danger col-md-12 col-lg-12 col-xl-8' choice='back' onChoice={stepBack} label='Regresar'/>
                    </div >
                    <div  className="col-lg-3 col-md-4">
                    <ChoiceButton type='primary col-md-12 col-lg-12 col-xl-8' choice='submit' onChoice={onSubmit} label="Continuar"/>
                    </div>
                    <div className="col-lg-3 col-md-2"></div>
             </div>
            </div>
        );
    }
    
}

export default InputForm;