// smartro POS API URL
export const POS_BASE_URL_TEST = "https://tordif.smilebiz.co.kr";
export const POS_BASE_URL_REAL = "https://ordif.smilebiz.co.kr";

export const POS_ORDER_NEW = "/partner/v1/table/order/new"; //신규 주문정보 등록
export const POS_ORDER_ADD = "/partner/v1/table/order/add"; // 추가 주문정보 등록
export const POS_POST_ORDER = "/partner/v1/table/order"; // 테이블 기준 10건
export const POS_POST_STORE_ORDER = "/partner/v2/table/order"; // 가맹점 전체 내역 (테이블당 5건)
export const POS_POST_MENU_STATE = "/partner/v1/menu/state"; // 상품정보 변경여부 확인
export const POS_POST_MENU_EDIT = "/partner/v1/menu/edit"; // 변경상품 조회
export const POS_POST_TABLE_LIST = "/partner/v1/table"; //테이블 목록 조회
export const POS_POST_PUSH_STATE = "/partner/v1/push/state"; // 푸시 서비스 목록 조회
export const POS_POST_PUSH_EDIT = "/partner/v1/push/edit"; // 푸시 수신 여부 갱신
export const POS_POST_ORDER_STATE = "{partner URL}/partner/v1/push"; //주문상태를 스마트로에서 보내줌.
export const POS_POST_ORDER_CANCEL = "/partner/v1/table/order/cancel"; // 반품요청

// meta
//export const POS_BASE_URL = "http://192.168.35.224:8090/PosConnectionTest"; //test
export const POS_BASE_URL = (ip) => {return `http://${ip}:8090/PosConnection`;}; // real
//export const POS_BASE_URL = "http://192.168.35.198:8090/PosConnection"; // real

// version code
export const POS_VERSION_CODE = "0010";
// wor codes
// 대분류 정보 조회
export const POS_WORK_CD_MAIN_CAT = "1000";
export const POS_WORK_CD_MAIN_CAT_RES = "1001";
// 중분류 정보조회 요청 
export const POS_WORK_CD_MID_CAT = "2000";
export const POS_WORK_CD_MID_CAT_RES = "2001";
// 소분류 정보조회 요청 
export const POS_WORK_CD_SUB_CAT = "3000";
export const POS_WORK_CD_SUB_CAT_RES = "3001";
// 테이블 정보 조회
export const POS_WORK_CD_TABLE_INFO = "4000";
// 상품 정보 조회
export const POS_WORK_CD_MENU_ITEMS = "5000";
// 선불제 주문 조회/요청/취소
export const POS_WORK_CD_PREPAY_ORDER_LIST = "6000";
export const POS_WORK_CD_PREPAY_ORDER_REQUEST = "6010";
export const POS_WORK_CD_PREPAY_ORDER_CANCEL = "6020";
// 상품 변경 여부 확인
export const POS_WORK_CD_IS_MENU_CHANGE = "7000";
// 상품 주문 가능 여부 확인
export const POS_WORK_CD_CAN_MENU_ORDER = "7010";
// 세트 그룹 정보조회
export const POS_WORK_CD_SET_GROUP_INFO = "8000";
// 세트 상품 정보조회
export const POS_WORK_CD_SET_GROUP_ITEM_INFO = "8010";
// 후불제 주문 요청
export const POS_WORK_CD_POSTPAY_ORDER = "8020";
// 후불제 주문 취소
export const POS_WORK_CD_POSTPAY_ORDER_CANCEL = "8030";
// 테이블 LOCK 요청
export const POS_WORK_CD_TABLE_LOCK = "8040";
// 테이블 작업 가능 여부 조회
export const POS_WORK_CD_TABLE_CAN_LOCK = "8050";
// 테이블 주문내역
export const POS_WORK_CD_TABLE_ORDER_LIST = "8060";
// 버전정보조회
export const POS_WORK_CD_VERSION = "8070";
// 결제금액 조회
export const POS_WORK_CD_PAID_AMT = "8080";
// 주문 결제 요청 (후불제)
export const POS_WORK_CD_REQ_PAY = "8090";
// 매장 정보 
export const POS_WORK_CD_REQ_STORE_INFO = "1100";
// 테이블 이동요청
export const POS_WORK_CD_REQ_TABLE_MOVE = "1110";
// 테이블 합석 요청
export const POS_WORK_CD_REQ_TABLE_MERGE = "1120";
// 에러 코드
export const POS_SUCCESS_CD = "E0000";

// kocess
export const TID = "0710000900";
export const BSN_ID = "2148631917";
export const SN = "1000000007";

export const KOCES_CODE_STORE_DOWNLOAD = "D10";
export const KOCES_CODE_KEY_RENEW = "D20";

// ADMIN API URL
export const ADMIN_BASE_URL = "http://worder2.co.kr/metacity";

export const ADMIN_API_GOODS = "good2.php";
export const ADMIN_API_CATEGORIES = "category.php";





export const ADMIN_GOODS = "/goods2.php";
export const ADMIN_OPTION = "/option.php";
export const ADMIN_CATEGORIES= "/category.php";
export const ADMIN_CALL_SERVICE = "/call.php";
export const ADMIN_POST_CALL_SERVICE = "/call2.php";
export const ADMIN_POST_BULLETIN = "/call2a.php";
export const ADMIN_BANNER = "/banner.php";
export const ADMIN_TABLE_STATUS = "/store_table.php";
export const ADMIN_ORDER_LOG = "/error1.php";
export const ADMIN_PAY_LOG = "/pay1.php";

export const ADMIN_BANNER_DIR = "https://wooriorder.co.kr/metacity/upload_file/banner/";

//export const STORE_ID = "3100396007";
//export const STORE_ID = "7407191"; //테스트 
//export const SERVICE_ID = "532461";

// 내꺼 테스트용
export const STORE_ID = "3113810001"; 
export const SERVICE_ID = "3010";

// 우리포스 테스트용
//export const STORE_ID = "3113813001";
//export const SERVICE_ID = "3010";

//export const STORE_ID = "3113815001"; 
//export const SERVICE_ID = "3010";


export const CALL_SERVICE_GROUP_CODE = "99999";
// ADMIN API URL



export const CODE_PUSH_SECRET = "da5e87fb-a7b8-4e7a-8428-e6eda2804cb3";
export const CODE_PUSH_PRODUCTION = "_strT2FBl4DuNhi3d4zU4MNmQrbfGU4s7iTFK";
export const CODE_PUSH_DEBUG = "GZAwRKJ3yfMeCfp7elUrPyn8EiW_ldg_274Lt";
export const CODE_PUSH_STAGING = "LXSnC9viZ4XyE3ak5RkNsl_v9I8bE-_LGhqS-";


