const url =
	'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const getData = async () => {
	const response = await fetch(url);
	const data = await response.json();
	const dataset = { ...data };
	return dataset;
};

const renderData = async () => {
	const dataset = await getData();
	const monthlyVariance = dataset.monthlyVariance;
	const baseTemp = dataset.baseTemperature;

	const w = 900;
	const h = 500;
	const padding = 75;

	const yAxisTickLabels = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	renderCellFill = temp => {
		let color;

		if (temp < 2.8) {
			color = 'rgb(69, 25, 228)';
		} else if (temp < 3.9) {
			color = 'rgb(25, 89, 228)';
		} else if (temp < 5.0) {
			color = 'rgb(25, 120, 228)';
		} else if (temp < 6.1) {
			color = 'rgb(25, 228, 228)';
		} else if (temp < 7.2) {
			color = 'rgb(25, 228, 103)';
		} else if (temp < 8.3) {
			color = 'rgb(123, 228, 25)';
		} else if (temp < 9.5) {
			color = 'rgb(228, 225, 25)';
		} else if (temp < 10.6) {
			color = 'rgb(228, 174, 25)';
		} else if (temp < 11.7) {
			color = 'rgb(228, 116, 25)';
		} else if (temp < 12.8) {
			color = 'rgb(228, 72, 25)';
		} else {
			color = 'rgb(228, 25, 25)';
		}

		return color;
	};

	const renderTooltip = (year, month, variance) => {
		const format = d3.format('.1f');
		return `${year} ${yAxisTickLabels[month - 1]} <br /> ${format(
			baseTemp + variance
		)}℃ <br />  ${format(variance)}℃`;
	};

	// Scales

	const xScale = d3
		.scaleLinear()
		.domain([
			d3.min(monthlyVariance, d => d.year),
			d3.max(monthlyVariance, d => d.year),
		])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleLinear()
		.domain([0.5, 12.5])
		.range([padding, h - padding]);

	// SVG Container
	const svg = d3
		.select('.svg-container')
		.append('svg')
		.attr('viewBox', `0 0 ${w} ${h}`)
		.classed('svg-content', true);

	// Title
	svg
		.append('text')
		.attr('id', 'title')
		.attr('x', w / 2)
		.attr('text-anchor', 'middle')
		.attr('y', padding / 2)
		.text('Monthly Global Land-Surface Temperature');

	// Subtitle
	svg
		.append('text')
		.attr('id', 'description')
		.attr('x', w / 2)
		.attr('y', padding / 2 + 20)
		.attr('text-anchor', 'middle')
		.text('1753 - 2015: base temperature 8.66℃');

	// Tooltip
	const tooltip = d3
		.select('.svg-container')
		.append('div')
		.attr('id', 'tooltip')
		.attr('class', 'tooltip')
		.style('opacity', 0);

	// Cells
	svg
		.selectAll('rect')
		.data(monthlyVariance)
		.enter()
		.append('rect')
		.attr('class', 'cell')
		.attr('data-year', d => d.year)
		.attr('data-month', d => d.month)
		.attr('x', d => xScale(d.year))
		.attr('y', d => yScale(d.month - 0.5))
		.attr('width', 3)
		.attr('height', (h - 2 * padding) / 12)
		.attr('data-month', d => d.month - 1)
		.attr('data-year', d => d.year)
		.attr('data-temp', d => baseTemp + d.variance)
		.style('fill', d => renderCellFill(baseTemp + d.variance))
		.on('mousemove', d => {
			tooltip.transition().style('opacity', 0.6);
			tooltip
				.html(renderTooltip(d.year, d.month, d.variance))
				.style('left', `${d3.event.pageX}px`)
				.style('top', `${d3.event.pageY + 30}px`)
				.style('background-color', renderCellFill(baseTemp + d.variance))
				.attr('data-year', d.year);
		})
		.on('mouseout', d => {
			tooltip.transition().style('opacity', 0);
		});

	// x-axis
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

	svg
		.append('g')
		.attr('id', 'x-axis')
		.attr('transform', `translate(0, ${h - padding})`)
		.call(xAxis);

	// x-axis Label
	svg
		.append('text')
		.attr('class', 'axis-label')
		.attr('text-anchor', 'middle')
		.attr('x', w / 2)
		.attr('y', h - padding / 2.5)
		.text('Year');

	// y-axis
	const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => yAxisTickLabels[i]);

	svg
		.append('g')
		.attr('id', 'y-axis')
		.attr('transform', `translate(${padding}, 0)`)
		.call(yAxis);

	// y-axis Label
	svg
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr('class', 'axis-label')
		.attr('x', 0 - h / 2)
		.attr('y', padding / 2)
		.text('Month');

	// Legend
	const threshold = d3
		.scaleThreshold()
		.domain([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
		.range([
			'rgb(69, 25, 228)',
			'rgb(25, 89, 228)',
			'rgb(25, 120, 228)',
			'rgb(25, 228, 228)',
			'rgb(25, 228, 103)',
			'rgb(123, 228, 25)',
			'rgb(228, 225, 25)',
			'rgb(228, 174, 25)',
			'rgb(228, 116, 25)',
			'rgb(228, 72, 25)',
			'rgb(228, 25, 25)',
		]);

	const format = d3.format('.1f');

	const xScaleLegend = d3
		.scaleLinear()
		.domain([1.8, 13.8])
		.range([0, w / 4]);

	const xAxisLegend = d3
		.axisBottom(xScaleLegend)
		.tickSize(20)
		.tickValues(threshold.domain())
		.tickFormat(d => format(d));

	const legend = svg
		.append('g')
		.call(xAxisLegend)
		.attr('class', 'legend')
		.attr('id', 'legend')
		.attr('transform', `translate( ${w / 12} , ${h - padding / 1.7})`);

	legend.select('.domain').remove();

	legend
		.selectAll('rect')
		.data(
			threshold.range().map(color => {
				const d = threshold.invertExtent(color);
				if (d[0] == null) d[0] = xScaleLegend.domain()[0];
				if (d[1] == null) d[1] = xScaleLegend.domain()[1];
				return d;
			})
		)
		.enter()
		.insert('rect', '.tick')
		.attr('height', 15)
		.attr('x', d => xScaleLegend(d[0]))
		.attr('width', d => xScaleLegend(d[1]) - xScaleLegend(d[0]))
		.attr('fill', d => threshold(d[0]));
};

renderData();
