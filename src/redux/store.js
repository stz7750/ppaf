import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { RtkqGetApi } from '../commons/RtkqGetApi';
import spinnerReducer from './spinnerSlice';

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
	reducer: {
		spinner: spinnerReducer,
		user: persistedReducer,
		[RtkqGetApi.reducerPath]: RtkqGetApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'], // redux-persist 관련 액션들을 검사에서 제외
			},
		}).concat(RtkqGetApi.middleware),
});

export default store;
