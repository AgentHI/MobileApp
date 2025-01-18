import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  piData: {},
  keys__: {},
  currentUid: {},
  agentData: {},
  bearerToken:'',
  globalAudioState:false
};

export const piDataSlice = createSlice({
  name: 'piData',
  initialState,
  reducers: {
    updatePiData: (state, action) => {
      state.piData = {...state.piData, ...action.payload};
    },
    updateAgentData_: (state, action) => {
      state.agentData = {...state.agentData, ...action.payload};
    },
    updateBearerToken_: (state, action) => {
      state.bearerToken = action.payload
    },
    updateKeysData: (state, action) => {
      // console.log('updateKeysData_Reducer ',action.payload);
      state.keys__ = action.payload;
    },
    updateCUID: (state, action) => {
      // console.log('updateCUID_Reducer ',action.payload);
      state.currentUid = action.payload;
    },
    updateGlobalAudioState: (state, action) => {
            console.log('updateGlobalAudioState ',action.payload);
      state.globalAudioState = action.payload;
    },
    clearPiData: state => {
      state.piData = {};
      state.keys__ = {};
      state.currentUid = {};
      state.agentData={}
      state.globalAudioState=false
      state.bearerToken=''
    },
    clearKeysData: state => {
      // console.log('clearKeysData__ ');
      state.piData = {};
    },
    clearCUID: state => {
      // console.log('clearCUID__ ');
      state.currentUid = {};
    },
  },
});

export const {
  updatePiData,
  clearPiData,
  clearKeysData,
  updateKeysData,
  clearCUID,
  updateCUID,
  updateGlobalAudioState,
  updateAgentData_
} = piDataSlice.actions;

export default piDataSlice.reducer;
