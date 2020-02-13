(function() {

const sqrt = Math.sqrt, pow = Math.pow, e = Math.E, pi = Math.PI, sq = (x) => x*x;

function makeGaussian(m, s) {
    return (function() {
        let mu = m;
        let sig = s;
        return function(x) {
            let a = 1 / (sig * sqrt(2* pi));
            return a * pow(e, (-0.5)*pow((x-mu)/sig, 2) );
        };
    })();;
}
let getLine = () => d3.line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);



// d3 stuff
let start = -3;
let end = 3;

let margin = {top: 10, right: 10, bottom: 20, left: 30};
let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let xScale = d3.scaleLinear().domain([start, end]).range([0, width]);
let yScale = d3.scaleLinear().domain([0, 4]).range([height, 0]);

let line = getLine();


let m1 = 0, s1 = 0.5;
let m2 = 1, s2 = 0.2;
let m2 = 1, s2 = 0.2;

let g1 = makeGaussian(m1, s1);
let g2 = makeGaussian(m2, s2);
let S12 = (1/sqrt(2*pi*(sq(s1)+sq(s2))))*pow(e, -0.5*sq(m1-m2)/(sq(s1)+sq(s2)));
let S123 = (1/sqrt(2*pi*(sq(s1)+sq(s2))))*pow(e, -0.5*sq(m1-m2)/(sq(s1)+sq(s2)));
let g12 = (x) => (1/S12)*g1(x)*g2(x);


let data1 = [];
let data2 = [];
let data12 = [];



let ticks = 200;
let delx = (end-start)/ticks;
for(let i=0; i<ticks; i++) {
    let x = start+delx*i;
    
    data1.push({x: x, y: g1(x)});
    data2.push({x: x, y: g2(x)});
    data12.push({x: x, y: g12(x)})
}

let svg = d3.select("#svg2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft


let path1 = svg.append("path")
    .datum(data1)
    .attr("class", "line red")
    .attr("d", line);

let path2 = svg.append("path")
    .datum(data2)
    .attr("class", "line blue")
    .attr("d", line);

let path12 = svg.append("path")
    .datum(data12)
    .attr("class", "line purple")
    .attr("d", line);


let myObj = {
}

function updateCurves(m1, s1, m2, s2) {

    let g1 = makeGaussian(m1, s1);
    let g2 = makeGaussian(m2, s2);
    let S12 = (1/sqrt(2*pi*(sq(s1)+sq(s2))))*pow(e, -0.5*sq(m1-m2)/(sq(s1)+sq(s2)));
    let g12 = (x) => (1/S12)*g1(x)*g2(x);

    myObj.g1 = g1;
    myObj.g2 = g2;
    myObj.g12= g12;

    let data1 = [];
    let data2 = [];
    let data12 = [];


    let ticks = 200;
    let delx = (end-start)/ticks;
    for(let i=0; i<ticks; i++) {
        let x = start+delx*i;
        
        data1.push({x: x, y: g1(x)});
        data2.push({x: x, y: g2(x)});
        data12.push({x: x, y: g12(x)})
    }

    path1.datum(data1).attr("d", line);
    path2.datum(data2).attr("d", line);
    path12.datum(data12).attr("d", line);
}

$(".slider").on('input', function() {
    let mu1 = parseFloat($("#mu1").val());
    let sigma1 = parseFloat($("#sigma1").val());

    let mu2 = parseFloat($("#mu2").val());
    let sigma2 = parseFloat($("#sigma2").val());

    updateCurves(mu1, sigma1, mu2, sigma2);

    $("#vm1").text(mu1.toFixed(1)); $("#vs1").text(sigma1.toFixed(1));
    $("#vm2").text(mu2.toFixed(1)); $("#vs2").text(sigma2.toFixed(1));

    sigma12 = sqrt((sq(sigma1)*sq(sigma2))/(sq(sigma1)+sq(sigma2)));
    mu12 = (sq(sigma2)*mu1+sq(sigma1)*mu2)/(sq(sigma1)+sq(sigma2))

    $("#vm12").text(mu12.toFixed(3));
    $("#vs12").text(sigma12.toFixed(3));
});

})();