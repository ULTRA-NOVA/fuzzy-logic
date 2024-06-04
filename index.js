// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear()
    .domain([0, 110])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

const plotLines = (svg, lineData) => {
    // Plot lines
    svg.selectAll("line")
        .data(lineData)
        .enter()
        .append("line")
        .attr("x1", function(d) { return xScale(d.startX); })
        .attr("y1", function(d) { return yScale(d.startY); })
        .attr("x2", function(d) { return xScale(d.endX); })
        .attr("y2", function(d) { return yScale(d.endY); })
        .style("stroke", function(d) { return d.color }) // Customize line color
        .style("stroke-width", d => d.stroke || 5); // Customize line width
}

// Sample data for connecting lines
var lineData = [

    // freezing 
    { startX: 0, startY: 1, endX: 30, endY: 1, color: "#0284c7"},
    { startX: 30, startY: 1, endX: 50, endY: 0, color: "#0284c7"},
    
    // cool
    { startX: 30, startY: 0, endX: 50, endY: 1, color: "#7dd3fc" },
    { startX: 50, startY: 1, endX: 70, endY: 0, color: "#7dd3fc" },
    
    // warm
    { startX: 50, startY: 0, endX: 70, endY: 1, color: "#fcd34d" },
    { startX: 70, startY: 1, endX: 90, endY: 0, color: "#fcd34d" },

    // hot
    { startX: 70, startY: 0, endX: 90, endY: 1, color: "#e11d48" },
    { startX: 90, startY: 1, endX: 110, endY: 1, color: "#e11d48" },
];

plotLines(svg, lineData);

// axes 
svg.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "16px")
svg.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "16px");


const getFreezingMf = (x, a, b, c, d) => {
    if (x <= c) return 1;
    if (c <= x && x <= d) return (-0.05*x)+2.5;
    if (d <= x) return 0;
}

const getHotMf = (x, a, b, c, d) => {
    if (x <= a) return 0;
    if (a <= x && x <= b) return (0.05*x)-3.5;
    if (b <= x) return 1;
}

const getCoolMf = (x, a, b, c) => {
    if (x <= a || x >= c) return 0;
    if (x >= a && x <= b) return (0.05*x)-1.5;
    if (x >= b && x <= c) return (-0.05*x)+3.5;
}

const getWarmMf = (x, a, b, c) => {
    if (x <= a || x >= c) return 0;
    if (x >= a && x <= b) return (0.05*x)-2.5;
    if (x >= b && x <= c) return (-0.05*x)+4.5;
}

const getMf = (x, freeze, cool, warm, hot) => {
    const Fs = []
    
    let freezingmf = parseFloat(getFreezingMf(x, freeze[0], freeze[1], freeze[2], freeze[3])).toFixed(2);
    let coolmf = parseFloat(getCoolMf(x, cool[0], cool[1], cool[2])).toFixed(2);
    let warmmf = parseFloat(getWarmMf(x, warm[0], warm[1], warm[2])).toFixed(2);
    let hotmf = parseFloat(getHotMf(x, hot[0], hot[1], hot[2], hot[3])).toFixed(2);

    const labels = [];

    if (freezingmf > 0) {
        Fs.push(freezingmf) 
        labels.push("Freezing");
    }
    if (coolmf > 0) {
        Fs.push(coolmf) 
        labels.push("Cool");
    }
    if (warmmf > 0) {
        Fs.push(warmmf) 
        labels.push("Warm");
    }
    if (hotmf > 0) {
        Fs.push(hotmf) 
        labels.push("Hot");
    }
    return [Fs, labels];
}

freezing_trapmf = [0, 0, 30, 50]
cool_trimf = [30, 50, 70]
warm_trimf = [50, 70, 90]
hot_trapmf = [70, 90, 110, 110]

const tempValue = document.getElementById("tempValue");
let Fs;

tempValue.addEventListener("input", () => {
    x = tempValue.value;
    [Fs, labels] = getMf(x, freezing_trapmf, cool_trimf, warm_trimf, hot_trapmf);

    svg.selectAll("circle").remove();

    var elemEnter = svg.selectAll("circle")
    .data(Fs)
    .enter();

    elemEnter
        .append("circle")
        .attr("cx", d => xScale(x))
        .attr("cy", d => yScale(d))
        .attr("r", 10)
        .style("fill", "#34d399");


    while (lineData.length > 8) {
        lineData.pop();
    }

    lineData.push(
        {startX: x, startY: 0, endX: x, endY: 1, color: "green", stroke: 3},
        {startX: 0, startY: Fs[0], endX: width, endY: Fs[0], color: "rgba(0, 0, 0, 0.5)", stroke: 1}
    );

    if (Fs.length > 1) {
        lineData.push({startX: 0, startY: Fs[1], endX: width, endY: Fs[1], color: "rgba(0, 0, 0, 0.5)", stroke: 1});
    }

    svg.selectAll("line").remove();
    plotLines(svg, lineData);

    svg.selectAll("text").remove();

    console.log(Fs)

    svg
        .append("text")
        .attr("dx", d => xScale(x) > 1000 ? xScale(x) - 75 : xScale(x) + 25)
        .attr("dy", _ => yScale(Fs[0]) + 20)
        .style("font-size", "16px")
        .text((Fs[0]*100) + "% " + labels[0]);


    if (Fs.length > 1) {
        svg
        .append("text")
        .attr("dx", d => xScale(x) > 1000 ? xScale(x) - 75 : xScale(x) + 25)
        .attr("dy", _ => yScale(Fs[1]) - 20)
        .style("font-size", "16px")
        .text((Fs[1]*100) + "% " + labels[1]);
    }


    // axes 
    svg.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "16px")
    svg.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "16px");
});