import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * DataEntryForm
 * A form for adding or editing a single point with x, y, optional z, and RSSI.
 */
function DataEntryForm({ onSubmit, onCancel, initial }) {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");
  const [rssi, setRssi] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setX(initial.x ?? "");
      setY(initial.y ?? "");
      setZ(initial.z ?? "");
      setRssi(initial.rssi ?? "");
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const nx = Number(x);
    const ny = Number(y);
    const nz = z === "" ? null : Number(z);
    const nr = Number(rssi);

    if (Number.isNaN(nx) || Number.isNaN(ny) || Number.isNaN(nr)) {
      setError("Please enter valid numeric values for x, y and RSSI.");
      return;
    }
    if (z !== "" && Number.isNaN(nz)) {
      setError("Please enter a valid numeric value for z or leave it empty.");
      return;
    }
    onSubmit({
      x: nx,
      y: ny,
      z: nz,
      rssi: nr,
      id: initial?.id ?? undefined,
    });
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="x">X</label>
          <input id="x" type="number" step="any" value={x} onChange={(e) => setX(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="y">Y</label>
          <input id="y" type="number" step="any" value={y} onChange={(e) => setY(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="z">Z (optional)</label>
          <input id="z" type="number" step="any" value={z} onChange={(e) => setZ(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="rssi">RSSI</label>
          <input id="rssi" type="number" step="any" value={rssi} onChange={(e) => setRssi(e.target.value)} required />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="form-actions">
        <button className="btn primary" type="submit">{initial ? "Update" : "Add Point"}</button>
        {onCancel && (
          <button className="btn ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default DataEntryForm;
