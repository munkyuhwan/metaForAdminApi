import { 
    configureStore, 
    combineReducers,
    getDefaultMiddleware,
} from '@reduxjs/toolkit'

//slices
import { cagegoriesSlice } from './categories'
import { languagesSlice } from './languages'
import { menuSlice } from './menu'
import { menuDetailSlice } from './menuDetail'
import { popupsSlice } from './popup'
import { callServerSlice } from './callServer'
import { orderSlice } from './order'
import { adSlice } from './ad'
import { cartViewSlice } from './cart'
import { errorSlice } from './error'
import { tableInfoSlice } from './tableInfo'
import { memberInfoSlice } from './member'
import { menuExtraSlice } from './menuExtra'
import { imageStorageSlice } from './imageStorage'
import { monthSelectSlice } from './monthPopup'
import { dispatchPopupSlice } from './dispatchPopup'

const store = configureStore({
    reducer:{
        categories:cagegoriesSlice.reducer,
        languages:languagesSlice.reducer,
        menu:menuSlice.reducer,
        menuDetail:menuDetailSlice.reducer,
        popup:popupsSlice.reducer,
        callServer:callServerSlice.reducer,
        order:orderSlice.reducer,
        ads:adSlice.reducer,
        cartView:cartViewSlice.reducer,
        tableInfo:tableInfoSlice.reducer,
        memberInfo:memberInfoSlice.reducer,
        menuExtra:menuExtraSlice.reducer,
        imageStorage:imageStorageSlice.reducer,
        monthSelect:monthSelectSlice.reducer,
        dispatchPopup:dispatchPopupSlice.reducer,
        
        error:errorSlice.reducer,
    },
    devTools:true
})


export default store;
