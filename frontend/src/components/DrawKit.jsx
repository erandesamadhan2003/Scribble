import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Palette, Eraser, Undo2, Redo2, Trash2 } from "lucide-react";

export const Drawkit = ({ width }) => {
    const [lines, setLines] = useState([]);
    const [tool, setTool] = useState("pen");
    const [color, setColor] = useState("#3b82f6");
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const isDrawing = useRef(false);
    const stageRef = useRef(null);

    const containerRef = useRef(null);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleResize = () => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            });
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#000000", "#6b7280"];

    const strokeWidths = [1, 3, 5, 8, 12, 14, 18, 24, 28];

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine = {
            tool,
            stroke: tool === "eraser" ? "#000" : color,
            strokeWidth: tool === "eraser" ? strokeWidth * 2 : strokeWidth,
            points: [pos.x, pos.y],
        };
        setLines([...lines, newLine]);
        setRedoStack([]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = [...lastLine.points, point.x, point.y];
        const updatedLines = [...lines.slice(0, -1), lastLine];
        setLines(updatedLines);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        if (lines.length > 0 && lines[lines.length - 1].points.length > 2) {
            setHistory([...history, JSON.parse(JSON.stringify(lines))]);
        }
    };

    const handleUndo = () => {
        if (lines.length === 0) return;

        setRedoStack([...redoStack, JSON.parse(JSON.stringify(lines))]);

        if (history.length === 0) {
            setLines([]);
            return;
        }

        const previousState = history[history.length - 1];
        setLines(previousState);
        setHistory(history.slice(0, -1));
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;

        const redoState = redoStack[redoStack.length - 1];

        setHistory([...history, JSON.parse(JSON.stringify(lines))]);

        setLines(redoState);
        setRedoStack(redoStack.slice(0, -1));
    };

    const handleClear = () => {
        if (lines.length === 0) return;
        setHistory([...history, JSON.parse(JSON.stringify(lines))]);
        setLines([]);
        setRedoStack([]);
    };

    useEffect(() => {
        const handleTouchStart = (e) => {
            if (!stageRef.current) return;
            e.preventDefault();
            const touch = e.touches[0];
            const stage = stageRef.current;
            const pos = stage.getPointerPosition();
            if (!pos) return;

            isDrawing.current = true;
            const newLine = {
                tool,
                stroke: tool === "eraser" ? "#ffffff" : color,
                strokeWidth: tool === "eraser" ? strokeWidth * 2 : strokeWidth,
                points: [pos.x, pos.y],
            };
            setLines([...lines, newLine]);
            setRedoStack([]);
        };

        const handleTouchMove = (e) => {
            if (!isDrawing.current || !stageRef.current) return;
            e.preventDefault();
            const stage = stageRef.current;
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const lastLine = lines[lines.length - 1];
            lastLine.points = [...lastLine.points, pos.x, pos.y];
            const updatedLines = [...lines.slice(0, -1), lastLine];
            setLines(updatedLines);
        };

        const handleTouchEnd = () => {
            isDrawing.current = false;
            if (lines.length > 0 && lines[lines.length - 1].points.length > 2) {
                setHistory([...history, JSON.parse(JSON.stringify(lines))]);
            }
        };

        const stageElement = stageRef.current;
        if (stageElement) {
            const konvaContainer = stageElement.getContent().parentElement;
            konvaContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
            konvaContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            konvaContainer.addEventListener('touchend', handleTouchEnd);

            return () => {
                konvaContainer.removeEventListener('touchstart', handleTouchStart);
                konvaContainer.removeEventListener('touchmove', handleTouchMove);
                konvaContainer.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [tool, color, strokeWidth, lines, history]);

    return (
        <div className="flex flex-col items-center p-4 rounded-lg shadow-md bg-gray-50" style={{ width: `${width}%` }}>
            <div className="flex flex-col w-full gap-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            className={`p-2 rounded ${tool === "pen" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                            onClick={() => setTool("pen")}
                            title="Pen Tool"
                        >
                            <Palette size={20} />
                        </button>
                        <button
                            className={`p-2 rounded ${tool === "eraser" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                            onClick={() => setTool("eraser")}
                            title="Eraser Tool"
                        >
                            <Eraser size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 text-gray-700 bg-white border border-gray-300 rounded disabled:opacity-50"
                            onClick={handleUndo}
                            disabled={lines.length === 0 && history.length === 0}
                            title="Undo"
                        >
                            <Undo2 size={20} />
                        </button>
                        <button
                            className="p-2 text-gray-700 bg-white border border-gray-300 rounded disabled:opacity-50"
                            onClick={handleRedo}
                            disabled={redoStack.length === 0}
                            title="Redo"
                        >
                            <Redo2 size={20} />
                        </button>
                        <button
                            className="p-2 text-gray-700 bg-white border border-gray-300 rounded disabled:opacity-50"
                            onClick={handleClear}
                            disabled={lines.length === 0}
                            title="Clear Canvas"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((c, i) => (
                                <button
                                    key={i}
                                    className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                    title={`Select ${c} color`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Stroke Width</label>
                        <div className="flex gap-2">
                            {strokeWidths.map((width, i) => (
                                <button
                                    key={i}
                                    className={`w-8 h-8 rounded flex items-center justify-center border ${strokeWidth === width ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}
                                    onClick={() => setStrokeWidth(width)}
                                    title={`${width}px stroke width`}
                                >
                                    <div
                                        className="bg-black rounded-full"
                                        style={{ width: width + 4, height: width + 4 }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div
                ref={containerRef}
                className="w-full h-[70%] bg-white rounded-lg shadow-inner border border-gray-200"
            >
                <Stage
                    width={dimensions.width}
                    height={dimensions.height}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    onMouseleave={handleMouseUp}
                    ref={stageRef}
                    className="bg-white"
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={line.stroke}
                                strokeWidth={line.strokeWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={
                                    line.tool === "eraser" ? "destination-out" : "source-over"
                                }
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>

            <div className="w-full mt-2 text-sm text-center text-gray-500">
                {tool === "pen" ? "Drawing with pen" : "Erasing"} | Stroke width: {strokeWidth}px
            </div>

            <div>
                Word
            </div>
        </div>
    );
};