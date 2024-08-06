"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function RunawayText() {
  const [position, setPosition] = useState<{ top: string; left: string }>({
    top: "45%",
    left: "45%",
  });
  const textRef = useRef<HTMLDivElement>(null);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [smileys, setSmileys] = useState<
    { top: string; left: string; id: number }[]
  >([]);
  const smileyCount = 10;

  const moveText = (mouseX: number, mouseY: number) => {
    if (!textRef.current) return;
    const textElement = textRef.current;
    const rect = textElement.getBoundingClientRect();

    const textX = rect.left + rect.width / 2;
    const textY = rect.top + rect.height / 2;

    const diffX = textX - mouseX;
    const diffY = textY - mouseY;

    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    if (distance < 150) {
      const angle = Math.atan2(diffY, diffX);
      const moveDistance = 70;
      const newLeft = textX + Math.cos(angle) * moveDistance;
      const newTop = textY + Math.sin(angle) * moveDistance;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      const clampedLeft = Math.min(
        Math.max(0, newLeft - rect.width / 2),
        containerWidth - rect.width
      );
      const clampedTop = Math.min(
        Math.max(0, newTop - rect.height / 2),
        containerHeight - rect.height
      );

      setPosition({ top: `${clampedTop}px`, left: `${clampedLeft}px` });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isFirstMove) {
        generateSmileys();
        setIsFirstMove(false);
      }
      moveText(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isFirstMove]);

  const generateSmileys = () => {
    const newSmileys = [];
    for (let i = 0; i < smileyCount; i++) {
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      newSmileys.push({ top, left, id: i });
    }
    setSmileys(newSmileys);
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
      {smileys.map((smiley, index) => (
        <div
          key={smiley.id}
          className="absolute text-3xl smiley text-white"
          style={{
            top: smiley.top,
            left: smiley.left,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          :)
        </div>
      ))}
      <Link href={"/menu"}>
        <div
          ref={textRef}
          className="absolute cursor-pointer transition-all duration-75 neon-text text-[50px]"
          style={{ top: position.top, left: position.left }}
        >
          START
        </div>
      </Link>
      <style jsx>{`
        @keyframes appear {
          0% {
            opacity: 0;
            transform: rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: rotate(90deg);
          }
          100% {
            opacity: 0;
            transform: rotate(0deg);
          }
        }
        .smiley {
          animation: appear 5s infinite;
        }
        .neon-text {
          color: #39ff14;
          text-shadow: 0 0 5px rgba(57, 255, 20, 0.7),
            0 0 10px rgba(57, 255, 20, 0.6), 0 0 20px rgba(57, 255, 20, 0.5),
            0 0 40px rgba(57, 255, 20, 0.4), 0 0 80px rgba(57, 255, 20, 0.3),
            0 0 90px rgba(57, 255, 20, 0.2), 0 0 100px rgba(57, 255, 20, 0.1),
            0 0 150px rgba(57, 255, 20, 0.05);
        }
      `}</style>
    </div>
  );
}
