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
  width: 100%;
  height: 63px;
  margin-bottom: 4px;
`

const result:resultProps = {
  "right": "colorRight",
  "place": "colorPlace",
  "wrong": "colorWrong"
}

export const Letter = styled.div<LetterProps>`
  width: 63px;
  height: 63px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 600;
  font-size: 35px;
  text-transform: uppercase;
  color: ${props => props.theme.colorText};
  border: 4px solid ${props => props.theme.colorBorder};
  border-bottom: ${props => props.active && `10px solid ${props.theme.colorBorder}`};
  margin-bottom: ${props => props.active && `-1px`};
  cursor: ${props => props.activeRow && `pointer`};
  background: ${props => !props.activeRow && props.theme.colorLetter};
  border-color: ${props => !props.activeRow && props.theme.colorLetter};
  background: ${props => props.sent && props.theme[result[props.status]]};
  border: ${props => props.sent && "none"}
  
`

