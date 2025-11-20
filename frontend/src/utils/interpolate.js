/**
 * PUBLIC_INTERFACE
 * idwInterpolate2D
 * Performs inverse distance weighting interpolation on scattered 2D points onto a regular grid.
 *
 * points: [{x, y, rssi}]
 * gridSize: number of steps along each axis (square grid)
 * bounds: {minX, maxX, minY, maxY}
 * power: power parameter for IDW (commonly 2)
 *
 * Returns: { X: number[], Y: number[], Z: number[][] }
 */
export function idwInterpolate2D(points, gridSize, bounds, power = 2) {
  if (!Array.isArray(points) || points.length === 0) {
    return { X: [], Y: [], Z: [] };
  }
  const { minX, maxX, minY, maxY } = bounds;
  const nx = Math.max(2, gridSize);
  const ny = Math.max(2, gridSize);

  const X = [];
  const Y = [];
  for (let i = 0; i < nx; i++) {
    X.push(minX + (i * (maxX - minX)) / (nx - 1));
  }
  for (let j = 0; j < ny; j++) {
    Y.push(minY + (j * (maxY - minY)) / (ny - 1));
  }

  const Z = Array.from({ length: ny }, () => Array(nx).fill(null));

  // For numerical stability
  const EPS = 1e-9;

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const gx = X[i];
      const gy = Y[j];

      let wsum = 0;
      let vsum = 0;

      for (const p of points) {
        const dx = gx - p.x;
        const dy = gy - p.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < EPS) {
          wsum = 1;
          vsum = p.rssi;
          break;
        }
        const w = 1 / Math.pow(Math.sqrt(d2) + EPS, power);
        wsum += w;
        vsum += w * p.rssi;
      }

      Z[j][i] = wsum > 0 ? vsum / wsum : null;
    }
  }

  return { X, Y, Z };
}

/**
 * PUBLIC_INTERFACE
 * computeBounds
 * Computes bounds for x and y from points, with optional padding.
 */
export function computeBounds(points, padding = 0.05) {
  if (!points.length) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;
  const px = dx * padding;
  const py = dy * padding;
  return { minX: minX - px, maxX: maxX + px, minY: minY - py, maxY: maxY + py };
}

/**
 * PUBLIC_INTERFACE
 * clampZByRange
 * Clamps Z values to the specified [min, max] range.
 */
export function clampZByRange(Z, minVal, maxVal) {
  return Z.map(row => row.map(v => {
    if (v == null || Number.isNaN(v)) return null;
    return Math.max(minVal, Math.min(maxVal, v));
  }));
}
