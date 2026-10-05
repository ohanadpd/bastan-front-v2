
import type { Point, PerspectivePoints, Homography, Matrix3 } from "./types";

/* =========================================================
   HOMOGRAPHY
========================================================= */

export function createHomography(
  tl: Point,
  tr: Point,
  br: Point,
  bl: Point,
): Homography {
  const x0 = tl.x;
  const y0 = tl.y;

  const x1 = tr.x;
  const y1 = tr.y;

  const x2 = br.x;
  const y2 = br.y;

  const x3 = bl.x;
  const y3 = bl.y;

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;

  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  let h31 = 0;
  let h32 = 0;

  const denominator = dx1 * dy2 - dx2 * dy1;

  if (Math.abs(denominator) > 1e-7) {
    h31 = (dx3 * dy2 - dx2 * dy3) / denominator;

    h32 = (dx1 * dy3 - dx3 * dy1) / denominator;
  }

  const h11 = x1 - x0 + h31 * x1;

  const h12 = x3 - x0 + h32 * x3;

  const h13 = x0;

  const h21 = y1 - y0 + h31 * y1;

  const h22 = y3 - y0 + h32 * y3;

  const h23 = y0;

  return {
    h11,
    h12,
    h13,

    h21,
    h22,
    h23,

    h31,
    h32,
  };
}

export function projectPoint(u: number, v: number, H: Homography): Point | null {
  const denominator = H.h31 * u + H.h32 * v + 1;

  if (!Number.isFinite(denominator) || Math.abs(denominator) < 1e-5) {
    return null;
  }

  const x = (H.h11 * u + H.h12 * v + H.h13) / denominator;

  const y = (H.h21 * u + H.h22 * v + H.h23) / denominator;

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return {
    x,
    y,
  };
}

/* =========================================================
   INVERSE HOMOGRAPHY
========================================================= */

export function invertHomography(H: Homography): Matrix3 | null {
  const a = H.h11;
  const b = H.h12;
  const c = H.h13;

  const d = H.h21;
  const e = H.h22;
  const f = H.h23;

  const g = H.h31;
  const h = H.h32;

  const i = 1;

  const A = e * i - f * h;

  const B = -(d * i - f * g);

  const C = d * h - e * g;

  const D = -(b * i - c * h);

  const E = a * i - c * g;

  const F = -(a * h - b * g);

  const G = b * f - c * e;

  const Hc = -(a * f - c * d);

  const I = a * e - b * d;

  const determinant = a * A + b * B + c * C;

  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-10) {
    return null;
  }

  const inv = 1 / determinant;

  return [
    A * inv,
    D * inv,
    G * inv,

    B * inv,
    E * inv,
    Hc * inv,

    C * inv,
    F * inv,
    I * inv,
  ];
}

export function unprojectPoint(x: number, y: number, inverse: Matrix3): Point | null {
  const denominator = inverse[6] * x + inverse[7] * y + inverse[8];

  if (!Number.isFinite(denominator) || Math.abs(denominator) < 1e-8) {
    return null;
  }

  const u = (inverse[0] * x + inverse[1] * y + inverse[2]) / denominator;

  const v = (inverse[3] * x + inverse[4] * y + inverse[5]) / denominator;

  if (!Number.isFinite(u) || !Number.isFinite(v)) {
    return null;
  }

  return {
    x: u,
    y: v,
  };
}

/* =========================================================
   DRAW IMAGE TRIANGLE
========================================================= */

export function drawImageTriangle(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,

  sx0: number,
  sy0: number,

  sx1: number,
  sy1: number,

  sx2: number,
  sy2: number,

  dx0: number,
  dy0: number,

  dx1: number,
  dy1: number,

  dx2: number,
  dy2: number,
) {
  const denominator = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1);

  if (Math.abs(denominator) < 0.000001) {
    return;
  }

  const a =
    (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denominator;

  const c =
    (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denominator;

  const e =
    (dx0 * (sx1 * sy2 - sx2 * sy1) +
      dx1 * (sx2 * sy0 - sx0 * sy2) +
      dx2 * (sx0 * sy1 - sx1 * sy0)) /
    denominator;

  const b =
    (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denominator;

  const d =
    (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denominator;

  const f =
    (dy0 * (sx1 * sy2 - sx2 * sy1) +
      dy1 * (sx2 * sy0 - sx0 * sy2) +
      dy2 * (sx0 * sy1 - sx1 * sy0)) /
    denominator;

  ctx.save();

  ctx.beginPath();

  ctx.moveTo(dx0, dy0);

  ctx.lineTo(dx1, dy1);

  ctx.lineTo(dx2, dy2);

  ctx.closePath();

  ctx.clip();

  ctx.setTransform(a, b, c, d, e, f);

  ctx.drawImage(image, 0, 0);

  ctx.restore();
}

/* =========================================================
   PROJECTED QUAD
========================================================= */

export function fillProjectedQuad(
  ctx: CanvasRenderingContext2D,

  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,

  renderWidth: number,
  renderHeight: number,

  color: string,
) {
  ctx.beginPath();

  ctx.moveTo(p0.x * renderWidth, p0.y * renderHeight);

  ctx.lineTo(p1.x * renderWidth, p1.y * renderHeight);

  ctx.lineTo(p2.x * renderWidth, p2.y * renderHeight);

  ctx.lineTo(p3.x * renderWidth, p3.y * renderHeight);

  ctx.closePath();

  ctx.fillStyle = color;

  ctx.fill();
}

/* =========================================================
   HELPERS
========================================================= */

export function getCellId(row: number, column: number) {
  return `${row}:${column}`;
}

export function createDefaultPerspective(points: Point[]): PerspectivePoints | null {
  if (points.length < 3) {
    return null;
  }

  const xs = points.map((point) => point.x);

  const ys = points.map((point) => point.y);

  const minX = Math.min(...xs);

  const maxX = Math.max(...xs);

  const minY = Math.min(...ys);

  const maxY = Math.max(...ys);

  const width = maxX - minX;

  const height = maxY - minY;

  return {
    TL: {
      x: minX + width * 0.2,

      y: minY + height * 0.15,
    },

    TR: {
      x: maxX - width * 0.2,

      y: minY + height * 0.15,
    },

    BR: {
      x: maxX - width * 0.05,

      y: maxY - height * 0.05,
    },

    BL: {
      x: minX + width * 0.05,

      y: maxY - height * 0.05,
    },
  };
}

export function pointInsidePolygon(point: Point, polygon: Point[]) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;

    const yi = polygon[i].y;

    const xj = polygon[j].x;

    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

