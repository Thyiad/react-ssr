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
    scale?: { [key in 'x' | 'y']?: { [key in 'min' | 'max']?: number } };
    onGetG2Instance?: (chartIns: G2.Chart) => void;
    toolTipItemTpl?: string;
}

const Bar: FC<BarProps> = (props: BarProps) => {
    const { scale, width, height, padding, autoFit, data, color, barWidth, toolTipItemTpl, onGetG2Instance } = props;
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
            <Interval position="x*y" color={color} size={barWidth} />
            <Tooltip itemTpl={itemTpl} shared={false} showTitle={false} showCrosshairs={false} />
        </Chart>
    );
};

Bar.defaultProps = {
    height: 300,
    autoFit: true,
    padding: [30, 30, 30, 50],
    color: 'rgba(24, 144, 255, 0.85)',
    toolTipItemTpl: '{name}: {value}',
};

export default Bar;
