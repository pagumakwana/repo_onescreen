export interface DataTableConfig {
    tableTitle?: string;
    tableData: any[]; // Ideally, use a specific interface here
    tableConfig: TableConfig[];
    showCheckBox?: boolean;
    isCustom?: {
        current: number;
        total: number;
        steps: number;
        callbackfn: () => void; // or (arg: any) => void if needed
    };
    buttonList?: ButtonConfig[];
}

export interface TableConfig {
    identifier: string;
    title: string;
    type: 'text' | 'link' | 'image'; // limit possible values
    dataType?: {
        type: 'array' | 'string' | 'number';
        path: string[];
    };
    size?: {
        height: string;
        width: string;
    };
    navigate?: string | (() => void); // customize as per routing use case
    buttonList?: ButtonConfig[];
    buttonIconList?: IconButtonConfig[];
}

export interface ButtonConfig {
    name: string;
    class: string;
    iconClass?: string;
    isStatic?: boolean;
    isAddModify?: boolean;
}

export interface IconButtonConfig {
    title: string;
    class: string;
    iconClass: string;
}

export interface TableEvent {
    tableItem: any;
    action: TableConfig;
    actionInfo: any;
    checkedData?: any;
}
