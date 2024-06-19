import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DSeat, dSeatStickPoints } from './seat.jsx'
import { Armbow, armbowStickPoints } from './armbow.jsx'
import { graduateCumulative } from './graduate.js'
import { Sticks } from './sticks.jsx'

const Slider = ({title, min, max, step, value, format, hideValue, onChange}) => {
  const formatted = format ? format(value) : value
  return <div>
    <label>{title}{hideValue ? "" : `: ${formatted}`}</label>
    <input type="range"
      min={min} max={max} step={step ?? 1} value={value}
      onChange={e => onChange(e.target.value-0)} 
    />
  </div>
}

const App = () => {
  const [seatState, setSeatState] = useState({
    radius: 250,
    extent: 140,
    thickness: 40,
    stickMargin: 25
  })

  const [armbowState, setArmbowState] = useState({
    radius: 250,
    extent: 50,
    width: 50,
    height: 210,
    shift: 100,
    thickness: 20
  })

  const [stickState, setStickState] = useState({
    number: 8,
    variation: 1.2,
    thickness: 20
  })

  const onChange = (stateGetter, stateSetter, id) => (value) =>
    stateSetter({...stateGetter, [id]: value})

  const seatPoints = dSeatStickPoints(
    seatState,
    length => graduateCumulative(length, stickState.number-1, 1)
  )

  const armbowPoints = armbowStickPoints(
    armbowState,
    length => graduateCumulative(length, stickState.number-1, stickState.variation)
  )

  return <>
    <Canvas camera={{near: 1, far: 2000, position: [0, 1000, 1000]}}>
      <OrbitControls/>
      <ambientLight color="white" intensity={2}/>
      <directionalLight position={[0, 1000, 1000]} color="white" intensity={2}/>
      <DSeat {...seatState}/>
      <Armbow {...armbowState}/>
      <Sticks starts={seatPoints} ends={armbowPoints} thickness={stickState.thickness}/>
    </Canvas>
    <Slider id="sticks" title="Sticks"
      min={3} max={12} step={1}
      value={stickState.number} onChange={onChange(stickState, setStickState, "number")}/>
    <Slider id="variation" title="Variation"
      min={0.5} max={2} step={0.1} hideValue={false}
      value={stickState.variation} onChange={onChange(stickState, setStickState, "variation")}/>
  </>
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
