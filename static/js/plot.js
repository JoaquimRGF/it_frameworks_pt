
const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let languages;
let column;

const onColumnClicked = col => {
    column = col;
    getDataAsync("POST")
        .then(loadedData => {
            try{
                dataHandler(loadedData);
                render();
            } catch {
                data = loadedData;
                render_error();
            }
        });      
}

const render_error = () => {

    const error = d3.select('#error_message');
    
    var errorOutput = error.selectAll('.p')
    .data([null])
    .enter()
    .append('p');

    errorOutput.text(data.error)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("color", "black");

}


const render = () => {

    const error = d3.select('#error_message');
    error.selectAll('*').remove();

    const xValue = d => d.value;
    const yValue = d => d.name;
    const margin = { top: 20, right:40, bottom:20, left:100};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select('#menu')
    .call(dropdownMenu, {
      options: languages,
      onOptionClicked: onColumnClicked,
    });

  
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => xValue(d))])
        .range([0, innerWidth]);
  
    const yScale = d3.scaleBand()
        .domain(data.map(d => yValue(d)))
        .range([0, innerHeight])
        .padding(1 * data.length / 10); 

  
    const g = svg.selectAll('.container').data([null]);
    const gEnter = g.enter().append('g').attr('class', 'container');
    gEnter.merge(g)
        .attr('transform', "translate("+ margin.left + "," + margin.top + " )")


    const yAxis = d3.axisLeft(yScale)

    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
    .append('g')
        .attr('class', 'y-axis')
    yAxisG
    .merge(yAxisGEnter)
        .call(yAxis);
    
    const xAxis = d3.axisBottom(xScale)

    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
    .append('g')
        .attr('class', 'x-axis')
    xAxisG
    .merge(xAxisGEnter)
        .attr('transform', "translate("+ 0 + "," + innerHeight + " )")
        .call(xAxis)
    
    const rect = g.merge(gEnter).selectAll('.rect')
        .remove()
        .exit()
        .data(data);

    rect.enter().append("rect")
        .attr('class', 'rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());
        // .ordering(d =>  -xValue(d));
        
  };



async function getDataAsync(method='GET') 
{
    let response = await fetch("/plot", {method: method,
        body: column});
    let data = await response.json()
    
    return data;
}

getDataAsync()
    .then(loadedData => {
        dataHandler(loadedData);
        render();
})


const dataHandler = (loadedData) => {
    languages = loadedData[0];
    data = loadedData[1];
    data.forEach(d => {
    d.value = +d.value}
    ); 
    data.sort(function(x, y){
        return d3.descending(x.value, y.value);
    });

}