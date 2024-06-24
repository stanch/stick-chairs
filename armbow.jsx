import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point, Segment } from '@flatten-js/core'
import Slider from '@mui/joy/Slider'
import { baseStickDiagram } from './sticks'
import { arrowMarker, pointDistanceMarks, Controls, Control } from './utils'

export const Armbow = ({radius, extent, width, thickness, height, shift}) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(radius, width/2)
    s.lineTo(radius, extent)
    s.absarc(0, extent, radius, 0, Math.PI)
    s.lineTo(-radius, width/2)
    s.absarc(-radius-width/2, width/2, width/2, Math.PI*2, Math.PI, true)
    s.lineTo(-radius-width, extent)
    s.absarc(0, extent, radius+width, Math.PI, 0, true)
    s.lineTo(radius+width, width/2)
    s.absarc(radius+width/2, width/2, width/2, Math.PI*2, Math.PI, true)
    return s
  }, [radius, extent, width])

  return <mesh rotation-x={-Math.PI/2} position-y={height} position-z={-shift}>
    <extrudeGeometry args={[shape, {depth: thickness, bevel: false}]}/>
    <meshStandardMaterial color="orange" />
  </mesh>
}

export const armbowShift = ({backAngle}, seat, {extent, radius, width, height}) => {
  const seatStickPosition = seat.depth - seat.stickMargin
  const targetArmbowPosition = seatStickPosition + Math.tan(backAngle * Math.PI/180) * height
  return targetArmbowPosition - (extent + radius + width/2)
}

export const armbowStickPoints = ({radius, extent, width, height, shift}, splitter) => {
  const arc = new Arc(new Point(0, extent+shift), radius+width/2, 0, Math.PI)
  const points = splitter(arc.length)
  return points
    .map(p => arc.pointAtLength(Math.min(p, arc.length)))
    .map(p => ({x: p.x, z: -p.y, y: height}))
}

const baseDiagram = (radius, extent, width) => {
  const center = new Point(0, extent)
  const arc = new Arc(center, radius+width/2, 0, Math.PI)
  .svg().match(/d="([^"]+)"/)[1]

  return {center, armbow: <g>
    <circle r={width/2} cx={-radius-width/2} cy={width/2} fill="#ddd"/>
    <circle r={width/2} cx={radius+width/2} cy={width/2} fill="#ddd"/>
    <rect x={-radius-width} y={width/2} width={width} height={extent} fill="#ddd"/>
    <rect x={radius} y={width/2} width={width} height={extent} fill="#ddd"/>
    <path d={arc} fill="none" stroke="#ddd" strokeWidth={width}/>
  </g>}
}

export const ArmbowDiagram = ({radius, extent, width}) => {
  const { center, armbow } = baseDiagram(radius, extent, width)

  const innerPoint = new Segment(center, new Point(0, extent+radius))
    .rotate(30 * Math.PI/180, center)
    .end
  const outerPoint = new Segment(center, new Point(0, extent+radius+width))
    .rotate(30 * Math.PI/180, center)
    .end

  return <svg viewBox={`${-radius-width-15} ${-15} ${(radius+width)*2+30} ${extent+radius+width+30}`}>
    <defs>{arrowMarker}</defs>
    {armbow}
    <line x1={-radius-width} y1={0} x2={radius+width} y2={0} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={-radius-width} y1={extent} x2={radius+width} y2={extent} fill="none" stroke="#666" strokeDasharray="4"/>
    {extent > 0 && pointDistanceMarks([new Point(0, 0), center])}
    {pointDistanceMarks([center, innerPoint])}
    {pointDistanceMarks([innerPoint, outerPoint])}
  </svg>
}

export const ArmbowStickDiagram = ({radius, extent, width, shift, points}) => {
  const { armbow } = baseDiagram(radius, extent, width)
  const localPoints = points.map(p => new Point(p.x, -shift-p.z))

  return <svg viewBox={`${-radius-width-15} ${-15} ${(radius+width)*2+30} ${extent+radius+width+30}`}>
    <defs>{arrowMarker}</defs>
    {armbow}
    {baseStickDiagram(extent, radius+width, width/2, localPoints)}
  </svg>
}

export const ArmbowControls = ({state, setState}) => {
  return <Controls>
    <Control label="Radius">
      <Slider value={state.radius} valueLabelDisplay="on"
        min={250} max={350} step={10} marks
        onChange={(event, value) => setState({...state, radius: value})} />
    </Control>
    <Control label="Straight section">
      <Slider value={state.extent} valueLabelDisplay="on"
        min={Math.ceil(state.width/2/5)*5} max={100} step={5} marks
        onChange={(event, value) => setState({...state, extent: value})} />
    </Control>
    <Control label="Height">
      <Slider value={state.height} valueLabelDisplay="on"
        min={150} max={250} step={10} marks
        onChange={(event, value) => setState({...state, height: value})} />
    </Control>
    <Control label="Width">
      <Slider value={state.width} valueLabelDisplay="on"
        min={40} max={70} step={5} marks
        onChange={(event, value) => setState({
          ...state,
          width: value,
          extent: Math.max(state.extent, Math.ceil(value/2/5)*5)
        })} />
    </Control>
    <Control label="Thickness">
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={15} max={30} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </Control>
  </Controls>
}
