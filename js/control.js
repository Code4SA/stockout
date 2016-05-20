



// Charts
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Month', 'Percentage'],
    ['January', 95.4], ['February', 96.2], ['March', 95], ['April', 90]
 ]);

  var options = {
    title: 'Descendants by Generation',
    hAxis: {title: 'Month'},
    vAxis: {title: 'Percentage', minValue: 0, maxValue: 100},
    trendlines: {
      0: {
        type: 'exponential',
        visibleInLegend: true,
      }
    }
  };

  var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}