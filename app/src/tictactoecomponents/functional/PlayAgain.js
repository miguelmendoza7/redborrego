import React from 'react'

export default function PlayAgain({end, onClick}) {
    return (
        <div className='again-container'>
            <button className=' btn btn-light' onClick={onClick} style={{visibility: end?'visible':'hidden', opacity: end?'1':'0'}}>Jugar de nuevo</button>
        </div>
    )
}