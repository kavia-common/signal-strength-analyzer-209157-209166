import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./index.css";
import DataEntryForm from "./components/DataEntryForm";
import DataTable from "./components/DataTable";
import ControlsPanel from "./components/ControlsPanel";
import PlotHeatmap from "./components/PlotHeatmap";
import PlotSurface3D from "./components/PlotSurface3D";
import { computeBounds, idwInterpolate2D, clampZByRange } from "./utils/interpolate";

/**
 * PUBLIC_INTERFACE
 * App
 * Single-page RSSI analyzer with manual data entry and Plotly visualizations.
 */
function App() {
  // Theme aligned with Ocean Professional: default light, toggle available
  const [theme, setTheme] = useState("light");

  // Data points state
  const [points, setPoints] = useState(() => {
    // preload sample points
    return [
      { id: 1, x: 0, y: 0, z: 0, rssi: -45 },
      { id: 2, x: 5, y: 0, z: 0, rssi: -55 },
      { id: 3, x: 0, y: 5, z: 0, rssi: -60 },
      { id: 4, x: 5, y: 5, z: 0, rssi: -70 },
      { id: 5, x: 2.5, y: 2.5, z: 0, rssi: -50 },
    ];
  });
  const [editing, setEditing] = useState(null);

  // Controls state
  const [minRssi, setMinRssi] = useState(-90);
  const [maxRssi, setMaxRssi] = useState(-30);
  const [gridSize, setGridSize] = useState(40);
  const [power, setPower] = useState(2);
  const [colorScale, setColorScale] = useState("Viridis");
  const [show2D, setShow2D] = useState(true);
  const [show3D, setShow3D] = useState(true);

  // Grid data
  const [grid, setGrid] = useState({ X: [], Y: [], Z: [] });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }, [theme]);

  // Derived bounds
  const bounds = useMemo(() => computeBounds(points, 0.1), [points]);

  const onControlsChange = (cfg) => {
    setMinRssi(cfg.minRssi);
    setMaxRssi(cfg.maxRssi);
    setGridSize(cfg.gridSize);
    setPower(cfg.power);
    setColorScale(cfg.colorScale);
    setShow2D(cfg.show2D);
    setShow3D(cfg.show3D);
  };

  const generateGrid = () => {
    if (points.length === 0) {
      setGrid({ X: [], Y: [], Z: [] });
      return;
    }
    const { X, Y, Z } = idwInterpolate2D(points, gridSize, bounds, power);
    const Zc = clampZByRange(Z, minRssi, maxRssi);
    setGrid({ X, Y, Z: Zc });
  };

  // CRUD handlers
  const addPoint = (p) => {
    const id = points.length ? Math.max(...points.map((q) => q.id)) + 1 : 1;
    const np = { ...p, id };
    setPoints((prev) => [...prev, np]);
  };

  const updatePoint = (p) => {
    setPoints((prev) => prev.map((q) => (q.id === p.id ? p : q)));
    setEditing(null);
  };

  const deletePoint = (id) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  // Layout styles for Ocean Professional theme
  // Adding CSS variables here for quick theme customization
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--ocean-primary", "#1E3A8A");
    r.style.setProperty("--ocean-secondary", "#F59E0B");
    r.style.setProperty("--ocean-bg", "#F3F4F6");
    r.style.setProperty("--ocean-surface", "#FFFFFF");
    r.style.setProperty("--ocean-text", "#111827");
    r.style.setProperty("--muted-text", "rgba(17,24,39,0.6)");
  }, []);

  return (
    <div className="App" style={{ background: "var(--ocean-bg)" }}>
      <header
        className="ocean-header"
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #0f172a, #1E3A8A)",
          color: "#fff",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Signal Strength Analyzer</h1>
            <div style={{ opacity: 0.85, fontSize: 13 }}>Manual RSSI Data • Heatmap & 3D Surface</div>
          </div>
          <div>
            <button
              className="btn"
              style={{ background: "var(--ocean-secondary)", color: "#111827", border: "none" }}
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
        <section className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <DataEntryForm
              onSubmit={editing ? updatePoint : addPoint}
              onCancel={editing ? () => setEditing(null) : undefined}
              initial={editing || undefined}
            />
            <DataTable
              points={points}
              onEdit={(p) => setEditing(p)}
              onDelete={deletePoint}
            />
          </div>
          <div>
            <ControlsPanel
              minRssi={minRssi}
              maxRssi={maxRssi}
              gridSize={gridSize}
              power={power}
              colorScale={colorScale}
              show2D={show2D}
              show3D={show3D}
              onChange={onControlsChange}
              onGenerateGrid={generateGrid}
            />
            <div className="card" style={{ padding: 12 }}>
              <div style={{ fontSize: 12, color: "var(--muted-text)" }}>
                Bounds: x [{bounds.minX.toFixed(2)}, {bounds.maxX.toFixed(2)}], y [{bounds.minY.toFixed(2)}, {bounds.maxY.toFixed(2)}]
              </div>
              <div style={{ fontSize: 12, color: "var(--muted-text)" }}>
                Points: {points.length} • Grid: {gridSize}×{gridSize}
              </div>
            </div>
          </div>
        </section>

        <section className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          {show2D && <PlotHeatmap X={grid.X} Y={grid.Y} Z={grid.Z} colorScale={colorScale} minRssi={minRssi} maxRssi={maxRssi} />}
          {show3D && <PlotSurface3D X={grid.X} Y={grid.Y} Z={grid.Z} colorScale={colorScale} minRssi={minRssi} maxRssi={maxRssi} />}
          {!show2D && !show3D && (
            <div className="card">
              <div className="card-header"><h3>Visualizations</h3></div>
              <div className="placeholder">Enable 2D and/or 3D toggles in Controls to show charts.</div>
            </div>
          )}
        </section>
      </main>

      <footer className="container" style={{ padding: 20, color: "var(--muted-text)", fontSize: 12 }}>
        <div style={{ textAlign: "center" }}>© {new Date().getFullYear()} Ocean Professional Theme • RSSI Visualizer</div>
      </footer>
    </div>
  );
}

export default App;
