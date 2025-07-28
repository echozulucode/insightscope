import React from 'react';
import {
  FaArrowsAlt,
  FaSearchPlus,
  FaSearchMinus,
  FaCamera,
  FaLayerGroup,
  FaChartBar,
  FaExpandArrowsAlt
} from 'react-icons/fa';

export type LayoutMode = 'combined' | 'stacked';

interface ChartToolbarProps {
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPan: () => void;
  onBoxZoom: () => void;
  onReset: () => void;
  onSaveImage: () => void;
}

const ChartToolbar: React.FC<ChartToolbarProps> = ({
  layoutMode,
  onLayoutModeChange,
  onZoomIn,
  onZoomOut,
  onPan,
  onBoxZoom,
  onReset,
  onSaveImage
}) => {
  const buttons = [
    { id: 'pan', tooltip: 'Pan', icon: <FaArrowsAlt />, onClick: onPan },
    { id: 'box-zoom', tooltip: 'Box Zoom', icon: <FaSearchPlus />, onClick: onBoxZoom },
    { id: 'zoom-in', tooltip: 'Zoom In', icon: <FaSearchPlus />, onClick: onZoomIn },
    { id: 'zoom-out', tooltip: 'Zoom Out', icon: <FaSearchMinus />, onClick: onZoomOut },
    { id: 'reset', tooltip: 'Reset View', icon: <FaExpandArrowsAlt />, onClick: onReset },
    { id: 'save', tooltip: 'Save as PNG', icon: <FaCamera />, onClick: onSaveImage }
  ];

  return (
    <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center space-x-2">
      {buttons.map((button) => (
        <button
          key={button.id}
          title={button.tooltip}
          onClick={button.onClick}
          className="p-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {button.icon}
        </button>
      ))}
      <div className="flex-grow" />
      <div className="flex items-center space-x-1 bg-gray-300 rounded-lg p-1">
        <button
          title="Combined View"
          onClick={() => onLayoutModeChange('combined')}
          className={`p-2 rounded-md ${
            layoutMode === 'combined' ? 'bg-white shadow' : 'hover:bg-gray-200'
          }`}
        >
          <FaChartBar />
        </button>
        <button
          title="Stacked View"
          onClick={() => onLayoutModeChange('stacked')}
          className={`p-2 rounded-md ${
            layoutMode === 'stacked' ? 'bg-white shadow' : 'hover:bg-gray-200'
          }`}
        >
          <FaLayerGroup />
        </button>
      </div>
    </div>
  );
};

export default ChartToolbar;
