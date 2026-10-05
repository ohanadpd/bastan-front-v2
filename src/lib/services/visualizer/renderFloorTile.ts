import {
  Canvas,
  FabricImage,
  Polygon,
} from 'fabric';


type Point = {
  x:number;
  y:number;
};



export async function renderFloorTile(

  canvas:Canvas,

  tileSrc:string,

  points:Point[],

  floorTileRef:any

){

  if(points.length < 3)
    return;



  if(floorTileRef.current){

    canvas.remove(
      floorTileRef.current
    );

    floorTileRef.current=null;

  }




  const tile = new Image();

  tile.crossOrigin="anonymous";

  tile.src=tileSrc;



  await new Promise<void>((resolve,reject)=>{

    tile.onload=()=>resolve();

    tile.onerror=()=>reject();

  });




  const tempCanvas =
    document.createElement('canvas');


  tempCanvas.width=1000;

  tempCanvas.height=650;



  const ctx =
    tempCanvas.getContext('2d');


  if(!ctx)
    return;



  const pattern =
    ctx.createPattern(
      tile,
      'repeat'
    );


  if(pattern){

    ctx.fillStyle=pattern;

    ctx.fillRect(
      0,
      0,
      1000,
      650
    );

  }




  const image =
    new FabricImage(
      tempCanvas,
      {
        left:0,
        top:0,
        selectable:false,
        evented:false,
      }
    );



  const mask =
    new Polygon(
      points,
      {
        fill:'#fff',
        selectable:false,
        evented:false,
        absolutePositioned:true,
      }
    );



  image.clipPath=mask;



  floorTileRef.current=image;



  canvas.add(image);


  canvas.requestRenderAll();

}