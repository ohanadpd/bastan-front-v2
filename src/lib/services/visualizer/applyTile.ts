import {
  Canvas,
  FabricImage,
  Polygon,
} from 'fabric';


type Point = {
  x: number;
  y: number;
};


export async function applyTileToFloor(
  canvas: Canvas,
  tileSrc: string,
  points: Point[]
) {

  if (points.length !== 4) return;


  const tile = await FabricImage.fromURL(tileSrc);


  // اندازه کاشی برای تست
  tile.set({
    left: 0,
    top: 0,

    scaleX: 1,
    scaleY: 1,

    selectable: false,
    evented: false,
  });



  const mask = new Polygon(
    points,
    {
      fill: 'white',

      absolutePositioned: true,

      selectable: false,

      evented: false,
    }
  );


  tile.clipPath = mask;


  canvas.add(tile);


  canvas.bringObjectToFront(tile);


  canvas.requestRenderAll();

}