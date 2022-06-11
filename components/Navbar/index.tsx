import React from 'react'
import { Navbar, Title, NavButton } from "./styles"

interface NavBarProps {
  setOpenHeader: Function
  openHeader: boolean
}

const NavBar:React.FC<NavBarProps> = ({setOpenHeader, openHeader}) => {
  return (
    <Navbar>
      <NavButton isActive={openHeader} onClick={() => setOpenHeader(!openHeader)}>
        v
      </NavButton>
      <Title>T<span>H</span>ERMO</Title>
    </Navbar>
  )
}

export default NavBar