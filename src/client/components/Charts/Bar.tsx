import React, { FC, useRef } from 'react';
import { Chart, G2, Interval, Tooltip } from 'bizcharts';

interface BarProps {
    width?: number;
    height?: number;
    autoFit?: boolean;
    padding?: number[];
    data: {
        x: string;
        y: number;
    }[];
    color?: string;
    barWidth?: number;
    toolTipFun?: (x: string, y: string) => { name: string; value: string };
    scale?: { [key in 'x' | 'y']?: { [key in 'min' | 'max']?: number } };
    onGetG2Instance?: (chartIns: G2.Chart) => void;
}

const Bar: FC<BarProps> = (props: BarProps) => {
    const { scale, width, height, autoFit, padding, data, color, barWidth, toolTipFun, onGetG2Instance } = props;

    const tooltip: [string, (...args: any[]) => { name?: string; value: string }] = ['x*y', toolTipFun];
    const chartRef = useRef<G2.Chart>();

    return (
        <Chart
            scale={scale}
            width={width}
            height={height}
            autoFit={autoFit}
            data={data}
            interactions={['active-region']}
            padding={padding}
            onGetG2Instance={(chartIns: G2.Chart) => {
                chartRef.current = chartIns;
                onGetG2Instance && onGetG2Instance(chartIns);
            }}
        >
            <Interval position="x*y" color={color} tooltip={tooltip} size={barWidth} />
            <Tooltip shared={false} showTitle={false} showCrosshairs={false} />
        </Chart>
    );
};

Bar.defaultProps = {
    height: 400,
    autoFit: true,
    padding: [30, 30, 30, 50],
    color: 'rgba(24, 144, 255, 0.85)',
    toolTipFun: (x: string, y: string) => ({
        name: x,
        value: y,
    }),
};

export default Bar;
