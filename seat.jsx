import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point } from '@flatten-js/core'

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
    <meshStandardMaterial color="#6be092" />
  </mesh>
}

export const dSeatStickPoints = ({radius, extent, thickness, stickMargin}, splitter) => {
  const arc = new Arc(new Point(0, extent), radius-stickMargin, 0, Math.PI)
  const points = splitter(arc.length)
  return points
    .map(p => arc.pointAtLength(Math.min(p, arc.length)))
    .map(p => ({x: p.x, z: -p.y, y: thickness}))
}
