import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'
import Slider from '@mui/joy/Slider'
import { Arc, Point, Segment } from '@flatten-js/core'
import { Controls, Control, pointMarks, pointDistanceMarks } from './utils'

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

export const baseStickDiagram = (extent, radius, margin, points) => {
  const center = new Point(0, extent)
  const arc = new Arc(center, radius-margin, 0, Math.PI)
    .svg().match(/d="([^"]+)"/)[1]

  const withExtraPoint = points.length % 2 ?
    points :
    [
      ..._.take(points, points.length / 2),
      new Segment(
        points[points.length / 2 - 1],
        points[points.length / 2]
      ).middle(),
      ..._.takeRight(points, points.length / 2)
    ]

  const middlePoint = points[Math.floor((points.length+1)/2)]
  const outerPoint = center.translate(
    new Segment(center, middlePoint).tangentInStart().multiply(radius)
  )

  return <g>
    <line x1={0} y1={0} x2={0} y2={radius+extent} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={-radius+margin} y1={0} x2={-radius+margin} y2={extent} fill="none" stroke="#666" strokeDasharray="4"/>
    <line x1={radius-margin} y1={0} x2={radius-margin} y2={extent} fill="none" stroke="#666" strokeDasharray="4"/>
    <path d={arc} fill="none" stroke="#666" strokeDasharray="4"/>
    {pointMarks(points)}
    {pointDistanceMarks(withExtraPoint)}
    {pointDistanceMarks([middlePoint, outerPoint])}
  </g>
}

export const StickControls = ({state, setState}) => {
  return <Controls>
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
