import type { NextPage } from 'next'
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
  height: ${props => `calc(100vh - ${props.openHeader ? "64px" : "0px"} - 60px - 190px)`}; // 100vh - height of the HeaderMenu - height of the navbar - height of the keyboard
  margin: auto;
  transition: height 0.5s ease-in-out;

  @media(max-width: 670px) {
    max-width: 400px;
  }

  @media(max-width: 500px) {
    width: 100%;
  }
`

const Keyboard = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(32, 1fr);
  grid-gap: .5rem;
  width: 100%;
  width: 720px;
  height: 190px;
  margin: 0 auto;
  padding-bottom: 1rem;
  > button {
    grid-column: span 3;
    font: inherit;
    font-size: 2rem;
    font-weight: 900;
    text-transform: uppercase;
    padding: .5rem;
    border: none;
    border-radius: 4px;
    color: ${props => props.theme.colorText};
    background-color: ${props => props.theme.colorBorder};
    transition: all .05s ease-in-out;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
    }
    &:nth-child(11) {
      grid-column: 2 / span 3;
    }
    &:nth-child(20) {
      grid-column: 30 / span 3;
    }
    &:nth-child(21) {
      grid-column: 3 / span 3;
    }
    &:nth-child(28) {
      grid-column: 25 / span 8;
    }
  }
`

interface gameModeFormatProps {
  [key: string]: {
    numberOfGames: number
    rows: number
  }
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

const Home: NextPage = () => {
  const [gameMode, setGameMode] = useState("duo") // single, duo, quad
  const [openHeader, setOpenHeader] = useState(false)
  const [activeRow, setActiveRow] = useState(0)
  const [activeLetter, setActiveLetter] = useState(0)
  const [letterCompletion, setLetterCompletion] = useState([false, false, false, false, false])
  const [gameStatus, setGameStatus] = useState([false])  
  const [keyboardAction, setKeyboardAction] = useState("")  
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

  function handleKeyboardPress(keyboardInput:string) {
    // Sem o timeout essas funções acontecem simultaneamente
    // Fazendo com queo movimento entre as letras aconteça antes da escrita
    // Todo - encontrar uma forma de trocar o setTimeout por algo melhor
    if(keyboardInput === "Backspace" || keyboardInput === "Enter") {
      setKeyboardAction(keyboardInput)
      setTimeout(() => { keyboardActions[keyboardInput]() }, 10)
      return 
    }
    setKeyboardAction(keyboardInput)
    setTimeout(() => { keyboardActions.write() }, 10)
    return 
  }


  const keyboardActions: ObjectLiteral = {
    "write": async () => { 
      console.log({activeLetter});
      
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
          // activeRow={activeRow}
          activeLetter={activeLetter}
          setActiveLetter={setActiveLetter}
          gameFormat={gameModeFormat[gameMode]}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          gameNumber={i}
          keyboardAction={keyboardAction}
          setKeyboardAction={setKeyboardAction}
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
        <button onClick={() => handleKeyboardPress("q")}> q </button>
        <button onClick={() => handleKeyboardPress("w")}> w </button>
        <button onClick={() => handleKeyboardPress("e")}> e </button>
        <button onClick={() => handleKeyboardPress("r")}> r </button>
        <button onClick={() => handleKeyboardPress("t")}> t </button>
        <button onClick={() => handleKeyboardPress("y")}> y </button>
        <button onClick={() => handleKeyboardPress("u")}> u </button>
        <button onClick={() => handleKeyboardPress("i")}> i </button>
        <button onClick={() => handleKeyboardPress("o")}> o </button>
        <button onClick={() => handleKeyboardPress("p")}> p </button>
        <button onClick={() => handleKeyboardPress("a")}> a </button>
        <button onClick={() => handleKeyboardPress("s")}> s </button>
        <button onClick={() => handleKeyboardPress("d")}> d </button>
        <button onClick={() => handleKeyboardPress("f")}> f </button>
        <button onClick={() => handleKeyboardPress("g")}> g </button>
        <button onClick={() => handleKeyboardPress("h")}> h </button>
        <button onClick={() => handleKeyboardPress("j")}> j </button>
        <button onClick={() => handleKeyboardPress("k")}> k </button>
        <button onClick={() => handleKeyboardPress("l")}> l </button>
        <button onClick={() => handleKeyboardPress("Backspace")}> {"<"} </button>
        <button onClick={() => handleKeyboardPress("z")}> z </button>
        <button onClick={() => handleKeyboardPress("x")}> x </button>
        <button onClick={() => handleKeyboardPress("c")}> c </button>
        <button onClick={() => handleKeyboardPress("v")}> v </button>
        <button onClick={() => handleKeyboardPress("b")}> b </button>
        <button onClick={() => handleKeyboardPress("n")}> n </button>
        <button onClick={() => handleKeyboardPress("m")}> m </button>
        <button onClick={() => handleKeyboardPress("Enter")}> Enter </button>
      </Keyboard>
      <Modal status={!gameStatus.some((el) => el === false )}><div>Parabéns</div></Modal>
    </>
  )
}

export default Home