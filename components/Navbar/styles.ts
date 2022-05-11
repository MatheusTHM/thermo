import styled from "styled-components"

export const Title = styled.h1`
  color: ${props => props.theme.colorText};
  & span {
    color: ${props => props.theme.colorRight};
  }
`


export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
`



