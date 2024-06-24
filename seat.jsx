import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point, Segment, Line } from '@flatten-js/core'
import Slider from '@mui/joy/Slider'
import { arrowMarker, pointMarks, pointDistanceMarks, angleMark, Controls, Control } from './utils'
import { baseStickDiagram } from './sticks'

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

const baseDiagram = (width, depth) => {
  const radius = width/2
  const extent = depth - radius
  const center = new Point(0, extent)
  const arc = new Arc(center, radius, 0, Math.PI)
    .svg().match(/d="([^"]+)"/)[1]

  return {radius, extent, center, seat: (<g>
    <rect x={-radius} y1={0} width={radius*2} height={extent} fill="#ddd" stroke="none"/>
    <path d={arc} fill="#ddd" stroke="none"/>
  </g>)}
}

export const SeatDiagram = ({width, depth}) => {
  const { radius, extent, center, seat } = baseDiagram(width, depth)

  const outerPoint = new Segment(center, new Point(0, radius+extent))
    .rotate(30 * Math.PI/180, center)
    .end

  return <svg viewBox={`${-radius-15} -15 ${radius*2+30} ${radius+extent+30}`}>
    <defs>{arrowMarker}</defs>
    {seat}
    <line x1={-radius} y1={extent} x2={radius} y2={extent} fill="none" stroke="#666" strokeDasharray="4"/>
    {pointDistanceMarks([new Point(0, 0), center])}
    {pointDistanceMarks([center, outerPoint])}
  </svg>
}

export const SeatLegDiagram = ({width, depth, angles, edgeOffset, points}) => {
  const { radius, extent, center, seat } = baseDiagram(width, depth)
  const localPoints = points.map(p => new Point(p.x, -p.z))

  const arc = new Arc(center, radius-edgeOffset, 0, Math.PI)
    .svg().match(/d="([^"]+)"/)[1]

  const outerPoint = center.translate(
    new Segment(center, localPoints[2]).tangentInStart().multiply(radius)
  )

  const frontline = new Segment(
    localPoints[0],
    new Segment(localPoints[0], localPoints[1]).middle()
  ).rotate(angles.front.sightline * Math.PI/180, localPoints[0])

  const backline = new Segment(
    localPoints[3],
    new Segment(localPoints[3], localPoints[2]).middle()
  ).rotate(angles.back.sightline * Math.PI/180, localPoints[3])

  return <svg viewBox={`${-radius-15} -15 ${radius*2+30} ${radius+extent+30}`}>
    <defs>{arrowMarker}</defs>
    {seat}
    <path d={arc} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={-radius+edgeOffset} y1={0} x2={-radius+edgeOffset} y2={extent} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={radius-edgeOffset} y1={0} x2={radius-edgeOffset} y2={extent} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={localPoints[0].x} y1={localPoints[0].y} x2={localPoints[1].x} y2={localPoints[1].y} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={localPoints[2].x} y1={localPoints[2].y} x2={localPoints[3].x} y2={localPoints[3].y} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={frontline.start.x} y1={frontline.start.y} x2={frontline.end.x} y2={frontline.end.y} fill="none" stroke="#666" strokeDasharray="4 4 1 4"/>
    <line x1={backline.start.x} y1={backline.start.y} x2={backline.end.x} y2={backline.end.y} fill="none" stroke="#666" strokeDasharray="10 4"/>
    {pointMarks(localPoints)}
    {pointDistanceMarks([new Point(0, 0), new Segment(localPoints[0], localPoints[1]).middle()])}
    {pointDistanceMarks([new Segment(localPoints[2], localPoints[3]).middle(), new Point(0, radius+extent)])}
    {pointDistanceMarks([localPoints[2], outerPoint])}
    {angleMark(localPoints[0], 0, angles.front.sightline)}
    {angleMark(localPoints[3], 180, 180+angles.back.sightline)}
  </svg>
}

export const SeatStickDiagram = ({width, depth, stickMargin, points}) => {
  const { radius, extent, seat } = baseDiagram(width, depth)
  const localPoints = points.map(p => new Point(p.x, -p.z))

  return <svg viewBox={`${-radius-15} -15 ${radius*2+30} ${radius+extent+30}`}>
    <defs>{arrowMarker}</defs>
    {seat}
    {baseStickDiagram(extent, radius, stickMargin, localPoints)}
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
