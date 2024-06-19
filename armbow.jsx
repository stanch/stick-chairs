import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point } from '@flatten-js/core'

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
    <meshStandardMaterial color="red" />
  </mesh>
}

export const armbowStickPoints = ({radius, extent, width, height, shift}, splitter) => {
  const arc = new Arc(new Point(0, extent+shift), radius+width/2, 0, Math.PI)
  const points = splitter(arc.length)
  return points
    .map(p => arc.pointAtLength(Math.min(p, arc.length)))
    .map(p => ({x: p.x, z: -p.y, y: height}))
}
