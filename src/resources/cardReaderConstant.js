export const SMARTRO_DEVICE = "dongle";
export const SMARTRO_DEVICE_COMM = "[\"com\",\"ftdi1\",\"115200\"]";
export const SMARTRO_SERVICE_FUNCTION="function";
export const SMARTRO_SERVICE_SETTING="setting";
export const SMARTRO_SERVICE_GETTING="getting";

export const CONTRACT_TYPE = "VAN";
export const BUSINESS_NO = "2118806806";
export const DEVICE_NO = "7109912041";

export const BASIC_DATA = {"cat-id":DEVICE_NO, "business-no":BUSINESS_NO};

// 동작
export const SMARTRO_EM_SIGNITURE = "get-signature";

export const SMARTRO_FUNCTION = [
    {   
        "label":"장치관리",
        "key":"device-manage",
        "data":[
            {label:"키교환",value:"exchange-key"},
            {label:"무결성",value:"check-integrity"},
            {label:"장치 정보",value:"get-info"},
            //{label:"카드입력 감지",value:"get-detection"},
            //{label:"금전함 열기",value:"open-up-cash-drawer"},
            {label:"카드삽입상태",value:"check-card-inserted"},
        ]
    },
    {
        'label':"데이터받기",
        "key":"getting-data",
        "data":[
            {label:"마지막 승인거래",value:"last-payment"},
            {label:"가맹점 정보",value:"merchant-info"},
            //{label:"qr",value:"“code-qr"},
            //{label:"qr",value:"code-qr-via-device"},
            //{label:"qr",value:"code-qr-via-additional-device"},
            //{label:"카드정보 읽어오기",value:"card-no-via-device"},
        ]
    },
    /* 
    {
        "key":"external-manage",
        "data":[
            {label:"부가장치 번호받기",value:"get-numbers"},
            {label:"부가장치 서명받기",value:"get-signature"},
        ]
    },
    */
]

export const SMARTRO_PAYMENT =[

]



