import React, { FC, useRef } from 'react';
import { Chart, G2, Tooltip, Line, Point, Axis } from 'bizcharts';

interface LineProps {
    width?: number;
    height?: number;
    autoFit?: boolean;
    padding?: number[];
    data: {
        x: string;
        y: number;
    }[];
    color?: string;
    scale?: { [key in 'x' | 'y']?: { [key in 'min' | 'max']?: number } };
    onGetG2Instance?: (chartIns: G2.Chart) => void;
    toolTipItemTpl?: string;
}

const LineChart: FC<LineProps> = (props: LineProps) => {
    const { width, height, padding, autoFit, data, color, scale, onGetG2Instance, toolTipItemTpl } = props;
    const chartRef = useRef<G2.Chart>();

    const itemTpl =
        '<li style="padding-bottom: 12px;" data-index={index}>' +
        '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
        toolTipItemTpl +
        '</li>';

    return (
        <Chart
            width={width}
            height={height}
            padding={padding}
            autoFit={autoFit}
            data={data}
            scale={scale}
            interactions={['element-active']}
            onGetG2Instance={(chartIns: G2.Chart) => {
                chartRef.current = chartIns;
                onGetG2Instance && onGetG2Instance(chartIns);
            }}
        >
            <Line position="x*y" color={color} />
            <Point position="x*y" />
            <Tooltip shared={false} itemTpl={itemTpl} showTitle={false} showCrosshairs lock triggerOn="hover" />
            <Axis name="y" />
        </Chart>
    );
};

LineChart.defaultProps = {
    height: 300,
    autoFit: true,
    padding: [30, 30, 30, 50],
    color: 'rgba(24, 144, 255, 0.85)',
    toolTipItemTpl: '{name}: {value}',
};

export default LineChart;
