/**
 * 操作类型
 */
export enum TableActionType {
    /** 空状态 */
    none = 'none',
    /** 新增 */
    create = 'create',
    /** 更新 */
    update = 'update',
    /** 删除 */
    remove = 'remove',
}

export const TableDialogTitleDic: Record<TableActionType, string> = {
    [TableActionType.none]: '',
    [TableActionType.create]: '新增',
    [TableActionType.update]: '更新',
    [TableActionType.remove]: '',
};

export interface EditDialogProps<T = Record<string, any>> {
    visible: boolean;
    type: TableActionType;
    data: Partial<T>;
}
