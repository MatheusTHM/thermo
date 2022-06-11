import styled from "styled-components"

interface LetterProps {
  active: boolean
  activeRow: boolean
  sent: boolean
  status: string
}

interface resultProps {
  [key: string]: any;
}

export const Row = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: max-content;
  height: 4rem;
  margin-bottom: .25rem;
`

const result:resultProps = {
  "right": "colorRight",
  "place": "colorPlace",
  "wrong": "colorWrong"
}

export const Letter = styled.div<LetterProps>`
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .4rem;
  font-weight: 600;
  font-size: 2rem;
  text-transform: uppercase;
  color: ${props => props.theme.colorText};
  border: .3rem solid ${props => props.theme.colorBorder};
  border-bottom: ${props => props.active && `.6rem solid ${props.theme.colorBorder}`};
  margin-bottom: ${props => props.active && `-.1rem`};
  cursor: ${props => props.activeRow && `pointer`};
  background: ${props => !props.activeRow && props.theme.colorLetter};
  border-color: ${props => !props.activeRow && props.theme.colorLetter};
  background: ${props => props.sent && props.theme[result[props.status]]};
  border: ${props => props.sent && "none"};
  :nth-child(n+2) {
    margin-left: .25rem;
  }
`

