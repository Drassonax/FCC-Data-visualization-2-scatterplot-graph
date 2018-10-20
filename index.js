const createGraph = (dataset) => {
    const width = 1000
    const height = 500
    const margin = 50

    const yearFormat = d3.format('d')
    const timeFormat = d3.timeFormat('%M:%S')
    const xScale = d3.scaleLinear().domain([d3.min(dataset, (d) => d.Year - 1), d3.max(dataset, (d) => d.Year + 1)]).range([0, width])
    const yScale = d3.scaleTime().domain(d3.extent(dataset, (d) => new Date(Date.UTC(1970, 0, 1, 0,d.Time.split(':')[0], d.Time.split(':')[1])))).range([0, height])
    const xAxis = d3.axisBottom(xScale).tickFormat(yearFormat)
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)

    let tooltip = d3.select('#scatterplot')
                .append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0)

    const svg = d3.select('#scatterplot')
                .append('svg')
                .attr('width', width + 2 * margin)
                .attr('height', height + 2 * margin)

            svg.selectAll('circle')
                .data(dataset)
                .enter()
                .append('circle')
                .attr('cx', (d) => margin + xScale(d.Year))
                .attr('cy', (d) => margin + yScale(new Date(Date.UTC(1970, 0, 1, 0,d.Time.split(':')[0], d.Time.split(':')[1]))))
                .attr('r', 5)
                .attr('class', 'dot')
                .attr('data-xvalue', (d) => d.Year)
                .attr('data-yvalue', (d) => new Date(Date.UTC(1970, 0, 1, 0,d.Time.split(':')[0], d.Time.split(':')[1])))
                .style('fill', (d) => {
                    return d.Doping === '' ? 'blue' : 'red'
                })
                .on('mouseover', (d) => {
                    tooltip.style('opacity', 0.8)
                        .attr('data-year', d.Year)
                        .html(`${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${d.Time}<br/>${d.Doping}`)
                        .style('left', (d3.event.pageX + 15) + 'px')
                        .style('top', (d3.event.pageY - 30) + 'px')
                })
                .on('mouseout', (d) => {
                    tooltip.style('opacity', 0)
                })

            svg.append('g')
                .attr('transform', `translate(${margin}, ${height + margin})`)
                .attr('id', 'x-axis')
                .call(xAxis)
            svg.append('g')
                .attr('transform', `translate(${margin}, ${margin})`)
                .attr('id', 'y-axis')
                .call(yAxis)
}


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then((res) => res.json())
    .then((data) => {
        createGraph(data)
    })