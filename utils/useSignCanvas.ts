/**
 * 手写签名 Hook
 * 用于合同签署场景
 */

import { useRef, useCallback, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface UseSignCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  clear: () => void;
  undo: () => void;
  getSignatureDataURL: () => string | null;
  getSignatureBlob: () => Promise<Blob | null>;
  isEmpty: boolean;
}

export function useSignCanvas(): UseSignCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStroke = useRef<Point[]>([]);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    currentStroke.current = [];

    const rect = canvas.getBoundingClientRect();
    const point = getPoint(e, rect);

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    currentStroke.current.push(point);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const point = getPoint(e, rect);

    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = '#18FF74'; // 生物绿签名
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    currentStroke.current.push(point);
    setIsEmpty(false);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (isDrawing && currentStroke.current.length > 0) {
      setStrokes(prev => [...prev, currentStroke.current]);
      currentStroke.current = [];
    }
    setIsDrawing(false);
  }, [isDrawing]);

  const clear = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    currentStroke.current = [];
    setIsEmpty(true);
  }, []);

  const undo = useCallback(() => {
    if (strokes.length === 0) return;

    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);

    // 重绘
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    newStrokes.forEach(stroke => {
      if (stroke.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = '#18FF74';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    if (newStrokes.length === 0) {
      setIsEmpty(true);
    }
  }, [strokes]);

  const getSignatureDataURL = useCallback((): string | null => {
    if (!canvasRef.current || isEmpty) return null;
    return canvasRef.current.toDataURL('image/png');
  }, [isEmpty]);

  const getSignatureBlob = useCallback(async (): Promise<Blob | null> => {
    if (!canvasRef.current || isEmpty) return null;

    return new Promise((resolve) => {
      canvasRef.current!.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }, [isEmpty]);

  // 辅助函数：获取鼠标/触摸点相对于 canvas 的坐标
  const getPoint = (e: MouseEvent | TouchEvent, rect: DOMRect): Point => {
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  // 绑定事件监听
  useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing as any);
    canvas.addEventListener('mousemove', draw as any);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing as any);
    canvas.addEventListener('touchmove', draw as any);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing as any);
      canvas.removeEventListener('mousemove', draw as any);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing as any);
      canvas.removeEventListener('touchmove', draw as any);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  return {
    canvasRef,
    isDrawing,
    clear,
    undo,
    getSignatureDataURL,
    getSignatureBlob,
    isEmpty,
  };
}
