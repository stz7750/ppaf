/*
 * Copyright (c) 2024. &copy; STZ. All rights reserved
 */

/**
 *packageName    : stz-
 * fileName       : TableMaker.js
 * author         : stz
 * date           : 10/7/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 10/7/24        stz       최초 생성
 */
import React from 'react';
import MaterialTable from 'material-table';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { Button } from '@mui/material';

const TableMaker = ({ data, title, paginationProps, options }) => {
	const { currentPage, onChangePage, rowsPerPage, totalCount, showSearch = false, showPagination = false, columns } = paginationProps;
	const exportBtn = options.exportBtn || false;
	const exportIcon = options.exportIcon || false;
	const totalPages = Math.ceil(totalCount / (rowsPerPage > 0 ? rowsPerPage : 1));

	const CustomPagination = ({ page, onChangePage }) => (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<Button onClick={() => onChangePage(0)} disabled={page === 0}>
				<FirstPage />
			</Button>
			<Button onClick={() => onChangePage(page - 1)} disabled={page === 0}>
				<KeyboardArrowLeft />
			</Button>
			<span>
				Page {page + 1} of {totalPages}
			</span>
			<Button onClick={() => onChangePage(page + 1)} disabled={page >= totalPages - 1}>
				<KeyboardArrowRight />
			</Button>
			<Button onClick={() => onChangePage(totalPages - 1)} disabled={page >= totalPages - 1}>
				<LastPage />
			</Button>
		</div>
	);

	return (
		<MaterialTable
			title={title} // 타이틀 설정
			columns={columns}
			data={data}
			options={{
				exportButton: exportBtn,
				search: showSearch, // 검색 기능 설정
				paging: showPagination, // 페이지네이션 기능 설정
				filtering: false, // 필터 기능 활성화
			}}
			icons={{
				Export: () => exportIcon,
			}}
			components={{
				Pagination: props => (showPagination ? <CustomPagination page={currentPage} onChangePage={onChangePage} /> : null),
			}}
		/>
	);
};

export default TableMaker;
