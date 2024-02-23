'use client'

import React, { useRef, useState } from "react";

import Element from "./types/Element";
import WhiteBoard from "./components/WhiteBoard";

const RoomPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);


    const [tool, setTool] = useState<string>("pencil");
    const [color, setColor] = useState<string>('black');
    const [elements, setElements] = useState<Element[]>([]);
    const [history, setHistory] = useState<Element[]>([]);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [scale, setScale] = useState<number>(1);

    const handleUndo = () => {
        if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];
            setHistory((prev) => [...prev, lastElement]);
            setElements((prev) => prev.slice(0, -1));
        }
    };

    const handleRedo = () => {
        if (history.length > 0) {
            const lastHistoryElement = history[history.length - 1];
            setElements((prev) => [...prev, lastHistoryElement]);
            setHistory((prev) => prev.slice(0, -1));
        }
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
                ctx.scale(scale, scale);
                ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);
                setElements([]);
            }
        }
    };

    const handleZoomIn = () => {
        setZoomLevel(zoomLevel + 10);
        setScale(prevScale => prevScale * 1.1);
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel - 10);
        setScale(prevScale => prevScale / 1.1);
    };

    return (
        <div className="row w-full h-full flex items-center jusitfy-center">
            <div className="fixed top-0 left-0 translate-middle-x bg-white w-full  mx-auto px-5 mb-3 flex items-center jusitfy-center">
                <div className="flex col-md-2 justify-center gap-2">
                    <div className="flex gap-1 items-center ">
                        <label htmlFor="pencil">Pencil</label>
                        <input
                            type="radio"
                            name="tool"
                            id="pencil"
                            checked={tool === "pencil"}
                            value="pencil"
                            onChange={(e) => setTool(e.target.value)} />
                    </div>
                    <div className="flex gap-1 items-center ">
                        <label htmlFor="line">Line</label>
                        <input
                            type="radio"
                            name="tool"
                            id="line"
                            checked={tool === "line"}
                            value="line"
                            onChange={(e) => setTool(e.target.value)} />
                    </div>
                    <div className="flex gap-1 items-center ">
                        <label htmlFor="rect">Rectangle</label>
                        <input
                            type="radio"
                            name="tool"
                            id="rect"
                            checked={tool === "rect"}
                            value="rect"
                            onChange={(e) => setTool(e.target.value)} />
                    </div>


                </div>
                <div className="col-md-3 mx-auto">
                    <div className="flex items-center">
                        <label htmlFor="color">Select Color: </label>
                        <input
                            type="color"
                            id="color"
                            className="ms-3"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                </div>
                <div className='col-md-3 flex gap-2'>
                    <button className="btn btn-primary mt-1"
                        disabled={elements.length === 0}
                        onClick={() => handleUndo()}
                    >Undo</button>
                    <button className="btn btn-outline-primary mt-1"
                        disabled={history.length < 1}
                        onClick={() => handleRedo()}
                    >Redo</button>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-danger" onClick={handleClearCanvas}> Clear Canvas</button>
                </div>
            </div>
            <div className="fixed  bottom-0 start-0 m-3 p-3 bg-white rounded-3 shadow " style={{ width: '90px' }}>
                <button onClick={handleZoomIn} className="btn btn-light d-block rounded-circle mb-2" style={{ width: "50px", height: "50px" }}> <span className="fs-4">+</span></button>
                <div className="text-center mb-2">
                    <span id="zoomLevel">{zoomLevel}%</span>
                </div>
                <button onClick={handleZoomOut} className="btn btn-light d-block rounded-circle" style={{ width: "50px", height: "50px" }}><span className="fs-4">-</span></button>
            </div>
            <div className="w-full h-full">
                <WhiteBoard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}
                    scale={scale}
                    tool={tool}
                    zoomLevel={zoomLevel}
                />
            </div>
        </div>
    );
};

export default RoomPage;
