"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface Position {
  top: number;
  left: number;
}

const CubeMover: React.FC = () => {
  const [cube, setCube] = useState<Position>({ top: 50, left: 50 });
  const [color, setColor] = useState("blue");
  const requestRef = useRef<number>();
  const cubeSize = 50;
  const [speed, setSpeed] = useState(3);
  const direction = useRef<string | null>(null);

  const moveCube = useCallback(() => {
    setCube((prevCube) => {
      let newTop = prevCube.top;
      let newLeft = prevCube.left;

      switch (direction.current) {
        case "ArrowUp":
          newTop = Math.max(prevCube.top - speed, 0);
          break;
        case "ArrowDown":
          newTop = Math.min(
            prevCube.top + speed,
            window.innerHeight - cubeSize
          );
          break;
        case "ArrowLeft":
          newLeft = Math.max(prevCube.left - speed, 0);
          break;
        case "ArrowRight":
          newLeft = Math.min(prevCube.left + speed, 1290);
          break;
        default:
          break;
      }

      return { top: newTop, left: newLeft };
    });
  }, [speed]);

  const animate = useCallback(() => {
    moveCube();
    requestRef.current = requestAnimationFrame(animate);
  }, [moveCube]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      setColor((prevColor) => {
        switch (prevColor) {
          case "red":
            return "blue";
          case "blue":
            return "green";
          case "green":
            return "red";
          default:
            return "blue";
        }
      });
    } else if (e.key >= "1" && e.key <= "9") {
      setSpeed(Number(e.key));
    } else {
      direction.current = e.key;
    }
  }, []);

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", keydownListener);

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("keydown", keydownListener);
      cancelAnimationFrame(requestRef.current!);
    };
  }, [animate, handleKeyDown]);

  const getColorHex = (color: string) => {
    switch (color) {
      case "blue":
        return "#3b82f6";
      case "red":
        return "#ef4444";
      case "green":
        return "#10b981";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <div
        style={{
          top: `${cube.top}px`,
          left: `${cube.left}px`,
          width: `${cubeSize}px`,
          height: `${cubeSize}px`,
          position: "absolute",
          backgroundColor: getColorHex(color),
        }}
      />
      <Link href={"/game"} className="absolute top-[700px] left-[600px]">
        <p className="text-white text-[50px] hover:text-green-500">START</p>
      </Link>
    </div>
  );
};

export default CubeMover;
