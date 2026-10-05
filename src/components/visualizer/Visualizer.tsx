"use client";

import { useState } from "react";
import VisualizerCanvas from "./VisualizerCanvas";
import RoomUploader from "./RoomUploader";
import type { Point } from '@/lib/services/visualizer/perspective';
import FloorSelector from "./FloorSelector";
const tiles = [
  {
    id: 1,
    name: "سرامیک ۱",
    image: "/images/visualizer/tiles/ceramic-1.png",
  },
  {
    id: 2,
    name: "سرامیک ۲",
    image: "/images/visualizer/tiles/ceramic-2.png",
  },
  {
    id: 3,
    name: "سرامیک ۳",
    image: "/images/visualizer/tiles/ceramic-3.png",
  },
];

export default function Visualizer() {
  const [selectedTile, setSelectedTile] = useState(tiles[0]);
  const [room, setRoom] = useState("/images/visualizer/rooms/living-room.png");
  const [floorPoints,setFloorPoints] = useState<Point[]>([]);
  return (
    <div className="space-y-6 mt-20">
      <RoomUploader onUpload={setRoom} />
      <div className="relative">

  <VisualizerCanvas

 roomSrc="/images/visualizer/rooms/living-room.png"

 tileSrc="/images/visualizer/tiles/ceramic-1.png"

/>

  {floorPoints.length < 4 && (
    <FloorSelector
  onComplete={setFloorPoints}
  width={1000}
  height={650}
/>
  )}

</div>

      <div>
        <h2 className="mb-3 text-lg font-bold">انتخاب سرامیک</h2>

        <div className="flex gap-4">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => setSelectedTile(tile)}
              className={`overflow-hidden rounded-lg border-2 p-1 ${
                selectedTile.id === tile.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <img
                src={tile.image}
                alt={tile.name}
                className="h-20 w-20 rounded object-cover"
              />

              <span className="mt-1 block text-sm">{tile.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
