import React from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface ChartViewProps {
  data: Data[]
  layout: Partial<Layout>
}

const ChartView = React.forwardRef<Plot, ChartViewProps>(({ data, layout }, ref) => {
  return (
    <Plot
      ref={ref}
      data={data}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
      config={{ displayModeBar: false }}
    />
  )
})

ChartView.displayName = 'ChartView'

export default ChartView
