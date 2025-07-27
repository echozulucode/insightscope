import { Data, Layout } from 'plotly.js'

class ScatterPlotViewModel {
  public getPlotData(): Data[] {
    return [
      {
        x: [1, 2, 3, 4, 5],
        y: [2, 6, 3, 5, 8],
        mode: 'markers',
        type: 'scatter',
        name: 'Team A',
        marker: { size: 12 }
      },
      {
        x: [1.5, 2.5, 3.5, 4.5, 5.5],
        y: [4, 1, 7, 2, 6],
        mode: 'markers',
        type: 'scatter',
        name: 'Team B',
        marker: { size: 12 }
      }
    ]
  }

  public getPlotLayout(): Partial<Layout> {
    return {
      title: 'Static Scatter Plot Example',
      xaxis: {
        title: 'X Axis'
      },
      yaxis: {
        title: 'Y Axis'
      }
    }
  }
}

export default new ScatterPlotViewModel()
