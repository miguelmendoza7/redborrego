import React from 'react'

export default function Status({message, color}) {
    return (
        <div className={'status ' + color}>
            <h1 className="status-message">{message}</h1>
        </div>
    )
}