import React from 'react';

export type LayoutMode = 'combined' | 'stacked';

interface ChartControlsProps {
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onAssignY2: () => void;
  traceCount: number;
}

const ChartControls: React.FC<ChartControlsProps> = ({ layoutMode, onLayoutModeChange, onAssignY2, traceCount }) => {
  return (
    <div className="p-2 bg-gray-200">
      <div className="flex items-center space-x-4">
        <div>
          <span className="font-semibold">Layout:</span>
          <label className="ml-2">
            <input
              type="radio"
              name="layoutMode"
              value="combined"
              checked={layoutMode === 'combined'}
              onChange={() => onLayoutModeChange('combined')}
            />
            Combined
          </label>
          <label className="ml-2">
            <input
              type="radio"
              name="layoutMode"
              value="stacked"
              checked={layoutMode === 'stacked'}
              onChange={() => onLayoutModeChange('stacked')}
            />
            Stacked
          </label>
        </div>
        {layoutMode === 'combined' && traceCount > 1 && (
          <div>
            <button onClick={onAssignY2} className="px-2 py-1 bg-gray-300 rounded">
              Assign 2nd Trace to Y2-axis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartControls;