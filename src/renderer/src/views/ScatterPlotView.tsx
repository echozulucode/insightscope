import React from 'react'
import Plot from 'react-plotly.js'
import scatterPlotViewModel from '../viewmodels/ScatterPlotViewModel'

const ScatterPlotView: React.FC = () => {
  const data = scatterPlotViewModel.getPlotData()
  const layout = scatterPlotViewModel.getPlotLayout()

  return (
    <div className="p-4 h-full">
      <Plot
        data={data}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
        className="w-full h-full"
      />
    </div>
  )
}

export default ScatterPlotView
