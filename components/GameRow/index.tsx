import React, { useEffect, useState } from 'react'
import { Row, Letter } from "./styles"

interface Props {
  answer: Array<string>;
  rowNumber: number;
  activeRow: number
  activeLetter: number
  setActiveLetter : Function
  content: ObjectContent
  gameStatus: Boolean
}

interface ObjectContent {
  attempt: number
  complete: boolean
  0: string
  1: string
  2: string
  3: string
  4: string
}

interface ObjectContentLetter {
  0: string
  1: string
  2: string
  3: string
  4: string
}

const GameRow:React.FC<Props> = ({ answer, rowNumber, activeRow, activeLetter, setActiveLetter, content, gameStatus }) => {
  const letters = () => {
    const rowActive = rowNumber === activeRow;
    const letters = []
    const {attempt, complete, ...contentLetter} = content

    function answerStatus(answer:Array<string>, letter:string, letterIndex:number) {
      if(letter === answer[letterIndex]) return "right"
      if(answer.some((answerLetter) =>  answerLetter === letter)) return "place"
      return "wrong"
    }

    // keys - 1, pois content vem com attempt
    for(let i = 0; i < 5; i++) {  
      letters.push(
        <Letter 
          key={i}
          active={!gameStatus && rowActive && activeLetter === i}
          activeRow={!gameStatus && rowActive}
          onClick={() => setActiveLetter(i)}
          sent={activeRow > rowNumber}
          status={answerStatus(answer, contentLetter[i as keyof ObjectContentLetter], i)}
          >
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