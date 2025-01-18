import { configureStore } from "@reduxjs/toolkit";
import piDataSlice from "./piDataSlice";


const store = configureStore({
  reducer: {
    user: piDataSlice,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  })

});

export default store;