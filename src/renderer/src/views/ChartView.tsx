import React from 'react';
import Plot from 'react-plotly.js';

interface ChartViewProps {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
}

const ChartView: React.FC<ChartViewProps> = ({ data, layout }) => {
  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: '100%' }}
      useResizeHandler
    />
  );
};

export default ChartView;
