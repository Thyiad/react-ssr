import { G2 } from 'bizcharts';

/**
 * 返回图表的 dataURL 用于生成图片。
 * @param chart 需要获取 DataURL 的 chart 实例
 * @returns 返回图表的 dataURL
 */
export function toDataURL(chart: G2.Chart): string {
    if (!chart) {
        return '';
    }
    // 4.0开始需要自行封装
    const canvas = chart.getCanvas();
    const renderer = chart.renderer;
    const canvasDom = canvas.get('el');
    let dataURL = '';
    if (renderer === 'svg') {
        const clone = canvasDom.cloneNode(true);
        const svgDocType = document.implementation.createDocumentType(
            'svg',
            '-//W3C//DTD SVG 1.1//EN',
            'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd',
        );
        const svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
        svgDoc.replaceChild(clone, svgDoc.documentElement);
        const svgData = new XMLSerializer().serializeToString(svgDoc);
        dataURL = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData);
    } else if (renderer === 'canvas') {
        dataURL = canvasDom.toDataURL('image/png');
    }
    return dataURL;
}

/**
 * 图表图片导出
 * @param chart chart 实例
 * @param name 图片名称，可选，默认名为 'G2Chart'
 */
export function downloadImage(chart: G2.Chart, name = 'G2Chart'): void {
    if (!chart) {
        return;
    }
    // 4.0开始需要自行封装
    const link = document.createElement('a');
    const renderer = chart.renderer;
    const filename = `${name}${renderer === 'svg' ? '.svg' : '.png'}`;
    const canvas = chart.getCanvas();
    canvas.get('timeline').stopAllAnimations();

    setTimeout(() => {
        const dataURL = toDataURL(chart);
        if (window.Blob && window.URL && renderer !== 'svg') {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const blobObj = new Blob([u8arr], { type: mime });
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(blobObj, filename);
            } else {
                link.addEventListener('click', () => {
                    link.download = filename;
                    link.href = window.URL.createObjectURL(blobObj);
                });
            }
        } else {
            link.addEventListener('click', () => {
                link.download = filename;
                link.href = dataURL;
            });
        }
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', false, false);
        link.dispatchEvent(e);
    }, 16);
}
