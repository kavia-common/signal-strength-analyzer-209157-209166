import React from "react";

/**
 * PUBLIC_INTERFACE
 * DataTable
 * Displays a table of points with actions to edit and delete.
 */
function DataTable({ points, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Data Points</h3>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>X</th>
              <th>Y</th>
              <th>Z</th>
              <th>RSSI</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {points.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted-text)" }}>
                  No data points. Add some using the form.
                </td>
              </tr>
            ) : (
              points.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>{p.x}</td>
                  <td>{p.y}</td>
                  <td>{p.z ?? "-"}</td>
                  <td>{p.rssi}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn small" onClick={() => onEdit(p)}>Edit</button>
                      <button className="btn small danger" onClick={() => onDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
