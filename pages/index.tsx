import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import NavBar from '../components/Navbar'
import Termo from '../components/Termo'
import { useEventListener } from '../util/useEventListener'

interface ModalProps {
  status: boolean
}

const Modal = styled.div<ModalProps>`
  display: ${props => props.status ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  & div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background-color: #fff;
    border-radius: 4px;

  }
`

const GameContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  // 100vh - height of the navbar - height of the keyboard
  height: calc(100vh - 60px - 0px);
  margin: auto;
`

interface gameModeFormatProps {
  [key: string]: {
    numberOfGames: number
    rows: number
  }
}

interface ObjectLiteral {
  [key: string]: any;
}

const Home = () => {
  const [gameMode, setGameMode] = useState("duo") // single, duo, quad
  const [activeRow, setActiveRow] = useState(0)
  const [activeLetter, setActiveLetter] = useState(0)
  const [letterCompletion, setLetterCompletion] = useState([false, false, false, false, false])
  const [gameStatus, setGameStatus] = useState([false])  

  const answer = 
  [
    ["t", "e", "l", "h", "a"], 
    ["m", "e", "i", "a", "o"],
    ["f", "a", "t", "o", "r"],
    ["p", "o", "r", "t", "a"],
  ]
  
  const gameModeFormat: gameModeFormatProps = {
    single: {numberOfGames: 1, rows: 6},
    duo: {numberOfGames: 2, rows: 7},
    quad: {numberOfGames: 4, rows: 9},
  }

  function handleWordMovement(target:number) {
    if(target > 5) setActiveLetter(0)
    if(target < 0 || target > 4) return 
    setActiveLetter(target)
  }

  function handleIndexMovement() {
    // Procurando o próximo index que está vazio começando com a posição ativa
    const nextEmptyLetter = letterCompletion.findIndex((letter, index) => {
      if(activeLetter < 4) return !letter && index > activeLetter
      // Sinceramente eu ainda não entendi a lógica disso funcionar, mas se funciona a gente não mexe
      return !letter
    }
    );
    // Se o array de letras estiver cheio a posição de letras vazias é -1 então seta a palavra como completa
    if(nextEmptyLetter === -1) return setActiveLetter(5)
    if(nextEmptyLetter > -1) setActiveLetter(nextEmptyLetter)
  }



  const keyboardActions: ObjectLiteral = {
    "write": async () => { 
      if(activeLetter < 5 && activeLetter > -1) {
        const letterStatus = [...letterCompletion]
        letterStatus[activeLetter] = true
        setLetterCompletion(letterStatus)
        handleIndexMovement()
      }
    },
    "Backspace": () => {
      const letterStatus = [...letterCompletion]
      letterStatus[activeLetter] = false
      setLetterCompletion(letterStatus)
      handleWordMovement(activeLetter - 1)
    },
    "Enter": () => {
      const resetLetterCompletion = letterCompletion.map(() => false)
      setLetterCompletion(resetLetterCompletion)
      setActiveLetter(0)
      setActiveRow(activeRow + 1)
    },
    "Space": () => {
      const letterStatus = [...letterCompletion]
      letterStatus[activeLetter] = false 
      setLetterCompletion(letterStatus)
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


  // UseEffect para definir a quantidade de games e setar todos como incompletos
  useEffect(() => {
    const gameStatus = []
    for (let i = 0; i < gameModeFormat[gameMode].numberOfGames; i++) {
      gameStatus.push(false)
    }
    setGameStatus(gameStatus)
  }, [])
  

  // Callback utilizado para gerar mais de um Termo dependendo do modo de jogo
  const gamesGenerator = useCallback(() => {
    const termos = []
    for (let i = 0; i < gameModeFormat[gameMode].numberOfGames; i++) {
      termos.push(
        <Termo
          key={i}
          answer={answer[i]}
          activeLetter={activeLetter}
          setActiveLetter={setActiveLetter}
          gameFormat={gameModeFormat[gameMode]}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          gameNumber={i}
        />
      ) 
    }
    return termos     
  }, [answer, gameMode])
  

  return (
    <>
      <NavBar/>
      <GameContainer>
        {gamesGenerator()}
      </GameContainer>
      {/* Keyboard */}
      <Modal status={!gameStatus.some((el) => el === false )}><div>Parabéns</div></Modal>
    </>
  )
}

export default Home