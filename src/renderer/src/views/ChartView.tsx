import React, { useRef, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import type { Figure } from 'plotly.js'

interface ChartViewProps {
  data: Data[]
  layout: Partial<Layout>
  onUpdate?: (figure: Readonly<Figure>) => void
  onDoubleClick?: () => void
  onWheel?: (event: WheelEvent) => void
}

const ChartView = React.forwardRef<Plot, ChartViewProps>(
  ({ data, layout, onUpdate, onDoubleClick, onWheel }, ref) => {
    const plotRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const currentPlotRef = plotRef.current
      if (currentPlotRef && onWheel) {
        // The wheel event is captured on the plot div
        currentPlotRef.addEventListener('wheel', onWheel)
      }
      return () => {
        if (currentPlotRef && onWheel) {
          currentPlotRef.removeEventListener('wheel', onWheel)
        }
      }
    }, [onWheel])

    return (
      <div ref={plotRef}>
        <Plot
          ref={ref}
          data={data}
          layout={layout}
          onUpdate={onUpdate}
          onDoubleClick={onDoubleClick}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          config={{
            displayModeBar: false,
            scrollZoom: false // Disable native scroll zoom to allow custom handling
          }}
        />
      </div>
    )
  }
)

ChartView.displayName = 'ChartView'

export default ChartView