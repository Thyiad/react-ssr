export const getTableInitData = (): Promise<{ [key: string]: any }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                a: 1,
            });
        }, 100);
    });
};
