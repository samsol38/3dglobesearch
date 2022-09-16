import React, {
    Fragment,
    useState,
    useEffect,
    useRef
} from 'react';

import {
    useDisclosure,
    useColorMode,
    Heading,
    Box,
    Text,
    Flex,
    Button,
    IconButton
} from "@chakra-ui/react";

import * as topojson from "topojson-client";
import versor from "versor";
import * as d3 from "d3";

import './index.css';

import {
    connect
} from 'react-redux';

import lodash from 'lodash';
import DrawerView from '../drawer';

import Actions from '../../redux/action';
import Constants from '../../utils/Constants';

import * as geolib from 'geolib';

import {
    getVisibility,
    polygonContains,

    // fillLand,
    // fillWater,
    fill,

    stroke,
    strokePath,
    // fillPath
} from './globeutils';

// import * as worldGeoJSON from "../../data/world.geojson";
// import * as countriesTSV from "../../data/countries.tsv";

const {
    MasterDrawerMenuType,
    MasterDrawerMenuConfig
} = Constants;

const MasterGlobeView = (props) => {

    const {
        userConfig
    } = props;

    const [state, setState] = useState({
        selectedMenuType: userConfig?.selectedMenuType ?? MasterDrawerMenuType.Search
    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    const containerRef = useRef();
    const canvasRef = useRef();
    const canvasOpRef = useRef();
    const svgRef = useRef();
    const svgMarkerRef = useRef();

    const globeDataObj = useRef({});
    const elementRefObj = useRef({});
    const pathRefObj = useRef({});

    const updateGlobeData = (data) =>
        globeDataObj.current = {
            ...globeDataObj.current,
            ...data
        };

    const updateElementRef = (data) =>
        elementRefObj.current = {
            ...elementRefObj.current,
            ...data
        };

    const updatePathRef = (data) =>
        pathRefObj.current = {
            ...pathRefObj.current,
            ...data
        };

    /*  Life-cycles Methods */

    useEffect(() => {
        // console.log(containerRef.current.offsetWidth)
        initData();
        return () => {
        };
    }, []);

    useEffect(() => {
        let selectedMenuType = state?.selectedMenuType;
        let selectedPlaceItem = userConfig?.selectedPlaceItem;
        let selectedInputCoordinate = userConfig?.selectedInputCoordinate;

        if (selectedMenuType !== userConfig?.selectedMenuType) {
            updateState({
                selectedMenuType: userConfig?.selectedMenuType
            });
        }

        if (!lodash.isNil(selectedInputCoordinate)) {
            moveMarkerToFindCountryByLatLong(selectedInputCoordinate);
        }

        if (!lodash.isNil(selectedPlaceItem)) {
            showPlaceItem(selectedPlaceItem);
        }

    }, [userConfig]);

    /*  Public Interface Methods */

    const initData = () => {

        globeDataObj.current = {
            scaleFactor: 0.9,
            water: {
                type: 'Sphere'
            },

            angles: {
                x: -20,
                y: 40,
                z: 0
            },

            v0: null,
            r0: null,
            q0: null,

            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,

            currentCountry: null,

            textGroup: null,
            graticuleGroup: null,
            markerGroup: null,
            landGroup: null,

            isDragStop: true,
            markerArray: [
                {
                    id: 'mark1',
                    lat: 0.0,
                    long: 0.0
                }
            ],
            markerLineArray: [],
            markerPolygonArray: [],

            markerSize: 32,
            selectedMarkerID: null,
            transform: d3.zoomIdentity,

            colorWater: '#74ccf4aa',
            colorLand: '#222',
            colorGraticule: '#333',
            colorCountry: '#fff3',
            colorPolygon: '#f003',

            selectedCounytryID: null,
            userCountryID: null,

            canvas: d3.select(canvasRef.current),
            canvasOp: d3.select(canvasOpRef.current),
            svg: d3.select(svgRef.current),
            svgMarker: d3.select(svgMarkerRef.current),
        };

        const {
            canvas,
            canvasOp,
            scaleFactor,
            width,
            height
        } = globeDataObj.current;

        elementRefObj.current = {
            context: canvas.node().getContext('2d'),
            contextOp: canvasOp.node().getContext('2d'),

            projection: d3.geoOrthographic().precision(0.1).clipAngle(90),
            graticule: d3.geoGraticule10()
        };

        const {
            projection,
            context,
            contextOp
        } = elementRefObj.current;

        pathRefObj.current = {
            path: d3.geoPath(projection).context(context),
            tempPath: d3.geoPath(projection),
            pathOp: d3.geoPath(projection).context(contextOp),
        };

        // return;

        loadData((world, countryList) => {
            let land = topojson.feature(world, world?.objects?.land)
            let countries = topojson.feature(world, world?.objects?.countries)

            let names = {};
            // console.log('countries: ', countryList)

            countryList.forEach((d, i) => {
                names[d["country-code"]] = d.name
            });

            updateGlobeData({
                land: land,
                countries: countries,
                countryList: countryList,
                names: names
            });

            window.addEventListener('resize', () => {
                updateState({});
                initDomElements();
                scale();
            })

            initDomElements();
            scale();
        });

        setAngles();

        console.log(width, height)

        canvas
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended),
            )
            .on('click', mouseClicked)
            .on('mousemove', mousemove)
            .call(d3.zoom()
                .scaleExtent([0.8, 8])
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", (event) => {
                    let {
                        canvas,
                        canvasOp,
                        scaleFactor,
                        transform
                    } = globeDataObj.current;

                    let projection;

                    // canvas.attr("transform", event.transform)

                    scaleFactor = event.transform.k;

                    updateGlobeData({
                        transform: event.transform,
                        scaleFactor: scaleFactor
                    });

                    // if (scaleFactor < 2) {
                    //     projection = d3.geoOrthographic().precision(0.1).clipAngle(90);
                    //     // projection = d3.geoMercator()
                    // } else {
                    //     projection = d3.geoMercator()
                    // }

                    // updateProjectionOnZoom(projection);

                    scale()
                    // render()
                }))
    }

    const setAngles = () => {
        let {
            angles
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let rotation = projection.rotate()
        rotation[0] = angles.y
        rotation[1] = angles.x
        rotation[2] = angles.z
        projection.rotate(rotation);

        updateGlobeData({
            angles: angles
        });

        updateElementRef({
            projection: projection
        });
    }

    /*  UI Events Methods   */

    const initDomElements = () => {

        let {
            width,
            height,

            canvas,
            canvasOp,
            scaleFactor,

            svg,
            svgMarker,
            graticuleGroup,
            colorGraticule,

            landGroup,
            textGroup,
            markerGroup,

            countries,
            names,
            markerArray
        } = globeDataObj.current;

        let {
            projection,
            graticule
        } = elementRefObj.current;

        let {
            path
        } = pathRefObj.current;

        width = containerRef.current.offsetWidth;
        height = containerRef.current.offsetHeight;

        canvas.attr('width', width).attr('height', height)
        canvasOp.attr('width', width).attr('height', height)

        projection.fitSize([width, height])
            .translate([width / 2, height / 2]);

        svg.attr("width", width)
            .attr("height", height)

        svgMarker.attr("width", width)
            .attr("height", height)

        updateGlobeData({
            width: width,
            height: height,
            canvas: canvas,
            canvasOp: canvasOp,
            svg: svg,
            svgMarker: svgMarker
        });

        if (!graticuleGroup) {

            graticuleGroup = svg.append("g")
                .attr("id", 'graticule')

            graticuleGroup.append("path")
                .datum(graticule)
                .attr("d", path)
                .attr("stroke-width", "1.5")
                .attr("stroke-dasharray", "5, 2")
                .attr("stroke", colorGraticule)
                .attr("fill", 'transparent')

            updateGlobeData({
                graticuleGroup: graticuleGroup
            });
        }

        if (!landGroup) {
            let defs = svg.append("defs");

            defs.html(`
            <filter 
                id='inset-shadow'>
            <!-- Shadow offset -->
                <feOffset
                    dx='0'
                    dy='0'/>
                <!-- Shadow blur -->
                <feGaussianBlur
                    stdDeviation='15'
                    result='offset-blur'/>
            <!-- Invert drop shadow to make an inset shadow-->
                <feComposite
                    operator='out'
                    in='SourceGraphic'
                    in2='offset-blur'
                    result='inverse'/>
            <!-- Cut colour inside shadow -->
                <feFlood
                    flood-color='#000'
                    flood-opacity='1'
                    result='color'/>
                <feComposite
                    operator='in'
                    in='color'
                    in2='inverse'
                    result='shadow'/>
            <!-- Placing shadow over element -->
                <feComposite
                    operator='over'
                    in='shadow'
                    in2='SourceGraphic'/> 
            </filter>
        `)

            landGroup = svg.append("g")
                .attr("id", 'land');

            updateGlobeData({
                landGroup: landGroup
            });
        }

        svgMarker.selectAll('#maskPath').remove();

        let mask = svgMarker.append("clipPath")
        mask.attr("id", 'maskPath')
        mask.html(`
            <rect width="${width}" height="${height}" x="0" y="0" />
        `);

        if (!textGroup) {

            let defs = svg.append("defs");
            const value = 0.19;

            defs.html(`
            <filter 
                id="blackOutlineEffect"
                color-interpolation-filters="sRGB">
                <feMorphology 
                    in="SourceAlpha" 
                    result="MORPH" 
                    operator="dilate" 
                    radius="2.0" />
                <feColorMatrix 
                    in="MORPH" 
                    result="WHITENED" 
                    type="matrix" 
                    values="-1 0 0 0 ${value}, 0 -1 0 0 ${value}, 0 0 -1 0 ${value}, 0 0 0 1 0" />
                <feMerge>
                    <feMergeNode 
                        in="WHITENED" />
                    <feMergeNode 
                        in="SourceGraphic" />
                </feMerge>
            </filter>
        `);

            textGroup = svgMarker.append("g")
                .attr("id", 'text')
                .attr("clip-path", "url(#maskPath)");

            textGroup.selectAll("text")
                .data(countries?.features)
                .enter()
                .append("text")
                .attr("id", function (d) {
                    // console.log(d.id)
                    return `id${parseInt(d?.id)}`;
                })
                .attr("fill", "#fff")
                .attr("x", (d) => {
                    return path.centroid(d)[0];
                })
                .attr("y", (d) => {
                    return path.centroid(d)[1];
                })
                .attr("filter", "url(#blackOutlineEffect)")
                .attr("text-anchor", "middle")
                .attr("font-size", "13.6px")
                .attr("font-family", "Verdana")
                .text(function (d) {
                    return names[`${d.id}`];
                });
        }

        updateGlobeData({
            textGroup: textGroup
        });

        if (!markerGroup) {

            markerGroup = svgMarker.append("g")
                .attr("id", 'marker');

            updateGlobeData({
                markerGroup: markerGroup
            });

            reloadMarker();
        }

        updateElementRef({
            projection: projection
        });

        updateGlobeData({
            svg: svg,
            svgMarker: svgMarker
        });
    }

    const scale = () => {
        let {
            width,
            height,

            canvas,
            canvasOp,
            scaleFactor,

            svg,
            svgMarker,
            graticuleGroup,
            colorGraticule,

            landGroup,
            textGroup,
            markerGroup,

            countries,
            names,
            markerArray
        } = globeDataObj.current;

        let {
            projection,
            graticule
        } = elementRefObj.current;

        let {
            path
        } = pathRefObj.current;

        projection
            .scale((scaleFactor * Math.min(width, height)) / 2);

        updateElementRef({
            projection: projection
        });

        // render();
        window.requestAnimationFrame(render);
    }


    const reloadMarker = () => {

        let {
            markerGroup,
            markerArray,
            markerSize,
            selectedMarkerID
        } = globeDataObj.current;

        let {
            projection,
            graticule
        } = elementRefObj.current;

        let {
            path,
            tempPath
        } = pathRefObj.current;

        markerGroup.selectAll("image").remove();

        markerGroup.selectAll("image")
            .data(markerArray)
            .enter()
            .append("image")
            .attr('width', markerSize)
            .attr('height', markerSize)
            .attr('id', (d) => {
                return d.id
            })
            .attr('visibility', (d) => {
                return getVisibility(tempPath, d)
            })
            .attr('pointer-events', "visiblePainted")
            .attr("xlink:href", (d) => {
                let {
                    selectedMarkerID
                } = globeDataObj.current;

                return selectedMarkerID ?
                    (selectedMarkerID === d.id ?
                        'assets/map-pin_selected-v2.svg' : 'assets/map-pin-v2.svg')
                    : 'assets/map-pin-v2.svg';
            })
            .attr("transform", (d) => {
                let {
                    projection,
                } = elementRefObj.current;

                let p = projection([d.long, d.lat]);
                return `translate(${p[0] - markerSize / 2}, ${p[1] - markerSize}) `;
            })
            .call(d3.drag()
                .on('start', (event) => {
                    markerDragEvent(event)
                })
                .on('drag', (event) => {
                    markerDragEvent(event);
                })
                .on('end', (event) => {
                    markerDragEvent(event);
                    updateGlobeData({
                        selectedMarkerID: null
                    });

                    // let {
                    //     canvas,
                    //     svgMarker
                    // } = globeDataObj.current;

                    // let country = getCountry(event);
                    // let selectedCountryCode = userConfig?.selectedCountryCode;
                    // let selectedPlaceCoordinate = null;
                    // let isPlaceVisible = false;

                    // let position = projection.invert(d3.pointer(event, svgMarker.node()));
                    // selectedPlaceCoordinate = {
                    //     latitude: `${position[1].toFixed(8)}`,
                    //     longitude: `${position[0].toFixed(8)}`
                    // };

                    // if (!lodash.isNil(country)) {
                    //     let updatedCountryCode = country?.id;
                    //     props.setUserConfig({
                    //         ...userConfig,
                    //         selectedPlaceItem: null,
                    //         isPlaceVisible: true,
                    //         selectedCountryCode: updatedCountryCode,
                    //         selectedInputCoordinate: null,
                    //         selectedPlaceCoordinate: selectedPlaceCoordinate
                    //     });
                    // } else {
                    //     props.setUserConfig({
                    //         ...userConfig,
                    //         selectedPlaceItem: null,
                    //         isPlaceVisible: false,
                    //         selectedCountryCode: null,
                    //         selectedInputCoordinate: null,
                    //         selectedPlaceCoordinate: selectedPlaceCoordinate
                    //     });
                    // }

                    reloadMarker();
                    reloadMarkerLineArray();
                    renderMarker();
                    addClickedMarkerToFindCountry(event);
                })
            );

        updateGlobeData({
            markerGroup: markerGroup
        });
    }

    const markerDragEvent = (event) => {
        let {
            markerGroup,
            markerArray,
            svgMarker,
            selectedMarkerID
        } = globeDataObj.current;

        let {
            projection,
        } = elementRefObj.current;

        markerGroup.selectAll("image").remove();
        updateGlobeData({
            markerGroup: markerGroup
        });

        let pos = projection.invert(d3.pointer(event, svgMarker.node()));

        let markerID = event.subject.id;
        let markerIndex = markerArray.findIndex((item) => {
            return item.id === markerID
        });

        selectedMarkerID = markerID;

        // console.log("markerID: ", markerID)
        markerArray[markerIndex] =
        {
            id: markerID,
            long: pos[0],
            lat: pos[1]
        };

        // console.log("markerArray: ", markerArray)

        markerArray = markerArray.slice();
        updateGlobeData({
            markerArray: markerArray,
            selectedMarkerID: selectedMarkerID
        });

        reloadMarker();
        reloadMarkerLineArray();
        renderMarker();
        mousemove(event);
    }

    const render = () => {

        let {
            width,
            height,
            colorWater,
            colorGraticule,
            colorLand,
            colorPolygon,
            water,
            land,
            countries,
            markerLineArray,
            markerPolygonArray,

            currentCountry,
            scaleFactor,
            markerSize,

            textGroup,
            landGroup,
            markerGroup,
            selectedCounytryID
        } = globeDataObj.current;

        let {
            projection,
            graticule,
            context,
            contextOp
        } = elementRefObj.current;

        let {
            path,
            pathOp,
            tempPath
        } = pathRefObj.current;

        context.clearRect(0, 0, width, height);
        contextOp.clearRect(0, 0, width, height);

        fill({
            context,
            path
        }, water, colorWater);

        stroke({
            context,
            path
        }, graticule, colorGraticule);

        // console.log("land: ", land)
        fill({
            context,
            path
        }, land, colorLand);

        stroke({
            context,
            path
        }, countries, '#fff6')

        if (markerLineArray.length > 1) {
            markerLineArray.forEach((item) => {
                strokePath({
                    contextOp,
                    pathOp
                }, item, '#f00')
            });
        }

        textGroup.selectAll("text").attr("opacity", `${scaleFactor > 2 ? 1 : 0}`);
        landGroup.selectAll("path").remove();

        renderMarker();
        renderSelectedCountry();

        updateGlobeData({
            textGroup: textGroup,
            landGroup: landGroup,
            markerGroup: markerGroup
        });

        // renderText();
        if (scaleFactor >= 2) {
            renderText();
        }
    }

    const renderMarker = () => {
        let {
            markerGroup,
            markerSize
        } = globeDataObj.current;

        let {
            tempPath
        } = pathRefObj.current;

        markerGroup.selectAll("image")
            .attr('visibility', (d) => {
                return getVisibility(tempPath, d)
            })
            .attr("transform", (d) => {
                let {
                    projection,
                } = elementRefObj.current;

                let p = projection([d.long, d.lat]);
                return `translate(${p[0] - markerSize / 2}, ${p[1] - markerSize})`;
            })
    }

    const renderSelectedCountry = () => {

        let {
            currentCountry,
            textGroup,
            selectedCounytryID
        } = globeDataObj.current;

        let {
            path
        } = pathRefObj.current;

        if (currentCountry) {
            showCountry();

            selectedCounytryID = `text#id${parseInt(currentCountry.id)}`;
            textGroup.selectAll(selectedCounytryID)
                .attr("opacity", 1)
                .attr("x", (d1) => {
                    return path.centroid(d1)[0];
                })
                .attr("y", (d1) => {
                    return path.centroid(d1)[1];
                });
        }

        updateGlobeData({
            textGroup: textGroup
        });
    }

    const showCountry = () => {
        let {
            landGroup,
            currentCountry
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        // landGroup.selectAll("path").remove();

        landGroup.selectAll("path")
            .data([currentCountry])
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .attr("fill", '#555')
            .attr("stroke-width", "1.85")
            .attr("stroke-dasharray", "5,3")
            .attr("stroke", '#ccc')
            .attr("filter", "url(#inset-shadow)")

        updateGlobeData({
            landGroup: landGroup
        });
    }

    const renderText = () => {

        let {
            textGroup
        } = globeDataObj.current;

        let {
            path,
            tempPath
        } = pathRefObj.current;

        textGroup.selectAll("text")
            .attr("x", (d) => {
                return path.centroid(d)[0];
            })
            .attr("y", (d) => {
                return path.centroid(d)[1];
            });

        updateGlobeData({
            textGroup: textGroup
        });
    }

    const mousemove = (event) => {

        let {
            currentCountry
        } = globeDataObj.current;

        let c = getCountry(event);

        if (!c) {
            if (currentCountry) {
                currentCountry = null;
                updateGlobeData({
                    currentCountry: currentCountry
                });
                // render()
                window.requestAnimationFrame(render);
            }
            return
        }
        if (c === currentCountry) {
            return
        }
        currentCountry = c
        updateGlobeData({
            currentCountry: currentCountry
        });

        // render();
        window.requestAnimationFrame(render);
    }

    const mouseClicked = (event) => {
        // addClickedMarker(event);
        addClickedMarkerToFindCountry(event);
    }

    const dragstarted = (event) => {

        let {
            scaleFactor,
            transform
        } = globeDataObj.current;

        let {
            v0,
            r0,
            q0,
            canvas
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        v0 = versor.cartesian(projection
            .invert(d3.pointer(event, canvas.node())))
        r0 = projection.rotate()
        q0 = versor(r0)
        // stopRotation()

        updateGlobeData({
            v0: v0,
            r0: r0,
            q0: q0
        });

        updateElementRef({
            projection: projection
        });
    }

    const dragged = (event) => {
        let {
            v0,
            r0,
            q0,
            canvas
        } = globeDataObj.current;

        // return;

        let {
            projection
        } = elementRefObj.current;

        let v1 = versor.cartesian(projection.rotate(r0)
            .invert(d3.pointer(event, canvas.node())))
        let q1 = versor.multiply(q0, versor.delta(v0, v1))
        let r1 = versor.rotation(q1);
        // r1[1] = 0
        r1[2] = 0
        projection.rotate(r1)

        updateElementRef({
            projection: projection
        });

        // render()
        window.requestAnimationFrame(render);
    }

    const dragended = () => {
        // startRotation(rotationDelay)
    }

    const addClickedMarker = (event) => {
        let {
            width,
            height,
            canvas,
            markerArray
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let pos = projection.invert(d3.pointer(event, canvas.node()));
        let center = projection.invert([width / 2, height / 2])

        updateElementRef({
            projection: projection
        });

        // console.log(center)

        d3.transition()
            .duration(1000)
            .tween("rotate", () => {
                const r = d3.interpolate([-center[0], -center[1]], [-pos[0], -pos[1]]);
                return (t) => {
                    let {
                        projection
                    } = elementRefObj.current;

                    projection.rotate(r(t));
                    updateElementRef({
                        projection: projection
                    });
                    // render();
                    window.requestAnimationFrame(render);
                };
            }).on("end", () => {
                let {
                    markerArray
                } = globeDataObj.current;

                let placeObj = {
                    id: `mark${markerArray.length + 1}`,
                    long: pos[0],
                    lat: pos[1]
                };

                markerArray.push(placeObj);
                updateGlobeData({
                    markerArray: markerArray
                });

                reloadMarkerLineArray();
                reloadMarker();
                // render();
                window.requestAnimationFrame(render);
            });
    }

    const moveMarkerToFindCountryByLatLong = (coordinates) => {
        let {
            width,
            height,
            canvas,
            markerArray,
            markerGroup,
            svgMarker
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let country = getCountryFromCoordinates(coordinates);
        let selectedCountryCode = null;
        let selectedPlaceCoordinate = null;
        let isPlaceVisible = false;
        selectedPlaceCoordinate = coordinates;

        if (!lodash.isNil(country)) {

            selectedCountryCode = country?.id;
            isPlaceVisible = true;
        }

        props.setUserConfig({
            ...userConfig,
            selectedInputCoordinate: null,
            isPlaceVisible: isPlaceVisible,
            selectedCountryCode: selectedCountryCode,
            selectedPlaceCoordinate: selectedPlaceCoordinate
        });

        let pos = [parseFloat(coordinates?.longitude), parseFloat(coordinates?.latitude)]
        let center = projection.invert([width / 2, height / 2])

        updateElementRef({
            projection: projection
        });

        // console.log(center)
        markerArray = [];

        let placeObj = {
            id: `mark${markerArray.length + 1}`,
            long: pos[0],
            lat: pos[1]
        };

        markerArray.push(placeObj);

        updateGlobeData({
            markerArray: markerArray
        });

        reloadMarkerLineArray();
        reloadMarker();
        renderMarker();

        d3.transition()
            .duration(1000)
            .tween("rotate", () => {
                const r = d3.interpolate([-center[0], -center[1]], [-pos[0], -pos[1]]);
                return (t) => {
                    let {
                        projection
                    } = elementRefObj.current;

                    projection.rotate(r(t));
                    updateElementRef({
                        projection: projection
                    });

                    // render();
                    window.requestAnimationFrame(render);
                };
            }).on("end", () => {

            });
    }

    const addClickedMarkerToFindCountry = async (event) => {
        let {
            width,
            height,
            canvas,
            markerArray
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let country = getCountry(event);
        let selectedCountryCode = null;
        let selectedPlaceCoordinate = null;
        let isPlaceVisible = false;
        let pos = projection.invert(d3.pointer(event, canvas.node()));

        // console.log("pos: ", pos);

        if (!lodash.isNil(country)) {
            selectedCountryCode = country?.id;
            isPlaceVisible = true;
        }

        selectedPlaceCoordinate = {
            latitude: `${pos[1].toFixed(8)}`,
            longitude: `${pos[0].toFixed(8)}`
        };

        await props.setUserConfig({
            ...userConfig,
            selectedInputCoordinate: null,
            isPlaceVisible: isPlaceVisible,
            selectedCountryCode: selectedCountryCode,
            selectedPlaceCoordinate: selectedPlaceCoordinate
        });

        let center = projection.invert([width / 2, height / 2])

        updateElementRef({
            projection: projection
        });

        // console.log(center)
        markerArray = [];

        let placeObj = {
            id: `mark${markerArray.length + 1}`,
            long: pos[0],
            lat: pos[1]
        };

        markerArray.push(placeObj);
        updateGlobeData({
            markerArray: markerArray
        });

        reloadMarkerLineArray();
        reloadMarker();
        renderMarker();

        d3.transition()
            .duration(1000)
            .tween("rotate", () => {
                const r = d3.interpolate([-center[0], -center[1]], [-pos[0], -pos[1]]);
                return (t) => {
                    let {
                        projection
                    } = elementRefObj.current;

                    projection.rotate(r(t));
                    updateElementRef({
                        projection: projection
                    });
                    window.requestAnimationFrame(render);
                };
            }).on("end", () => {

            });
    }

    const showPlaceItem = (placeItem) => {
        let {
            width,
            height,
            canvas,
            markerArray
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let center = projection.invert([width / 2, height / 2])

        updateElementRef({
            projection: projection
        });

        // console.log(center)

        markerArray = [];

        let placeObj = {
            id: `mark${markerArray.length + 1}`,
            long: placeItem.longitude,
            lat: placeItem.latitude
        };

        markerArray.push(placeObj);
        updateGlobeData({
            markerArray: markerArray
        });

        reloadMarkerLineArray();
        reloadMarker();
        renderMarker();

        d3.transition()
            .duration(1000)
            .tween("rotate", () => {
                const r = d3.interpolate([-center[0], -center[1]],
                    [-placeItem.longitude, -placeItem.latitude]);
                return (t) => {
                    let {
                        projection
                    } = elementRefObj.current;

                    projection.rotate(r(t));
                    updateElementRef({
                        projection: projection
                    });

                    // render();
                    window.requestAnimationFrame(render);
                };
            }).on("end", () => {

            });
    }

    const reloadMarkerLineArray = () => {

        let {
            markerLineArray,
            markerArray,
            markerPolygonArray
        } = globeDataObj.current;

        markerLineArray = [];
        markerPolygonArray = [];

        if (markerArray.length > 1) {
            let coordinateArray = [];
            markerArray.forEach((item, index) => {
                let lineObj;
                if (index === markerArray.length - 1) {
                    lineObj = {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [[item.long, item.lat],
                            [markerArray[0].long, markerArray[0].lat]]
                        }
                    }
                } else if (markerArray.length > 2) {
                    lineObj = {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [[item.long, item.lat],
                            [markerArray[index + 1].long, markerArray[index + 1].lat]]
                        }
                    }
                }

                markerLineArray.push(lineObj);
                coordinateArray.push([item.long, item.lat]);
            });

            if (coordinateArray.length > 2) {
                coordinateArray.push([markerArray[0].long, markerArray[0].lat]);
                let polygonObj = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: 'MultiPolygon',
                                coordinates: [[coordinateArray]]
                            }
                        }
                    ]
                };

                markerPolygonArray.push(polygonObj);
            }
        }

        updateGlobeData({
            markerLineArray: markerLineArray,
            markerPolygonArray: markerPolygonArray
        });
    }

    const getCountry = (event) => {
        let {
            countries,
            canvas
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let pos = projection.invert(d3.pointer(event, canvas.node()))
        // console.log("pos: ", pos)

        return countries?.features.find((f) => {
            return f.geometry.coordinates.find((c1) => {
                return polygonContains(c1, pos) || c1.find((c2) => {
                    return polygonContains(c2, pos)
                })
            })
        });
    }

    const getCountryFromCoordinates = (coordinates) => {
        let {
            countries,
            canvas
        } = globeDataObj.current;

        let {
            projection
        } = elementRefObj.current;

        let pos = [coordinates?.longitude, coordinates?.latitude]
        // console.log("pos: ", pos)

        return countries?.features.find((f) => {
            return f.geometry.coordinates.find((c1) => {
                return polygonContains(c1, pos) || c1.find((c2) => {
                    return polygonContains(c2, pos)
                })
            })
        })
    }

    /*  Server Request Methods  */

    const loadData = (callback) => {
        //https://unpkg.com/world-atlas@1/world/110m.json

        d3.json("data/world.geojson").then((world) => {
            d3.tsv("data/countries.tsv").then((countries) => {
                callback(world, countries)
            });
        });
    }

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const renderMasterContainer = () => {
        return (
            <>
                <Flex
                    ref={containerRef}
                    flex={1}
                    bg={'#000'}
                    // zIndex={10}
                    className="globeContainer">
                    <canvas
                        ref={canvasRef}
                        className="globe"></canvas>
                    <svg
                        ref={svgRef}
                        className="globesvg"></svg>
                    <canvas
                        ref={canvasOpRef}
                        className="operation"></canvas>
                    <svg
                        ref={svgMarkerRef}
                        className="globesvg"></svg>
                </Flex>
            </>
        )
    }


    return renderMasterContainer()
};

const mapStateToProps = state => {
    return {
        userConfig: state.userConfig,
        userPref: state.userPref,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUserConfig: (userConfig) => dispatch(Actions.setUserConfig(userConfig)),
        setUserPref: (userPref) => dispatch(Actions.setUserPref(userPref))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterGlobeView);
