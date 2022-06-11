import styled from "styled-components"

interface HeaderProps {
  isActive: boolean
}

export const Header = styled.div<HeaderProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;  
  height: ${props => props.isActive ? "7vh" : "0px"};
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  background-color: ${props => props.theme.colorBaseBlack};
  > button {
    border: none;
    font: inherit;
    font-size: 16px;
    color: ${props => props.theme.colorText};
    background-color: transparent;
  }
`

interface HeaderButtonsProps {
  isActive: boolean
}

export const HeaderButton = styled.div<HeaderButtonsProps>`
  border: none;
  margin: 0 1rem;
  font: inherit;
  font-size: 16px;
  color: ${props => props.isActive ?  props.theme.colorText : props.theme.colorOffWhite};
  background-color: transparent;
  cursor: pointer;
  &::first-letter {
    text-transform: uppercase;
  }
`



