
import { ChangeEvent, MouseEvent, useCallback, useMemo, useRef, useState, useEffect } from "react";
import type { Product, Variant } from "@/types/products.types";
import type { Point, Step, PerspectiveKey, PerspectivePoints, RoomImage, TileData, SurfaceArea, GroutData, RenderGridData } from "./types";
import { initialRoom, initialTile, initialGrout } from "./types";
import { createHomography, projectPoint, invertHomography, unprojectPoint, drawImageTriangle, fillProjectedQuad, getCellId, createDefaultPerspective, pointInsidePolygon } from "./geometry";

export function useVisualizerController() {
  /* =======================================================
     REFS
  ======================================================= */

  const roomInputRef = useRef<HTMLInputElement>(null);

  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const renderCanvasRef = useRef<HTMLCanvasElement>(null);

  const renderGridRef = useRef<Record<string, RenderGridData>>({});
  const renderRunRef = useRef(0);

  /* =======================================================
     STATE
  ======================================================= */

  const [step, setStep] = useState<Step>("upload");

  const [room, setRoom] = useState<RoomImage>(initialRoom);

  const [error, setError] = useState<string | null>(null);

  const [areas, setAreas] = useState<SurfaceArea[]>([]);
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);
  const activeArea = areas.find((area) => area.id === activeAreaId);
  const maskPoints = activeArea?.points ?? [];
  const perspectivePoints = activeArea?.perspective ?? null;
  const tile = activeArea?.tile ?? initialTile;
  const tileOverrides = activeArea?.overrides ?? {};
  const updateActiveArea = (update: (area: SurfaceArea) => SurfaceArea) => {
    setAreas((previous) => previous.map((area) =>
      area.id === activeAreaId ? update(area) : area,
    ));
  };
  const setMaskPoints = (value: Point[] | ((previous: Point[]) => Point[])) => {
    updateActiveArea((area) => ({
      ...area,
      points: typeof value === "function" ? value(area.points) : value,
    }));
  };
  const setPerspectivePoints = (
    value: PerspectivePoints | null | ((previous: PerspectivePoints | null) => PerspectivePoints | null),
  ) => {
    updateActiveArea((area) => ({
      ...area,
      perspective: typeof value === "function" ? value(area.perspective) : value,
    }));
  };
  const setTile = (value: TileData | ((previous: TileData) => TileData)) => {
    updateActiveArea((area) => ({
      ...area,
      tile: typeof value === "function" ? value(area.tile) : value,
    }));
  };
  const setTileOverrides = (
    value: Record<string, TileData> | ((previous: Record<string, TileData>) => Record<string, TileData>),
  ) => {
    updateActiveArea((area) => ({
      ...area,
      overrides: typeof value === "function" ? value(area.overrides) : value,
    }));
  };

  const [draggingMaskIndex, setDraggingMaskIndex] = useState<number | null>(
    null,
  );

  const [draggingPerspectivePoint, setDraggingPerspectivePoint] =
    useState<PerspectiveKey | null>(null);

  const [grout, setGrout] = useState<GroutData>(initialGrout);

  /*
   * Multi selection
   */

  const [selectedTileCells, setSelectedTileCells] = useState<Set<string>>(
    new Set(),
  );

  /*
   * Current alternate tile
   */

  const [alternateTile, setAlternateTile] = useState<TileData | null>(null);

  /*
   * Cell ID -> TileData
   *
   * Different cells can contain
   * completely different products.
   */


  /* =======================================================
     NORMALIZED MOUSE POSITION
  ======================================================= */

  const getNormalizedPoint = useCallback((event: MouseEvent): Point | null => {
    const wrapper = imageWrapperRef.current;

    if (!wrapper) {
      return null;
    }

    const rect = wrapper.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return null;
    }

    const x = (event.clientX - rect.left) / rect.width;

    const y = (event.clientY - rect.top) / rect.height;

    return {
      x: Math.max(0, Math.min(1, x)),

      y: Math.max(0, Math.min(1, y)),
    };
  }, []);

  /* =======================================================
     ROOM
  ======================================================= */

  const handleRoomUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("فرمت تصویر باید JPG، PNG یا WebP باشد.");

      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("حجم تصویر نباید بیشتر از 15 مگابایت باشد.");

      return;
    }

    const url = URL.createObjectURL(file);

    const image = new window.Image();

    image.onload = () => {
      const firstArea: SurfaceArea = {
        id: `area-${Date.now()}`,
        points: [],
        perspective: null,
        tile: { ...initialTile },
        overrides: {},
      };
      setAreas([firstArea]);
      setActiveAreaId(firstArea.id);
      setRoom({
        file,
        url,

        width: image.naturalWidth,

        height: image.naturalHeight,
      });

      setSelectedTileCells(new Set());

      setTileOverrides({});

      setAlternateTile(null);

      setError(null);

      setStep("mask");
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);

      setError("تصویر محیط قابل بارگذاری نیست.");
    };

    image.src = url;
  };

  const addArea = () => {
    if (areas.some((area) => area.points.length < 3)) {
      setError("ابتدا محدوده فعلی را با حداقل سه نقطه کامل کنید.");
      return;
    }
    const area: SurfaceArea = {
      id: `area-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      points: [],
      perspective: null,
      tile: { ...initialTile },
      overrides: {},
    };
    setAreas((previous) => [...previous, area]);
    setActiveAreaId(area.id);
    setSelectedTileCells(new Set());
    setError(null);
  };

  const chooseArea = (id: string) => {
    setActiveAreaId(id);
    setSelectedTileCells(new Set());
    setAlternateTile(null);
    setError(null);
  };

  useEffect(() => {
    return () => { if (room.url) URL.revokeObjectURL(room.url); };
  }, [room.url]);

  /* =======================================================
     MASK
  ======================================================= */

  const handleMaskAreaClick = (event: MouseEvent<HTMLDivElement>) => {
    if (step !== "mask") {
      return;
    }

    if (draggingMaskIndex !== null) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.dataset.point === "true") {
      return;
    }

    const point = getNormalizedPoint(event);

    if (!point) {
      return;
    }

    setMaskPoints((previous) => [...previous, point]);
  };

  const handleMaskMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (draggingMaskIndex === null) {
      return;
    }

    const point = getNormalizedPoint(event);

    if (!point) {
      return;
    }

    setMaskPoints((previous) =>
      previous.map((item, index) =>
        index === draggingMaskIndex ? point : item,
      ),
    );
  };

  const finishMask = () => {
    if (areas.some((area) => area.points.length < 3)) {
      setError("حداقل سه نقطه برای مشخص کردن کف لازم است.");

      return;
    }

    setAreas((previous) => previous.map((area) => ({
      ...area,
      perspective: area.perspective ?? createDefaultPerspective(area.points),
      overrides: {},
    })));

    setSelectedTileCells(new Set());

    setError(null);

    setStep("perspective");
  };

  /* =======================================================
     PERSPECTIVE
  ======================================================= */

  const handlePerspectiveMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!draggingPerspectivePoint) {
      return;
    }

    const point = getNormalizedPoint(event);

    if (!point) {
      return;
    }

    setPerspectivePoints((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        [draggingPerspectivePoint]: point,
      };
    });
  };

  const resetPerspective = () => {
    const perspective = createDefaultPerspective(maskPoints);

    if (perspective) {
      setPerspectivePoints(perspective);
    }
  };

  const finishPerspective = () => {
    if (areas.some((area) => !area.perspective)) {
      return;
    }

    setAreas((previous) => previous.map((area) => ({ ...area, overrides: {} })));

    setSelectedTileCells(new Set());

    setError(null);

    setStep("tile");
  };

  /* =======================================================
     BASE TILE
  ======================================================= */

  const finishTile = () => {
    if (areas.some((area) => !area.tile.url)) {
      setError("برای همه محدوده‌ها کاشی انتخاب کنید.");

      return;
    }

    if (areas.some((area) => !area.perspective)) {
      setError("اطلاعات پرسپکتیو وجود ندارد.");

      return;
    }

    if (areas.some((area) => area.tile.widthCm <= 0 || area.tile.heightCm <= 0)) {
      setError("ابعاد کاشی معتبر نیست.");

      return;
    }

    setSelectedTileCells(new Set());

    setAlternateTile(null);

    setError(null);

    setStep("render");
  };

  /* =======================================================
     ALTERNATE TILE
  ======================================================= */

  const applyAlternateTile = () => {
    if (!alternateTile || !alternateTile.url) {
      setError("ابتدا کاشی جایگزین را انتخاب کنید.");

      return;
    }

    if (selectedTileCells.size === 0) {
      setError("حداقل یک کاشی را انتخاب کنید.");

      return;
    }

    setTileOverrides((previous) => {
      const next = {
        ...previous,
      };

      selectedTileCells.forEach((cellId) => {
        next[cellId] = alternateTile;
      });

      return next;
    });

    setSelectedTileCells(new Set());

    setAlternateTile(null);

    setError(null);
  };

  /* =======================================================
     RESET SELECTED CELLS TO BASE TILE
  ======================================================= */

  const resetSelectedTiles = () => {
    if (selectedTileCells.size === 0) {
      return;
    }

    setTileOverrides((previous) => {
      const next = {
        ...previous,
      };

      selectedTileCells.forEach((cellId) => {
        delete next[cellId];
      });

      return next;
    });

    setSelectedTileCells(new Set());

    setAlternateTile(null);

    setError(null);
  };

  /* =======================================================
     SVG VALUES
  ======================================================= */

  const polygonPoints = useMemo(
    () =>
      maskPoints.map((point) => `${point.x * 100},${point.y * 100}`).join(" "),
    [maskPoints],
  );

  const perspectivePolygon = useMemo(() => {
    if (!perspectivePoints) {
      return "";
    }

    return [
      perspectivePoints.TL,
      perspectivePoints.TR,
      perspectivePoints.BR,
      perspectivePoints.BL,
    ]
      .map((point) => `${point.x * 100},${point.y * 100}`)
      .join(" ");
  }, [perspectivePoints]);

  const homography = useMemo(() => {
    if (!perspectivePoints) {
      return null;
    }

    return createHomography(
      perspectivePoints.TL,
      perspectivePoints.TR,
      perspectivePoints.BR,
      perspectivePoints.BL,
    );
  }, [perspectivePoints]);

  const gridColumns = 8;

  const gridRows = 8;

  /* =======================================================
     RENDER ENGINE
  ======================================================= */

  const renderBaseScene = useCallback(() => {
    if (step !== "render" || !room.url || areas.some((area) => !area.tile.url || !area.perspective)) {
      return;
    }

    const canvas = renderCanvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    /*
     * Build list of all unique
     * tile image URLs currently used.
     */

    const requiredUrls = new Set<string>();

    areas.forEach((area) => {
      if (area.tile.url) requiredUrls.add(area.tile.url);
      (Object.values(area.overrides) as TileData[]).forEach((override) => {
        if (override.url) requiredUrls.add(override.url);
      });
    });

    const run = ++renderRunRef.current;
    const roomImage = new window.Image();
    const imageCache = new Map<string, HTMLImageElement>();

    let roomLoaded = false;

    let loadedTiles = 0;

    const totalTiles = requiredUrls.size;

    /* ===============================================
         DRAW
      =============================================== */

      

    const tryRender = () => {
      if (run !== renderRunRef.current || !roomLoaded || loadedTiles !== totalTiles) {
        return;
      }

      const MAX_RENDER_WIDTH = 1600;

      const scale = Math.min(
        1,

        MAX_RENDER_WIDTH / roomImage.naturalWidth,
      );

      const renderWidth = Math.round(roomImage.naturalWidth * scale);

      const renderHeight = Math.round(roomImage.naturalHeight * scale);

      canvas.width = renderWidth;

      canvas.height = renderHeight;

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.clearRect(0, 0, renderWidth, renderHeight);

      ctx.drawImage(roomImage, 0, 0, renderWidth, renderHeight);

      renderGridRef.current = {};
      areas.forEach((area) => {
        const { points: maskPoints, perspective: perspectivePoints, tile, overrides: tileOverrides } = area;
        if (!perspectivePoints || !tile.url) return;
      /* ===========================================
             HOMOGRAPHY
          =========================================== */

      const H = createHomography(
        perspectivePoints.TL,
        perspectivePoints.TR,
        perspectivePoints.BR,
        perspectivePoints.BL,
      );

      const inverse = invertHomography(H);

      if (!inverse) {
        setError("پرسپکتیو معتبر نیست.");

        return;
      }

      /* ===========================================
             MASK -> UV
          =========================================== */

      const maskUV = maskPoints
        .map((point) => unprojectPoint(point.x, point.y, inverse))
        .filter((point): point is Point => point !== null);

      if (maskUV.length < 3) {
        setError("محدوده کف قابل تبدیل به فضای پرسپکتیو نیست.");

        return;
      }

      const us = maskUV.map((point) => point.x);

      const vs = maskUV.map((point) => point.y);

      let minU = Math.min(...us) - 0.2;

      let maxU = Math.max(...us) + 0.2;

      let minV = Math.min(...vs) - 0.2;

      let maxV = Math.max(...vs) + 0.2;

      minU = Math.max(-10, minU);

      maxU = Math.min(10, maxU);

      minV = Math.max(-10, minV);

      maxV = Math.min(10, maxV);

      /* ===========================================
             TILE GEOMETRY
          =========================================== */

      const effectiveWidth = tile.rotation === 0 ? tile.widthCm : tile.heightCm;

      const effectiveHeight =
        tile.rotation === 0 ? tile.heightCm : tile.widthCm;

      const density = Math.max(2, tile.density);

      const tileU = 1 / density;

      const tileV = tileU * (effectiveHeight / effectiveWidth);

      if (
        !Number.isFinite(tileU) ||
        !Number.isFinite(tileV) ||
        tileU <= 0 ||
        tileV <= 0
      ) {
        return;
      }

      /* ===========================================
             GROUT GEOMETRY
          =========================================== */

      const groutWidthCm = grout.widthMm / 10;

      const groutRatioU = Math.min(
        0.25,

        groutWidthCm / effectiveWidth,
      );

      const groutRatioV = Math.min(
        0.25,

        groutWidthCm / effectiveHeight,
      );

      const groutU = tileU * groutRatioU;

      const groutV = tileV * groutRatioV;

      /* ===========================================
             GRID
          =========================================== */

      const startU = Math.floor(minU / tileU) * tileU;

      const endU = Math.ceil(maxU / tileU) * tileU;

      const startV = Math.floor(minV / tileV) * tileV;

      const endV = Math.ceil(maxV / tileV) * tileV;

      const columns = Math.ceil((endU - startU) / tileU);

      const rows = Math.ceil((endV - startV) / tileV);

      if (columns * rows > 2500) {
        setError("تعداد کاشی‌ها بیش از حد زیاد است. مقیاس کاشی را کاهش دهید.");

        return;
      }

      renderGridRef.current[area.id] = {
        H,
        inverse,

        startU,
        startV,

        tileU,
        tileV,

        rows,
        columns,
      };

      /* ===========================================
             FLOOR MASK
          =========================================== */

      ctx.save();

      ctx.beginPath();

      maskPoints.forEach((point, index) => {
        const x = point.x * renderWidth;

        const y = point.y * renderHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.closePath();

      ctx.clip();

      /* ===========================================
             DRAW ALL CELLS
          =========================================== */

      for (let row = 0; row < rows; row++) {
        const v0 = startV + row * tileV;

        const v1 = v0 + tileV;

        for (let column = 0; column < columns; column++) {
          const u0 = startU + column * tileU;

          const u1 = u0 + tileU;

          const cellId = getCellId(row, column);

          const cellTile = tileOverrides[cellId] ?? tile;

          if (!cellTile.url) {
            continue;
          }

          const tileImage = imageCache.get(cellTile.url);

          if (!tileImage) {
            continue;
          }

          const p00 = projectPoint(u0, v0, H);

          const p10 = projectPoint(u1, v0, H);

          const p11 = projectPoint(u1, v1, H);

          const p01 = projectPoint(u0, v1, H);

          if (!p00 || !p10 || !p11 || !p01) {
            continue;
          }

          const d00 = {
            x: p00.x * renderWidth,

            y: p00.y * renderHeight,
          };

          const d10 = {
            x: p10.x * renderWidth,

            y: p10.y * renderHeight,
          };

          const d11 = {
            x: p11.x * renderWidth,

            y: p11.y * renderHeight,
          };

          const d01 = {
            x: p01.x * renderWidth,

            y: p01.y * renderHeight,
          };

          const destinationPoints = [d00, d10, d11, d01];

          const invalid = destinationPoints.some(
            (point) =>
              !Number.isFinite(point.x) ||
              !Number.isFinite(point.y) ||
              Math.abs(point.x) > renderWidth * 20 ||
              Math.abs(point.y) > renderHeight * 20,
          );

          if (invalid) {
            continue;
          }

          const imageWidth = tileImage.naturalWidth;

          const imageHeight = tileImage.naturalHeight;

          /*
           * Triangle 1
           */

          drawImageTriangle(
            ctx,
            tileImage,

            0,
            0,

            imageWidth,
            0,

            imageWidth,
            imageHeight,

            d00.x,
            d00.y,

            d10.x,
            d10.y,

            d11.x,
            d11.y,
          );

          /*
           * Triangle 2
           */

          drawImageTriangle(
            ctx,
            tileImage,

            0,
            0,

            imageWidth,
            imageHeight,

            0,
            imageHeight,

            d00.x,
            d00.y,

            d11.x,
            d11.y,

            d01.x,
            d01.y,
          );
        }
      }

      /* ===========================================
             GROUT
          =========================================== */

      if (grout.widthMm > 0) {
        /*
         * Vertical grout
         */

        for (let column = 0; column <= columns; column++) {
          const u = startU + column * tileU;

          const leftU = u - groutU / 2;

          const rightU = u + groutU / 2;

          const p0 = projectPoint(leftU, startV, H);

          const p1 = projectPoint(rightU, startV, H);

          const p2 = projectPoint(rightU, endV, H);

          const p3 = projectPoint(leftU, endV, H);

          if (!p0 || !p1 || !p2 || !p3) {
            continue;
          }

          fillProjectedQuad(
            ctx,

            p0,
            p1,
            p2,
            p3,

            renderWidth,
            renderHeight,

            grout.color,
          );
        }

        /*
         * Horizontal grout
         */

        for (let row = 0; row <= rows; row++) {
          const v = startV + row * tileV;

          const topV = v - groutV / 2;

          const bottomV = v + groutV / 2;

          const p0 = projectPoint(startU, topV, H);

          const p1 = projectPoint(endU, topV, H);

          const p2 = projectPoint(endU, bottomV, H);

          const p3 = projectPoint(startU, bottomV, H);

          if (!p0 || !p1 || !p2 || !p3) {
            continue;
          }

          fillProjectedQuad(
            ctx,

            p0,
            p1,
            p2,
            p3,

            renderWidth,
            renderHeight,

            grout.color,
          );
        }
      }

      /* ===========================================
             SELECTED CELL HIGHLIGHT
          =========================================== */

      if (area.id === activeAreaId) selectedTileCells.forEach((cellId) => {
        const [rowString, columnString] = cellId.split(":");

        const row = Number(rowString);

        const column = Number(columnString);

        if (!Number.isFinite(row) || !Number.isFinite(column)) {
          return;
        }

        if (row < 0 || row >= rows || column < 0 || column >= columns) {
          return;
        }

        const u0 = startU + column * tileU;

        const u1 = u0 + tileU;

        const v0 = startV + row * tileV;

        const v1 = v0 + tileV;

        const p00 = projectPoint(u0, v0, H);

        const p10 = projectPoint(u1, v0, H);

        const p11 = projectPoint(u1, v1, H);

        const p01 = projectPoint(u0, v1, H);

        if (!p00 || !p10 || !p11 || !p01) {
          return;
        }

        ctx.beginPath();

        ctx.moveTo(
          p00.x * renderWidth,

          p00.y * renderHeight,
        );

        ctx.lineTo(
          p10.x * renderWidth,

          p10.y * renderHeight,
        );

        ctx.lineTo(
          p11.x * renderWidth,

          p11.y * renderHeight,
        );

        ctx.lineTo(
          p01.x * renderWidth,

          p01.y * renderHeight,
        );

        ctx.closePath();

        ctx.fillStyle = "rgba(255, 153, 0, 0.30)";

        ctx.fill();

        ctx.strokeStyle = "#ff9900";

        ctx.lineWidth = 3;

        ctx.stroke();
      });

      ctx.restore();
      });

      setError(null);
    };

    /* ===============================================
         LOAD ROOM
      =============================================== */

    roomImage.onload = () => {
      roomLoaded = true;

      tryRender();
    };

    roomImage.onerror = () => {
      if (run === renderRunRef.current) setError("تصویر محیط برای رندر قابل بارگذاری نیست.");
    };

    roomImage.src = room.url;

  //   /* ===============================================
  //        LOAD ALL TILE TEXTURES
  //     =============================================== */

    requiredUrls.forEach((url) => {
      const image = new window.Image();

      image.onload = () => {
        imageCache.set(url, image);

        loadedTiles += 1;

        tryRender();
      };

      image.onerror = () => {
        if (run === renderRunRef.current) setError("یکی از تصاویر کاشی قابل بارگذاری نیست.");
      };

      image.src = url;
    });
  }, [
    step,

    room.url,

    areas,

    grout.widthMm,
    grout.color,

    selectedTileCells,
    activeAreaId,
  ]);

  /* =======================================================
     RUN RENDERER
  ======================================================= */

  useEffect(() => {
    if (step !== "render") {
      return;
    }

    renderBaseScene();
    return () => { renderRunRef.current += 1; };
  }, [step, renderBaseScene]);

  /* =======================================================
     CANVAS CLICK
  ======================================================= */

  const handleRenderedTileClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = renderCanvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const canvasX = (event.clientX - rect.left) * (canvas.width / rect.width);

    const canvasY = (event.clientY - rect.top) * (canvas.height / rect.height);

    const x = canvasX / canvas.width;

    const y = canvasY / canvas.height;

    const hitArea = [...areas].reverse().find((area) =>
      area.points.length >= 3 &&
      pointInsidePolygon({ x, y }, area.points) &&
      renderGridRef.current[area.id],
    );
    if (!hitArea) return;
    const grid = renderGridRef.current[hitArea.id];
    if (hitArea.id !== activeAreaId) {
      chooseArea(hitArea.id);
      return;
    }

    const uv = unprojectPoint(x, y, grid.inverse);

    if (!uv) {
      return;
    }

    const column = Math.floor((uv.x - grid.startU) / grid.tileU);

    const row = Math.floor((uv.y - grid.startV) / grid.tileV);

    if (column < 0 || column >= grid.columns || row < 0 || row >= grid.rows) {
      return;
    }

    const cellId = getCellId(row, column);

    setSelectedTileCells((previous) => {
      const next = new Set(previous);

      if (next.has(cellId)) {
        next.delete(cellId);
      } else {
        next.add(cellId);
      }

      return next;
    });
  };

  const handleBaseProductSelect = (
    product: Product,
    data: {
      image: string;
      widthCm: number | null;
      heightCm: number | null;
      variant: Variant | null;
    },
  ) => {
    setTile((previous) => ({
      ...previous,

      id: `product-${product.id}`,

      productId: product.id,
      productName: product.name,

      variantId: data.variant?.id ?? null,

      url: data.image,

      widthCm: data.widthCm ?? previous.widthCm,

      heightCm: data.heightCm ?? previous.heightCm,
    }));

    setTileOverrides({});

    setSelectedTileCells(new Set());

    setAlternateTile(null);

    setError(null);
  };

  const handleAlternateProductSelect = (
    product: Product,
    data: {
      image: string;
      widthCm: number | null;
      heightCm: number | null;
      variant: Variant | null;
    },
  ) => {
    /*
     * محصول جایگزین داخل Cell فعلی قرار می‌گیرد.
     *
     * بنابراین geometry شبکه را تغییر نمی‌دهیم.
     */

    setAlternateTile({
      id: `product-${product.id}`,

      productId: product.id,
      productName: product.name,

      variantId: data.variant?.id ?? null,

      url: data.image,

      /*
       * Keep base-cell geometry.
       */

      widthCm: tile.widthCm,

      heightCm: tile.heightCm,

      rotation: tile.rotation,

      density: tile.density,
    });

    setError(null);
  };

  return {
    roomInputRef,
    imageWrapperRef,
    renderCanvasRef,
    step,
    setStep,
    room,
    setRoom,
    error,
    setError,
    areas,
    setAreas,
    activeAreaId,
    setActiveAreaId,
    maskPoints,
    perspectivePoints,
    tile,
    tileOverrides,
    setMaskPoints,
    setPerspectivePoints,
    setTile,
    setTileOverrides,
    draggingMaskIndex,
    setDraggingMaskIndex,
    draggingPerspectivePoint,
    setDraggingPerspectivePoint,
    grout,
    setGrout,
    selectedTileCells,
    setSelectedTileCells,
    alternateTile,
    setAlternateTile,
    getNormalizedPoint,
    handleRoomUpload,
    addArea,
    chooseArea,
    handleMaskAreaClick,
    handleMaskMouseMove,
    finishMask,
    handlePerspectiveMouseMove,
    resetPerspective,
    finishPerspective,
    finishTile,
    applyAlternateTile,
    resetSelectedTiles,
    polygonPoints,
    perspectivePolygon,
    homography,
    gridColumns,
    gridRows,
    handleRenderedTileClick,
    handleBaseProductSelect,
    handleAlternateProductSelect,
  };
}
