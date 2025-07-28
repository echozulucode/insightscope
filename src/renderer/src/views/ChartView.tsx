import React from 'react';
import Plot from 'react-plotly.js';

interface ChartViewProps {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
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
  );
});

export default ChartView;
