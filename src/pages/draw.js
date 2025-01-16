import React, { useEffect, useRef, useState } from 'react'
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
const Draw = () => {
    const canvasRef = useRef();
    const [shapName, setShapName] = useState(null);
    const [img, setImg] = useState(null);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [shapes, setShapes] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas.getContext) {
            const context = canvas.getContext('2d');

            const drawAllShapes = () => {
                // Clear canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (img) {
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

                // Draw all shapes from the state
                shapes.forEach(({ shapName, startX, startY, endX, endY }) => {
                    context.strokeStyle = "#FF0000";
                    context.lineWidth = 2;

                    switch (shapName) {
                        case "rectangle":
                            drawRactangleFunction(context, startX, startY, endX, endY);
                            break;
                    }
                });
            };

            const drawRactangleFunction = (ctx, startX, startY, endX, endY) => {
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
                const corner = [
                    { x: startX, y: startY },
                    { x: endX, y: startY },
                    { x: startX, y: endY },
                    { x: endX, y: endY },
                ]

                corner.forEach(({ x, y }) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = "red";
                    ctx.fill();
                })
            }

            const handleMouseDown = (e) => {
                const react = canvas.getBoundingClientRect();
                const startX = e.clientX - react.left;
                const startY = e.clientY - react.top;
                setStartPosition({ x: startX, y: startY })
                setIsDrawing(true);
            }

            const handleMouseMove = (e) => {
                if (!isDrawing && !shapName) return;
                const react = canvas.getBoundingClientRect();
                const endX = e.clientX - react.left;
                const endY = e.clientY - react.top;
                drawAllShapes()
                context.strokeStyle = "#FF0000";
                context.lineWidth = 2;

                switch (shapName) {
                    case "rectangle":
                        drawRactangleFunction(context, startPosition.x, startPosition.y, endX, endY)
                        break;
                }
            }

            const handleMouseUp = (e) => {
                if (!isDrawing) return;
                const react = canvas.getBoundingClientRect();
                const endX = e.clientX - react.left;
                const endY = e.clientY - react.top;
                setShapes((prevShapes) => [
                    ...prevShapes,
                    { shapName, startX: startPosition.x, startY: startPosition.y, endX, endY },
                ])
                setIsDrawing(false);
            }

            canvas.addEventListener('mousemove', handleMouseMove)
            canvas.addEventListener('mousedown', handleMouseDown)
            canvas.addEventListener('mouseup', handleMouseUp)
            return () => {
                canvas.removeEventListener('mousemove', handleMouseMove)
                canvas.removeEventListener('mousedown', handleMouseDown)
                canvas.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [img, startPosition, isDrawing, shapes, shapName])

    const handleImage = (e) => {
        const image = new Image();
        image.src = URL.createObjectURL(e.target.files[0]);
        image.onload = () => {
            setImg(image)
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
        }
    }

    // return (
    //     <div className=''>
    //         <div className='flex'>
    //             <div className='gap-3 p-2 bg-blue-400 rounded'>
    //                 <div className='text-white pt-2'>Draw</div>
    //                 <FaRegCircle className={`${shapName == "circle" && 'bg-blue-500 p-1 rounded'} text-white size-10`} onClick={() => setShapName("circle")} />
    //                 <MdOutlineCheckBoxOutlineBlank className={`${shapName == "rectangle" && 'bg-blue-500 p-1 rounded'} text-white size-10`} onClick={() => setShapName("rectangle")} />
    //             </div>
    //             <div className='p-2 rounded ml-2 border border-orange-500'>
    //                 <div className='p-2'>
    //                     <input type="file" accept='image/*' onChange={handleImage} />
    //                     <canvas width={"500%"} height={"500%"} ref={canvasRef}></canvas>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
    return (
        <div className="flex justify-center items-start p-5 bg-gray-100 min-h-screen">
            {/* Shape Selection Panel */}
            <div className="flex flex-col gap-3 p-4 bg-blue-500 rounded-lg shadow-md">
                <div className="text-white font-semibold text-lg mb-2">Draw</div>
                <button
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition 
                ${shapName === "circle" ? "bg-blue-700" : "bg-blue-400 hover:bg-blue-600"} text-white`}
                    onClick={() => setShapName("circle")}
                >
                    <FaRegCircle className="text-white" />
                    <span>Circle</span>
                </button>
                <button
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition 
                ${shapName === "rectangle" ? "bg-blue-700" : "bg-blue-400 hover:bg-blue-600"} text-white`}
                    onClick={() => setShapName("rectangle")}
                >
                    <MdOutlineCheckBoxOutlineBlank className="text-white" />
                    <span>Rectangle</span>
                </button>
            </div>

            {/* Canvas and File Input Section */}
            <div className="ml-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                </div>
                <div className="border border-gray-300 rounded-md p-2">
                    <canvas width={500} height={500} ref={canvasRef} className="border border-gray-400" />
                </div>
            </div>
        </div>
    );
}

export default Draw
