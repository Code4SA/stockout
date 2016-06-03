      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Month', 'Percentage'],
          ['January',  95.5],
          ['February',  96.8],
          ['March',  95.2],
          ['April',  94.7]
        ]);

        var options = {
          title: 'TRENDS IN MEDICINE STOCKOUTS',
          curveType: 'none',
          legend: { position: 'bottom' },
          colors: ['#EC7F24'],
          titleTextStyle: {color:'#EC7F24', fontSize: 20, fontName: 'Lato'},
          tooltip: {textStyle: {color:'#CA640F'}}
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


$(".prv-btn").click(function() {
  $(".prv-btn").removeClass("active");
  $(this).addClass("active");
});