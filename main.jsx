import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DSeat, dSeatStickPoints, SeatControls, DSeatStickPointDiagram } from './seat'
import { Armbow, armbowStickPoints, ArmbowControls, ArmbowStickPointDiagram } from './armbow'
import { graduateCumulative } from './graduate'
import { Sticks, StickControls } from './sticks'
import Container from '@mui/joy/Container'
import Box from '@mui/joy/Box'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import TabPanel from '@mui/joy/TabPanel'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'

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
    variation: 0.9,
    thickness: 20
  })

  const seatPoints = dSeatStickPoints(
    seatState,
    length => graduateCumulative(length, stickState.number-1, 1)
  )

  const armbowPoints = armbowStickPoints(
    armbowState,
    length => graduateCumulative(length, stickState.number-1, stickState.variation)
  )

  const customTheme = extendTheme({
    fontFamily: {
      display: 'Source Sans 3',
      body: 'Source Sans 3'
    }
  })

  const viz = <Box sx={{height: "40vh"}}>
    <Canvas camera={{near: 1, far: 2000, position: [0, 1000, 1000]}}>
      <OrbitControls minDistance={300} maxDistance={1000}/>
      <ambientLight color="white" intensity={2}/>
      <directionalLight position={[0, 1000, 1000]} color="white" intensity={2}/>
      <directionalLight position={[0, -1000, 1000]} color="white" intensity={2}/>
      <DSeat {...seatState}/>
      <Armbow {...armbowState}/>
      <Sticks starts={seatPoints} ends={armbowPoints} thickness={stickState.thickness}/>
    </Canvas>
  </Box>

  const controls = <Tabs defaultValue={0} sx={{height: "50vh", overflowY: "auto"}}>
    <TabList sticky="top">
      <Tab>Seat</Tab>
      <Tab>Legs</Tab>
      <Tab>Armbow</Tab>
      <Tab>Sticks</Tab>
    </TabList>
    <TabPanel value={0}>
      <SeatControls state={seatState} setState={setSeatState}/>
    </TabPanel>
    <TabPanel value={1}>
      TBD
    </TabPanel>
    <TabPanel value={2}>
      <ArmbowControls state={armbowState} setState={setArmbowState}/>
    </TabPanel>
    <TabPanel value={3}>
      <StickControls state={stickState} setState={setStickState}/>
    </TabPanel>
  </Tabs>

  const diagrams = <Tabs defaultValue={0} sx={{height: "90vh", overflowY: "auto"}}>
    <TabList sticky="top">
      <Tab>Sticks</Tab>
    </TabList>
    <TabPanel value={0}>
      <DSeatStickPointDiagram {...seatState} points={seatPoints}/>
      <ArmbowStickPointDiagram {...armbowState} points={armbowPoints}/>
    </TabPanel>
  </Tabs>

  return <CssVarsProvider theme={customTheme}>
    <Container maxWidth="sm">
      <Tabs defaultValue={0}>
        <TabList sticky="top" tabFlex={1}>
          <Tab>Designing</Tab>
          <Tab>Marking out</Tab>
        </TabList>
        <TabPanel value={0}>
          {viz}{controls}
        </TabPanel>
        <TabPanel value={1}>
          {diagrams}
        </TabPanel>
      </Tabs>
    </Container>
  </CssVarsProvider>
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
