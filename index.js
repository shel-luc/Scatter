const w = 900;
const h = 450;
const p = 35;

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (dataset) {
    // Format date/time using Date object
    let parsedTime;
    dataset.forEach((d) => {
      parsedTime = d.Time.split(':');
      d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    });
    // Create xScale
    const xScale = d3.scaleLinear()
      .domain([d3.min(dataset, (d) => d.Year - 1), d3.max(dataset, (d) => d.Year + 1)])
      .range([p, w - p]);
    // Create yScale
    const yScale = d3.scaleTime()
      .domain([d3.max(dataset, (d) => d.Time), d3.min(dataset, (d) => d.Time)])
      // Alternative method using the d3.extent()
      // .domain(d3.extent(dataset, (d) => { return d.Time; }).reverse())
      .range([h - p, p]);
    // Create x axis
    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(d3.format('d'));
    // Create y axis
    const yAxis = d3.axisLeft()
      .scale(yScale)
      .tickFormat(d3.timeFormat('%M:%S'));
    // Create tooltip
    const div = d3.select('.container')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    // Create the svg
    const svg = d3.select('.container')
      .append('svg')
      .attr('width', w + 65)
      .attr('height', 480)
      .style('display', 'block')
      .style('margin', 'auto');
    // Create the scatter plot graph
    svg.selectAll('.dot')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', (d) => 6)
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d) => yScale(d.Time))
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d, i) => d.Time.toISOString())
      .attr('transform', 'translate(30, 0)')
      .style("fill", (d) => {
        if (d.Doping !== '') {
          return '#1f77b4';
        } else {
          return '#ff7f0e';
        }
      })
      .on('mouseover', (d) => {
        div.style('opacity', 1)
        div.attr('data-year', d.Year)
        div.html(`${d.Name} (${d.Nationality}) <br>Year: ${d.Year} <br>Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}<br><br>${d.Doping}`)
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', (d) => {
        div.style('opacity', 0)
      });
    // Create x axis group
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(30,' + (h - p) + ')')
      .call(xAxis);
    // Create y axis group
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(65, 0)')
      .call(yAxis);
    // Add label to y axis
    svg.append('text')
      .attr('transform', 'rotate(270)')
      .text('Time in Minutes')
      .attr('class', 'y-axis-label')
      .attr('x', -(h / 2))
      .attr('y', 10);
    // Add label to x axis
    svg.append('text')
      .attr('transform', 'rotate(0)')
      .text('Years')
      .attr('class', 'x-axis-label')
      .attr('x', 435)
      .attr('y', 460);
    // Create the legend
    const legend = svg.selectAll('.legend')
      .data(['Riders with doping allegations', 'No doping allegations'])
      .enter()
      .append('g')
      .attr('id', 'legend')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (w - 190) + ', 50)');
    // Add legend information
    legend.append('text')
      .attr('y', (d, i) => i * 20 + 5)
      .attr('x', 15)
      .text((d) => d);
    // Add color key
    legend.append('circle')
      .attr('cy', (d, i) => i * 20)
      .attr('r', 6)
      .attr('fill', (d) => {
        if (d == 'Riders with doping allegations') {
          return '#1f77b4';
        } else {
          return '#ff7f0e';
        }
      })
      .style('opacity', 0.5)
      .style('stroke', '#000');
  });