import _ from 'lodash'
import * as THREE from 'three'
import { useMemo } from 'react'

export const Stick = ({start, end, thickness}) => {
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
    <meshStandardMaterial color="blue" />
  </mesh>
}

export const Sticks = ({starts, ends, thickness}) =>
  <>
    {_.zip(starts, ends).map(([start, end], i) =>
      <Stick key={i} start={start} end={end} thickness={thickness}/>
    )}
  </>
