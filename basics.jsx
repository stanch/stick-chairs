import Slider from '@mui/joy/Slider'
import { Controls, Control } from './utils'

export const BasicControls = ({state, setState}) => {
  return <Controls>
    <Control label="Seat height">
      <Slider value={state.seatHeight} valueLabelDisplay="on"
        min={400} max={550} step={10} marks
        onChange={(event, value) => setState({...state, seatHeight: value})} />
    </Control>
    {/* <Control label="Seat angle">
      <Slider value={state.seatAngle} valueLabelDisplay="on"
        min={0} max={10} marks
        onChange={(event, value) => setState({...state, seatAngle: value})} />
    </Control> */}
    <Control label="Back angle">
      <Slider value={state.backAngle} valueLabelDisplay="on"
        min={0} max={30} marks
        onChange={(event, value) => setState({...state, backAngle: value})} />
    </Control>
  </Controls>
}
