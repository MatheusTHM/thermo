import styled from "styled-components"

export const Title = styled.h1`
  font-size: 5vh;
  margin: 0 1rem;
  color: ${props => props.theme.colorText};
  & span {
    font-size: 5vh;
    color: ${props => props.theme.colorRight};
  }
`

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* height: 60px; */
  height: 8vh;
  padding-top: 1rem;
`
interface NavButtonProps {
  isActive: boolean
}

export const NavButton = styled.button<NavButtonProps>`
  width: 27.5px;
  height: 27.5px;
  font: inherit;
  font-size: 1.5vh;
  line-height: 0;
  border: 2px solid ${props => props.theme.colorOffWhite};
  border-radius: 4px;
  color: ${props => props.theme.colorOffWhite};
  background-color: transparent;
  transform: ${props => props.isActive ? "rotate(180deg)" : "rotate(0deg)"};
  transition: filter .2s, transform 0.5s ease-in-out;
  cursor: pointer;
  &:hover {
    filter: brightness(1.5);
  }
`

