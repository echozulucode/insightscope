import React, { useRef } from 'react'
import Plot from 'react-plotly.js'
import ChartToolbar from '../components/ChartToolbar'

interface ChartViewProps {
  data: Plotly.Data[]
  layout: Partial<Plotly.Layout>
}

const ChartView: React.FC<ChartViewProps> = ({ data, layout }) => {
  const plotRef = useRef(null)

  return (
    <div>
      <ChartToolbar plotRef={plotRef} />
      <Plot
        ref={plotRef}
        data={data}
        layout={layout}
        style={{ width: '100%' }}
        useResizeHandler
        config={{ displayModeBar: false }}
      />
    </div>
  )
}

export default ChartView
