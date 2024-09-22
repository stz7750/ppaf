import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css'; // OpenLayers 기본 CSS
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj'; // 좌표 변환을 위한 함수
import { Box, TextField, Button, Typography, Grid, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import trans from '../commons/trans';
import { MdLocationOn } from 'react-icons/md'; // React Icons
import VectorLayer from 'ol/layer/Vector'; // 벡터 레이어
import VectorSource from 'ol/source/Vector'; // 벡터 소스
import { Point } from 'ol/geom'; // Point 지오메트리
import { Feature } from 'ol'; // 피처
import { Icon, Style } from 'ol/style'; // 스타일 및 아이콘
import ReactDOMServer from 'react-dom/server'; // react-icons를 HTML 문자열로 변환하기 위한 패키지

const OlMap = () => {
	const mapRef = useRef(null); // 지도를 그릴 div 요소 참조
	const [mapObject, setMapObject] = useState(null); // OpenLayers 맵 객체 상태 저장
	const [isMapInitialized, setIsMapInitialized] = useState(false); // 맵 초기화 여부
	const [sigKorNm, setSigKorNm] = useState(''); // 시/구 이름
	const [dong, setDong] = useState(''); // 동 이름
	const [bunji, setBunji] = useState(''); // 번지 이름
	const [searchResult, setSearchResult] = useState(null); // 검색 결과 좌표
	const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer 상태 관리

	// 아이콘을 Data URI로 변환하는 함수
	const convertIconToDataURI = () => {
		const iconSVGString = ReactDOMServer.renderToString(<MdLocationOn style={{ fontSize: '32px', color: 'red' }} />);
		const encodedIcon = encodeURIComponent(iconSVGString); // 인코딩 처리
		return `data:image/svg+xml;charset=utf-8,${encodedIcon}`;
	};

	// 지도 초기화 함수
	const initMakeMapFnc = () => {
		// 맵이 초기화되지 않았고, mapRef.current가 존재할 때만 초기화
		if (!isMapInitialized && mapRef.current) {
			// 벡터 소스 및 벡터 레이어 생성 (마커 추가할 용도)
			const vectorSource = new VectorSource();
			const vectorLayer = new VectorLayer({
				source: vectorSource,
			});

			const map = new OLMap({
				target: mapRef.current, // mapRef를 사용하여 target 설정
				layers: [
					new TileLayer({
						source: new OSM(),
					}),
					vectorLayer, // 벡터 레이어 추가
				],
				view: new View({
					center: fromLonLat([127.0402, 37.574]), // 초기 좌표
					zoom: 16, // 초기 줌 레벨
				}),
			});

			// 마커 클릭 이벤트 추가
			map.on('singleclick', function (evt) {
				map.forEachFeatureAtPixel(evt.pixel, function (feature) {
					// 마커를 클릭했을 때 해당 마커의 속성 정보를 표시
					const props = feature.getProperties(); // 모든 속성 가져오기
					console.log(props); // 확인을 위해 속성 전체 출력
					alert(`위치 정보: 경도 ${props.longitude}, 위도 ${props.latitude}, 기타 정보: ${props.info || '정보 없음'}`);
				});
			});

			setMapObject(map); // 맵 객체 저장
			setIsMapInitialized(true); // 맵 초기화 완료 상태로 설정
		}
	};

	useEffect(() => {
		// mapRef가 업데이트될 때마다 지도를 한 번만 초기화
		if (!isMapInitialized && mapRef.current) {
			initMakeMapFnc();
		}
	}, [mapRef, isMapInitialized]); // mapRef가 업데이트될 때 실행

	const handleSearch = useCallback(async () => {
		try {
			const response = await trans.get(`admin/api/getAddr`, {
				params: { sigKorNm, dong, bunji },
			});

			// API 응답 데이터 확인
			console.log(response.data[0]); // 응답 데이터 구조 확인

			if (response.data && response.data.length > 0) {
				setSearchResult(response.data); // 전체 검색 결과 리스트를 상태로 저장

				// 첫 번째 결과로 지도 중심 이동 및 마커 추가
				const firstResult = response.data[0];
				const { longitude, latitude, additionalInfo } = firstResult; // API에서 추가 정보를 가져오기

				if (mapObject) {
					const view = mapObject.getView();
					const coords = fromLonLat([longitude, latitude]); // 좌표 변환
					view.setCenter(coords);
					view.setZoom(16); // 줌 레벨 조정

					// 벡터 소스를 가져와서 마커(Feature)를 추가
					const vectorSource = mapObject.getLayers().item(1).getSource();

					// 기존 마커 제거
					vectorSource.clear();

					// 새로운 마커(Feature) 생성
					const marker = new Feature({
						geometry: new Point(coords), // 마커의 좌표
						longitude, // 경도 정보
						latitude, // 위도 정보
						info: additionalInfo, // 기타 추가 정보
					});

					// 마커 스타일 설정 (React Icon을 Data URI로 변환 후 이미지로 사용)
					const iconDataURI = convertIconToDataURI(); // react-icons 아이콘을 Data URI로 변환
					marker.setStyle(
						new Style({
							image: new Icon({
								src: iconDataURI, // Data URI로 변환된 아이콘 사용
								anchor: [0.5, 1], // 아이콘의 위치 조정
								scale: 1, // 아이콘 크기 조정
							}),
						})
					);

					// 벡터 소스에 마커 추가
					vectorSource.addFeature(marker);
				}
			}
		} catch (error) {
			alert('오류가 발생했습니다.');
		}
	}, [mapObject, sigKorNm, bunji]);

	// Drawer 열고 닫기 제어
	const toggleDrawer = open => () => {
		setIsDrawerOpen(open);
	};

	return (
		<Box sx={{ p: 3 }}>
			{/* 메뉴 버튼 추가하여 사이드바 열기 */}
			<IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mb: 2 }}>
				<MenuIcon />
			</IconButton>

			<Typography variant="h4" gutterBottom>
				OpenLayers Map - 주소 검색
			</Typography>

			<Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
				<Box role="presentation" sx={{ width: 250, padding: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label="시/구"
								variant="outlined"
								fullWidth
								value={sigKorNm}
								onChange={e => setSigKorNm(e.target.value)}
								placeholder="서울특별시 종로구 **동"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField label="번지" variant="outlined" fullWidth value={bunji} onChange={e => setBunji(e.target.value)} placeholder="번지" />
						</Grid>
						<Grid item xs={12}>
							<Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
								검색
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Drawer>

			{/* 지도 렌더링 박스 */}
			<Box id="mapBox" ref={mapRef} sx={{ width: '100%', height: '500px', border: '1px solid #ccc', mt: 2 }}></Box>
		</Box>
	);
};

export default OlMap;
