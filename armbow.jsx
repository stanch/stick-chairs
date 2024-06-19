import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point } from '@flatten-js/core'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Stack from '@mui/joy/Stack'
import Slider from '@mui/joy/Slider'

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

export const ArmbowControls = ({state, setState}) => {
  return <Stack gap={2}>
    <FormControl>
      <FormLabel>Radius</FormLabel>
      <Slider value={state.radius} valueLabelDisplay="on"
        min={250} max={350} step={10} marks
        onChange={(event, value) => setState({...state, radius: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Straight section</FormLabel>
      <Slider value={state.extent} valueLabelDisplay="on"
        min={0} max={100} step={10} marks
        onChange={(event, value) => setState({...state, extent: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Height</FormLabel>
      <Slider value={state.height} valueLabelDisplay="on"
        min={150} max={250} step={10} marks
        onChange={(event, value) => setState({...state, height: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Shift</FormLabel>
      <Slider value={state.shift} valueLabelDisplay="on"
        min={0} max={300} step={50} marks
        onChange={(event, value) => setState({...state, shift: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Width</FormLabel>
      <Slider value={state.width} valueLabelDisplay="on"
        min={35} max={70} step={5} marks
        onChange={(event, value) => setState({...state, width: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Thickness</FormLabel>
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={15} max={30} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </FormControl>
  </Stack>
}
