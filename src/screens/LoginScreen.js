import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Text, TouchableWithoutFeedback } from 'react-native'
import { LoginActionInputID, LoginActionInputPW, LoginActionSubtitle, LoginActionTitle, LoginActionWrapper, LoginBtnIcon, LoginBtnText, LoginBtnWrapper, LoginLogo, LoginMainWrapper } from '../styles/login/loginStyle'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { memberLogin } from '../store/member';
import {isEmpty} from 'lodash';

const LoginScreen = () =>{
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const {memberInfo} = useSelector(state=>state.memberInfo);

    const pwRef = useRef();
    const idRef = useRef();

    useEffect(()=>{
        if(!isEmpty(memberInfo)) {
            navigation.navigate("main");
        }
    },[memberInfo])

    return(
        <>
            <LoginMainWrapper behavior="padding" enabled >
                <LoginLogo source={require("../assets/icons/logo.png")} />
                <LoginActionWrapper>
                    <LoginActionTitle>로그인</LoginActionTitle>
                    <LoginActionSubtitle>login</LoginActionSubtitle>
                    <LoginActionInputID
                        ref={idRef}
                        placeholder="아이디 입력"
                        onSubmitEditing={()=>{
                            if(pwRef.current!=null) {
                                pwRef.current.focus()
                            }
                        }}
                    />
                    <LoginActionInputPW 
                        ref={pwRef}
                        placeholder="비밀번호 입력"
                        onSubmitEditing={()=>{
                        }}
                        secureTextEntry={true}  
                    />
                    <TouchableWithoutFeedback onPress={()=>{dispatch(memberLogin()); }} >
                        <LoginBtnWrapper>
                            <LoginBtnText>로그인하기</LoginBtnText>
                            <LoginBtnIcon source={require("../assets/icons/lock.png")} />
                        </LoginBtnWrapper>
                    </TouchableWithoutFeedback>

                </LoginActionWrapper>
            </LoginMainWrapper>

        </>
    )
}
export default LoginScreen