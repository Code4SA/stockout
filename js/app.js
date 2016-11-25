(function(window) {
  var stockoutData = null;
  var constants = window.constants;
  window.pymChild = window.pymChild || new pym.Child({id: 'code4sa-embed-stockout' });

  // Cache the DOM for each province so that we don't have to
  // remake it all every time a province is selected
  var domCache = {};
  var provinceIndex = {};

  // Dates
  var currentDate = new Date();
  var adjustedDate = currentDate;

  adjustedDate.setDate(adjustedDate.getDate() - constants.WAITING_PERIOD);

  // DOM Elements
  var DOM = {};

  DOM.$stockTable = $('#prv-stock-table');
  DOM.$infoRow = $('#prv-stock-table .info-row');
  DOM.$totalClinics = $('#clinics-total');
  DOM.$prvBtns = $('#prv-btns');
  DOM.$prvLinks = $('#prv-links');
  DOM.$prvName = $('#prv-name');
  DOM.$prvClinics = $('#prv-clinics');
  DOM.$prvAvail = $('#prv-avail');
  DOM.$availDate = $('#avail-date');
  DOM.$counter = $('#counter');
  DOM.$reports = $('#reports');

  // Pull in data
  fetch(constants.URL)
    .then(function(res) {
        if(!res.ok) console.log('Error with response.');
        else {
          return res.json()
          .then(function(data) {
            // Set data
            init(data);
          });
        }
      });

  // Append yearly reports
  for(var year=constants.REPORTS_START;year <= currentDate.getFullYear(); year++) {
    var reportName = 'Full-year ' + year;

    if(year == currentDate.getFullYear()) reportName = constants.LONG_MONTHS[0] + ' - ' + constants.LONG_MONTHS[adjustedDate.getMonth()] + ' '  + year;

    DOM.$reports.append('<a class="dropdown-item" href="https://cbm.code4sa.org/stockouts/year/report/?year=' + year + '" target="_blank">' + reportName + '</a>');
  }

  function isArray(arr) {
    if(!Array.isArray) {
      return Object.prototype.toString.call( arr ) === '[object Array]';
    } else {
      return Array.isArray(arr);
    }
  }

  function init(data) {
    stockoutData = data;

    // Sort provinces by name
    stockoutData.provinces.sort(function(a,b) {
      return a.name > b.name;
    });

    // Setup menu links
    setupLinks();
    // Attach click handlers and display province data as callback
    buttonClickHandlers();
    // Show default view
    displayStockData('ZA');
  }

  function setupLinks() {
    var provinces = stockoutData.provinces;
    var $links = [];
    var dom = [];
    // Create a list of indexes that point us to where each ID is
    // in the the list of province objects so that we don't have to
    // search the array every time we want to find a province
    provinces.forEach(function(province,i) {
      var code = province.code;
      var isNational = code === 'ZA';

      provinceIndex[code] = i;

      $links.push(createLink(isNational ? 'National' : province.name,code,isNational));

      if(isNational) {
        var temp = province[0];
        var tempLink = $links[0];

        province[0] = province;
        province[i] = temp;
        $links[0] = $links[$links.length - 1];
        $links[$links.length - 1] = tempLink;
      }
    });

    // Add buttons to DOM
    dom.push({ target: 'prvLinks', change: $links, type: 'list' });

    view(dom);
  }

  function createLink(name,code,active) {
    var $link = $('<a class="dropdown-item nav-item" data-code="' + code + '">' + name + '</a>');

    if(active) $link.addClass('active');

    return $link;
  }

  function buttonClickHandlers(cb) {
    // Event listener should only be attached once we've
    // gotten the data we need
    var $btns = $.merge(DOM.$prvBtns,DOM.$prvLinks);

    $btns.on('click', function(e) {
      var $target = $(e.target);
      var code = $target.attr('data-code');

      // Toggle active button classes
      $('.nav-item').removeClass('active');
      $('.nav-item[data-code="' + code + '"]').addClass('active');
      // Show province data
      if(code) {
        displayStockData(code);
      } else {
        console.log('Province data does not exist for province with code ' + code);
      }
    });

    if(cb) {
      cb();
    }
  }

  function tableClickHandlers() {
    DOM.$medicines.on('click', function(e) {
      var $stockTable = DOM.$stockTable;
      var $infoRow = DOM.$infoRow;
      var $medRow = $(e.target).closest('.med-row');
      var code = $medRow.attr('data-code');
      var openRowCode = $stockTable.attr('data-open');

      if($infoRow.hasClass('open')) {
        $infoRow.removeClass('open');

        setTimeout(function() {
          $infoRow
            .addClass('collapsed')
            .find('.med-info')
            .empty();
        }, 500);
      }

      if(code !== openRowCode) {
        $infoRow
          .removeClass('collapsed')
          .insertAfter($medRow)
          .find('.med-info')
          .html(constants.MEDICINES[code]);

          setTimeout(function() {
            $infoRow.addClass('open');
          }, 0);

        $stockTable.attr('data-open',code);
      } else {
        $stockTable.removeAttr('data-open');
      }
    });
  }

  // Generate a row in the medicines table
  function medicineRow(row) {
    var code = row.code;
    var medicine = row.name;
    var stringSplit = medicine.split('(');
    var name = stringSplit[0] ? stringSplit[0] : '';
    var dosage = stringSplit[1] ? '(' + stringSplit[1] : '';
    var $row = $('<div class="med-row ' + row.status + '"></div>');
    var $info = $('<div class="med-info" id="' + code + '-heading"></div>');
    var $toggle = $('<div class="row-toggle row" aria-controls="info-' + code + '" data-toggle="collapse" data-parent="#stock-table" aria-expanded="false" data-target="#info-' + code + '"></div>');
    var $box = $('<div id="info-' + code + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + code + '-heading"><div class="inner">' + constants.MEDICINES[code] + '</div></div>');
    var $medName = $('<div class="med-name col-xs-6 col-sm-7"><span class="plus"><i class="fa fa-plus" aria-hidden="true"></i></span>' + name + '</div>');
    var $medDosage = $('<span class="med-dosage">' + dosage + '</span>');
    var $medAvail = $('<div class="med-avail text-xs-center col-xs-3 col-sm-3"><strong>' + row.avail + '%</strong></div>');
    var $medChecks = $('<div class="med-checks text-xs-center col-xs-3 col-sm-2">' + row.totalChecks + '</div>');

    $medName.append($medDosage);
    $toggle.append($medName,$medAvail,$medChecks);
    $info.append($toggle);
    $row.append($info,$box);

    return $row;
  }

  // Clear DOM
  function clear() {
    for(var key in DOM) {
      DOM[key].empty();
    }
  }

  // Create table of row objects showing availability of each medicine
  function availabilityTable(stats) {
    var medsInStock = stats.medicine_instock;
    var medsOutOfStock = stats.medicine_stockouts;
    var medicines = stockoutData.medicines;
    var table = [];

    for(var med in medicines) {
      var inStockChecks = medsInStock[med];

      if(!!inStockChecks) {
        var row = {};
        var outOfStockChecks = medsOutOfStock[med] ? medsOutOfStock[med] : 0;
        var totalChecks = inStockChecks + outOfStockChecks;
        var availability = (inStockChecks / totalChecks * 100).toFixed(0);

        row.code = med;
        row.name = medicines[med];
        row.totalChecks = totalChecks;
        row.avail = availability
        row.status = colorClass(availability);

        table.push(row);
      }
    }

    table.sort(function(a,b) {
      return a.avail - b.avail;
    });

    return table;
  }

  function colorClass(num) {
    var className = '';

    if(num <= 50) {
      className = 'critical';
    } else if(num > 50 && num <= 75) {
      className = 'intermediate';
    } else {
      className = 'normal';
    }

    return className;
  }

  function view(dom,shouldResize) {
    if(!!dom) {
      if(isArray(dom)) {
        dom.forEach(function(el) {
          var domTarget = DOM['$' + el.target];
          var domChange = el.change;
          var type = el.type ? el.type : 'set'; // Default to replacing old content with new

          switch(type) {
            case 'set':
              domTarget.html(domChange);
              break;
            case 'append':
              domTarget.append(domChange);
              break;
            case 'list':
              domTarget
                .empty()
                .append(domChange);
              break;
            case 'dash':
              domTarget.attr('stroke-dashoffset',domChange);
              break;
          }
        });
      } else if(!isArray(dom) && typeof dom === 'object') {
        view([dom]);
      }

      if(shouldResize) {
        pymChild.sendHeight(); // Make sure pym resizes
      }
    } else {
      console.log('No keys supplied to view, so DOM remains unchanged.');
    }
  }

  // Insert the correct DOM
  function displayStockData(code) {
    var province = stockoutData.provinces[provinceIndex[code]];
    var stockData;

    if(!!province) {
      var provinceCache = domCache[code];
      var stats = province.stats;
      var totalClinics = stats.total_clinics;
      var stockTable = [];
      var stockData = null;
      var dom = [];

      // Get most recent monthly availability
      var monthlyAvail = stats.monthly_availability;
      var latestDate = null;
      var dateFormat = '';
      var availability = null;

      for(var key in monthlyAvail) {
        var currentAvail = monthlyAvail[key];
        var currentDate = new Date(key);

        if(currentDate > latestDate) {
          latestDate = currentDate;
          availability = currentAvail.toFixed(0);
        }
      }

      dateFormat = latestDate.getFullYear();

      if(!!provinceCache) {
        stockData = provinceCache;
      } else {
        stockData = availabilityTable(province.stats);

        // Add these to the cache
        domCache[code] = stockData;
      }

      // Set up stock table row elements
      stockData.forEach(function(row) {
        stockTable.push(medicineRow(row));
      });

      // Create new DOM
      dom.push({ target: 'prvName', change: province.name });
      dom.push({ target: 'prvClinics', change: totalClinics });
      dom.push({ target: 'stockTable', change: stockTable, type: 'list' });
      dom.push({ target: 'prvAvail', change: availability + '%' });
      dom.push({ target: 'availDate', change: dateFormat });

      // Set the view
      view(dom,true);

      // COLOR INDICATOR
      DOM.$prvAvail.addClass(colorClass(availability));

      // Grab medicine row DOM references
      DOM.$medicines = $('#prv-stock-table .med-row');
    } else {
      console.log('No data for province code ' + code);
      clear();
    }
  }
})(window);
