import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";

/**
 * PUBLIC_INTERFACE
 * PlotSurface3D
 * Renders a 3D surface using Plotly.
 */
const PlotlyComponent = createPlotlyComponent(Plotly);

function PlotSurface3D({ X, Y, Z, colorScale = "Viridis", minRssi, maxRssi, height = 480 }) {
  if (!X?.length || !Y?.length || !Z?.length) {
    return (
      <div className="card">
        <div className="card-header"><h3>3D Surface</h3></div>
        <div className="placeholder">No grid data. Click "Generate Grid".</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header"><h3>3D Surface</h3></div>
      <PlotlyComponent
        data={[
          {
            type: "surface",
            z: Z,
            x: X,
            y: Y,
            colorscale: colorScale,
            cmin: minRssi,
            cmax: maxRssi,
            colorbar: { title: "RSSI" },
            hovertemplate: "x: %{x}<br>y: %{y}<br>RSSI: %{z}<extra></extra>",
            contours: {
              z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#2d3748",
                project: { z: true }
              }
            }
          },
        ]}
        layout={{
          autosize: true,
          scene: {
            xaxis: { title: "X" },
            yaxis: { title: "Y" },
            zaxis: { title: "RSSI", range: [minRssi, maxRssi] },
          },
          margin: { l: 0, r: 0, t: 10, b: 0 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          height,
        }}
        useResizeHandler
        style={{ width: "100%", height }}
        config={{ displayModeBar: true, responsive: true }}
      />
    </div>
  );
}

export default PlotSurface3D;
