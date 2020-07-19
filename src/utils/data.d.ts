export interface ResponseData<T = any> {
    /** 状态码 */
    code: number;
    /** 提示语 */
    message: string;
    /** 数据 */
    data: T;
}
