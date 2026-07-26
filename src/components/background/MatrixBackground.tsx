"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MatrixBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  fontSize?: number;
  speed?: number;
  color?: string;
  charset?: string;
}

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

const DEFAULT_CHARSET =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

export function MatrixBackground({
  className,
  children,
  fontSize = 16,
  speed = 1,
  color = "#ff0606",
  charset = DEFAULT_CHARSET,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    const chars = charset.split("");

    const columnWidth = fontSize;
    let columnCount = Math.ceil(width / columnWidth);

    const createColumn = (x: number): Column => ({
      x,
      y: Math.random() * 2 * height - height,
      speed: (0.5 + Math.random() * 0.5) * speed,
      chars: Array.from({ length: 25 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ),
      length: 15 + Math.floor(Math.random() * 15),
    });

    let columns: Column[] = Array.from({ length: columnCount }, (_, i) =>
      createColumn(i * columnWidth)
    );

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      columnCount = Math.ceil(width / columnWidth);

      while (columns.length < columnCount) {
        columns.push(createColumn(columns.length * columnWidth));
      }
      columns = columns.slice(0, columnCount);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 255, g: 6, b: 6 };
    };

    const rgb = hexToRgb(color);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (const column of columns) {
        column.y += column.speed * fontSize * 0.5;

        for (let i = 0; i < column.length; i++) {
          const charY = column.y - i * fontSize;

          if (charY < -fontSize || charY > height + fontSize) continue;

          const opacity = i === 0 ? 1 : Math.max(0, 1 - i / column.length);

          if (i === 0) {
            ctx.fillStyle = `rgba(${Math.min(255, rgb.r + 150)}, ${Math.min(255, rgb.g + 150)}, ${Math.min(255, rgb.b + 150)}, ${opacity})`;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
            ctx.shadowBlur = 0;
          }

          if (Math.random() < 0.02) {
            column.chars[i % column.chars.length] =
              chars[Math.floor(Math.random() * chars.length)];
          }

          ctx.fillText(
            column.chars[i % column.chars.length],
            column.x,
            charY
          );
        }

        ctx.shadowBlur = 0;

        if (column.y - column.length * fontSize > height) {
          column.y = Math.random() * -height * 0.5;
          column.speed = (0.5 + Math.random() * 0.5) * speed;
          column.length = 15 + Math.floor(Math.random() * 15);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [fontSize, speed, color, charset]);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-y-auto overflow-x-hidden bg-black", className)}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full pointer-events-none"
      />

      {children && (
        <div className="relative z-10 min-h-full w-full">{children}</div>
      )}
    </div>
  );
}
