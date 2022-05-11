import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useEventListener } from '../../util/useEventListener';
import GameRow from '../GameRow';
import { TermoContainer } from "./styles"

interface GameFormatProps {
  numberOfGames: number
  rows: number
}

interface Props {
  answer: Array<string>
  gameFormat: GameFormatProps
  // activeRow: number
  activeLetter: number
  gameNumber: number
  gameStatus: Array<Boolean>
  setActiveLetter: Function
  setGameStatus: Function
  // setActiveRow: Function
  // gameContent: Array<any>
}

interface ObjectLiteral {
  [key: string]: any;
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

interface ObjectRowLetters {
  0: string
  1: string
  2: string
  3: string
  4: string
}
  
const Termo:React.FC<Props> = ({ activeLetter, setActiveLetter, gameStatus, setGameStatus, gameFormat, gameNumber, answer}) => {
  const [activeRow, setActiveRow] = useState(0)
  const [rowContent, setRowContent] = useState<ObjectContent[]>([{
    attempt: 0,
    complete: false,
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
  }])

  function handleWriteLetter(keyboardInput:string) {    
    const newRowContent = rowContent.map((row) => 
        {
          if(row.attempt === activeRow) {
            return {...row, [activeLetter]: keyboardInput}
          }
          return row
        }
      )
      setRowContent(newRowContent)
  }

  function handleEraseLetter(letter:string | number) {
    const newRowContent = rowContent.map((row) => 
      {
        if(row.attempt === activeRow) {
          // se tiver letra na posição ativa, apaga, ou se a posição ativa for 0 mantém
          // senão apaga a anterior e o useEffect vai mover um para trás
          return {...row, [letter || activeLetter === 0 ? activeLetter : activeLetter - 1]: ""}
        }
        return row
      }
    )
    setRowContent(newRowContent)
  }

  function verifyAnswer() {
    const [activeRowContent] = rowContent.filter((row) => row.attempt === activeRow)
    const {attempt, complete, ...rowLetters} = activeRowContent
    const letters = Object.values(rowLetters)
    // Se alguma letra estiver errada incorrectAnswer será verdadeiro
    const incorrectAnswer = letters.some((letter, index) => !(letter === answer[index]))
    // Se a palavra estiver correta...
    if(!incorrectAnswer) {
      const newGameStatus = [...gameStatus]
      newGameStatus[gameNumber] = true
      setGameStatus(newGameStatus)
    }
  }


  const keyboardActions: ObjectLiteral = {
    "write": async (keyboardInput:string) => { 
      if(activeLetter < 5 && activeLetter > -1) {
        handleWriteLetter(keyboardInput)
      }
    },
    "Backspace": () => {
      const [activeRowContent] = rowContent.filter((row) => row.attempt === activeRow)
      const {attempt, complete, ...rowLetters} = activeRowContent
      const letter = rowLetters[activeLetter as keyof ObjectRowLetters]
      handleEraseLetter(letter)
    },
    "Enter": () => {
      console.log('enter');
      verifyAnswer()
      setActiveLetter(0)
      setActiveRow(activeRow + 1)
    },
    "Space": () => {
      handleWriteLetter("")
    },
  }

  function handleLetterPress(event:KeyboardEvent)  {
    if(gameStatus[gameNumber]) return

    const alphabet = /^[a-zA-Z]*$/.test(event.key)
    
    if(alphabet && event.key.length === 1) return keyboardActions.write(event.key)
    keyboardActions[event.code]?.()     
  }

  if (typeof window !== "undefined") {
    useEventListener('keydown', handleLetterPress, window); 
  }

  const rows = useCallback(() => {
    const rows = []
    for(let i = 0; i < gameFormat.rows; i++) {
      rows.push(
        <GameRow
          key={i}
          rowNumber={i}
          activeRow={activeRow}
          activeLetter={activeLetter}
          setActiveLetter={setActiveLetter}
          content={rowContent[i]}
          answer={answer}
          gameStatus={gameStatus[gameNumber]}
        />
      )
    }
    return rows
  }, [activeRow, activeLetter, setActiveLetter, answer, rowContent, gameStatus])


  useEffect(() => {
    const rows = []
    for(let i = 0; i < gameFormat.rows; i++) {
      rows.push({ attempt: i, 0: "", 1: "", 2: "", 3: "", 4: "", complete: false })
    }
    setRowContent(rows)
  }, [])

  return (
    <TermoContainer>    
      {rows()}
    </TermoContainer>
  )
}

export default Termo