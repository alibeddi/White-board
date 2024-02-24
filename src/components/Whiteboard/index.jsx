import { useEffect, useLayoutEffect, useState } from 'react'

import rough from 'roughjs'

const roughGenerator = rough.generator()

const WhiteBoard = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    color, scale, zoomLevel
}) => {
    console.log(canvasRef)
    const [isDrawing, setIsDrawing] = useState(false)
    const redrawCanvas = () => {

        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const roughCanvas = rough.canvas(canvasRef.current)

        elements.forEach((element) => {
            if (element.type === 'pencil') {
                roughCanvas.linearPath(element.path, { stroke: element.stroke, strokeWidth: 5, roughness: 0.5 })
            } else if (element.type === 'line') {
                const { offsetX, offsetY, width, height, stroke } = element
                roughCanvas.line(offsetX, offsetY, width, height, { stroke, strokeWidth: 5, roughness: 0.5 })
            } else if (element.type === 'rect') {
                const { offsetX, offsetY, width, height, stroke } = element
                roughCanvas.rectangle(offsetX, offsetY, width, height, { stroke, strokeWidth: 5, roughness: 0.5 })
            }
        })
    };

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = window.innerWidth * 2
        canvas.height = window.innerHeight * 2
        console.log(canvasRef)
        const ctx = canvas.getContext('2d')
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
        ctx.scale(scale, scale);
        ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctxRef.current = ctx
        redrawCanvas();
    }, [scale, color])
    useEffect(() => {
        ctxRef.current.strokeStyle = color
    }, [color])
    useLayoutEffect(() => {
        const roughCanvas = rough.canvas(canvasRef.current)

        if (elements.length > 0) {
            // Calculate the top-left corner of the transformed canvas
            const topLeftX = canvasRef.current.width * (100 - zoomLevel) / 100
            const topLeftY = canvasRef.current.height * (100 - zoomLevel) / 100
            ctxRef.current.clearRect(-topLeftX, -topLeftY, canvasRef.current.width + canvasRef.current.width * (100 - zoomLevel) / 100, canvasRef.current.height + canvasRef.current.height * (100 - zoomLevel) / 100)
        }

        elements.forEach((element) => {
            if (element.type === 'pencil') {
                roughCanvas.linearPath(element.path, { stroke: element.stroke, strokeWidth: 5, roughness: 0.5 })
            } else if (element.type === 'line') {
                const { offsetX, offsetY, width, height, stroke } = element
                roughCanvas.line(offsetX, offsetY, width, height, { stroke, strokeWidth: 5, roughness: 0.5 })
            } else if (element.type === 'rect') {
                const { offsetX, offsetY, width, height, stroke } = element
                roughCanvas.rectangle(offsetX, offsetY, width, height, { stroke, strokeWidth: 5, roughness: 0.5 })
            }

        })
    }, [elements])
    const getMouseCoordsOnCanvas = (event, canvas, scale) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left - window.innerWidth / 2) / scale + window.innerWidth / 2;
        const y = (event.clientY - rect.top - window.innerHeight / 2) / scale + window.innerHeight / 2;
        return { x, y };
    };
    const handleMouseDown = (e) => {

        const canvas = canvasRef.current;
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
                }
            ])
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
                }
            ])
        }
        else if (tool === 'rect') {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: 'rect',
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                }
            ])
        }
        setIsDrawing(true)
    }
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const coords = getMouseCoordsOnCanvas(e.nativeEvent, canvas, scale);
        const offsetX = coords.x;
        const offsetY = coords.y;
        if (isDrawing) {

            if (elements.length > 0) { // Ensure elements is not empty
                if (tool === "pencil") {
                    const { path } = elements[elements.length - 1]; // Accessing the last element's path
                    const newPath = [...path, [offsetX, offsetY]];
                    setElements((prevElements) => {
                        return prevElements.map((element, index) => { // Return the result of the map
                            if (index === prevElements.length - 1) {
                                return {
                                    ...element,
                                    path: newPath
                                };
                            } else {
                                return element;
                            }
                        });
                    })
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

    const handleMouseUp = (e) => {
        const canvas = canvasRef.current;
        const coords = getMouseCoordsOnCanvas(e.nativeEvent, canvas, scale);
        const offsetX = coords.x;
        const offsetY = coords.y;
        setIsDrawing(false)
    }
    return (
        <div onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className='border border-dark border-3 overflow-hidden'>
            <canvas
                ref={canvasRef} >

            </canvas>
        </div>
    )
}

export default WhiteBoard
