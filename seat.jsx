import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point } from '@flatten-js/core'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Slider from '@mui/joy/Slider'
import { pointDistanceMarks, pointMarks, Controls, Control } from './utils'

export const DSeat = ({radius, extent, thickness}) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(radius, 0)
    s.lineTo(radius, extent)
    s.absarc(0, extent, radius, 0, Math.PI)
    s.lineTo(-radius, 0)
    s.lineTo(radius, 0)
    return s
  }, [radius, extent])

  return <mesh rotation-x={-Math.PI/2}>
    <extrudeGeometry args={[shape, {depth: thickness}]}/>
    <meshStandardMaterial color="orange" />
  </mesh>
}

export const dSeatStickPoints = ({radius, extent, thickness, stickMargin}, splitter) => {
  const arc = new Arc(new Point(0, extent), radius-stickMargin, 0, Math.PI)
  const points = splitter(arc.length)
  return points
    .map(p => arc.pointAtLength(Math.min(p, arc.length)))
    .map(p => ({x: p.x, z: -p.y, y: thickness}))
}

export const DSeatStickPointDiagram = ({radius, extent, stickMargin, points}) => {
  const seatArc = new Arc(new Point(0, extent), radius, 0, Math.PI)
    .svg().match(/d="([^"]+)"/)[1]
  const stickArc = new Arc(new Point(0, extent), radius-stickMargin, 0, Math.PI)
    .svg().match(/d="([^"]+)"/)[1]
  const localPoints = points.map(p => new Point(p.x, -p.z))

  return <svg viewBox={`${-radius-15} -15 ${radius*2+30} ${radius+extent+30}`}>
    <rect x={-radius} y1={0} width={radius*2} height={extent} fill="#ddd" stroke="none"/>
    <path d={seatArc} fill="#ddd" stroke="none"/>
    <path d={stickArc} fill="none" stroke="black" strokeDasharray="4"/>
    {pointMarks(localPoints)}
    {pointDistanceMarks(localPoints)}
  </svg>
}

export const SeatControls = ({state, setState}) => {
  return <Controls>
    <Control>
      <Select defaultValue="d">
        <Option value="d">D-shaped</Option>
      </Select>
    </Control>
    <Control label="Radius">
      <Slider value={state.radius} valueLabelDisplay="on"
        min={250} max={350} step={10} marks
        onChange={(event, value) => setState({...state, radius: value})} />
    </Control>
    <Control label="Straight section">
      <Slider value={state.extent} valueLabelDisplay="on"
        min={0} max={200} step={10} marks
        onChange={(event, value) => setState({...state, extent: value})} />
    </Control>
    <Control label="Thickness">
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={35} max={55} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </Control>
  </Controls>
}
