/**
 * dataurl转换为File
 * @param dataurl
 * @param filename
 */
export const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
    // 转换成成blob对象
    // return new Blob([u8arr],{type:mime});
};

/** 文件转为base64 */
export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * 获取文件名字
 * @param path 路径
 */
export function getFileName(path: string, includeExt = true): string {
    if (!path) {
        return '';
    }

    const slashIndex = path.lastIndexOf('/');
    const nameWithExt = slashIndex < 0 ? path : path.substr(slashIndex + 1);
    if (includeExt) {
        return nameWithExt;
    }

    const lastDotIndex = nameWithExt.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex < 0 ? nameWithExt : nameWithExt.substr(0, lastDotIndex);
    return nameWithoutExt;
}
