"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Position {
  top: number;
  left: number;
}

interface Obstacle extends Position {
  color: string;
}

const CubeMover: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ top: 50, left: 50 }]);
  const [color, setColor] = useState("blue");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>();
  const lastKeyPressed = useRef<string | null>(null);
  const cubeSize = 50;
  const [obstacleSpeed, setObstacleSpeed] = useState(2);
  const [snakeSpeed, setSnakeSpeed] = useState(3);
  const speedIncreaseInterval = 7000;

  const resetGame = () => {
    location.reload();
  };

  useEffect(() => {
    setObstacles(
      Array.from({ length: 30 }, () => ({
        top: Math.random() * (window.innerHeight - cubeSize),
        left: window.innerWidth + Math.random() * window.innerWidth,
        color: getRandomColor(),
      }))
    );
  }, []);

  useEffect(() => {
    const increaseSpeed = () => {
      setObstacleSpeed((prevSpeed) => prevSpeed * 1.09);
    };

    const interval = setInterval(increaseSpeed, speedIncreaseInterval);

    return () => clearInterval(interval);
  }, []);

  const getRandomColor = () => {
    const colors = ["blue", "red", "green"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
      setSnakeSpeed(Number(e.key));
    } else {
      lastKeyPressed.current = e.key;
    }
  }, []);

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", keydownListener);

    return () => {
      window.removeEventListener("keydown", keydownListener);
    };
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (lastKeyPressed.current) {
        case "ArrowUp":
          head.top = Math.max(head.top - snakeSpeed, 0);
          break;
        case "ArrowDown":
          head.top = Math.min(
            head.top + snakeSpeed,
            window.innerHeight - cubeSize
          );
          break;
        case "ArrowLeft":
          head.left = Math.max(head.left - snakeSpeed, 0);
          break;
        case "ArrowRight":
          head.left = Math.min(
            head.left + snakeSpeed,
            window.innerWidth - cubeSize
          );
          break;
        default:
          return newSnake;
      }

      newSnake.unshift(head);
      newSnake.pop();

      if (
        head.top === 0 ||
        head.top === window.innerHeight - cubeSize ||
        head.left === 0 ||
        head.left === window.innerWidth - cubeSize
      ) {
        setIsGameOver(true);
      }

      return newSnake;
    });
  }, [snakeSpeed]);

  const moveObstacles = useCallback(() => {
    setObstacles((prevObstacles) =>
      prevObstacles.map((obstacle) => {
        const newLeft = obstacle.left - obstacleSpeed;

        const isCollision = snake.some(
          (segment) =>
            segment.left < obstacle.left + cubeSize &&
            segment.left + cubeSize > obstacle.left &&
            segment.top < obstacle.top + cubeSize &&
            segment.top + cubeSize > obstacle.top
        );

        if (isCollision) {
          if (obstacle.color === color) {
            const newSegment = {
              top: snake[snake.length - 1].top,
              left: snake[snake.length - 1].left,
            };
            setSnake((prevSnake) => [...prevSnake, newSegment]);
            setScore((prevScore) => prevScore + 1);
            return {
              top: Math.random() * (window.innerHeight - cubeSize),
              left: window.innerWidth,
              color: getRandomColor(),
            };
          } else {
            setIsGameOver(true);
          }
        }

        if (newLeft <= 0) {
          return {
            top: Math.random() * (window.innerHeight - cubeSize),
            left: window.innerWidth,
            color: getRandomColor(),
          };
        }

        return {
          ...obstacle,
          left: newLeft,
        };
      })
    );
  }, [color, snake, obstacleSpeed]);

  const animate = useCallback(() => {
    if (!isGameOver) {
      moveSnake();
      moveObstacles();
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isGameOver, moveSnake, moveObstacles]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  const getColorHex = (color: string) => {
    switch (color) {
      case "blue":
        return "#3b82f6";
      case "red":
        return "#ef4444";
      case "green":
        return "#10b941";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {snake.map((segment, index) => (
        <div
          key={index}
          style={{
            top: `${segment.top}px`,
            left: `${segment.left}px`,
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            position: "absolute",
            transition: "top 0.1s linear, left 0.1s linear",
            backgroundColor: getColorHex(color),
          }}
        />
      ))}
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          style={{
            top: `${obstacle.top}px`,
            left: `${obstacle.left}px`,
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            position: "absolute",
            transition: "left 0.1s linear",
            backgroundColor: getColorHex(obstacle.color),
          }}
        />
      ))}
      {isGameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   text-white text-[50px]">
          <p className="block text-white bg-red-500 p-2  rounded"> You Lost</p>
          <button
            onClick={resetGame}
            className="block mt-4  text-white px-6 py-2  rounded"
          >
            Restart
          </button>
        </div>
      )}
      <div className="absolute bottom-4 right-4  text-white text-[30px]">
        Score: {score}
      </div>
    </div>
  );
};

export default CubeMover;
