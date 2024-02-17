import { useEffect,useLayoutEffect,useState } from 'react'
import rough from 'roughjs'

const roughGenerator = rough.generator()

const WhiteBoard = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    color
}) => {

const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2

    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctxRef.current = ctx
}, [])
useEffect(() => {
    ctxRef.current.strokeStyle = color
}, [color])
useLayoutEffect(() => {
    const roughCanvas=rough.canvas(canvasRef.current)
if (elements.length > 0) {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
}

    elements.forEach((element) => {
        if (element.type === 'pencil') {
            roughCanvas.linearPath(element.path,{stroke:element.stroke,strokeWidth:5,roughness:0.5})
        }else if (element.type === 'line') {
            const {offsetX, offsetY, width, height, stroke} = element
            roughCanvas.line(offsetX, offsetY, width, height, {stroke,strokeWidth:5,roughness:0.5})
        }else if (element.type === 'rect') {
            const {offsetX, offsetY, width, height, stroke} = element
            roughCanvas.rectangle(offsetX, offsetY, width, height, {stroke,strokeWidth:5,roughness:0.5})
        }

    })
}, [elements])

const handleMouseDown = (e) => {
    const {offsetX, offsetY} = e.nativeEvent

    if (tool === 'pencil') {

    setElements((prevElements) => [
        ...prevElements,
        {
            type:'pencil',
            offsetX,
            offsetY,
            path:[[offsetX,offsetY]],
            stroke:color,
        }
    ])}else if (tool === 'line') {
        setElements((prevElements) => [
            ...prevElements,
            {
                type:'line',
                offsetX,
                offsetY,
                width:offsetX,
                height:offsetY,
                 stroke:color,
            }
        ])}
        else if (tool === 'rect') {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type:'rect',
                    offsetX,
                    offsetY,
                    width:0,
                    height:0,
                     stroke:color,
                }
            ])}
setIsDrawing(true)
}
const handleMouseMove = (e) => {
    const {offsetX, offsetY} = e.nativeEvent;
    if (isDrawing) {
        console.log(elements);
        if (elements.length > 0) { // Ensure elements is not empty
            if (tool === "pencil") {
              const {path} = elements[elements.length - 1]; // Accessing the last element's path
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
            })} else if (tool === "line") {
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
            }else if (tool === "rect") {
                setElements((prevElements) => {
                    return prevElements.map((element, index) => {
                        if (index === prevElements.length - 1) {
                            return {
                                ...element,
                                width: offsetX - element.offsetX,
                                height: offsetY- element.offsetY
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
    const {offsetX, offsetY} = e.nativeEvent
setIsDrawing(false)
}
    return (
     <div    onMouseDown={handleMouseDown}
     onMouseMove={handleMouseMove}
     onMouseUp={handleMouseUp}
     className='border border-dark border-3 h-100 w-100 overflow-hidden'>
        <canvas 
        ref={canvasRef} 
    >
        
        </canvas>
        </div>
    )
}

export default WhiteBoard
