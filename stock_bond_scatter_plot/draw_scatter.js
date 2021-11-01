async function drawScatter() {
  const dataset = await d3.csv('../stock_bond.csv')

  const xAccessor = d => d['SP500'] * 100
  const yAccessor = d => d['10YearsTBond'] * 100

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])

  const dimensions = {
    width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right

  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper.append('g')
    .style('transform', `translate(
      ${dimensions.margin.left}px,
      ${dimensions.margin.top}px)`
    )

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const dots = bounds.selectAll('circle')
    .data(dataset)
    .enter().append('circle')
    .attr('cx', d => xScale(xAccessor(d)))
    .attr('cy', d => yScale(yAccessor(d)))
    .attr('r', 5)
    .attr('fill', 'purple')

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .tickFormat((d) => `${d}%`)

  const xAxis = bounds.append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .attr('font-size', '1.4em')
    .html('S&P 500 returns')

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickFormat((d) => `${d}%`)

  const yAxis = bounds.append('g')
    .call(yAxisGenerator)

  const yAxisLabel = yAxis.append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 10)
    .attr('fill', 'black')
    .attr('font-size', '1.4em')
    .text('10 Years T Bond returns')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle')
}

drawScatter()
