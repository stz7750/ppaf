/**
 *packageName    : stz-
 * fileName       : ExampleComponents
 * author         : stz
 * date           : 9/8/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 9/8/24        stz       최초 생성
 */
import React from 'react';
import InputMaker from '../commons/InputMaker';
import { FaSearchLocation } from 'react-icons/fa';
import GlobalAlert from '../commons/GlobalAlert';
import GlobalModal from '../commons/GlobalModal';

const ExampleComponents = () => {
	//ReadME : 각종 공통 컴포넌트 사용법을 작성합니다.
	const inputOptions = [
		{
			type: 'text',
			label: 'ex',
			placeholder: 'for test',
			name: 'test 입니다',
			icon: <FaSearchLocation />,
		},
		{
			type: 'text',
			label: 'ex2',
			placeholder: 'for test2',
			name: 'test 입니다2',
			icon: <FaSearchLocation />,
		},
	];

	const alertInfo = {
		level: 'info',
		message: 'from TestComponet',
	};

	return (
		<div>
			<InputMaker opt={inputOptions} />
			<GlobalAlert alertInfo={alertInfo} />
		</div>
	);
};

export default ExampleComponents;
