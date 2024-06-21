import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point, Segment, Multiline, Line } from '@flatten-js/core'
import Slider from '@mui/joy/Slider'
import { pointDistanceMarks, pointMarks, Controls, Control } from './utils'

export const Seat = ({width, depth, thickness}) => {
  const radius = width/2
  const extent = depth - radius
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

export const seatStickPoints = ({width, depth, thickness, stickMargin}, splitter) => {
  const radius = width/2
  const extent = depth - radius
  const arc = new Arc(new Point(0, extent), radius-stickMargin, 0, Math.PI)
  const points = splitter(arc.length)
  return points
    .map(p => arc.pointAtLength(Math.min(p, arc.length)))
    .map(p => ({x: p.x, z: -p.y, y: thickness}))
}

export const seatLegPoints = ({width, depth}, {frontOffset, backOffset, edgeOffset}) => {
  const radius = width/2
  const extent = depth - radius
  const arc = new Arc(new Point(0, extent), radius-edgeOffset, 0, Math.PI)
  const find = o => {
    if (o > extent) {
      return arc.intersect(new Line(new Point(-radius, o), new Point(radius, o)))
    }
    return [new Point(-radius+edgeOffset, o), new Point(radius-edgeOffset, o)]
  }
  const points = [...find(frontOffset), ...find(depth-backOffset)]
  return points.map(p => ({x: p.x, z: -p.y, y: 0}))
}

export const SeatStickPointDiagram = ({width, depth, stickMargin, points}) => {
  const radius = width/2
  const extent = depth - radius
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
    <Control label="Width">
      <Slider value={state.width} valueLabelDisplay="on"
        min={500} max={700} step={20} marks
        onChange={(event, value) => setState({
          ...state,
          width: value,
          depth: Math.min(Math.max(state.depth, state.width/2+50), state.width/2+200)
        })} />
    </Control>
    <Control label="Depth">
      <Slider value={state.depth} valueLabelDisplay="on"
        min={Math.max(state.width/2+50, 330)} max={Math.min(state.width/2+200, 430)} step={10} marks
        onChange={(event, value) => setState({...state, depth: value})} />
    </Control>
    <Control label="Thickness">
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={35} max={55} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </Control>
  </Controls>
}
