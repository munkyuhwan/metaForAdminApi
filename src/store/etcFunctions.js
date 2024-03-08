import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import RNFS from "react-native-fs";


export const initEtcFunction = createAsyncThunk("etcFunction/initEtcFunction", async(category) =>{
    const formData = new FormData();
    return [];
})

export const uploadFile = createAsyncThunk("etcFunction/uploadFile", async(category) =>{
    console.log("file upload========================")
    
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    
    const formData = new FormData();
    const folderPath = RNFS.DownloadDirectoryPath
    const fileName = `log_${year}_${month}_${date}.txt`;

    const fileDir = `file://${folderPath}/${fileName}`;

    RNFS.exists(fileDir)
    .then((exists) => {
      if (exists) {
        const file = {
            name: "file_0",
            type:"text",
            uri: fileDir,
        }
        formData.append('file_0', file);
        console.log(formData.headers)
        axios.post
        axios.post(
            `https://wooriorder.co.kr/smartro/log_files.php`,
            formData,
            {
                headers:
                    { 
                        'Content-Type': 'multipart/form-data'
                    },
            }
        )
        .then(result=>{
            console.log("result: ",result);
        })
        .catch(err=>{
            console.log("err: ",err);
        })
        


      } else {
        console.log('File does not exist');
      }
    })
    .catch((error) => {
      console.log(error);
    });

    
    
 
    return ;
})

// Slice
export const etcFunction = createSlice({
    name: 'etcFunction',
    initialState: {
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        
       
    }
});

