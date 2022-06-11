import React from 'react'
import { Header, HeaderButton } from "./styles"

interface HeaderMenuProps {
  gameMode: string
  setGameMode: Function
  openHeader: boolean
}

const HeaderMenu:React.FC<HeaderMenuProps> = ({ gameMode, setGameMode, openHeader }) => {
  // Trocar a forma de trocar o gamemode de um button com useState para um href
  // Trocar por useState causa bugs durande a renderização
  // O ideal seria trocar para um método de rotas como o jogo original
  return (
    <Header isActive={openHeader}>
      <HeaderButton isActive={gameMode === "single"} onClick={() => setGameMode("single")}>
        single
      </HeaderButton>
      <HeaderButton isActive={gameMode === "duo"} onClick={() => setGameMode("duo")}>
        duo
      </HeaderButton>
      <HeaderButton isActive={gameMode === "quad"} onClick={() => setGameMode("quad")}>
        quad
      </HeaderButton>
    </Header>
  )
}

export default HeaderMenu