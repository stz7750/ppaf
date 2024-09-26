import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css'; // OpenLayers 기본 CSS
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj'; // 좌표 변환을 위한 함수
import { Box, TextField, Button, Typography, Grid, IconButton, Drawer, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import trans from '../../commons/trans';
import { MdLocationOn } from 'react-icons/md'; // React Icons
import VectorLayer from 'ol/layer/Vector'; // 벡터 레이어
import VectorSource from 'ol/source/Vector'; // 벡터 소스
import { LineString, Point } from 'ol/geom'; // Point 지오메트리
import { Feature } from 'ol'; // 피처
import { Fill, Icon, Stroke, Style } from 'ol/style'; // 스타일 및 아이콘
import ReactDOMServer from 'react-dom/server';
import { MousePosition, OverviewMap } from 'ol/control';
import { createStringXY, toStringHDMS } from 'ol/coordinate'; // react-icons를 HTML 문자열로 변환하기 위한 패키지
import { defaults as defaultControls } from 'ol/control.js';
import Overlay from 'ol/Overlay.js';
import { Popover } from 'bootstrap';
import { XYZ } from 'ol/source';
import MapPosition from './MapPosition';
import Geolocation from 'ol/Geolocation.js';
import CircleStyle from 'ol/style/Circle'; // 위치 트래킹

const OlMap = () => {
	const mapRef = useRef(null); // 지도를 그릴 div 요소 참조
	const [mapObject, setMapObject] = useState(null); // OpenLayers 맵 객체 상태 저장
	const [isMapInitialized, setIsMapInitialized] = useState(false); // 맵 초기화 여부
	const [sigKorNm, setSigKorNm] = useState(''); // 시/구 이름
	const [dong, setDong] = useState(''); // 동 이름
	const [bunji, setBunji] = useState(''); // 번지 이름
	const [searchResult, setSearchResult] = useState(null); // 검색 결과 좌표
	const [mode, setMode] = useState('address'); // 모드 상태: 'address' 또는 'route'
	const [startPoint, setStartPoint] = useState(''); // 출발지점
	const [endPoint, setEndPoint] = useState(''); // 도착지점
	const [vectorSource, setVectorSource] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer 상태 관리
	const [userLocation, setUserLocation] = useState(null); // 사용자 위치를 상태로 관리
	const [mouseCoordinates, setMouseCoordinates] = useState({ longitude: null, latitude: null });

	// 아이콘을 Data URI로 변환하는 함수
	const convertIconToDataURI = () => {
		const iconSVGString = ReactDOMServer.renderToString(<MdLocationOn style={{ fontSize: '32px', color: 'red' }} />);
		const encodedIcon = encodeURIComponent(iconSVGString); // 인코딩 처리
		return `data:image/svg+xml;charset=utf-8,${encodedIcon}`;
	};

	const view = new View({
		center: fromLonLat([127.0402, 37.574]), // 초기 좌표
		zoom: 16, // 초기 줌 레벨
	});
	// 지도 초기화 함수
	const initMakeMapFnc = () => {
		// 맵이 초기화되지 않았고, mapRef.current가 존재할 때만 초기화
		if (!isMapInitialized && mapRef.current) {
			// 벡터 소스 및 벡터 레이어 생성 (마커 추가할 용도)
			const vectorSource = new VectorSource();
			const vectorLayer = new VectorLayer({
				source: vectorSource,
			});
			const pos = fromLonLat([127.0402, 37.574]);
			const map = new OLMap({
				controls: defaultControls().extend([overviewMapControl]),
				target: mapRef.current, // mapRef를 사용하여 target 설정
				layers: [
					new TileLayer({
						/*source: new OSM(),*/ // 오픈 스트릿 맵 객체로 초기화
						source: new XYZ({
							url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
							crossOrigin: 'anonymous',
						}),
					}),
					vectorLayer, // 벡터 레이어 추가
				],
				view: view,
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
			const popup = new Overlay({
				element: document.getElementById('popup'),
			});
			map.addOverlay(popup);
			const marker = new Overlay({
				position: pos,
				positioning: 'center-center',
				element: document.getElementById('marker'),
				stopEvent: false,
			});
			map.addOverlay(marker);
			const mousePositionControl = new MousePosition({
				coordinateFormat: createStringXY(4),
				projection: 'EPSG:4326',
				className: 'custom-mouse-position',
				target: null, // We don't need a DOM element, we'll update state
			});

			map.addControl(mousePositionControl);
			map.on('pointermove', function (evt) {
				const coords = toLonLat(evt.coordinate);
				setMouseCoordinates({ longitude: coords[0], latitude: coords[1] });
			});

			const element = popup.getElement();
			map.on('click', function (evt) {
				const coordinate = evt.coordinate;
				const hdms = toStringHDMS(toLonLat(coordinate));
				popup.setPosition(coordinate);
				let popover = Popover.getInstance(element);
				if (popover) {
					popover.dispose();
				}
				popover = new Popover(element, {
					animation: false,
					container: element,
					content: '<p>The location you clicked was:</p><code>' + hdms + '</code>',
					html: true,
					placement: 'top',
					title: 'Welcome to OpenLayers',
				});
				popover.show();
			});

			setMapObject(map); // 맵 객체 저장
			setIsMapInitialized(true); // 맵 초기화 완료 상태로 설정
			setVectorSource(vectorSource);
		}
	};

	useEffect(() => {
		// mapRef가 업데이트될 때마다 지도를 한 번만 초기화
		if (!isMapInitialized) {
			let cnt = 0;
			cnt++;
			console.log(cnt);
			initMakeMapFnc();
		}
	}, [isMapInitialized]); // mapRef가 업데이트될 때 실행

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

	/*// 사용자의 위치를 가져오는 함수
	const handleUserLocation = () => {
		if (navigator.geolocation) {
			// 0.3초마다 위치를 가져오는 인터벌 설정
			const intervalId = setInterval(() => {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords;
						console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
						const coords = fromLonLat([longitude, latitude]); // 좌표 변환

						if (mapObject) {
							const view = mapObject.getView();
							console.log('지도 중심을 업데이트합니다:', coords);
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
								info: '사용자의 현재 위치', // 기타 추가 정보
							});

							// 마커 스타일 설정 (React Icon을 Data URI로 변환 후 이미지로 사용)
							const iconDataURI = convertIconToDataURI();
							marker.setStyle(
								new Style({
									image: new Icon({
										src: iconDataURI, // Data URI로 변환된 아이콘 사용
										anchor: [0.5, 1],
										scale: 1, // 아이콘 크기 조정
									}),
								})
							);

							console.log('마커를 추가합니다:', marker);
							// 벡터 소스에 마커 추가
							vectorSource.addFeature(marker);
						}
					},
					error => {
						console.error('위치 정보를 가져오는 데 실패했습니다:', error);
						alert(`오류 발생: ${error.message}`);
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			}, 300); // 300ms마다 위치 정보를 가져옴

			// 컴포넌트가 언마운트되면 인터벌을 해제하여 위치 추적을 중지
			return () => {
				clearInterval(intervalId);
			};
		} else {
			alert('이 브라우저에서는 Geolocation API를 지원하지 않습니다.');
		}
	};*/

	const mousePositionControl = new MousePosition({
		coordinateFormat: createStringXY(4),
		projection: 'EPSG:4326',
		// comment the following two lines to have the mouse position
		// be placed within the map.
		className: 'custom-mouse-position',
		target: document.getElementById('mouse-position'),
	});

	const overviewMapControl = new OverviewMap({
		// see in overviewmap-custom.html to see the custom CSS used
		className: 'ol-overviewmap ol-custom-overviewmap',
		layers: [
			new TileLayer({
				source: new OSM(),
			}),
		],
		collapseLabel: '\u00BB',
		label: '\u00AB',
		collapsed: false,
	});

	// 토글 버튼 핸들러
	const handleModeChange = (event, newMode) => {
		if (newMode !== null) {
			setMode(newMode);
		}
	};

	// 경로 표시 함수
	const drawRoute = useCallback(async () => {
		if (startPoint && endPoint) {
			try {
				// 예시로 두 점을 사용하여 임의의 경로를 그립니다.
				const startCoords = fromLonLat([127.0602, 37.5665]); // 출발지점 좌표 (동대문ㄱ)
				const endCoords = fromLonLat([126.92114552445851, 37.621679907134705]); // 도착지점 좌표 (은평구)

				const route = new LineString([startCoords, endCoords]);
				const routeFeature = new Feature({
					geometry: route,
				});
				console.log(startCoords, endCoords);
				routeFeature.setStyle(
					new Style({
						stroke: new Stroke({
							color: '#ffcc33',
							width: 4,
						}),
					})
				);

				if (vectorSource) {
					vectorSource.clear(); // 이전 마커와 경로 제거 (vectorSource가 존재할 경우에만)
				}
				console.log(routeFeature);
				console.log(vectorSource);
				vectorSource.addFeature(routeFeature); // 경로 추가

				// 출발지점과 도착지점에 마커 추가
				addMarker(startCoords, '출발지점');
				addMarker(endCoords, '도착지점');
			} catch (error) {
				console.error('경로를 가져오는 데 실패했습니다:', error);
			}
		} else {
			alert('none');
		}
	}, [startPoint, endPoint, vectorSource]);

	// 마커 추가 함수
	const addMarker = (coords, info) => {
		const marker = new Feature({
			geometry: new Point(coords),
			info,
		});

		// 마커 스타일 설정
		const iconDataURI = ReactDOMServer.renderToString(<MdLocationOn style={{ fontSize: '32px', color: 'red' }} />);
		const encodedIcon = encodeURIComponent(iconDataURI);

		marker.setStyle(
			new Style({
				image: new Icon({
					src: `data:image/svg+xml;charset=utf-8,${encodedIcon}`,
					anchor: [0.5, 1],
					scale: 1,
				}),
			})
		);

		vectorSource.addFeature(marker); // 마커 추가
	};

	// 실시간 사용자 위치 추적
	const handleUserLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const coords = fromLonLat([longitude, latitude]);
					setUserLocation(coords); // 사용자 위치 업데이트
				},
				error => {
					console.error('위치 정보를 가져오는 데 실패했습니다:', error);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				}
			);
		}
	};

	// 실시간 위치가 업데이트될 때마다 마커를 추가
	useEffect(() => {
		if (userLocation && vectorSource) {
			addMarker(userLocation, '사용자의 현재 위치');
		}
	}, [userLocation, vectorSource]);

	return (
		<Box sx={{ p: 3 }}>
			{/* 메뉴 버튼 추가하여 사이드바 열기 */}
			<IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mb: 2 }}>
				<MenuIcon />
			</IconButton>

			{/* 지도 렌더링 박스 */}
			<Box id="mapBox" ref={mapRef} sx={{ width: '100%', height: '500px', border: '1px solid #ccc', mt: 2 }}></Box>

			<Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
				<Box role="presentation" sx={{ width: 250, padding: 2 }}>
					{/* 모드 전환 토글 버튼 */}
					<ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} aria-label="지도 모드 선택" sx={{ mb: 2 }}>
						<ToggleButton value="address">주소 검색</ToggleButton>
						<ToggleButton value="route">길찾기</ToggleButton>
					</ToggleButtonGroup>

					<Grid container spacing={2}>
						{mode === 'address' ? (
							<>
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
							</>
						) : (
							<>
								<Grid item xs={12}>
									<TextField
										label="출발지"
										variant="outlined"
										fullWidth
										value={startPoint}
										onChange={e => setStartPoint(e.target.value)}
										placeholder="출발지 입력"
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField label="도착지" variant="outlined" fullWidth value={endPoint} onChange={e => setEndPoint(e.target.value)} placeholder="도착지 입력" />
								</Grid>
								<Grid item xs={12}>
									<Button variant="contained" color="primary" fullWidth onClick={drawRoute}>
										경로 찾기
									</Button>
								</Grid>
							</>
						)}
					</Grid>
				</Box>
			</Drawer>

			{/* 지도 렌더링 박스 */}
			{/*<Box id="mapBox" ref={mapRef} sx={{ width: '100%', height: '500px', border: '1px solid #ccc', mt: 2 }}></Box>*/}
			<MapPosition longitude={userLocation ? toLonLat(userLocation)[0] : null} latitude={userLocation ? toLonLat(userLocation)[1] : null} />
			<div id="marker" title="Marker"></div>
			<div id="popup"></div>
			<button onClick={handleUserLocation}>Click Me!</button>
		</Box>
	);
};

export default OlMap;
