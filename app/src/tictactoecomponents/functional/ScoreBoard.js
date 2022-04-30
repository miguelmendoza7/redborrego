import React from 'react'
import Score from './Score'

export default function ScoreBoard({data}) {
    return (
        <div className='score-board'>
            <h1 className="score-title">Resultados</h1>
            <Score name={data.player1[0]} score={data.player1[1]}/>
            <Score name={data.player2[0]} score={data.player2[1]}/>
        </div>
    )
}