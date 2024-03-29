import React, { FC, useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { thyEnv } from '@thyiad/util';

const ChartDemo: FC = () => {
    const data = [
        {
            type: '家具家电',
            sales: 38,
        },
        {
            type: '粮油副食',
            sales: 52,
        },
        {
            type: '生鲜水果',
            sales: 61,
        },
        {
            type: '美容洗护',
            sales: 145,
        },
        {
            type: '母婴用品',
            sales: 48,
        },
        {
            type: '进口食品',
            sales: 38,
        },
        {
            type: '食品饮料',
            sales: 38,
        },
        {
            type: '家庭清洁',
            sales: 38,
        },
    ];

    return (
        <div style={{ width: 400 }}>
            <Column
                width={400}
                title={{
                    visible: true,
                    text: '基础柱状图',
                }}
                data={data}
                padding="auto"
                xField="type"
                yField="sales"
                meta={{
                    type: { alias: '类别' },
                    sales: { alias: '销售额(万)' },
                }}
            />
        </div>
    );
};

export default ChartDemo;
