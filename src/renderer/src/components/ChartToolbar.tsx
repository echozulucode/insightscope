import React from 'react'
import { FaArrowsAlt, FaSearch, FaSearchPlus, FaSearchMinus, FaImage, FaHome } from 'react-icons/fa'
import Plotly from 'plotly.js'

interface ChartToolbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotRef: React.RefObject<any>
}

const ChartToolbar: React.FC<ChartToolbarProps> = ({ plotRef }) => {
  const buttons = [
    { id: 'pan', tooltip: 'Pan', icon: <FaArrowsAlt /> },
    { id: 'zoom', tooltip: 'Zoom', icon: <FaSearch /> },
    { id: 'zoom-in', tooltip: 'Zoom In', icon: <FaSearchPlus /> },
    { id: 'zoom-out', tooltip: 'Zoom Out', icon: <FaSearchMinus /> },
    { id: 'reset', tooltip: 'Reset View', icon: <FaHome /> },
    { id: 'save', tooltip: 'Save as PNG', icon: <FaImage /> }
  ]

  const handleButtonClick = (buttonId: string): void => {
    const gd = plotRef.current?.el
    if (!gd) return

    switch (buttonId) {
      case 'pan':
        Plotly.relayout(gd, { dragmode: 'pan' })
        break
      case 'zoom':
        Plotly.relayout(gd, { dragmode: 'zoom' })
        break
      case 'zoom-in':
        Plotly.relayout(gd, {
          'xaxis.range': [gd.layout.xaxis.range[0] * 0.9, gd.layout.xaxis.range[1] * 0.9],
          'yaxis.range': [gd.layout.yaxis.range[0] * 0.9, gd.layout.yaxis.range[1] * 0.9]
        })
        break
      case 'zoom-out':
        Plotly.relayout(gd, {
          'xaxis.range': [gd.layout.xaxis.range[0] * 1.1, gd.layout.xaxis.range[1] * 1.1],
          'yaxis.range': [gd.layout.yaxis.range[0] * 1.1, gd.layout.yaxis.range[1] * 1.1]
        })
        break
      case 'reset':
        Plotly.relayout(gd, { 'xaxis.autorange': true, 'yaxis.autorange': true })
        break
      case 'save':
        Plotly.downloadImage(gd, { format: 'png', width: 800, height: 600, filename: 'chart' })
        break
      default:
        break
    }
  }

  return (
    <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center space-x-2">
      {buttons.map((button) => (
        <button
          key={button.id}
          title={button.tooltip}
          className="p-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => handleButtonClick(button.id)}
        >
          {button.icon}
        </button>
      ))}
    </div>
  )
}

export default ChartToolbar
