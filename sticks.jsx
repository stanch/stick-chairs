import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import Slider from '@mui/joy/Slider'
import { Controls, Control } from './utils'

const Stick = ({start, end, thickness}) => {
  const startVector = new THREE.Vector3(start.x, start.y, start.z)
  const endVector = new THREE.Vector3(end.x, end.y, end.z)
  const direction = new THREE.Vector3().subVectors(endVector, startVector)

  const geometry = useMemo(() => new THREE.CylinderGeometry(thickness/2, thickness/2, direction.length(), 8)
    .translate(0, direction.length()/2, 0)
    .rotateX(Math.PI/2),
    [start.x, start.y, start.z, end.x, end.y, end.z, thickness]
  )

  return <mesh position={startVector} onUpdate={self => self.lookAt(endVector)}>
    <primitive object={geometry}/>
    <meshStandardMaterial color="orange" />
  </mesh>
}

export const Sticks = ({starts, ends, thickness}) =>
  <>
    {_.zip(starts, ends).map(([start, end], i) =>
      <Stick key={i} start={start} end={end} thickness={thickness}/>
    )}
  </>

export const StickControls = ({state, setState}) => {
  return <Controls mt={1}>
    <Control label="Number of sticks">
      <Slider value={state.number} valueLabelDisplay="on"
        min={3} max={12} marks
        onChange={(event, value) => setState({...state, number: value})} />
    </Control>
    <Control label="Spacing variation">
      <Slider value={state.variation} valueLabelDisplay="off"
        min={0.5} max={2} step={0.1} shiftStep={0.1}
        onChange={(event, value) => setState({...state, variation: value})} />
    </Control>
    <Control label="Thickness">
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={16} max={24} step={2} shiftStep={4} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </Control>
  </Controls>
}
