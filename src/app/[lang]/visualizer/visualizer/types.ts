
/* =========================================================
   TYPES
========================================================= */

export type Point = {
  x: number;
  y: number;
};

export type Step = "upload" | "mask" | "perspective" | "tile" | "render";

export type PerspectiveKey = "TL" | "TR" | "BR" | "BL";

export type PerspectivePoints = {
  TL: Point;
  TR: Point;
  BR: Point;
  BL: Point;
};

export type Homography = {
  h11: number;
  h12: number;
  h13: number;

  h21: number;
  h22: number;
  h23: number;

  h31: number;
  h32: number;
};

export type Matrix3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type RoomImage = {
  file: File | null;
  url: string | null;
  width: number;
  height: number;
};

export type TileData = {
  id: string;

  productId: number | null;
  productName: string | null;
  variantId: number | null;

  url: string | null;

  widthCm: number;
  heightCm: number;

  rotation: 0 | 90;

  density: number;
};

export type SurfaceArea = {
  id: string;

  points: Point[];

  perspective: PerspectivePoints | null;

  // کاشی مخصوص همین محدوده
  tile: TileData;
  overrides: Record<string, TileData>;
};

export type GroutData = {
  widthMm: number;
  color: string;
};

export type RenderGridData = {
  H: Homography;
  inverse: Matrix3;

  startU: number;
  startV: number;

  tileU: number;
  tileV: number;

  rows: number;
  columns: number;
};


/* =========================================================
   INITIAL VALUES
========================================================= */

export const initialRoom: RoomImage = {
  file: null,
  url: null,
  width: 0,
  height: 0,
};

export const initialTile: TileData = {
  id: "base",

  productId: null,
  productName: null,
  variantId: null,

  url: null,

  widthCm: 60,
  heightCm: 120,

  rotation: 0,

  density: 8,
};

export const initialGrout: GroutData = {
  widthMm: 3,
  color: "#d9d9d9",
};

