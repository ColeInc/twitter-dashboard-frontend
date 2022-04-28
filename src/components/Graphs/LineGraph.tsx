import React, { useCallback, useState } from "react";
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from "victory";
// import classes from "./LineGraph.module.css";

export const LineGraph: React.FC<{
    graphData: { x: number; y: number }[];
    color?: string;
    lineWidth?: number;
    dotSize?: number;
}> = props => {
    const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });

    const graphRef = useCallback(node => {
        if (node !== null) {
            setBoundingRect(node.getBoundingClientRect());
        }
    }, []);

    return (
        <div style={{ width: "100%", height: "100%" }} ref={graphRef}>
            <VictoryChart
                height={boundingRect.height}
                width={boundingRect.width}
                padding={{ top: 5, right: 10, bottom: 5, left: 10 }}
            >
                <VictoryLine
                    interpolation="monotoneX"
                    data={props.graphData}
                    style={{
                        ...lineStyle,
                        data: {
                            stroke: props.color || "#2BEAB8",
                            fillOpacity: 0.6,
                            strokeWidth: props.lineWidth || 4,
                        },
                    }}
                />

                <VictoryScatter
                    data={props.graphData}
                    size={props.dotSize || 6}
                    style={{ ...scatterStyle, data: { fill: props.color || "#2BEAB8" } }}
                />

                {/* to remove x and y axis: */}
                <VictoryAxis
                    style={{
                        axis: { stroke: "transparent" },
                        ticks: { stroke: "transparent" },
                        tickLabels: { fill: "transparent" },
                    }}
                />
            </VictoryChart>
        </div>
    );
};

export default React.memo(LineGraph);

const lineStyle = {
    parent: {
        border: "1px solid #ccc",
    },
    data: {
        fillOpacity: 0.6,
        stroke: "#1FC1FB",
        strokeWidth: 5,
    },
    labels: {
        fontSize: 1,
        fill: "transparent",
    },
};

const scatterStyle = {
    parent: {
        border: "1px solid #ccc",
    },
    data: {
        fill: "#1FC1FB",
    },
    labels: {
        fontSize: 1,
        fill: "transparent",
    },
};
