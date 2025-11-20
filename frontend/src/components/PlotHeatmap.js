import React from "react";
import Plot from "react-plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";

/**
 * PUBLIC_INTERFACE
 * PlotHeatmap
 * Renders a 2D heatmap using Plotly.
 */
const PlotlyComponent = createPlotlyComponent(Plotly);

function PlotHeatmap({ X, Y, Z, colorScale = "Viridis", minRssi, maxRssi, height = 420 }) {
  if (!X?.length || !Y?.length || !Z?.length) {
    return (
      <div className="card">
        <div className="card-header"><h3>2D Heatmap</h3></div>
        <div className="placeholder">No grid data. Click "Generate Grid".</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header"><h3>2D Heatmap</h3></div>
      <PlotlyComponent
        data={[
          {
            z: Z,
            x: X,
            y: Y,
            type: "heatmap",
            colorscale: colorScale,
            zmin: minRssi,
            zmax: maxRssi,
            colorbar: { title: "RSSI" },
            hovertemplate: "x: %{x}<br>y: %{y}<br>RSSI: %{z}<extra></extra>",
          },
        ]}
        layout={{
          autosize: true,
          margin: { l: 50, r: 10, t: 10, b: 50 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: { title: "X" },
          yaxis: { title: "Y" },
          height,
        }}
        useResizeHandler
        style={{ width: "100%", height }}
        config={{ displayModeBar: true, responsive: true }}
      />
    </div>
  );
}

export default PlotHeatmap;
