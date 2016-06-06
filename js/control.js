      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Month', 'Percentage'],
          ['January', 95.5],
          ['February', 96.8],
          ['March', 95.2],
          ['April', 94.7]
        ]);

        var options = {
          curveType: 'none',
          legend: { position: 'none' },
          colors: ['#EC7F24'],
          chartArea: {'width': '80%', 'height': '80%'},          
          titleTextStyle: {color:'#333', fontSize: 24, fontName: 'Lato'},
          tooltip: {textStyle: {color:'#333'}},
          vAxis: {
                format: '#\'%\'',
            },          
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      };  

function provinceClinicsTotal(number) {
  document.getElementById("prv-cli-total").innerHTML = number + " <small>clinics monitored</small>";
};

function provinceClinicsThree(number) {
  document.getElementById("prv-cli-three").innerHTML = number + " <small>in the last three months</small>";
};

function changeImage(a) {
  document.getElementById("prv-image").src=a;
};


$("a.prv-btn").click(function() {
  $("a.prv-btn").removeClass("active");
  $(this).addClass("active");
});