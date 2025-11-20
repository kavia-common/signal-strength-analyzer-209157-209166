import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ControlsPanel
 * Panel for visualization and interpolation settings.
 */
function ControlsPanel({
  minRssi,
  maxRssi,
  gridSize,
  power,
  colorScale,
  show2D,
  show3D,
  onChange,
  onGenerateGrid,
}) {
  const [local, setLocal] = useState({
    minRssi,
    maxRssi,
    gridSize,
    power,
    colorScale,
    show2D,
    show3D,
  });

  useEffect(() => {
    setLocal({ minRssi, maxRssi, gridSize, power, colorScale, show2D, show3D });
  }, [minRssi, maxRssi, gridSize, power, colorScale, show2D, show3D]);

  const update = (key, value) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    if (onChange) onChange(next);
  };

  const colorOptions = [
    "Viridis",
    "Cividis",
    "Inferno",
    "Magma",
    "Plasma",
    "Turbo",
    "Portland",
    "Greys",
    "YlGnBu"
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3>Controls</h3>
      </div>
      <div className="controls-grid">
        <div className="form-field">
          <label>RSSI Min</label>
          <input type="number" value={local.minRssi} onChange={(e) => update("minRssi", Number(e.target.value))} />
        </div>
        <div className="form-field">
          <label>RSSI Max</label>
          <input type="number" value={local.maxRssi} onChange={(e) => update("maxRssi", Number(e.target.value))} />
        </div>
        <div className="form-field">
          <label>Grid Resolution</label>
          <input type="number" min={5} max={200} value={local.gridSize} onChange={(e) => update("gridSize", Number(e.target.value))} />
        </div>
        <div className="form-field">
          <label>IDW Power</label>
          <input type="number" min={0.1} step="0.1" value={local.power} onChange={(e) => update("power", Number(e.target.value))} />
        </div>
        <div className="form-field">
          <label>Color Scale</label>
          <select value={local.colorScale} onChange={(e) => update("colorScale", e.target.value)}>
            {colorOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-field toggle">
          <label>Show 2D Heatmap</label>
          <input type="checkbox" checked={local.show2D} onChange={(e) => update("show2D", e.target.checked)} />
        </div>
        <div className="form-field toggle">
          <label>Show 3D Surface</label>
          <input type="checkbox" checked={local.show3D} onChange={(e) => update("show3D", e.target.checked)} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn primary" onClick={onGenerateGrid}>Generate Grid</button>
      </div>
    </div>
  );
}

export default ControlsPanel;
