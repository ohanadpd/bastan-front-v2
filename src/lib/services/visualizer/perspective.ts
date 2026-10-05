export type Point = {
  x: number;
  y: number;
};

export type Quad = [
  Point,
  Point,
  Point,
  Point
];

type TileSurfaceOptions = {
  columns?: number;
  rows?: number;

  // نسبت واقعی کاشی
  tileWidth?: number;
  tileHeight?: number;

  // ضخامت بند
  grout?: number;

  // رنگ بند
  groutColor?: string;
};

/**
 * یک سطح بزرگ از تکرار کاشی ایجاد می‌کند.
 * بعداً width/height را مستقیم از Django می‌دهیم.
 */
function createTileSurface(
  image: HTMLImageElement,
  options: TileSurfaceOptions = {}
): HTMLCanvasElement {
  const {
    columns = 7,
    rows = 8,
    tileWidth = 120,
    tileHeight = 60,
    grout = 2,
    groutColor = '#d5d5d5',
  } = options;

  // برای اینکه اندازه Canvas خیلی بزرگ نشود،
  // ابعاد واقعی را به نسبت تبدیل می‌کنیم.
  const baseSize = 140;

  const ratio = tileHeight / tileWidth;

  const renderedTileWidth = baseSize;
  const renderedTileHeight = baseSize * ratio;

  const canvas = document.createElement('canvas');

  canvas.width = Math.ceil(columns * renderedTileWidth);
  canvas.height = Math.ceil(rows * renderedTileHeight);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create tile surface context');
  }

  // رنگ بندکشی
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * renderedTileWidth;
      const y = row * renderedTileHeight;

      ctx.drawImage(
        image,

        x + grout / 2,
        y + grout / 2,

        renderedTileWidth - grout,
        renderedTileHeight - grout
      );
    }
  }

  return canvas;
}

/**
 * یک سطح مستطیلی را با subdivision روی چهارضلعی مقصد Warp می‌کند.
 */
function warpSurface(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  quad: Quad,
  subdivisions = 35
) {
  const [tl, tr, br, bl] = quad;

  const width = source.width;
  const height = source.height;

  const interpolate = (u: number, v: number): Point => ({
    x:
      (1 - u) * (1 - v) * tl.x +
      u * (1 - v) * tr.x +
      u * v * br.x +
      (1 - u) * v * bl.x,

    y:
      (1 - u) * (1 - v) * tl.y +
      u * (1 - v) * tr.y +
      u * v * br.y +
      (1 - u) * v * bl.y,
  });

  for (let row = 0; row < subdivisions; row++) {
    for (let col = 0; col < subdivisions; col++) {
      const u0 = col / subdivisions;
      const v0 = row / subdivisions;

      const u1 = (col + 1) / subdivisions;
      const v1 = (row + 1) / subdivisions;

      const p0 = interpolate(u0, v0);
      const p1 = interpolate(u1, v0);
      const p2 = interpolate(u1, v1);
      const p3 = interpolate(u0, v1);

      const sx = u0 * width;
      const sy = v0 * height;

      const sw = width / subdivisions;
      const sh = height / subdivisions;

      ctx.save();

      // فقط همین تکه رسم شود
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.clip();

      const a = (p1.x - p0.x) / sw;
      const b = (p1.y - p0.y) / sw;

      const c = (p3.x - p0.x) / sh;
      const d = (p3.y - p0.y) / sh;

      const e = p0.x - a * sx - c * sy;
      const f = p0.y - b * sx - d * sy;

      ctx.setTransform(
        a,
        b,
        c,
        d,
        e,
        f
      );

      ctx.drawImage(source, 0, 0);

      ctx.restore();
    }
  }
}

/**
 * تابع اصلی Visualizer
 */
export function drawPerspectiveTile(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  quad: Quad,
  subdivisions = 35,
  options: TileSurfaceOptions = {}
) {
  const surface = createTileSurface(image, options);

  warpSurface(
    ctx,
    surface,
    quad,
    subdivisions
  );
}