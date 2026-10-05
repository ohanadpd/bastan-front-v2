'use client';

import { useRef, useState } from 'react';
import type { Point } from '@/lib/services/visualizer/perspective';

type Props = {
  onComplete: (points: Point[]) => void;
  width: number;
  height: number;
};

export default function FloorSelector({
  onComplete,
  width,
  height,
}: Props) {

  const [points, setPoints] = useState<Point[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const isDragging = useRef(false);



  function getPosition(
    e: React.MouseEvent<HTMLDivElement>
  ): Point {

    const rect =
      e.currentTarget.getBoundingClientRect();

    return {
      x:
        ((e.clientX - rect.left) / rect.width) * width,

      y:
        ((e.clientY - rect.top) / rect.height) * height,
    };
  }



  // اضافه کردن نقطه جدید
  function handleCanvasClick(
    e: React.MouseEvent<HTMLDivElement>
  ) {

    // اگر درگ بود، کلیک حساب نشود
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }


    // بعد از ۴ نقطه دیگر نقطه نساز
    if (points.length >= 4) return;


    const next = [
      ...points,
      getPosition(e),
    ];


    setPoints(next);


    if (next.length === 4) {
      onComplete(next);
    }

  }



  // شروع حرکت نقطه
  function startDrag(
    e: React.MouseEvent,
    index: number
  ) {

    e.stopPropagation();

    isDragging.current = true;

    setDragIndex(index);

  }



  // حرکت نقطه
  function handleMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {

    if (dragIndex === null) return;


    const updated = [
      ...points,
    ];


    updated[dragIndex] =
      getPosition(e);


    setPoints(updated);


    if (updated.length === 4) {
      onComplete(updated);
    }

  }



  function stopDrag() {

    setDragIndex(null);

    isDragging.current = false;

  }



  function reset() {

    setPoints([]);

    setDragIndex(null);

    onComplete([]);

  }



  return (

    <div

      className="
        absolute
        inset-0
        cursor-crosshair
      "

      onClick={handleCanvasClick}

      onMouseMove={handleMove}

      onMouseUp={stopDrag}

      onMouseLeave={stopDrag}

    >


      {/* محدوده کف */}

      {points.length >= 2 && (

        <svg

          className="
            pointer-events-none
            absolute
            inset-0
            h-full
            w-full
          "

          viewBox={`0 0 ${width} ${height}`}

          preserveAspectRatio="none"

        >

          <polygon

            points={
              points
                .map(
                  (p) =>
                    `${p.x},${p.y}`
                )
                .join(' ')
            }


            fill="rgba(0,150,255,0.25)"

            stroke="#008cff"

            strokeWidth="4"

          />

        </svg>

      )}




      {/* نقاط کف */}

      {points.map((p,index)=>(

        <div

          key={index}

          onMouseDown={(e)=>
            startDrag(e,index)
          }


          className="
            absolute
            z-10
            h-6
            w-6
            cursor-move
            rounded-full
            bg-red-500
            shadow-lg
          "


          style={{

            left:
              `${(p.x / width) * 100}%`,

            top:
              `${(p.y / height) * 100}%`,


            transform:
              'translate(-50%, -50%)',

          }}

        />

      ))}





      {/* پاک کردن */}

      {points.length > 0 && (

        <button

          type="button"

          onClick={(e)=>{

            e.stopPropagation();

            reset();

          }}


          className="
            absolute
            bottom-5
            left-5
            z-20
            rounded-lg
            bg-white
            px-4
            py-2
            text-sm
            shadow
          "

        >

          پاک کردن انتخاب کف

        </button>

      )}


    </div>

  );

}