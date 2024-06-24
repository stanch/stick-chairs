import _ from 'lodash'
import { Arc, Segment } from '@flatten-js/core'
import Grid from '@mui/joy/Grid'

export const arrowMarker = <marker
    id="arrow"
    viewBox="0 0 10 6"
    refX="10"
    refY="3"
    markerUnits="strokeWidth"
    markerWidth="10"
    markerHeight="6"
    orient="auto-start-reverse">
    <path d="M 0 0 L 10 3 L 0 6 z" fill="#444" />
  </marker>

export const pointDistanceMarks = points =>
  _.zip(_.dropRight(points, 1), _.drop(points, 1))
    .map(([p1, p2], i) => {
      const segment = new Segment(p1, p2)
      const textLocation = segment.middle()
        .translate(segment.tangentInStart().rotate90CCW().multiply(20))
      return <g key={i}>
        <text x={textLocation.x} y={textLocation.y}
          dominantBaseline="middle" textAnchor="middle">
          {Math.round(segment.length)}
        </text>
        <line x1={p1.x} x2={p2.x} y1={p1.y} y2={p2.y}
          markerStart="url(#arrow)" markerEnd="url(#arrow)"
          stroke="#444"/>
      </g>
    })

export const angleMark = (point, start, end, customStroke) => {
  const arc = new Arc(point, 30, start * Math.PI/180, end * Math.PI/180)
    .svg().match(/d="([^"]+)"/)[1]

  const textLocation = new Segment(point, point.translate(50, 0))
    .rotate((start + end)/2 * Math.PI/180, point)
    .end

  return <g>
    <text x={textLocation.x} y={textLocation.y}
      dominantBaseline="middle" textAnchor="middle"
      {...customStroke}>
      {Math.round(end-start)}˚
    </text>
    <path d={arc} stroke="#444" fill="none" strokeWidth={1.5}/>
  </g>
}

export const pointMarks = points =>
  points.map((p, i) =>
    <circle key={i} r={4} cx={p.x} cy={p.y} fill="none" stroke="#666"/>
  )

export const Controls = ({children}) =>
  <Grid container justifyContent="center" alignItems="center" rowSpacing={3} mt={1}>
    {children}
  </Grid>

export const Control = ({label, children}) =>
  <>
    {label && <Grid xs={3}>{label}</Grid>}
    <Grid xs={label ? 9 : 12}>{children}</Grid>
  </>
