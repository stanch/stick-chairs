import _ from 'lodash'
import { Segment } from '@flatten-js/core'

export const pointDistanceMarks = points =>
  _.zip(_.dropRight(points, 1), _.drop(points, 1))
    .map(([p1, p2], i) => {
      const segment = new Segment(p1, p2)
      const textLocation = segment.rotate(Math.PI/2, segment.middle())
        .pointAtLength(segment.length*3/4)
      return <g key={i}>
        <text x={textLocation.x} y={textLocation.y}
          dominantBaseline="middle" textAnchor="middle">
          {Math.round(p1.distanceTo(p2)[0])}
        </text>
        <line x1={p1.x} x2={p2.x} y1={p1.y} y2={p2.y} stroke="black"/>
      </g>
    })

export const pointMarks = points =>
  points.map((p, i) =>
    <circle key={i} r={4} cx={p.x} cy={p.y} fill="none" stroke="black"/>
  )
