import { createApi } from '@reduxjs/toolkit/query/react';
import trans from '../commons/trans'; // trans를 가져옵니다.

// 커스텀 baseQuery 함수
const customBaseQuery = async ({ url, params }) => {
	let isLoading = true; // 로딩 상태 초기화
	try {
		const response = await trans.get(url, { params });
		isLoading = false; // 요청이 완료되면 로딩 상태 해제
		return { data: response.data, isLoading };
	} catch (error) {
		isLoading = false; // 요청이 실패해도 로딩 상태 해제
		return { error: error.message, isLoading };
	}
};

export const RtkqGetApi = createApi({
	reducerPath: 'api',
	baseQuery: customBaseQuery, // 커스텀 baseQuery 함수 사용
	endpoints: builder => ({
		getData: builder.query({
			query: ({ url, params }) => ({ url, params }), // `url`과 `params`를 인자로 받음
		}),
	}),
});

export const { useGetDataQuery } = RtkqGetApi;
