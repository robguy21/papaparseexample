$( document ).ready(function() {
  // Handler for .ready() called.
  var SCANNER_API = 'http://scanner.sites.dev/scanner-api/';
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawCharts);

  // init multi select

  function initSelect() {
    setTimeout(function() {
      $('#materialize-select-range').material_select()
      $('#materialize-select-gender').material_select()
    }, 200);
  }
  initSelect();

  // form submit
  $('#form-age-range-filter').submit(function(e){
    e.preventDefault(); // Keep the form from submitting

    var form = $(this);
    var inputs = $('#form-age-range-filter input');

    if (inputs[0].value !== "" && inputs[1] !== "0") {
      drawAgeChart(inputs[0].value, inputs[1].value);
    }

    return false;
  });

  // Create the data table.
  var chartGender;
  var chartAge;
  var chartCapacity;

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawCharts() {
    drawChart();
    drawCapacityChart();
  }

  function drawChart() {
    chartGender = new google.visualization.DataTable();
    chartGender.addColumn('string', 'Gender');
    chartGender.addColumn('number', 'Count');

    $.ajax({
      type: 'POST',
      url: SCANNER_API + 'getters/genderChartData.php',
      dataType: 'json',
    })
    .done(function(result) {
      chartGender.addRows(result);
      // Set chart options
      var options = {'title':'Gender Split'};

      // Instantiate and draw our chart, passing in some options.
      var genderChart = new google.visualization.PieChart(document.getElementById('js-chart-gender'));
      genderChart.draw(chartGender, options);

      startGenderListener();
    });
  }

  function drawCapacityChart() {
    chartCapacity = new google.visualization.DataTable();
    chartCapacity.addColumn('string', 'Now in');
    chartCapacity.addColumn('number', 'Count');

    $.ajax({
      type: 'POST',
      url: SCANNER_API + 'getters/capacityChartData.php',
      dataType: 'json',
    })
    .done(function(result) {
      chartCapacity.addRows(result);
      // Set chart options
      var options = {'title':'Capacity'};

      // Instantiate and draw our chart, passing in some options.
      var genderChart = new google.visualization.PieChart(document.getElementById('js-chart-capacity'));
      genderChart.draw(chartCapacity, options);

      startCapacityListener();
    });
  }

  function drawAgeChart(ageRange, gender) {
    chartAge = new google.visualization.DataTable();
    chartAge.addColumn('string', 'Total');
    chartAge.addColumn('number', 'Count');

    $.ajax({
      type: 'POST',
      url: SCANNER_API + 'getters/ageChartData.php',
      dataType: 'json',
      data: {
       'ageRange': ageRange,
       'gender': gender,
      }
    })
    .done(function(result) {
      chartAge.addRows(result);
      // Set chart options
      var options = {'title':'No. People Between Set Ages and Set Gender',
                     'width':400,
                     'height':300};

      // Instantiate and draw our chart, passing in some options.
      var ageChart = new google.visualization.ColumnChart(document.getElementById('js-chart-age'));
      ageChart.draw(chartAge, options);

    });
  }

  function startGenderListener() {
    setTimeout(function() { 
      $.ajax({
        type: 'POST',
        url: SCANNER_API + 'getters/genderChartData.php',
        dataType: 'json',
      })
      .done(function(result) {

        chartGender = new google.visualization.DataTable();

        chartGender.addColumn('string', 'Gender'); //a
        chartGender.addColumn('number', 'Count'); //b
        chartGender.addRows(result);
        // Set chart options
        var options = {'title':'Gender Split'};
        // Instantiate and draw our chart, passing in some options.
        var genderChart = new google.visualization.PieChart(document.getElementById('js-chart-gender'));
        genderChart.draw(chartGender, options);

        startGenderListener();
      })
      .fail(function(result) {
        // console.log(result);
      });
    }, 5000);
  }

  function startCapacityListener() {
    setTimeout(function() { 
      $.ajax({
        type: 'POST',
        url: SCANNER_API + 'getters/capacityChartData.php',
        dataType: 'json',
      })
      .done(function(result) {

        chartCapacity = new google.visualization.DataTable();

        chartCapacity.addColumn('string', 'Total'); //a
        chartCapacity.addColumn('number', 'Count'); //b
        chartCapacity.addRows(result);
        // Set chart options
        var options = {'title':'Capacity'};
        // Instantiate and draw our chart, passing in some options.
        var genderChart = new google.visualization.PieChart(document.getElementById('js-chart-capacity'));
        genderChart.draw(chartCapacity, options);

        startCapacityListener();
      })
      .fail(function(result) {
        // console.log(result);
      });
    }, 5000);
  }

  function getClubMetaData() {
    $.ajax({
      type: 'POST',
      url: SCANNER_API + 'getters/clubMetaData.php',
      dataType: 'json',
    })
    .done(function(result) {
      var clubTotal = $('#js-club-total')[0];
      var clubAverage = $('#js-club-average')[0];

      clubTotal.innerHTML = result.total;
      clubAverage.innerHTML = result.average;

      metaDataListener(clubTotal, clubAverage);
    })
    .fail(function(err) {
      // console.log(err);
    });
  }
  getClubMetaData();

  function metaDataListener(nodeTotal, nodeAverage) {
   setTimeout(function() { 
      $.ajax({
        type: 'POST',
        url: SCANNER_API + 'getters/clubMetaData.php',
        dataType: 'json',
      })
      .done(function(result) {
        // console.log(result);
        nodeTotal.innerHTML = result.total;
        nodeAverage.innerHTML = result.average;

        metaDataListener(nodeTotal, nodeAverage);
      });
    }, 5000); 
  }
});