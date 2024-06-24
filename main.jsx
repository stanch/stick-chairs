import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BasicControls } from './basics'
import { Seat, seatLegPoints, seatStickPoints, SeatControls, SeatDiagram, SeatLegDiagram, SeatStickDiagram } from './seat'
import { Legs, legAngles, Floor, LegControls } from './legs'
import { Armbow, armbowShift, armbowStickPoints, ArmbowControls, ArmbowDiagram, ArmbowStickDiagram } from './armbow'
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
  const [basicState, setBasicState] = useState({
    seatHeight: 450,
    seatAngle: 3,
    backAngle: 14
  })

  const [seatState, setSeatState] = useState({
    width: 500,
    depth: 390,
    thickness: 40,
    stickMargin: 25
  })

  const [legState, setLegState] = useState({
    thickness: [25, 40],
    reverseTaper: false,
    edgeOffset: 70,
    frontOffset: 50,
    backOffset: 100,
    frontSplay: 15,
    frontRake: 12,
    backSplay: 16,
    backRake: 19
  })

  const [armbowState, setArmbowState] = useState({
    radius: 250,
    extent: 75,
    width: 50,
    height: 210,
    thickness: 20
  })

  const [stickState, setStickState] = useState({
    number: 8,
    variation: 0.9,
    thickness: 20
  })

  const shift = armbowShift(basicState, seatState, armbowState)

  const legPoints = seatLegPoints(seatState, legState)
  const angles = legAngles(legState)

  const seatPoints = seatStickPoints(
    seatState,
    length => graduateCumulative(length, stickState.number-1, 1)
  )

  const armbowPoints = armbowStickPoints(
    {...armbowState, shift},
    length => graduateCumulative(length, stickState.number-1, stickState.variation)
  )

  const customTheme = extendTheme({
    fontFamily: {
      display: 'Source Sans 3',
      body: 'Source Sans 3'
    }
  })

  const viz = <Box sx={{height: "40vh"}}>
    <Canvas camera={{near: 1, far: 2000, position: [600, 600, 1000]}}>
      <OrbitControls minDistance={300} maxDistance={1000}/>
      <ambientLight color="white" intensity={0.1}/>
      <directionalLight position={[0, 1000, 1000]} color="white" intensity={2}/>
      <directionalLight position={[0, -1000, 1000]} color="white" intensity={2}/>
      {/* <Floor height={basicState.seatHeight} shift={seatState.depth/2}/> */}
      <Legs {...legState} angles={angles} height={basicState.seatHeight} points={legPoints}/>
      <Seat {...seatState}/>
      <Armbow {...armbowState} shift={shift}/>
      <Sticks starts={seatPoints} ends={armbowPoints} thickness={stickState.thickness}/>
    </Canvas>
  </Box>

  const controls = <Tabs defaultValue={0} sx={{height: "50vh", overflowY: "auto"}}>
    <TabList sticky="top">
      <Tab>Basics</Tab>
      <Tab>Seat</Tab>
      <Tab>Legs</Tab>
      <Tab>Arms</Tab>
      <Tab>Sticks</Tab>
    </TabList>
    <TabPanel value={0}>
      <BasicControls state={basicState} setState={setBasicState}/>
    </TabPanel>
    <TabPanel value={1}>
      <SeatControls state={seatState} setState={setSeatState}/>
    </TabPanel>
    <TabPanel value={2}>
      <LegControls state={legState} setState={setLegState}/>
    </TabPanel>
    <TabPanel value={3}>
      <ArmbowControls state={armbowState} setState={setArmbowState}/>
    </TabPanel>
    <TabPanel value={4}>
      <StickControls state={stickState} setState={setStickState}/>
    </TabPanel>
  </Tabs>

  const diagrams = <Tabs defaultValue={0} sx={{height: "90vh", overflowY: "auto"}}>
    <TabList sticky="top">
      <Tab>Seat</Tab>
      <Tab>Legs</Tab>
      <Tab>Arms</Tab>
      <Tab>Sticks</Tab>
    </TabList>
    <TabPanel value={0}>
      <SeatDiagram {...seatState}/>
    </TabPanel>
    <TabPanel value={1}>
      <SeatLegDiagram {...seatState} angles={angles} edgeOffset={legState.edgeOffset} points={legPoints}/>
    </TabPanel>
    <TabPanel value={2}>
      <ArmbowDiagram {...armbowState}/>
    </TabPanel>
    <TabPanel value={3}>
      <SeatStickDiagram {...seatState} points={seatPoints}/>
      <ArmbowStickDiagram {...armbowState} shift={shift} points={armbowPoints}/>
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
