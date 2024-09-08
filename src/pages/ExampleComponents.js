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

const ExampleComponents = () => {
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
	return (
		<div>
			<InputMaker opt={inputOptions} />
		</div>
	);
};

export default ExampleComponents;
