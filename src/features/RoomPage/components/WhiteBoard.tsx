'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Element from '../types/Element';
import rough from 'roughjs';

interface WhiteBoardProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctxRef: any;
    elements: Element[];
    setElements: React.Dispatch<React.SetStateAction<Element[]>>;
    tool: string;
    color: string;
    scale: number;
    zoomLevel: number;
}

const WhiteBoard: React.FC<WhiteBoardProps> = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    color,
    scale,
    zoomLevel,
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    console.log(canvasRef)
    console.log(ctxRef)

    const redrawCanvas = () => {
        const ctx = ctxRef.current;
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const roughCanvas = rough.canvas(canvasRef.current!);


            elements.forEach((element) => {
                if (element.type === 'pencil' && element.path) {
                    const path: any = element.path.map(point => {
                        if (point.length >= 2) {
                            return [point[0], point[1]] as [number, number]; // Asserting each point as a tuple
                        } else {
                            throw new Error("Invalid path point encountered");
                        }
                    });
                    roughCanvas.linearPath(path, { stroke: element.stroke, strokeWidth: 5, roughness: 0.5 });
                } else if (element.type === 'line') {
                    const { offsetX, offsetY, width, height, stroke } = element;
                    roughCanvas.line(offsetX, offsetY, width ?? offsetX, height ?? offsetY, { stroke, strokeWidth: 5, roughness: 0.5 });
                } else if (element.type === 'rect') {
                    const { offsetX, offsetY, width, height, stroke } = element;
                    roughCanvas.rectangle(offsetX, offsetY, width ?? 0, height ?? 0, { stroke, strokeWidth: 5, roughness: 0.5 });
                }
            });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                console.log('Canvas context:', ctx); // Check if context is obtained successfully
                ctxRef.current = ctx;
            }
        }
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth * 2;
                canvasRef.current.height = window.innerHeight * 2;
                redrawCanvas();
            }
        };

        handleResize(); // Call handleResize initially

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && ctxRef.current) {
            canvas.width = window.innerWidth * 2;
            canvas.height = window.innerHeight * 2;
            if (canvasRef.current) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
                    ctx.scale(scale, scale);
                    ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctxRef.current = ctx;
                    redrawCanvas();
                }
            }
        }
    }, [scale, color]);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.strokeStyle = color;
        }
    }, [color]);

    useLayoutEffect(() => {
        if (canvasRef.current) {
            const roughCanvas = rough.canvas(canvasRef.current);
            if (elements.length > 0) {

                const topLeftX = canvasRef.current.width * (100 - zoomLevel) / 100;
                const topLeftY = canvasRef.current.height * (100 - zoomLevel) / 100;
                ctxRef.current?.clearRect(-topLeftX, -topLeftY, canvasRef.current.width + canvasRef.current.width * (100 - zoomLevel) / 100, canvasRef.current.height + canvasRef.current.height * (100 - zoomLevel) / 100);
            }


            elements.forEach((element) => {
                if (element.type === 'pencil' && element.path) {
                    const path: any = element.path.map(point => {
                        if (point.length >= 2) {
                            return [point[0], point[1]] as [number, number];
                        } else {
                            throw new Error("Invalid path point encountered");
                        }
                    });
                    roughCanvas.linearPath(path, { stroke: element.stroke, strokeWidth: 5, roughness: 0.5 });
                } else if (element.type === 'line') {
                    const { offsetX, offsetY, width, height, stroke } = element
                    console.log(offsetX, offsetY, width, height, stroke)
                    roughCanvas.line(offsetX, offsetY, width ?? offsetX, height ?? offsetY, { stroke, strokeWidth: 5, roughness: 0.5 })
                } else if (element.type === 'rect') {
                    const { offsetX, offsetY, width, height, stroke } = element;
                    roughCanvas.rectangle(offsetX, offsetY, width ?? 0, height ?? 0, { stroke, strokeWidth: 5, roughness: 0.5 });
                }
            });
        }
    }, [elements]);

    const getMouseCoordsOnCanvas = (event: MouseEvent, canvas: HTMLCanvasElement, scale: number) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left - window.innerWidth / 2) / scale + window.innerWidth / 2;
        const y = (event.clientY - rect.top - window.innerHeight / 2) / scale + window.innerHeight / 2;
        return { x, y };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const coords = getMouseCoordsOnCanvas(e.nativeEvent, canvas, scale);
            const offsetX = coords.x;
            const offsetY = coords.y;
            if (tool === 'pencil') {
                setElements((prevElements) => [
                    ...prevElements,
                    {
                        type: 'pencil',
                        offsetX,
                        offsetY,
                        path: [[offsetX, offsetY]],
                        stroke: color,
                    },
                ]);
            } else if (tool === 'line') {
                setElements((prevElements) => [
                    ...prevElements,
                    {
                        type: 'line',
                        offsetX,
                        offsetY,
                        width: offsetX,
                        height: offsetY,
                        stroke: color,
                    },
                ]);
            } else if (tool === 'rect') {
                setElements((prevElements) => [
                    ...prevElements,
                    {
                        type: 'rect',
                        offsetX,
                        offsetY,
                        width: 0,
                        height: 0,
                        stroke: color,
                    },
                ]);
            }
            setIsDrawing(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const canvas = canvasRef.current;
        if (canvas && isDrawing) {
            const coords = getMouseCoordsOnCanvas(e.nativeEvent, canvas, scale);
            const offsetX = coords.x;
            const offsetY = coords.y;

            if (elements.length > 0) {
                if (tool === "pencil") {
                    const lastElement = elements[elements.length - 1];
                    if (lastElement.type === "pencil" && lastElement.path) {
                        const newPath = [...lastElement.path, [offsetX, offsetY]];
                        setElements((prevElements) =>
                            prevElements.map((element, index) =>
                                index === prevElements.length - 1 ? { ...element, path: newPath } : element
                            )
                        );
                    }
                } else if (tool === "line") {
                    setElements((prevElements) => {
                        return prevElements.map((element, index) => {
                            if (index === prevElements.length - 1) {
                                return {
                                    ...element,
                                    width: offsetX,
                                    height: offsetY
                                };
                            } else {
                                return element;
                            }
                        });
                    });
                } else if (tool === "rect") {
                    setElements((prevElements) => {
                        return prevElements.map((element, index) => {
                            if (index === prevElements.length - 1) {
                                return {
                                    ...element,
                                    width: offsetX - element.offsetX,
                                    height: offsetY - element.offsetY
                                };
                            } else {
                                return element;
                            }
                        });
                    });
                }
            }
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-dark w-full h-full"
        >
            <canvas ref={canvasRef} ></canvas>
        </div>
    );
};

export default WhiteBoard;
