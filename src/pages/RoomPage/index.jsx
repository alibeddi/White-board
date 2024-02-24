import { useEffect, useRef, useState } from "react";

import Line from '../../../public/icons/line.svg'
import Pencil from '../../../public/icons/pencile.svg'
import Rect from '../../../public/icons/rectangle.svg'
import Redo from '../../../public/icons/redo.svg'
import Trash from '../../../public/icons/trash.svg'
import Undo from '../../../public/icons/undo.svg'
import WhiteBoard from "../../components/Whiteboard";

const RoomPage = () => {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState('black')
    const [elements, setElements] = useState([])
    const [history, setHistory] = useState([])
    const [zoomLevel, setZoomLevel] = useState(100);
    const [scale, setScale] = useState(1);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            setIsHovering(clientX < window.innerWidth / 10 && clientY < window.innerHeight / 2);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleUndo = () => {
        if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];
            setHistory((prev) => [...prev, lastElement]);
            setElements((prev) => prev.slice(0, -1));

            redrawCanvas(elements.slice(0, -1), scale);
        }
    }
    const handleRedo = () => {
        if (history.length > 0) {
            const lastHistoryElement = history[history.length - 1];
            setElements((prev) => [...prev, lastHistoryElement]);
            setHistory((prev) => prev.slice(0, -1));
            redrawCanvas([...elements, lastHistoryElement], scale);
        }
    }
    const handleClearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.fillRect = 'white'
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
        ctx.scale(scale, scale);
        ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);
        setElements([])
    }
    const handleZoomIn = () => {
        setZoomLevel(zoomLevel + 10);
        setScale(prevScale => prevScale * 1.1);
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel - 10);
        setScale(prevScale => prevScale / 1.1);
    };

    return (
        <div className="d-flex align-items-center justify-content-center">
            {isHovering && (
                <div className="position-fixed gap-3 start-0 flex-column bg-white rounded-3 shadow mx-3 p-2 mb-3 d-flex align-items-center justify-content-center" style={{
                    width: '90px',
                    top: "100px"
                }}>
                    <div className="d-flex flex-column justify-content-center gap-2">
                        <div className="d-flex gap-1 align-items-center ">
                            <button
                                className={`btn ${tool === 'pencil' ? 'active' : ''}`}
                                onClick={() => setTool('pencil')}
                            >
                                <img src={Pencil} style={{ width: '10px' }} alt="Pencil" />
                            </button>
                        </div>
                        <div className="d-flex gap-1 align-items-center ">
                            <button
                                className={`btn  ${tool === 'line' ? 'active' : ''}`}
                                onClick={() => setTool('line')}
                            >
                                <img src={Line} style={{ width: '10px' }} alt="Line" />
                            </button>
                        </div>
                        <div className="d-flex gap-1 align-items-center ">
                            <button
                                className={`btn  ${tool === 'rect' ? 'active' : ''}`}
                                onClick={() => setTool('rect')}
                            >
                                <img src={Rect} style={{ width: '10px' }} alt="Rectangle" />
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-start">
                        <input
                            type="color"
                            id="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                    <div className='flex-column d-flex '>
                        <button className="btn btn-outline-primary mt-1"
                            disabled={elements.length === 0}
                            onClick={() => handleUndo()}
                        > <img src={Undo} style={{ width: '20px' }} alt="Undo" /></button>
                        <button className="btn btn-outline-primary mt-1"
                            disabled={history.length < 1}
                            onClick={() => handleRedo()}
                        > <img src={Redo} style={{ width: '20px' }} alt="Redo" /></button>
                    </div>
                    <div className="">
                        <button className="btn btn-danger" onClick={handleClearCanvas}><img src={Trash} style={{ width: '20px' }} alt="Clear" /></button>
                    </div>
                </div>
            )}
            <div
                className="position-fixed bottom-0 start-0 m-3 p-3 bg-white rounded-3 shadow"
                style={{ width: '90px' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <button onClick={handleZoomIn} className="btn btn-light d-block rounded-circle mb-2" style={{ width: "50px", height: "50px" }}>
                    <span className="fs-4">+</span>
                </button>
                <div className="text-center mb-2">
                    <span id="zoomLevel">{zoomLevel}%</span>
                </div>
                <button onClick={handleZoomOut} className="btn btn-light d-block rounded-circle" style={{ width: "50px", height: "50px" }}>
                    <span className="fs-4">-</span>
                </button>
            </div>
            <div className="canvas-box">
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
