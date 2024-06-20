import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point } from '@flatten-js/core'
import Slider from '@mui/joy/Slider'
import { pointDistanceMarks, pointMarks, Controls, Control } from './utils'

export const Armbow = ({radius, extent, width, thickness, height, shift}) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(radius, 0)
    s.lineTo(radius, extent)
    s.absarc(0, extent, radius, 0, Math.PI)
    s.lineTo(-radius, 0)
    s.absarc(-radius-width/2, 0, width/2, Math.PI*2, Math.PI, true)
    s.lineTo(-radius-width, extent)
    s.absarc(0, extent, radius+width, Math.PI, 0, true)
    s.lineTo(radius+width, 0)
    s.absarc(radius+width/2, 0, width/2, Math.PI*2, Math.PI, true)
    return s
  }, [radius, extent, width])

  return <mesh rotation-x={-Math.PI/2} position-y={height} position-z={-shift}>
    <extrudeGeometry args={[shape, {depth: thickness, bevel: false}]}/>
    <meshStandardMaterial color="orange" />
  </mesh>
}

export const armbowShift = ({backAngle}, seat, {extent, radius, width, height}) => {
  const seatStickPosition = seat.extent + seat.radius - seat.stickMargin
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

export const ArmbowStickPointDiagram = ({radius, extent, width, shift, points}) => {
  const stickArc = new Arc(new Point(0, extent), radius+width/2, 0, Math.PI)
    .svg().match(/d="([^"]+)"/)[1]
  const localPoints = points.map(p => new Point(p.x, -shift-p.z))

  return <svg viewBox={`${-radius-width-15} ${-15-width/2} ${(radius+width)*2+30} ${extent+radius+width*1.5+30}`}>
    <circle r={width/2} cx={-radius-width/2} cy={0} fill="#ddd"/>
    <circle r={width/2} cx={radius+width/2} cy={0} fill="#ddd"/>
    <rect x={-radius-width} y={0} width={width} height={extent} fill="#ddd"/>
    <rect x={radius} y={0} width={width} height={extent} fill="#ddd"/>
    <path d={stickArc} fill="none" stroke="#ddd" strokeWidth={width}/>
    <path d={stickArc} fill="none" stroke="black" strokeDasharray="4"/>
    {pointMarks(localPoints)}
    {pointDistanceMarks(localPoints)}
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
        min={0} max={100} step={10} marks
        onChange={(event, value) => setState({...state, extent: value})} />
    </Control>
    <Control label="Height">
      <Slider value={state.height} valueLabelDisplay="on"
        min={150} max={250} step={10} marks
        onChange={(event, value) => setState({...state, height: value})} />
    </Control>
    <Control label="Width">
      <Slider value={state.width} valueLabelDisplay="on"
        min={35} max={70} step={5} marks
        onChange={(event, value) => setState({...state, width: value})} />
    </Control>
    <Control label="Thickness">
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={15} max={30} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </Control>
  </Controls>
}
