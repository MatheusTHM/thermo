import type { NextPage } from 'next'
import GameRow from '../components/GameRow'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { useEventListener } from '../util/useEventListener'

const Termo = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 330px;
  margin: 0 auto;
`

const Game = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  margin: auto;
`

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

const Home: NextPage = () => {
  const [gameMode, setGameMode] = useState("single") // single, duo, quad
  const [activeRow, setActiveRow] = useState(0)
  const [activeLetter, setActiveLetter] = useState(0)
  const [rowContent, setRowContent] = useState<ObjectContent[]>([])

  const answer = 
  [
    ["l", "e", "t", "r", "a"], 
    ["n", "a", "v", "i", "o"],
    ["c", "u", "r", "t", "e"],
    ["a", "v", "i", "a", "o"],
  ]
  
  const gameModeFormat: ObjectLiteral = {
    single: {numberOfGames: 1, rows: 6},
    duo: {numberOfGames: 2, rows: 7},
    quad: {numberOfGames: 4, rows: 9},
  }

  const rows = useCallback((gameAnswer:Array<string>) => {
    const rows = []
    for(let i = 0; i < gameModeFormat[gameMode].rows; i++) {
      rows.push(
        <GameRow
          key={i}
          rowNumber={i}
          activeRow={activeRow}
          activeLetter={activeLetter}
          setActiveLetter={setActiveLetter}
          content={rowContent[i]}
          answer={gameAnswer}
        />
      )
    }
    return rows
  }, [activeRow, activeLetter, gameModeFormat, rowContent, gameMode])

  const games = useCallback(() => {
    const games = []
    for (let i = 0; i < gameModeFormat[gameMode].numberOfGames; i++) {
      games.push(
        <Termo key={i}>
          {rows(answer[i])}
        </Termo>
      )
    }
    return games
  }, [gameModeFormat, gameMode, rows])

  function handleWordMovement(target:number) {
    if(target > 5) setActiveLetter(0)
    if(target < 0 || target > 4) return 
    setActiveLetter(target)
  }

  function handleIndexMovement() {
    const [activeRowContent] = rowContent.filter((row) => row.attempt === activeRow)
    const {attempt, complete, ...rowLetters} = activeRowContent || {}
    const rowLettersArray = Object.values(rowLetters)
    // Procurando o próximo index que está vazio começando com a posição ativa
    const nextEmptyLetter = rowLettersArray.findIndex((letter, index) => {
      if(activeLetter < 4) return letter === "" && index > activeLetter
      // Sinceramente eu ainda não entendi a lógica disso funcionar, mas se funciona a gente não mexe
      if(activeLetter === 4 && index === 4) return false
      return letter === ""
    }
    );
    // Se o array de letras estiver cheio a posição de letras vazias é -1 então seta a palavra como completa
    if(rowLettersArray.length > 0 && nextEmptyLetter === -1) return setActiveLetter(5)
    if(nextEmptyLetter > -1) setActiveLetter(nextEmptyLetter)
  }

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

  const keyboardActions: ObjectLiteral = {
    "write": async (keyboardInput:string) => { 
      if(activeLetter < 5 && activeLetter > -1) {
        handleWriteLetter(keyboardInput)
        handleIndexMovement()
      }
    },
    "Backspace": () => {
      const [activeRowContent] = rowContent.filter((row) => row.attempt === activeRow)
      const {attempt, complete, ...rowLetters} = activeRowContent
      const letter = rowLetters[activeLetter as keyof ObjectRowLetters]
      handleEraseLetter(letter)
      handleWordMovement(activeLetter - 1)
    },
    "Enter": () => {
      console.log('enter');
      setActiveLetter(0)
      setActiveRow(activeRow + 1)
    },
    "Space": () => {
      handleWriteLetter("")
      handleWordMovement(activeLetter + 1)
    },
    "ArrowLeft": () => {
      handleWordMovement(activeLetter - 1)
    },
    "ArrowRight": () => {
      handleWordMovement(activeLetter + 1)
    },
  }

  function handleLetterPress(event:KeyboardEvent)  {
    const alphabet = /^[a-zA-Z]*$/.test(event.key)
    
    if(alphabet && event.key.length === 1) return keyboardActions.write(event.key)
    keyboardActions[event.code]?.()     
  }

  if (typeof window !== "undefined") {
    useEventListener('keydown', handleLetterPress, window); 
  }

  useEffect(() => {
    const rows = []
    for(let i = 0; i < gameModeFormat[gameMode].rows; i++) {
      rows.push({ attempt: i, 0: "", 1: "", 2: "", 3: "", 4: "", complete: false })
    }
    setRowContent(rows)
  }, [])

  return (
    <>
      {/* Header */}
      <Game>
        {games()}
      </Game>
      {/* Keyboard */}
    </>
  )
}

export default Home
