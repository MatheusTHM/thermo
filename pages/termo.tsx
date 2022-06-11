import type { NextPage } from 'next'
import GameRow from '../components/GameRow'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { useEventListener } from '../util/useEventListener'
import NavBar from '../components/Navbar'
import HeaderMenu from '../components/HeaderMenu'
import Termo from '../components/Termo'

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

interface GameContainerProps {
  openHeader: boolean
}

const GameContainer = styled.main<GameContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  height: ${props => props.openHeader ? "calc(100vh - 64px - 60px - 100px)" : "calc(100vh - 0px - 60px - 100px)" }; // 100vh - height of the HeaderMenu - height of the navbar - height of the keyboard
  margin: auto;

  @media(max-width: 670px) {
    max-width: 400px;
  }

  @media(max-width: 500px) {
    width: 100%;
  }
`

const Keyboard = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${props => props.theme.colorLetter};
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

/*
  A ideia é adicionar os event listeners nos termos
  enquanto que existe uma palavra exemplo sendo montada nessa tela
  cada termo vai ter sua palavra e seu conteúdo
  quando a palavra estiver pronta será adicionado um true em gameStatus
  quando não houver mais nenhum false em gameStatus o game acaba
*/

const termoTeste = () => {
  const [gameMode, setGameMode] = useState("quad") // single, duo, quad
  const [openHeader, setOpenHeader] = useState(false)
  const [activeRow, setActiveRow] = useState(0)
  const [activeLetter, setActiveLetter] = useState(0)
  const [letterCompletion, setLetterCompletion] = useState([false, false, false, false, false])
  const [gameStatus, setGameStatus] = useState([false])  
  // const [gameContent, setGameContent] = useState([{
  //   attempt: 0,
  //   complete: false,
  //   0: '',
  //   1: '',
  //   2: '',
  //   3: '',
  //   4: '',
  // }])

  const answer = 
  [
    ["l", "e", "t", "r", "a"], 
    ["n", "a", "v", "i", "o"],
    ["c", "u", "r", "t", "e"],
    ["a", "v", "i", "a", "o"],
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
    "write": async (keyboardInput:string) => { 
      if(activeLetter < 5 && activeLetter > -1) {
        // handleWriteLetter(keyboardInput)
        const letterStatus = [...letterCompletion]
        letterStatus[activeLetter] = true
        setLetterCompletion(letterStatus)
        handleIndexMovement()
      }
    },
    "Backspace": () => {
      // const [activeRowContent] = rowContent.filter((row) => row.attempt === activeRow)
      // const {attempt, complete, ...rowLetters} = activeRowContent
      // const letter = rowLetters[activeLetter as keyof ObjectRowLetters]
      // handleEraseLetter(letter)
      const letterStatus = [...letterCompletion]
      letterStatus[activeLetter] = false
      setLetterCompletion(letterStatus)
      handleWordMovement(activeLetter - 1)
    },
    "Enter": () => {
      console.log('enter');
      const resetLetterCompletion = letterCompletion.map(() => false)
      setLetterCompletion(resetLetterCompletion)
      setActiveLetter(0)
      setActiveRow(activeRow + 1)
    },
    "Space": () => {
      const letterStatus = [...letterCompletion]
      letterStatus[activeLetter] = false 
      setLetterCompletion(letterStatus)
      // handleWriteLetter("")
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
          // activeRow={activeRow}
          activeLetter={activeLetter}
          setActiveLetter={setActiveLetter}
          gameFormat={gameModeFormat[gameMode]}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          gameNumber={i}
          // setActiveRow={setActiveRow}
          // gameContent={gameContent}
        />
      ) 
    }
    return termos     
  }, [answer, gameMode
    // , gameContent
  ])
  

  return (
    <>
      <HeaderMenu gameMode={gameMode} setGameMode={setGameMode} openHeader={openHeader}/>
      <NavBar setOpenHeader={setOpenHeader} openHeader={openHeader} />
      <GameContainer openHeader={openHeader}>
        {gamesGenerator()}
      </GameContainer>
      <Keyboard>
        abcdefghijklmnopqrstuvwxyz
      </Keyboard>
      <Modal status={!gameStatus.some((el) => el === false )}><div>Parabéns</div></Modal>
    </>
  )
}

export default termoTeste