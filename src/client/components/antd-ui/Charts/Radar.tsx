import React, { FC, useRef } from 'react';
import { Chart, G2, Point, Line, Area, Tooltip, Coordinate } from 'bizcharts';

interface RadarProps {
    width?: number;
    height?: number;
    padding?: number[];
    autoFit?: boolean;
    data: {
        x: string;
        y: number;
    }[];
    color?: string;
    scale?: { [key in 'x' | 'y']?: { [key in 'min' | 'max']?: number } };
    onGetG2Instance?: (chartIns: G2.Chart) => void;
    toolTipItemTpl?: string;
}

const Radar: FC<RadarProps> = (props: RadarProps) => {
    const { width, height, padding, autoFit, data, scale, color, onGetG2Instance, toolTipItemTpl } = props;
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
            <Coordinate type="polar" radius={0.8} />
            <Tooltip shared={false} showTitle={false} itemTpl={itemTpl} />
            <Point position="x*y" color={color} shape="circle" />
            <Line position="x*y" color={color} size="2" />
        </Chart>
    );
};

Radar.defaultProps = {
    height: 300,
    autoFit: true,
    padding: [30, 30, 30, 50],
    color: 'rgba(24, 144, 255, 0.85)',
    toolTipItemTpl: '{name}: {value}',
};

export default Radar;
