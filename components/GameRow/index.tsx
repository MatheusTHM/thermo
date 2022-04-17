import React, { useEffect, useState } from 'react'
import { Row, Letter } from "./styles"

interface Props {
  activeRow: boolean
  activeLetter: number
  content: ObjectContent
}

interface ObjectContent {
  attempt: number
  0: string
  1: string
  2: string
  3: string
  4: string
}

const GameRow:React.FC<Props> = ({ activeRow, activeLetter, content }) => {
  
  const letters = () => {
    const letters = []
    // keys - 1, pois content vem com attempt
    for(let i = 0; i < Object.keys(content).length - 1; i++) {
      letters.push(
        <Letter 
          active={activeRow && activeLetter === i}>
          {content[i as keyof ObjectContent]}
        </Letter>
      )
    }
    return letters
  }

  return (
    <Row>
      {content && letters()}
    </Row>
  )
}

export default GameRow