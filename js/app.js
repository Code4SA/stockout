(function(window) {
  var qs = document.querySelector.bind(document);
  var qsa = document.querySelectorAll.bind(document);
  var stockoutData = null;
  var constants = {};

  // Cache the DOM for each province so that we don't have to
  // remake it all every time a province is selected
  var domCache = {};
  var provinceIndex = {};

  // DOM Elements
  var DOM = {};

  DOM.$stockTable = qs('#prv-stock-table tbody');
  DOM.$totalClinics = qs('#clinics-total');
  DOM.$prvBtns = qs('#prv-btns');
  DOM.$prvName = qs('#prv-name');
  DOM.$prvClinics = qs('#prv-clinics');
  DOM.$prvImg = qs('#prv-image');
  DOM.$prvAvail = qs('#prv-avail');
  DOM.$availDate = qs('#avail-date');
  DOM.$reportDD = qs('#report-dropdown');
  DOM.$counter = qs('#counter');
  DOM.$dropdown = qs('.dropdown');
  DOM.$dropdownMenu = qs('.dropdown-menu');

  // Set up constant values
  constants.URL = 'result.json';
  constants.PRV_IMAGES = {
    EC: 'ec.png',
    FS: 'fs.png',
    GT: 'gau.png',
    KZN: 'kzn.png',
    LIM: 'lim.png',
    MP: 'mpu.png',
    NC: 'nc.png',
    NW: 'nw.png',
    WC: 'wc.png'
  };
  constants.MONTHS = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];

  // Setup dropdown
  window.addEventListener('click', function(e) {
    var $target = e.target;

    if($target.classList.contains('dropdown-toggle')) {
      DOM.$dropdownMenu
        .classList
        .toggle('show');
    } else {
      DOM.$dropdownMenu
        .classList
        .remove('show');
    }
  });

  // Pull in data
  fetch(constants.URL)
    .then(function(res) {
        if(!res.ok) console.log('Error with response.');
        else {
          return res.json()
          .then(function(data) {
            // Set data
            stockoutData = data;

            // Sort provinces by name
            stockoutData.provinces.sort(function(a,b) {
              return a.name > b.name;
            });

            // Update total number of clinics
            view({ target: 'totalClinics', change: stockoutData.country_stats.total_clinics });

            calculateCounter();
            setupButtons(stockoutData.provinces);
          });
        }
      })
    .catch(function(err) {
      console.log(Error(err));
    });

  function isArray(arr) {
    if(!Array.isArray) {
      return Object.prototype.toString.call( arr ) === '[object Array]';
    } else {
      return Array.isArray(arr);
    }
  }

  function calculateCounter() {
    var now = new Date();
    var toEndOfYear = ((new Date(new Date().getFullYear(), 11, 31) - now) * 100) / now;
    var c = 2 * 80 * Math.PI;
    var strokeLength = c - (toEndOfYear * c);

    view({ target: 'counter', change: strokeLength, type: 'dash' });
  }

  function setupButtons(provinces) {
    // Create a list of indexes that point us to where each ID is
    // in the the list of province objects so that we don't have to
    // search the array every time we want to find a province
    provinces.forEach(function(province,i) {
      var code = province.code;

      provinceIndex[code] = i;

      createButton(province.name,code,code === 'EC');
    });

    // Add buttons to DOM object
    DOM.$btns = qsa('.prv-btn');

    // Attach click handlers and display province data as callback
    buttonClickHandlers(displayProvinceData.bind(null,'EC'));
  }

  function createButton(name,code,active) {
    var dom = {};
    var listItem = document.createElement('li');
    var btn = document.createElement('button');

    listItem.classList.add('list-item');

    btn.innerHTML = name;
    btn.setAttribute('type','button');
    btn.setAttribute('data-code',code);
    btn.classList.add('btn','btn-default','prv-btn');
    if(active) btn.classList.add('active');

    listItem.appendChild(btn);

    dom.target = 'prvBtns';
    dom.change = listItem;
    dom.type = 'append';

    view(dom);
  }

  function buttonClickHandlers(cb) {
    // Event listener should only be attached once we've
    // gotten the data we need
    var $btns = DOM.$btns;

    [].forEach.call($btns, function($btn) {
      $btn.addEventListener('click', function(e) {
        var $target = e.target;
        var code = $target.getAttribute('data-code');
        var classes = $target.classList;

        // Toggle active button classes
        [].forEach.call($btns, function($btn) {
          $btn.classList.remove('active');
        });

        $target.classList.add('active');

        // Show province data
        if(code) {
          displayProvinceData(code);
        } else {
          console.log('Province data does not exist for province with code ' + code);
        }
      });
    });

    if(cb) {
      cb();
    }
  }

  // Generate a row in the medicines table
  function medicineRow(row) {
    var medicine = row.name;
    var stringSplit = medicine.split('(');
    var name = stringSplit[0] ? stringSplit[0] : '';
    var dosage = stringSplit[1] ? '(' + stringSplit[1] : '';

    return '<tr class="' + row.status + '"><td>' + name + '<span class="dosage">' + dosage + '</span></td><td class="avail text-center"><h3>' + row.avail + '%</h3></td><td class="total text-center"><h4><strong>' + row.totalChecks + '</strong></h4></td></tr>';
  }

  // Clear DOM
  function clear() {
    for(var key in DOM) {
      DOM[key].innerHtml = '';
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

        row.name = medicines[med];
        row.totalChecks = totalChecks;
        row.avail = availability

        if(availability <= 50) {
          row.status = 'critical';
        } else if(availability > 50 && availability <= 75) {
          row.status = 'intermediate';
        } else {
          row.status = 'normal';
        }

        table.push(row);
      }
    }

    table.sort(function(a,b) {
      return a.avail - b.avail;
    });

    return table;
  }

  function view(dom) {
    if(!!dom) {
      if(isArray(dom)) {
        dom.forEach(function(el) {
          var domTarget = DOM['$' + el.target];
          var domChange = el.change;
          var type = el.type ? el.type : 'set'; // Default to replacing old content with new

          switch(type) {
            case 'set':
              domTarget.innerHTML = domChange;
              break;
            case 'append':
              domTarget.appendChild(domChange);
              break;
            case 'img':
              domTarget.setAttribute('src','img/' + domChange);
              break;
            case 'dash':
              domTarget.setAttribute('stroke-dashoffset',domChange);
              break;
          }
        });
      } else if(!isArray(dom) && typeof dom === 'object') {
        view([dom]);
      }
    } else {
      console.log('No keys supplied to view, so DOM remains unchanged.');
    }
  }

  // Insert the correct DOM
  function displayProvinceData(code) {
    var province = stockoutData.provinces[provinceIndex[code]];
    var stockData;

    if(!!province) {
      var provinceCache = domCache[code];
      var stats = province.stats;
      var stockTable = '';
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

      dateFormat = constants.MONTHS[latestDate.getMonth()];

      if(!!provinceCache) {
        stockData = provinceCache;
      } else {
        stockData = availabilityTable(province.stats);

        // Add these to the cache
        domCache[code] = stockData;
      }

      // Set up stock table row elements
      stockData.forEach(function(row) {
        stockTable += medicineRow(row);
      });

      // Create new DOM
      dom.push({ target: 'prvName', change: province.name });
      dom.push({ target: 'prvClinics', change: stats.total_clinics });
      dom.push({ target: 'prvImg', change: constants.PRV_IMAGES[code], type: 'img' });
      dom.push({ target: 'stockTable', change: stockTable });
      dom.push({ target: 'prvAvail', change: availability + '%' });
      dom.push({ target: 'availDate', change: dateFormat });

      // Set the view
      view(dom);

    } else {
      console.log('No data for province code ' + code);
      clear();
    }
  }
})(window);
