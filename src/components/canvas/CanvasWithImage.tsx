import React, { useRef, useState, useEffect } from "react";

type Point = { x: number; y: number };
type Path = {
  id: string;
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
  isErased?: boolean;
};

type Props = {
  imageUrl: string;
};

export default function CanvasWithImageUrl({ imageUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  // Load image from URL and set canvas size
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important if image is from other domains and you want to export canvas later
    img.onload = () => {
      setImage(img);
      setCanvasSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      console.error("Failed to load image:", imageUrl);
      setImage(null);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Drawing logic (same as before) ----------------------

  const isDrawing = useRef(false);

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasSize.width,
      y: ((e.clientY - rect.top) / rect.height) * canvasSize.height,
    };
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    isDrawing.current = true;

    if (mode === "draw") {
      const newPath: Path = {
        id: Date.now().toString(),
        points: [pos],
        strokeColor: "black",
        strokeWidth: 3,
      };
      setCurrentPath(newPath);
    } else if (mode === "erase") {
      eraseAtPoint(pos);
    }
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const pos = getMousePos(e);

    if (mode === "draw" && currentPath) {
      setCurrentPath({
        ...currentPath,
        points: [...currentPath.points, pos],
      });
    } else if (mode === "erase") {
      eraseAtPoint(pos);
    }
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    if (mode === "draw" && currentPath) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath(null);
    }
  };

  const eraseAtPoint = (point: Point) => {
    const hitRadius = 10;
    setPaths((prev) =>
      prev.map((path) => {
        if (path.isErased) return path;
        const hit = path.points.some((p) => Math.hypot(p.x - point.x, p.y - point.y) < hitRadius);
        if (hit) {
          if (highlightedId === path.id) setHighlightedId(null);
          return { ...path, isErased: true };
        }
        return path;
      })
    );
  };

  // Draw everything ------------------------

  const draw = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (image) {
      ctx.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    }

    paths.forEach((path) => {
      if (path.isErased) return;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = path.strokeColor;
      ctx.lineWidth = path.strokeWidth;

      if (path.id === highlightedId) {
        ctx.shadowColor = "orange";
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      path.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.closePath();
    });

    if (currentPath) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = currentPath.strokeColor;
      ctx.lineWidth = currentPath.strokeWidth;
      ctx.beginPath();
      currentPath.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.closePath();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const hitRadius = 10;
    const hitPath = [...paths]
      .reverse()
      .find((path) => !path.isErased && path.points.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < hitRadius));

    setHighlightedId(hitPath ? hitPath.id : null);
  };

  useEffect(() => {
    draw();
  }, [paths, currentPath, image, highlightedId, canvasSize]);

  return (
    <div className="">
      {/* <div style={{ marginBottom: 8 }}>
        <button onClick={() => setMode("draw")} disabled={mode === "draw"}>
          Draw
        </button>
        <button onClick={() => setMode("erase")} disabled={mode === "erase"}>
          Erase
        </button>
        <button onClick={() => setHighlightedId(null)}>Clear Highlight</button>
      </div> */}

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ border: "1px solid #ccc", cursor: mode === "draw" ? "crosshair" : "pointer" }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onClick={handleClick}
      />
    </div>
  );
}
