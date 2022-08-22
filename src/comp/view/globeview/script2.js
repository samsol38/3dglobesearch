//
// Configuration
//

// ms to wait after dragging before auto-rotating
var rotationDelay = 3000
// scale of the globe (not the canvas element)
var scaleFactor = 0.9
// autorotation speed
var degPerSec = 6
// start angles
var angles = { x: -20, y: 40, z: 0 }
// colors
var colorWater = '#74ccf4aa'
var colorLand = '#222'
var colorGraticule = '#333'
var colorCountry = '#fff3'
let selectedCounytryID = null;
var userCountryID = null;

//
// Handler
//

function enter(country) {
    // userCountryID = country.id;
    var country = countryList.find(function (c) {
        return parseInt(c.id, 10) === parseInt(country.id, 10)
    })
    current.text(country && country.name || '')

}

function leave(country) {
    current.text('')
}

//
// Variables
//

var current = d3.select('#current')
var canvas = d3.select('#globe')
var canvasOp = d3.select('#operation')
var context = canvas.node().getContext('2d')
var contextOp = canvasOp.node().getContext('2d')
var water = { type: 'Sphere' }
var projection = d3.geoOrthographic().precision(0.1).clipAngle(90)
var graticule = d3.geoGraticule10()
// var graticule = d3.geoGraticule().step([13, 13])
var path = d3.geoPath(projection).context(context);
var tempPath = d3.geoPath(projection);
var pathOp = d3.geoPath(projection).context(contextOp);
// var svg = d3.select("#name").append("svg")

var svg = d3.select("#globesvg").append("svg")
// var g = svg.append("g");
var v0 // Mouse position in Cartesian coordinates at start of drag gesture.
var r0 // Projection rotation as Euler angles at start.
var q0 // Projection rotation as versor at start.
var lastTime = d3.now()
var degPerMs = degPerSec / 1000
var width, height
var land, countries
var countryList
var autorotate, now, diff, roation
var currentCountry
var names = {};
let countryLocations = {};
let textGroup, graticuleGroup;
let markerGroup;
var isDragStop = true;
let landGroup;
let markerArray = [];
let markerLineArray = [];

let markerSize = 40;
let selectedMarkerID = null;

// var centroids = {};
//
// Functions
//

function setAngles() {
    var rotation = projection.rotate()
    rotation[0] = angles.y
    rotation[1] = angles.x
    rotation[2] = angles.z
    projection.rotate(rotation)
}

function scale() {
    width = document.documentElement.clientWidth
    height = document.documentElement.clientHeight
    canvas.attr('width', width).attr('height', height)
    canvasOp.attr('width', width).attr('height', height)

    projection
        .scale((scaleFactor * Math.min(width, height)) / 2)
        .translate([width / 2, height / 2]);

    svg.attr("width", width)
        .attr("height", height)

    if (!graticuleGroup) {

        // console.log(graticule)

        graticuleGroup = svg.append("g")
            .attr("id", 'graticule')

        graticuleGroup.append("path")
            .datum(graticule)
            .attr("d", path)
            .attr("stroke-width", "1.5")
            .attr("stroke-dasharray", "5, 2")
            .attr("stroke", colorGraticule)
            .attr("fill", 'transparent')
    }



    if (!landGroup) {
        var defs = svg.append("defs");

        // var filter = defs.append("filter")
        //     .attr("id", "dropshadow")

        // filter.append("feGaussianBlur")
        //     .attr("in", "SourceAlpha")
        //     .attr("stdDeviation", 4)
        //     .attr("result", "blur");
        // filter.append("feOffset")
        //     .attr("in", "blur")
        //     .attr("dx", 2)
        //     .attr("dy", 2)
        //     .attr("result", "offsetBlur");

        // var feMerge = filter.append("feMerge");


        defs.html(`
        <filter id='inset-shadow'>
        <!-- Shadow offset -->
        <feOffset
                dx='0'
                dy='0'
              />
        <!-- Shadow blur -->
      <feGaussianBlur
                stdDeviation='15'
                result='offset-blur'
              />
        <!-- Invert drop shadow to make an inset shadow-->
        <feComposite
                operator='out'
                in='SourceGraphic'
                in2='offset-blur'
                result='inverse'
              />
        <!-- Cut colour inside shadow -->
        <feFlood
                flood-color='#000'
                flood-opacity='1'
                result='color'
              />
        <feComposite
                operator='in'
                in='color'
                in2='inverse'
                result='shadow'
              />
        <!-- Placing shadow over element -->
        <feComposite
                operator='over'
                in='shadow'
                in2='SourceGraphic'
              /> 
      </filter>`)

        // feMerge.append("feMergeNode")
        //     .attr("in", "offsetBlur")
        // feMerge.append("feMergeNode")
        //     .attr("in", "SourceGraphic");

        landGroup = svg.append("g")
            .attr("id", 'land');
    }

    if (!textGroup) {
        textGroup = svg.append("g")
            .attr("id", 'text');

        textGroup.selectAll("text")
            .data(countries.features)
            .enter()
            .append("text")
            .attr("id", function (d) {
                // console.log(d.id)
                return `id${parseInt(d.id)}`;
            })
            .attr("fill", "#fff")
            .attr("x", (d) => {
                // console.log(path.centroid(d))
                return path.centroid(d)[0];
            })
            .attr("y", (d) => {
                return path.centroid(d)[1];
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-family", "Verdana")
            // .attr("opacity", "0")
            // .attr("stroke", '#0001')
            // .attr("stroke-width", '1px')
            .text(function (d) {
                return names[`${d.id}`];
            });
    }

    if (!markerGroup) {

        markerArray = [
            // {
            //     id: 'mark1',
            //     long: 22,
            //     lat: 42
            // }, // Kumanovo
            // {
            //     long: 21,
            //     lat: 41.500
            // }, // Skopje
            // {
            //     long: 20.400,
            //     lat: 80.500
            // }, // Belgrade
            // {
            //     long: 20,
            //     lat: 41.500
            // }
        ];


        markerGroup = svg.append("g")
            .attr("id", 'marker');

        reloadMarker();
    }

    render()
}

function reloadMarker() {
    markerGroup.selectAll("image").remove();

    markerGroup.selectAll("image")
        .data(markerArray)
        .enter()
        .append("image")
        .attr('width', markerSize)
        .attr('height', markerSize)
        .attr('id', function (d) {
            return d.id
        })
        .attr('visibility', function (d) {
            return getVisibility(d)
        })
        .attr('pointer-events', "visiblePainted")
        .attr("xlink:href", function (d) {
            var markerID = d3.select(this).attr("id");
            return selectedMarkerID ?
                (selectedMarkerID === markerID ?
                    './data/map-pin_selected.svg' : './data/map-pin.svg')
                : './data/map-pin.svg';
        })
        .attr("transform", (d) => {
            let p = projection([d.long, d.lat]);
            return `translate(${p[0] - markerSize / 2}, ${p[1] - markerSize / 2}) `;
        })
        .call(d3.drag()
            .on('start', function () {
                markerGroup.selectAll("image").remove();
                var pos = projection.invert(d3.mouse(this));

                var markerID = d3.select(this).attr("id");
                var markerIndex = markerArray.findIndex(function (item) {
                    return item.id === markerID
                });

                selectedMarkerID = markerID;

                // console.log("pos: ", pos)

                markerArray[markerIndex] =
                {
                    id: markerID,
                    long: pos[0],
                    lat: pos[1]
                };

                markerArray = markerArray.slice();

                reloadMarker();
                reloadMarkerLineArray();
                render();
            })
            .on('drag', function () {
                markerGroup.selectAll("image").remove();
                var pos = projection.invert(d3.mouse(this));

                var markerID = d3.select(this).attr("id");
                var markerIndex = markerArray.findIndex(function (item) {
                    return item.id === markerID
                });

                selectedMarkerID = markerID;
                // console.log(markerID, markerIndex)

                markerArray[markerIndex] =
                {
                    id: markerID,
                    long: pos[0],
                    lat: pos[1]
                };

                markerArray = markerArray.slice();

                reloadMarker();
                reloadMarkerLineArray();
                render();
                // console.log(pos)

            })
            .on('end', function () {
                markerGroup.selectAll("image").remove();
                var pos = projection.invert(d3.mouse(this));

                var markerID = d3.select(this).attr("id");
                var markerIndex = markerArray.findIndex(function (item) {
                    return item.id === markerID
                });
                // console.log(pos)

                selectedMarkerID = null;
                markerArray[markerIndex] =
                {
                    id: markerID,
                    long: pos[0],
                    lat: pos[1]
                };

                markerArray = markerArray.slice();

                reloadMarker();
                reloadMarkerLineArray();
                render();

            })
        );
}

function startRotation(delay) {
    // autorotate.restart(rotate, delay || 0)
}

function stopRotation() {
    // autorotate.stop()
}

function dragstarted() {

    v0 = versor.cartesian(projection.invert(d3.mouse(this)))
    r0 = projection.rotate()
    q0 = versor(r0)
    // stopRotation()
}

function dragged() {
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)))
    var q1 = versor.multiply(q0, versor.delta(v0, v1))
    var r1 = versor.rotation(q1);
    // r1[1] = 0
    r1[2] = 0
    projection.rotate(r1)
    render()
}

function dragended() {
    startRotation(rotationDelay)
}

function getVisibility(d) {
    // console.log(d)
    const visible = tempPath(
        { type: 'Point', coordinates: [d.long, d.lat] });

    return visible ? 'visible' : 'hidden';
}

function render() {
    context.clearRect(0, 0, width, height)
    contextOp.clearRect(0, 0, width, height)
    fill(water, colorWater)
    stroke(graticule, colorGraticule)
    fill(land, colorLand)
    stroke(countries, '#fff6')

    if (markerLineArray.length > 0) {
        for (var i = 0; i < markerLineArray.length; i++) {
            strokePath(markerLineArray[i], '#f00')
        }
    }

    textGroup.selectAll("text").attr("opacity", `${scaleFactor > 2 ? 1 : 0}`);
    landGroup.selectAll("path").remove();

    markerGroup.selectAll("image")
        .attr('visibility', function (d) {
            return getVisibility(d)
        })
        .attr("transform", function (d) {
            let p = projection([d.long, d.lat]);
            return `translate(${p[0] - markerSize / 2}, ${p[1] - markerSize / 2})`;
        })

    if (currentCountry) {
        // fill(currentCountry, colorCountry)
        // stroke(currentCountry, '#fff')
        showCountry();

        // console.log(currentCountry.id)

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


    if (scaleFactor >= 2) {
        renderText();
    }

}

function showCountry() {
    landGroup.selectAll("path").remove();

    landGroup.selectAll("path")
        .data([currentCountry])
        .enter()
        .append("path")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", '#555')
        .attr("stroke-width", "0.4")
        .attr("stroke-dasharray", "5, 2")
        .attr("stroke", '#fff')
        .attr("filter", "url(#inset-shadow)")
}

function renderText() {
    textGroup.selectAll("text")
        .attr("x", (d) => {
            return path.centroid(d)[0];
        })
        .attr("y", (d) => {
            return path.centroid(d)[1];
        })
}

function fillLand(obj, color) {
    context.beginPath()
    path(obj)
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 5;
    context.shadowColor = '#0008';

    // const img = new Image();
    // img.src = './data/tt3.png';

    // const pattern = context.createPattern(img, 'repeat');
    // context.fillStyle = pattern;

    var lingrad = context.createLinearGradient(0, 0, width, height);

    // // addColorStop(position, color) position = 0.0 and 1.0
    lingrad.addColorStop(0, '#333');
    lingrad.addColorStop(0.2, '#000a');
    lingrad.addColorStop(0.4, '#333');
    lingrad.addColorStop(0.8, '#000d');
    lingrad.addColorStop(1, '#333');

    // var grd = context.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, height / 4);
    // grd.addColorStop(0, "#000f");
    // grd.addColorStop(0.3, "#000a");
    // grd.addColorStop(0.5, "#0000");
    // grd.addColorStop(0.7, "#000d");
    // grd.addColorStop(1, "#000a");

    // assign gradients to fill and stroke styles
    context.fillStyle = lingrad;

    // context.fillStyle = color
    context.fill()
}

function fillWater(obj, color) {
    context.beginPath()
    path(obj)
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 5;
    context.shadowColor = '#0008';

    const img = new Image();
    img.src = './data/tt2.png';

    const pattern = context.createPattern(img, 'repeat');
    context.fillStyle = pattern;
    // context.fillStyle = color
    context.fill()
}

function fill(obj, color) {
    context.beginPath()
    path(obj)

    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 5;
    context.shadowColor = '#0008';

    // const img = new Image();
    // img.src = './data/tt2.png';

    // const pattern = context.createPattern(img, 'repeat');
    // context.fillStyle = pattern;
    context.fillStyle = color
    context.fill()
}

function stroke(obj, color) {
    context.beginPath()
    path(obj)
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    // context.shadowColor = '#0008';
    context.lineWidth = 0.6;
    context.setLineDash([3, 2])
    context.strokeStyle = color;
    context.stroke()
}

function strokePath(obj, color) {
    contextOp.beginPath()
    pathOp(obj)
    contextOp.shadowBlur = 0;
    contextOp.shadowOffsetX = 0;
    contextOp.shadowOffsetY = 0;
    // context.shadowColor = '#0008';
    contextOp.lineWidth = 1.5;
    contextOp.setLineDash([4, 2])
    contextOp.strokeStyle = color;
    contextOp.stroke()
}

function showText(obj) {
    context.beginPath()
    path(obj)

    context.fillStyle = '#00f';
    context.fillText(obj.name, obj.centroid[0], obj.centroid[1]);
    // console.log("obj: ", obj)
    // context.lineWidth = 0.5;
    // context.setLineDash([3, 2])

    // context.stroke()
}

function rotate(elapsed) {
    now = d3.now()
    diff = now - lastTime
    if (diff < elapsed) {
        rotation = projection.rotate()
        rotation[0] += diff * degPerMs
        projection.rotate(rotation)
        render()
    }
    lastTime = now
}

function loadData(cb) {
    //https://unpkg.com/world-atlas@1/world/110m.json
    d3.json('./data/world.geojson', function (error, world) {
        if (error) throw error
        d3.tsv('./data/countries.tsv', function (error, countries) {
            if (error) throw error
            cb(world, countries)
        })
    })
}

// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
    var n = polygon.length
    var p = polygon[n - 1]
    var x = point[0], y = point[1]
    var x0 = p[0], y0 = p[1]
    var x1, y1
    var inside = false
    for (var i = 0; i < n; ++i) {
        p = polygon[i], x1 = p[0], y1 = p[1]
        if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
        x0 = x1, y0 = y1
    }
    return inside
}

function mousemove() {
    var c = getCountry(this)
    if (!c) {
        if (currentCountry) {
            leave(currentCountry)
            currentCountry = undefined
            render()
        }
        return
    }
    if (c === currentCountry) {
        return
    }
    currentCountry = c
    render()
    enter(c)
}

function mouseClicked() {
    addClickedMarker(this);

}

function reloadMarkerLineArray() {
    markerLineArray = [];

    if (markerArray.length > 1) {
        for (var i = 0; i < markerArray.length; i++) {
            let lineObj;
            if (i === markerArray.length - 1) {
                lineObj = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[markerArray[i].long, markerArray[i].lat],
                        [markerArray[0].long, markerArray[0].lat]]
                    }
                }
            } else if (markerArray.length > 2) {
                lineObj = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[markerArray[i].long, markerArray[i].lat],
                        [markerArray[i + 1].long, markerArray[i + 1].lat]]
                    }
                }
            }
            markerLineArray.push(lineObj);
        }
    }
}

function addClickedMarker(event) {

    var pos = projection.invert(d3.mouse(event));
    let center = projection.invert([width / 2, height / 2])

    // console.log(center)

    d3.transition()
        .duration(1000)
        .tween("rotate", function () {
            const r = d3.interpolate([-center[0], -center[1]], [-pos[0], -pos[1]]);
            return function (t) {
                projection.rotate(r(t));
                render();
            };
        }).on("end", function () {
            // let placeObj = {
            //     id: `mark${markerArray.length + 1}`,
            //     long: pos[0],
            //     lat: pos[1]
            // };
            // markerArray.push(placeObj);
            // reloadMarkerLineArray();
            // reloadMarker();
            // render();
        });
}

function getCountry(event) {
    var pos = projection.invert(d3.mouse(event))

    // console.log("pos: ", pos)

    return countries.features.find(function (f) {
        return f.geometry.coordinates.find(function (c1) {
            return polygonContains(c1, pos) || c1.find(function (c2) {
                return polygonContains(c2, pos)
            })
        })
    })
}


//
// Initialization
//

setAngles()

canvas
    .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    )
    .on('click', mouseClicked)
    .on('mousemove', mousemove)
    .on("wheel", function (d) {
        var direction = d3.event.wheelDelta < 0 ? 'down' : 'up';
        // zoom(direction === 'up' ? d : d.parent);
        // alert(direction)

        let scaleNum = 0.35;

        if (direction === 'up') {
            if (scaleFactor > 10) {
                return
            }
            scaleFactor = scaleFactor + scaleNum;
        } else {
            if (scaleFactor < 0.9) {
                return
            }
            scaleFactor = scaleFactor - scaleNum;

        }
        scale()
        render()
    });

loadData(function (world, cList) {
    land = topojson.feature(world, world.objects.land)
    countries = topojson.feature(world, world.objects.countries)

    // land = world.features;
    // countries = topojson.feature(world, world.features);

    countryList = cList
    // console.log('countries: ', countries)

    // var names = {};
    // let countryLocations = {};

    countryList.forEach((d, i) => {
        names[d["country-code"]] = d.name
    });

    // console.log('countries: ', countryLocations["32"])

    window.addEventListener('resize', scale)
    scale()


    setTimeout(() => {
        let centroid = [72.136230, 22.309425];

        let x1 = centroid[0];
        let y1 = centroid[1];

        // x = width / 2;
        // y = height / 2;

        // projection.rotate([-148.136230, -76.309425]);
        // context.clearRect(0, 0, width, height);
        // projection.refresh();
        // scale()

        // markerGroup.selectAll("path").remove();

        // markerGroup.selectAll("image")
        //     // .data(centroid)
        //     // .enter()
        //     // .append("path")
        //     .transition()
        //     .duration(750)
        //     .attr("transform", "translate(" + x1 + "," + y1 + ")")
        //     .style("stroke-width", 1.5 + "px")

        // scale()

    }, 3000);



    // g.append("g")
    //     // .attr("class", "states-bundle")
    //     .selectAll("path")
    //     .data(countries)
    //     .enter()
    //     .append("path")
    //     .attr("d", path)
    //     .attr("stroke", "white")
    // .attr("class", "states");

    // g.append("g")
    //     // .attr("class", "states-names")
    //     .selectAll("text")
    //     .data(countries)
    //     .enter()
    //     .append("svg:text")
    //     .text((d) => {
    //         return names[d.id];
    //     })
    //     .attr("x", (d) => {
    //         return path.centroid(d)[0];
    //     })
    //     .attr("y", (d) => {
    //         return path.centroid(d)[1];
    //     })
    //     .attr("stroke", "#0000FF")
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "12px")
    //     .attr('fill', 'white');
    //   autorotate = d3.timer(rotate)
})