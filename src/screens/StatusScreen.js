import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StatusText, StatusWrapper } from "../styles/status/statusScreenStyle";

const StatusScreen = () =>{
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {tableStatus} = useSelector(state=>state.tableInfo);
    const [statusText, setStatusText] = useState("");
    useEffect(()=>{
        if(tableStatus) {
            if(tableStatus?.status == "1") {
                navigation.navigate("main");
            }
            else if(tableStatus?.status == "2") {
                setStatusText("준비중");
            }
            else if(tableStatus?.status == "4") {
                setStatusText("예약중");
            }
        }
    },[tableStatus])
    return(
        <>
            <StatusWrapper>
                <StatusText>{statusText}</StatusText>
            </StatusWrapper>
        </>
    )

}
export default StatusScreen;