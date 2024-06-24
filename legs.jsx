import * as THREE from 'three'
import { useMemo } from 'react'
import Slider from '@mui/joy/Slider'
import Switch from '@mui/joy/Switch'
import { Point } from '@flatten-js/core'
import { Controls, Control, arrowMarker, pointDistanceMarks, angleMark } from './utils'

const Leg = ({sightline, lr, fr, resultant, height, thickness, start}) => {
  const length = height / Math.cos(resultant * Math.PI/180) + 10
  const geometry = useMemo(() => new THREE.CylinderGeometry(thickness[0]/2, thickness[1]/2, length, 8)
    .translate(0, -length/2, 0)
    .rotateX(resultant * Math.PI/180)
    .rotateY(lr * (90 + fr * sightline) * Math.PI/180),
    [sightline, resultant, length, thickness[0], thickness[1]]
  )

  return <mesh position={[start.x, start.y, start.z]}>
    <primitive object={geometry}/>
    <meshStandardMaterial color="orange" />
  </mesh>
}

const toSightlineAndResultant = ({rake, splay}) => {
  // http://blackdogswoodshop.blogspot.com/2020/02/deriving-forumulas-for-sightline-and.html
  const sightline = Math.atan(Math.tan(rake * Math.PI/180) / Math.tan(splay * Math.PI/180))
  const resultant = Math.atan(Math.tan(rake * Math.PI/180) / Math.sin(sightline))
  return { sightline: sightline / Math.PI*180, resultant: resultant / Math.PI*180 }
}

export const legAngles = ({frontSplay, frontRake, backSplay, backRake}) => ({
  front: toSightlineAndResultant({rake: frontRake, splay: frontSplay}),
  back: toSightlineAndResultant({rake: backRake, splay: backSplay})
})

export const Legs = ({height, thickness, reverseTaper, angles, points}) => {
  const th = reverseTaper ? [thickness[1], thickness[0]] : thickness
  return <>
    <Leg lr={1} fr={1} {...angles.front} start={points[0]} height={height} thickness={th}/>
    <Leg lr={-1} fr={1} {...angles.front} start={points[1]} height={height} thickness={th}/>
    <Leg lr={1} fr={-1} {...angles.back} start={points[2]} height={height} thickness={th}/>
    <Leg lr={-1} fr={-1} {...angles.back} start={points[3]} height={height} thickness={th}/>
  </>
}

export const Floor = ({height, shift}) =>
  <mesh rotation-x={-Math.PI/2} position-y={-height} position-z={-shift}>
    <circleGeometry args={[600, 100]} />
    <meshStandardMaterial color="white"/>
  </mesh>

const baseLegDiagram = (resultant, thickness, extent, height, back) => {
  const s = back ? -1 : 1
  const path = `
    M ${-s*thickness[0]/2} 0
    L ${s*thickness[0]/2} 0
    L ${s*(-extent+thickness[1]/2)} -${height}
    L ${s*(-extent-thickness[1]/2)} -${height}`
  const shift = back ? {transform: "translate(100)"} : {}
  return <g {...shift}>
    <path d={path} fill="#ddd" stroke="none"/>
    <line x1={0} y1={0} x2={0} y2={-height} stroke="#666" strokeDasharray={4}/>
    <line x1={-40} y1={0} x2={40} y2={0} stroke="#666" strokeDasharray={back ? "10 4" : "4 4 1 4"}/>
    <text x={0} y={20} textAnchor="middle">
      {back ? "back leg" : "front leg"}
    </text>
    {pointDistanceMarks([new Point(-s*extent, -height), new Point(0, 0)])}
    {angleMark(
      new Point(0, 0), back ? -90 : -90-resultant, back ? -90+resultant : -90,
      {stroke: "white", strokeWidth: 3, paintOrder: "stroke"}
    )}
  </g>
}

export const LegDiagram = ({angles, thickness, reverseTaper, height}) => {
  const frontExtent = height * Math.tan(angles.front.resultant * Math.PI/180)
  const backExtent = height * Math.tan(angles.back.resultant * Math.PI/180)
  const th = reverseTaper ? [thickness[1], thickness[0]] : thickness
  return <svg viewBox={`${-frontExtent-th[1]/2-15} ${-height-15} ${frontExtent+backExtent+th[1]*2+100+30} ${height+20+30}`}>
    <defs>{arrowMarker}</defs>
    {baseLegDiagram(angles.front.resultant, th, frontExtent, height, false)}
    {baseLegDiagram(angles.back.resultant, th, backExtent, height, true)}
  </svg>
}

export const LegControls = ({state, setState}) => {
  return <Controls>
    <Control label="Thickness">
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={20} max={50} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </Control>
    <Control label="Reverse taper">
      <Switch checked={state.reverseTaper}
        onChange={(event) => setState({...state, reverseTaper: event.target.checked})} />
    </Control>
    <Control label="Front splay">
      <Slider value={state.frontSplay} valueLabelDisplay="on"
        min={1} max={30} marks
        onChange={(event, value) => setState({...state, frontSplay: value})} />
    </Control>
    <Control label="Front rake">
      <Slider value={state.frontRake} valueLabelDisplay="on"
        min={1} max={30} marks
        onChange={(event, value) => setState({...state, frontRake: value})} />
    </Control>
    <Control label="Back splay">
      <Slider value={state.backSplay} valueLabelDisplay="on"
        min={1} max={30} marks
        onChange={(event, value) => setState({...state, backSplay: value})} />
    </Control>
    <Control label="Back rake">
      <Slider value={state.backRake} valueLabelDisplay="on"
        min={1} max={30} marks
        onChange={(event, value) => setState({...state, backRake: value})} />
    </Control>
    <Control label="Front offset">
      <Slider value={state.frontOffset} valueLabelDisplay="on"
        min={40} max={100} step={10} marks
        onChange={(event, value) => setState({...state, frontOffset: value})} />
    </Control>
    <Control label="Back offset">
      <Slider value={state.backOffset} valueLabelDisplay="on"
        min={state.edgeOffset+20} max={150} step={10} marks
        onChange={(event, value) => setState({...state, backOffset: value})} />
    </Control>
    <Control label="Edge offset">
      <Slider value={state.edgeOffset} valueLabelDisplay="on"
        min={40} max={90} step={10} marks
        onChange={(event, value) => setState({
          ...state,
          edgeOffset: value,
          backOffset: Math.max(state.backOffset, value+20)
        })} />
    </Control>
  </Controls>
}
