import WhiteBoard from "../../components/Whiteboard";
import { useRef } from "react";
import { useState } from "react";

const RoomPage = () => {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)


    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState('black')
    const [elements, setElements] = useState([])
    const [history, setHistory] = useState([])


    const handleUndo = () => {
        if (elements.length > 0) {
            setHistory((prev) => [...prev, elements[elements.length - 1]])
            setElements((prev) => prev.slice(0, prev.length - 1))
        }
    }
    const handleRedo = () => {
        if (history.length > 0) {
            setElements((prev) => [...prev, history[history.length - 1]])
            setHistory((prev) => prev.slice(0, prev.length - 1))
        }
    }
    const handleClearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.fillRect = 'white'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setElements([])
    }
    return (
        <div className="row">
            <h1 className="text-center py-5">White Board Sharing App
                <span className="text-primary"> [Users Online:0]</span>
            </h1>
            <div className="col-md-10 mx-auto px-5 mb-3 d-flex align-items-center jusitfy-content-center">
                <div className="d-flex col-md-2 justify-content-center gap-2">
                    <div className="d-flex gap-1 align-items-center ">
                        <label htmlFor="pencil">Pencil</label>
                        <input
                            type="radio"
                            name="tool"
                            id="pencil"
                            checked={tool === "pencil"}
                            value="pencil"
                            onChange={(e) => setTool(e.target.value)} />
                    </div>
                    <div className="d-flex gap-1 align-items-center ">
                        <label htmlFor="line">Line</label>
                        <input
                            type="radio"
                            name="tool"
                            id="line"
                            checked={tool === "line"}
                            value="line"
                            onChange={(e) => setTool(e.target.value)} />
                    </div>
                    <div className="d-flex gap-1 align-items-center ">
                        <label htmlFor="rect">Rectangle</label>
                        <input
                            type="radio"
                            name="tool"
                            id="rect"
                            checked={tool === "rect"}
                            value="rect"
                            onChange={(e) => setTool(e.target.value)} />
                    </div>
                    {/* <div className="d-flex align-items-center gap-1">
    <label htmlFor="shape-select">Choose a shape:</label>
    <select
        id="shape-select"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        className="form-select"
    >
        <option value="rect">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="line">Line</option>
        <option value="pencil">Pencil</option>
    </select>
</div> */}

                </div>
                <div className="col-md-3 mx-auto">
                    <div className="d-flex align-items-center">
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
                <dir className='col-md-3 d-flex gap-2'>
                    <button className="btn btn-primary mt-1"
                        disabled={elements.length === 0}
                        onClick={() => handleUndo()}
                    >Undo</button>
                    <button className="btn btn-outline-primary mt-1"
                        disabled={history.length < 1}
                        onClick={() => handleRedo()}
                    >Redo</button>
                </dir>
                <div className="col-md-2">
                    <button className="btn btn-danger" onClick={handleClearCanvas}> Clear Canvas</button>
                </div>
            </div >
            <div className="col-md-10 mx-auto mt-4 canvas-box">
                <WhiteBoard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}

                    tool={tool} />
            </div>
        </div>
    );
};
export default RoomPage;