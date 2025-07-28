import React from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import type { Figure } from 'plotly.js'

interface ChartViewProps {
  data: Data[]
  layout: Partial<Layout>
  onUpdate?: (figure: Readonly<Figure>) => void
  onDoubleClick?: () => void
}

const ChartView = React.forwardRef<Plot, ChartViewProps>(
  ({ data, layout, onUpdate, onDoubleClick }, ref) => {
    return (
      <Plot
        ref={ref}
        data={data}
        layout={layout}
        onUpdate={onUpdate}
        onDoubleClick={onDoubleClick}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
        config={{ displayModeBar: false, scrollZoom: true }}
      />
    )
  }
)

ChartView.displayName = 'ChartView'

export default ChartView
