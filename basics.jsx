import Slider from '@mui/joy/Slider'
import { Controls, Control } from './utils'

export const BasicControls = ({state, setState}) => {
  return <Controls>
    <Control label="Back angle">
      <Slider value={state.backAngle} valueLabelDisplay="on"
        min={0} max={30} marks
        onChange={(event, value) => setState({...state, backAngle: value})} />
    </Control>
  </Controls>
}
