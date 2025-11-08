export class dataTableConfig {
    tableTitle?: string
    tableData?: any
    tableConfig?: tableConfig[]
    showCheckBox?: boolean
    displayPaging?: boolean
    isCustom?: {
        current: number,
        total: number,
        steps: number,
        callbackfn: any
    }
    buttonList?: Array<{
        name: string,
        class: string,
        iconClass?: string,
        isStatic?: boolean,
        isAddModify?: boolean,
    }>
}

export class tableConfig {
    identifer?: string;
    title?: string;
    type?: string; // Text | link | image
    dataType?: {
        type: string; // array | string |number
        path: Array<string>;
    }
    size?: {
        height: string,
        width: string
    };
    navigate?:any
    buttonList?: Array<{
        name: string,
        class: string,
        iconClass?: string
    }>
    buttonIconList?: Array<{
        title: string,
        class: string,
        iconClass: string
    }>
}

export class tableEvent {
    tableItem: any;
    action?: tableConfig;
    actionInfo: any;
    checkedData?: any;
}