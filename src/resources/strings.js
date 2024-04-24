export const LANGUAGE_LIST = [
    "korean","japanese","chinese","english"
]

export const LANGUAGE = {
    korean:{
        sideMenu:{
            languageSelect:"언어선택",
            callServer:"직원호출"
        },
        cartView:{
            orderAmt:"주문수량",
            orderAmtUnit:'개',
            totalAmt:"주문금액",
            totalAmtUnit:'원',
            makeOrder:"주문하기",
            payOrder:"계산하기",
            togo:"포장하기",
            togoCancel:"포장취소",
            payDutch:'더치페이',
        },
        detailView:{
            toMenu:'메뉴로 이동',
            addToCart:'주문 담기',
            selectOpt:'옵션 선택',
            recommendMenu:'함께먹기 좋은 메뉴',
        },
        languageSelectView:{
            title:"사용하시는 국가별 언어를 선택하여 주세요.",
            subTitle:"Please select the language for your country.",
            selectedLanguage:'한국어',
        },
        togoView:{
            title:"원하시는 포장 완료 시간을 선택 해 주세요.",
            confirmButtonnTitle:'확인',
        },
        popup:{
            closeTitle:'닫기',
            okTitle:"확인",
            cancelTitle:"취소",
        },
        serverPopup:{
            callServer:'직원호출',
            text:"직원호출이 필요하신분은 아래 호출항목을 선택 후 직원호출하기 버튼을 눌러주시면\n담당자가 확인 후 빠른게 조치해드리겠습니다.",
            callBtnText:'직원 호출하기',
            closeBtnText:'닫기',
        },
        orderListPopup:{
            orderListTitle:"주문내역",
            orderListSubtitle:"주문하신 내역입니다.",

            orderPayTitle:"결제내역",
            orderPaySubtitle:"결제하실 내역입니다.",

            orderFailListSubtitle:"결제는 되었으나 주문에 실패 했습니다. 직원을 호출 해 주세요.",
            tableColName:"메뉴명",
            tableColAmt:'수량',
            tableColPrice:"단가",
            tableColTotal:'합계',
            tableColGrandTotal:'총 합계',
            totalAmtUnit:'원',
            orderListPay:'결제하기',
            orderListCancel:'취소',
            orderListOK:'확인',
        },
        adSCreen:{
            letsOrder:"주문하기",
        },
        orderPay:{
            payAmtToPay:"선택금액",
            payAmtTitle:"결제금액",
            payRestAmtTitle:"남은금액",
            payAmtUnit:'원',
            payAmCancel:'결제취소',
        }
    },


    japanese:{
        orderPay:{
            payAmtTitle:"결제금액",
            payRestAmtTitle:"남은금액",
            payAmtUnit:'円',
        },
        sideMenu:{
            languageSelect:"言語選択",
            callServer:"従業員呼び出し"
        },
        cartView:{
            orderAmt:"注文数量",
            orderAmtUnit:'犬',
            totalAmt:"注文金額",
            totalAmtUnit:'円',
            makeOrder:"注文する",
            payOrder:"支払う",
            togo:"包装",
            togoCancel:"包装キャンセル",
            payDutch:'ダッチペイ',
       },
       detailView:{
            toMenu:"「メニューに移動」",
            addToCart:"「注文を追加」",
            selectOpt:'オプションの選択',
            recommendMenu:"「一緒に食べるのに良いメニュー」",
       },
       languageSelectView:{
            title:"使用する国別言語を選択してください。",
            subTitle:"Please select the language for your country.",
            selectedLanguage:'日本語',
       },
       togoView:{
            title:"ご希望の梱包完了時間を選択してください。",
            confirmButtonnTitle:'OK',
       },
       popup:{
            closeTitle:'閉じる',
            okTitle:"確認",
            cancelTitle:"キャンセル",
       },
       serverPopup:{
            callServer:'従業員呼び出し',
            text:"従業員呼出が必要な方は、下記の呼び出し項目を選択後、従業員呼出しボタンを押してください。\n担当者が確認後迅速に対処いたします。",
            callBtnText:'スタッフを呼び出す',
            closeBtnText:'閉じる',
       },
       orderListPopup:{
            orderListTitle:"注文履歴",
            orderListSubtitle:"注文したお支払い履歴です。",

            orderPayTitle:"決済履歴",
            orderPaySubtitle:"お支払いいただく履歴です。",

            orderFailListSubtitle:"お支払いは行われましたが、注文に失敗しました。 スタッフを呼び出してください。.",
            tableColName:"メニュー名",
            tableColAmt:'数量',
            tableColPrice:"単価",
            tableColTotal:'合計',
            totalAmtUnit:'円',
            tableColGrandTotal:'合計合計',
            orderListPay:'支払いをする',
            orderListCancel:'キャンセル',
            orderListOK:'OK',
       },
       adSCreen:{
            letsOrder:"注文する",
       }
    },


    chinese:{
        sideMenu:{
            languageSelect:"选择语言",
            callServer:"呼叫员工",
        },
        cartView:{
            orderAmt:"订单数量",
            orderAmtUnit:'狗',
            totalAmt:"订单金额",
            totalAmtUnit:'赢',
            makeOrder:"下订单",
            payOrder:"支付",
            togo:"包装",
            togoCancel:"取消包装",
            payDutch:'荷兰支付',
        },
        detailView:{
            toMenu:'转到菜单',
            addToCart:'添加订单',
            selectOpt:'选择选项',
            recommendMenu:'一起吃饭的好菜单',
        },
        languageSelectView:{
            title:"请选择您所在国家的语言。",
            subTitle:"Please select the language for your country.",
            selectedLanguage:'中文',
        },
        togoView:{
            title:"请选择您所需的打包完成时间。",
            informButtonnTitle:'确认',
        },
        popup:{
            loseTitle:'关闭',
            okTitle:"好的",
            cancelTitle:"取消",
        },
        serverPopup:{
            callServer:'员工呼叫',
            text:"如果您需要呼叫工作人员，请选择下面的呼叫项目，然后按呼叫工作人员按钮。\n负责人将检查并立即采取行动。",
            callBtnText:'呼叫员工',
            closeBtnText:'关闭',
        },
        orderListPopup:{
            orderListTitle:"订单详情",
            orderListSubtitle:"这是您订单的付款详细信息。",

            orderPayTitle:"付款详情",
            orderPaySubtitle:"这是付款详细信息。",

            orderFailListSubtitle:"已付款，但订单失败。 请致电工作人员。",
            tableColName:"菜单名称",
            tableColAmt:'数量',
            tableColPrice:"单价",
            tableColTotal:'总计',
            totalAmtUnit:'赢',
            tableColGrandTotal:'总计',
            orderListPay:'支付',
            orderListCancel:'取消',
            orderListOK: '好的',
        },
        adSCreen:{
            letOrder:"下订单",
        }

    },
    english:{
        sideMenu:{
            languageSelect:"Select language",
            callServer:"Call employee"
        },
        cartView:{
            orderAmt:"order quantity",
            orderAmtUnit:'dog',
            totalAmt:"Order Amount",
            totalAmtUnit:'won',
            makeOrder:"Make Order",
            payOrder:"Pay Order",
            togo:"packaging",
            togoCancel:"Cancel packaging",
            payDutch:'Dutch Pay',
       },
       detailView:{
            toMenu:'Go to menu',
            addToCart:'Add order',
            selectOpt:'Select option',
            recommendMenu:'Good menu to eat together',
       },
       languageSelectView:{
            title:"Please select the language of your country.",
            subTitle:"Please select the language for your country.",
            selectedLanguage:'English',
       },
       togoView:{
            title:"Please select your desired packaging completion time.",
            confirmButtonnTitle:'Confirm',
       },
       popup:{
            closeTitle:'Close',
            okTitle:"OK",
            cancelTitle:"Cancel",
       },
       serverPopup:{
            callServer:'Employee call',
            text:"If you need to call a staff member, please select the call item below and press the call staff button.\nThe person in charge will check and take immediate action.",
            callBtnText:'Call employee',
            closeBtnText:'close',
       },
       orderListPopup:{
            orderListTitle:"Order Details",
            orderListSubtitle:"This is the payment details for your order.",

            orderPayTitle:"Payment details",
            orderPaySubtitle:"This is the payment details.",

            orderFailListSubtitle:"Payment was made, but the order failed. Please call a staff member.",
            tableColName:"Menu Name",
            tableColAmt:'quantity',
            tableColPrice:"unit price",
            tableColTotal:'Total',
            tableColGrandTotal:'Grand Total',
            totalAmtUnit:'won',
            orderListPay:'Pay',
            orderListCancel:'Cancel',
            orderListOK:'OK',
       },
       adSCreen:{
            letsOrder:"Place an order",
       }
    }


}