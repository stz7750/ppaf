import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'ol/ol.css'; // OpenLayers 기본 CSS
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj'; // 좌표 변환을 위한 함수
import { Box, TextField, Button, Grid, ToggleButton, ToggleButtonGroup, Autocomplete, List, ListItem, ListSubheader, ListItemText } from '@mui/material';
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
import CircleStyle from 'ol/style/Circle';
import tileLayer from 'bootstrap/js/src/dom/event-handler'; // 위치 트래킹
import geolocation from 'ol/Geolocation';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import popover from 'bootstrap/js/src/popover';

// EPSG:5187 좌표계 등록
proj4.defs('EPSG:5187', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs');
register(proj4); // OpenLayers에 proj4 등록

const OlMap = () => {
	const mapRef = useRef(null); // 지도를 그릴 div 요소 참조
	const [mapObject, setMapObject] = useState(null); // OpenLayers 맵 객체 상태 저장
	const [isMapInitialized, setIsMapInitialized] = useState(false); // 맵 초기화 여부
	const [sigKorNm, setSigKorNm] = useState(''); // 시/구 이름
	const [bunji, setBunji] = useState(''); // 번지 이름
	const [searchResult, setSearchResult] = useState(null); // 검색 결과 좌표
	const [mode, setMode] = useState('address'); // 모드 상태: 'address' 또는 'route'
	const [startPoint, setStartPoint] = useState(''); // 출발지점
	const [endPoint, setEndPoint] = useState(''); // 도착지점
	const [vectorSource, setVectorSource] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer 상태 관리
	const [userLocation, setUserLocation] = useState(null); // 사용자 위치를 상태로 관리
	const [mouseCoordinates, setMouseCoordinates] = useState({ longitude: null, latitude: null });
	const [start, setStart] = useState([127.0602, 37.5665]);
	const [end, setEnd] = useState([126.92114552445851, 37.621679907134705]);
	const [allAddressData, setAllAddressData] = useState([]); // 서버에서 받아온 모든 주소 데이터
	const [startSigKorNm, setStartSigKorNm] = useState(''); // 출발지 시/구
	const [startBunji, setStartBunji] = useState(''); // 출발지 번지
	const [endSigKorNm, setEndSigKorNm] = useState(''); // 도착지 시/구
	const [endBunji, setEndBunji] = useState(''); // 도착지 번지

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
				target: null,
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
			setMapObject(map);
			setVectorSource(vectorSource);
			setIsMapInitialized(true);
		}
	};

	useEffect(() => {
		if (!isMapInitialized && mapRef.current) {
			initMakeMapFnc();
		}
	}, [isMapInitialized]);

	useEffect(() => {
		const fetchAllAddresses = async () => {
			try {
				const response = await trans.get('admin/api/getAllAddrNm');
				if (response.data && response.data.length > 0) {
					setAllAddressData(
						response.data.map(item => ({
							addr: item.addr,
							gid: item.gid,
						}))
					);
				}
				console.log(response.data);
			} catch (error) {
				console.error('주소 데이터를 가져오는 데 실패했습니다:', error);
			}
		};

		fetchAllAddresses();
	}, []);

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

	const filteredOptions = useMemo(() => {
		if (startPoint === '') return allAddressData;
		return allAddressData.filter(item => item.addr.toLowerCase().includes(startPoint.toLowerCase()));
	}, [startPoint, allAddressData]);

	const handleSearch = useCallback(async () => {
		try {
			const response = await trans.get(`admin/api/getAddr`, {
				params: { sigKorNm, bunji },
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
	const handleModeChange = (event, newMode) => {
		if (newMode !== null) {
			setMode(newMode);
		}
	};
	// 경로 요청 함수
	const getRoute = async (start, end) => {
		const url = `http://localhost:5001/route/v1/walking/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

		try {
			const response = await trans.get(url); // axios 요청을 trans.js를 통해 보냄
			if (response.data.code === 'Ok') {
				console.log(response.data.routes[0].geometry.coordinates);
				return response.data.routes[0].geometry.coordinates;
			}
		} catch (error) {
			console.error('경로를 가져오는 데 실패했습니다:', error);
			return null;
		}
	};
	const drawRouteOnMap = useCallback(
		routeCoordinates => {
			const transformedCoordinates = routeCoordinates.map(coord => fromLonLat(coord)); // 좌표 변환
			const lineString = new LineString(transformedCoordinates);

			const routeFeature = new Feature({
				geometry: lineString,
			});

			routeFeature.setStyle(
				new Style({
					stroke: new Stroke({
						color: '#ffcc33', // 경로 선 색
						width: 4, // 경로 선 두께
					}),
				})
			);

			vectorSource.clear(); // 기존 경로 제거
			vectorSource.addFeature(routeFeature); // 경로 추가
		},
		[vectorSource]
	);

	const disabledPopover = () => {
		const popup = new Overlay({
			element: document.getElementById('popup'),
		});
		const element = popup.getElement();
		let popover = Popover.getInstance(element);
		if (popover) {
			popover.dispose();
		}
	};

	// 경로 검색 버튼 클릭 시 실행
	const handleRouteSearch = useCallback(async () => {
		const params = {
			startSigKorNm,
			startBunji,
			endSigKorNm,
			endBunji,
		};
		console.log(params);
		try {
			const response = await trans.get('admin/api/getAllAddrNm', {
				params: {
					startSigKorNm,
					startBunji,
					endSigKorNm,
					endBunji,
				},
			});
			console.log(response.data); // API 응답 데이터
			const startCoordinates = [response.data[0].longitude, response.data[0].latitude];
			const endCoordinates = [response.data[1].longitude, response.data[1].latitude];

			setStart(startCoordinates);
			setEnd(endCoordinates);
		} catch (error) {
			console.error('경로를 가져오는 데 실패했습니다:', error);
			return null;
		}
		const routeCoordinates = await getRoute(start, end);
		console.log(routeCoordinates);
		if (routeCoordinates) {
			drawRouteOnMap(routeCoordinates);
		}
	}, [start, end, mapObject, startSigKorNm, startBunji, endSigKorNm, endBunji]);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* 검색 패널 */}
			<Box
				sx={{
					width: '300px',
					backgroundColor: 'white',
					padding: 2,
					borderRight: '1px solid #ccc',
					boxShadow: 3,
					height: '100%',
					p: 3,
				}}
			>
				<ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} aria-label="지도 모드 선택" sx={{ mb: 2 }}>
					<ToggleButton value="address">주소 검색</ToggleButton>
					<ToggleButton value="route">길찾기</ToggleButton>
					<ToggleButton value="myLocation" onClick={() => handleUserLocation()}>
						내 위치
					</ToggleButton>
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
							<Grid item xs={6}>
								<TextField label="출발지" variant="outlined" fullWidth value={startSigKorNm} onChange={e => setStartSigKorNm(e.target.value)} />
							</Grid>
							<Grid item xs={6}>
								<TextField label="번지" variant="outlined" fullWidth value={startBunji} onChange={e => setStartBunji(e.target.value)} />
							</Grid>
							{/* 도착지 입력 */}
							<Grid item xs={6}>
								<TextField label="도착지" variant="outlined" fullWidth value={endSigKorNm} onChange={e => setEndSigKorNm(e.target.value)} />
							</Grid>
							<Grid item xs={6}>
								<TextField label="번지" variant="outlined" fullWidth value={endBunji} onChange={e => setEndBunji(e.target.value)} />
							</Grid>
							<Grid item xs={12}>
								<Button variant="contained" color="primary" fullWidth onClick={handleRouteSearch}>
									경로 찾기
								</Button>
							</Grid>
							<List
								sx={{
									width: '100%',
									maxWidth: 360,
									bgcolor: 'text.secondary',
									position: 'relative',
									overflow: 'auto',
									maxHeight: 300,
									boxShadow: 0,
									'& ul': { padding: 0 },
								}}
								subheader={<li />}
							>
								{[0, 1, 2, 3, 4].map(sectionId => (
									<li key={`section-${sectionId}`}>
										<ul>
											<ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
											{[0, 1, 2].map(item => (
												<ListItem key={`item-${sectionId}-${item}`}>
													<ListItemText primary={`Item ${item}`} />
												</ListItem>
											))}
										</ul>
									</li>
								))}
							</List>
						</>
					)}
				</Grid>
			</Box>
			<Box
				ref={mapRef}
				sx={{
					flexGrow: 1,
					height: '100%',
					width: '100%',
					border: '1px solid #ccc',
				}}
			/>
			{/*<button onClick={handleUserLocation}>Click Me!</button>*/}
			<MapPosition longitude={userLocation ? toLonLat(userLocation)[0] : null} latitude={userLocation ? toLonLat(userLocation)[1] : null} />
			<div id="marker" title="Marker"></div>
			<div id="popup"></div>
			<div id={'geolocate'}>zz</div>
			<div id={'geolocation_marker'}></div>
			{/*<button onClick={handleUserLocation}>Click Me!</button>*/}
		</Box>
	);
};

export default OlMap;
