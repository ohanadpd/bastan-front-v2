'use client';

import { useEffect, useRef } from 'react';

import {
  Canvas,
  FabricImage,
  Polygon,
  Circle,
} from 'fabric';

import { renderFloorTile } from '@/lib/services/visualizer/renderFloorTile';



type Point = {
  x:number;
  y:number;
};


type Props = {
  roomSrc:string;
  tileSrc:string;
};



export default function VisualizerCanvas({

  roomSrc,
  tileSrc,

}:Props){


  const canvasRef =
    useRef<HTMLCanvasElement|null>(null);



  const fabricCanvasRef =
    useRef<Canvas|null>(null);



  const pointsRef =
    useRef<Point[]>([]);



  const pointObjectsRef =
    useRef<Circle[]>([]);



  const polygonRef =
    useRef<Polygon|null>(null);



  const floorTileRef =
    useRef<FabricImage|null>(null);



  const isDrawingRef =
    useRef(true);



  const historyRef =
    useRef<Point[][]>([]);



  const redoRef =
    useRef<Point[][]>([]);



  const clickTimerRef =
    useRef<NodeJS.Timeout|null>(null);








  useEffect(()=>{


    if(!canvasRef.current)
      return;



    const canvas =
      new Canvas(
        canvasRef.current,
        {
          width:1000,
          height:650,
          selection:false,
        }
      );



    fabricCanvasRef.current =
      canvas;





    let cancelled=false;





    async function init(){


      const room =
        await FabricImage.fromURL(roomSrc);



      if(cancelled)
        return;





      const scale =
        Math.min(
          canvas.width / room.width,
          canvas.height / room.height
        );





      room.set({

        left:canvas.width / 2,

        top:canvas.height / 2,

        originX:'center',

        originY:'center',

        scaleX:scale,

        scaleY:scale,

        selectable:false,

        evented:false,

      });





      canvas.backgroundImage =
        room;



      canvas.requestRenderAll();






      canvas.on(
        'mouse:down',
        (opt)=>{


          if(!isDrawingRef.current)
            return;




          if(clickTimerRef.current){

            clearTimeout(
              clickTimerRef.current
            );


            clickTimerRef.current=null;


            return;

          }






          clickTimerRef.current =
            setTimeout(()=>{



              const pointer =
                canvas.getPointer(opt.e);




              const point:Point = {

                x:pointer.x,

                y:pointer.y,

              };




              pointsRef.current.push(point);




              historyRef.current.push(
                [
                  ...pointsRef.current
                ]
              );



              redoRef.current=[];





              createPoint(
                canvas,
                point
              );




              updatePolygon(canvas);



              clickTimerRef.current=null;



            },250);



        }
      );









      canvas.on(
        'mouse:dblclick',
        ()=>{


          if(clickTimerRef.current){

            clearTimeout(
              clickTimerRef.current
            );


            clickTimerRef.current=null;

          }




          if(pointsRef.current.length < 3)
            return;





          isDrawingRef.current=false;





          renderFloorTile(

            canvas,

            tileSrc,

            pointsRef.current,

            floorTileRef

          );



        }
      );



    }





    init();






    return ()=>{

      cancelled=true;

      canvas.dispose();

    };



  },[
    roomSrc,
    tileSrc
  ]);









  function createPoint(

    canvas:Canvas,

    point:Point

  ){



    const dot =
      new Circle({

        left:point.x,

        top:point.y,

        radius:7,

        fill:'red',

        originX:'center',

        originY:'center',

        selectable:true,

        evented:true,

      });







    dot.on(
      'moving',
      ()=>{


        const index =
          pointObjectsRef.current.indexOf(dot);



        if(index===-1)
          return;




        pointsRef.current[index]={

          x:dot.left ?? 0,

          y:dot.top ?? 0,

        };




        updatePolygon(canvas);





        renderFloorTile(

          canvas,

          tileSrc,

          pointsRef.current,

          floorTileRef

        );



      }
    );





    pointObjectsRef.current.push(dot);



    canvas.add(dot);


  }









  function updatePolygon(
    canvas:Canvas
  ){



    if(pointsRef.current.length < 3)
      return;





    if(polygonRef.current){

      canvas.remove(
        polygonRef.current
      );

    }





    polygonRef.current =
      new Polygon(

        [
          ...pointsRef.current
        ],

        {

          fill:
          'rgba(0,150,255,0.12)',


          stroke:
          '#008cff',


          strokeWidth:2,


          selectable:false,


          evented:false,

        }

      );





    canvas.add(
      polygonRef.current
    );




    pointObjectsRef.current.forEach(
      p=>canvas.bringObjectForward(p)
    );



    canvas.requestRenderAll();


  }









  function undo(){


    if(historyRef.current.length===0)
      return;



    redoRef.current.push(
      [
        ...pointsRef.current
      ]
    );



    historyRef.current.pop();




    pointsRef.current =
      historyRef.current.length
      ?
      [
        ...historyRef.current[
          historyRef.current.length-1
        ]
      ]
      :
      [];



    redraw();


  }









  function redo(){


    if(redoRef.current.length===0)
      return;



    historyRef.current.push(
      [
        ...pointsRef.current
      ]
    );



    pointsRef.current =
      [
        ...redoRef.current.pop()!
      ];



    redraw();


  }








  function redraw(){


    const canvas =
      fabricCanvasRef.current;



    if(!canvas)
      return;




    pointObjectsRef.current.forEach(
      p=>canvas.remove(p)
    );



    pointObjectsRef.current=[];



    pointsRef.current.forEach(
      p=>{

        createPoint(
          canvas,
          p
        );

      }
    );



    updatePolygon(canvas);



    canvas.requestRenderAll();


  }








  function newFloor(){


    pointsRef.current=[];


    historyRef.current=[];


    redoRef.current=[];


    isDrawingRef.current=true;




    redraw();


  }









  return (

    <div className="relative w-full overflow-hidden rounded-xl bg-white shadow">


      <canvas ref={canvasRef}/>



      <div className="absolute bottom-5 left-5 flex gap-2">


        <button
          onClick={undo}
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Undo
        </button>



        <button
          onClick={redo}
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Redo
        </button>



        <button
          onClick={newFloor}
          className="rounded bg-black px-4 py-2 text-white"
        >
          کف جدید
        </button>


      </div>


    </div>

  );

}