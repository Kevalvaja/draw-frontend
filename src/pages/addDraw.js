import api, { API_URL } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

export default function SyncDrawWithDot() {
    const router = useRouter();
    const { drawId } = router?.query
    const leftSVGRef = useRef(null);
    const canvasRef = useRef(null);
    const [shape, setShape] = useState(null);
    const [rectangles, setRectangles] = useState([]);
    const [dotPositions, setDotPositions] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [resizingIndex, setResizingIndex] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    const handleCanvasClick = (e) => {
        // Canvas click handler (can be used for other shapes if needed)
    };

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const resizeIndex = rectangles?.findIndex(
            (r) =>
                mouseX >= r.x + r.width - 10 &&
                mouseX <= r.x + r.width + 10 &&
                mouseY >= r.y + r.height - 10 &&
                mouseY <= r.y + r.height + 10
        );

        if (resizeIndex !== -1) {
            setIsResizing(true);
            setResizingIndex(resizeIndex);
            setOffset({
                x: mouseX - rectangles[resizeIndex].x,
                y: mouseY - rectangles[resizeIndex].y,
            });
        } else {
            const index = rectangles?.findIndex(
                (r) =>
                    mouseX >= r.x &&
                    mouseX <= r.x + r.width &&
                    mouseY >= r.y &&
                    mouseY <= r.y + r.height
            );

            if (index !== -1) {
                setIsDragging(true);
                setDraggingIndex(index);
                setOffset({
                    x: mouseX - rectangles[index].x,
                    y: mouseY - rectangles[index].y,
                });
            }
        }
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (isResizing && resizingIndex !== null) {
            const newRectangles = rectangles?.map((r, index) =>
                index === resizingIndex
                    ? { ...r, width: mouseX - r.x, height: mouseY - r.y }
                    : r
            );
            setRectangles(newRectangles);
        } else if (isDragging && draggingIndex !== null) {
            const newRectangles = rectangles?.map((r, index) =>
                index === draggingIndex
                    ? { ...r, x: mouseX - offset.x, y: mouseY - offset.y }
                    : r
            );
            setRectangles(newRectangles);
        }

        setDotPositions(
            rectangles?.map((r) => ({
                x: r.x + r.width / 2,
                y: r.y + r.height / 2,
            }))
        );
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        setDraggingIndex(null);
        setResizingIndex(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousedown", handleMouseDown);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousedown", handleMouseDown);
        };
    }, [rectangles, isDragging, isResizing, offset]);

    const draw = () => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (image) {
            context.drawImage(
                image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
        }

        rectangles?.forEach((rectangle) => {
            // Draw only the border for rectangles
            context.strokeStyle = "red";
            context.lineWidth = 2;
            context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        });

        // Draw the red dots that are NOT inside any rectangles
        dotPositions?.forEach((pos) => {
            const isInsideRectangle = rectangles?.some(
                (rect) =>
                    pos.x >= rect.x &&
                    pos.x <= rect.x + rect.width &&
                    pos.y >= rect.y &&
                    pos.y <= rect.y + rect.height
            );

            if (!isInsideRectangle) {
                context.fillStyle = "red";
                context.beginPath();
                context.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                context.fill();
            }
        });
    };

    useEffect(() => {
        draw();
    }, [rectangles, dotPositions, image]);

    const handleImageUpload = (e) => {
        let file1 = e.target.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(file1);
        setFile(file1)
        img.onload = () => {
            setImage(img);
        };
    };

    const addRectangle = () => {
        const newRectangle = { x: 175, y: 175, width: 50, height: 50 }; // Centered rectangle
        setRectangles((prev) => [...prev, newRectangle]);
    };

    const deleteRectangle = (index) => {
        const newRectangles = rectangles?.filter((_, i) => i !== index);
        setRectangles(newRectangles);
    };

    useEffect(() => {
        console.log(`${API_URL}/images/${file}`)
        console.log("shape =>> ", shape)
        console.log("rectangles =>> ", rectangles)
        console.log("dotPositions =>> ", dotPositions)
        console.log("isDragging =>> ", isDragging)
        console.log("isResizing =>> ", isResizing)
        console.log("draggingIndex =>> ", draggingIndex)
        console.log("resizingIndex =>> ", resizingIndex)
        console.log("offset =>> ", offset)
        console.log("image =>> ", image)
        console.log('file => ', file)
    }, [
        shape,
        rectangles,
        dotPositions,
        isDragging,
        isResizing,
        draggingIndex,
        resizingIndex,
        offset,
        image,
        file
    ])

    const btnClick = async (e) => {
        try {
            e.preventDefault()
            const formData = new FormData;
            formData.append("shape", shape),
                formData.append("rectangles", JSON.stringify(rectangles)),
                formData.append("dotPositions", JSON.stringify(dotPositions)),
                formData.append("isDragging", isDragging),
                formData.append("isResizing", isResizing),
                formData.append("draggingIndex", draggingIndex),
                formData.append("resizingIndex", resizingIndex),
                formData.append("offset", JSON.stringify(offset)),
                formData.append("image", image),
                formData.append("img", file)
            let res;
            if (drawId) {
                res = await api.put(`/api/svg-store/${drawId}`, formData)
            } else {
                res = await api.post('/api/svg-store', formData)
            }
            if (res?.status === 200) {
                alert(res?.data?.message)
                router.push("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (drawId) {
            const getData = async () => {
                try {
                    const res = await api.get(`/api/svg-store/${drawId}`)
                    if (res?.status === 200) {
                        const fetchData = res?.data?.data
                        setShape(fetchData?.shape)
                        setDotPositions(fetchData?.dotPosition);
                        setOffset(fetchData?.offset);
                        setRectangles(fetchData?.rectangle)
                        setFile(fetchData?.img)
                        const img = new Image();
                        img.src = `${API_URL}/images/${fetchData?.img}`; // Handle URL or File object
                        img.onload = () => {
                            setImage(img);
                        };
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            getData()
        }
    }, [drawId])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sync Draw and Dot</h1>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="flex">
                <div className="mr-4">
                    <svg
                        ref={leftSVGRef}
                        className="border"
                        width={200}
                        height={400}
                        viewBox="0 0 400 800"
                    >
                        <rect x="50" y="50" width="100" height="700" fill="lightgray" />
                        {dotPositions?.map((pos, index) => (
                            <circle
                                key={index}
                                cx={pos.x / 2} // Ensure this scaling is appropriate for your use case
                                cy={pos.y / 2}
                                r={5}
                                fill="red"
                            />
                        ))}
                    </svg>
                </div>
                <div style={{ position: "relative" }}>
                    <canvas
                        ref={canvasRef}
                        className="border"
                        width={400}
                        height={400}
                        onClick={handleCanvasClick}
                    />
                    {rectangles?.map((rect, index) => (
                        <button
                            key={index}
                            style={{
                                position: "absolute",
                                left: `${rect.x + rect.width - 10}px`,
                                top: `${rect.y - 10}px`,
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                            }}
                            onClick={() => deleteRectangle(index)}
                        >
                            X
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => { setShape("rectangle"); addRectangle(); }}
                    className={`p-2 m-2 rounded ${shape === "rectangle" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                >
                    Draw Rectangle
                </button>
                <button
                    onClick={() => setShape("circle")}
                    className={`p-2 m-2 rounded ${shape === "circle" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                >
                    Draw Circle
                </button>
                <button
                    onClick={(e) => btnClick(e)}
                    className={`p-2 m-2 rounded ${shape === "circle" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}




