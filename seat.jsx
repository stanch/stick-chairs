import * as THREE from 'three'
import { useMemo } from 'react'
import { Arc, Point } from '@flatten-js/core'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Stack from '@mui/joy/Stack'
import Slider from '@mui/joy/Slider'

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

export const SeatControls = ({state, setState}) => {
  return <Stack gap={2}>
    <FormControl>
      <Select defaultValue="d">
        <Option value="d">D-shaped</Option>
      </Select>
    </FormControl>
    <FormControl>
      <FormLabel>Radius</FormLabel>
      <Slider value={state.radius} valueLabelDisplay="on"
        min={250} max={350} step={10} marks
        onChange={(event, value) => setState({...state, radius: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Straight section</FormLabel>
      <Slider value={state.extent} valueLabelDisplay="on"
        min={0} max={200} step={10} marks
        onChange={(event, value) => setState({...state, extent: value})} />
    </FormControl>
    <FormControl>
      <FormLabel>Thickness</FormLabel>
      <Slider value={state.thickness} valueLabelDisplay="on"
        min={35} max={55} step={5} marks
        onChange={(event, value) => setState({...state, thickness: value})} />
    </FormControl>
  </Stack>
}
