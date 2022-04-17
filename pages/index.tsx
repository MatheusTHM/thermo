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
  
  const gameModeFormat: ObjectLiteral = {
    single: {numberOfGames: 1, rows: 6},
    duo: {numberOfGames: 2, rows: 7},
    quad: {numberOfGames: 4, rows: 9},
  }

  const rows = useCallback(() => {
    const rows = []
    for(let i = 0; i < gameModeFormat[gameMode].rows; i++) {
      rows.push(
        <GameRow
          key={i}
          activeRow={activeRow === i}
          activeLetter={activeLetter}
          content={rowContent[i]}
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
          {rows()}
        </Termo>
      )
    }
    return games
  }, [gameModeFormat, gameMode, rows])

  function handleWordMovement(target:number) {
    if(target > 4) return setActiveLetter(0)
    if(target < 0) return setActiveLetter(4)
    setActiveLetter(target)
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
          return {...row, [letter || activeLetter === 0 ? activeLetter : activeLetter - 1]: ""}
        }
        return row
      }
    )
    setRowContent(newRowContent)
  }

  const keyboardActions: ObjectLiteral = {
    "write": (keyboardInput:string) => {
      handleWriteLetter(keyboardInput)
      handleWordMovement(activeLetter + 1)
    },
    "Backspace": () => {
      const letter = rowContent.filter((row) => row.attempt === activeRow)[0][activeLetter as keyof ObjectContent]
      handleEraseLetter(letter)
      handleWordMovement(activeLetter - 1)
    },
    "Enter": () => {
      console.log('enter');
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
      rows.push({ attempt: i, 0: "", 1: "", 2: "", 3: "", 4: "" })
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
