(function(window) {
  var stockoutData = null;
  var constants = {};

  // Cache the DOM for each province so that we don't have to
  // remake it all every time a province is selected
  var domCache = {};
  var provinceIndex = {};

  // DOM Elements
  var DOM = {};

  DOM.$stockTable = $('#prv-stock-table');
  DOM.$infoRow = $('#prv-stock-table .info-row');
  DOM.$totalClinics = $('#clinics-total');
  DOM.$prvBtns = $('#prv-btns');
  DOM.$prvName = $('#prv-name');
  DOM.$prvClinics = $('#prv-clinics');
  DOM.$prvImg = $('#prv-image');
  DOM.$prvAvail = $('#prv-avail');
  DOM.$availDate = $('#avail-date');
  DOM.$counter = $('#counter');

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
  constants.MEDICINES = {
    "aba": "Abacavir (ABC) is currently recommended as part of first- and second-line antiretroviral therapy (ART) for HIV-positive paediatric patients.",
    "adr": "Adrenaline is used as a treatment for anaphylaxis. Anaphylaxis is an extreme form of an allergic reaction can cause swelling of your mouth and tongue, breathing problems, flushing, collapse and a loss of consciousness.",
    "amosus": "Amoxicillin suspension is used susceptible infections including ear/nose/throat, genetial and unirary tract, skin and skin structures, lower respiratory, acute uncomplicated gonorrhea.",
    "amocap": "Amoxicillin capsules are used susceptible infections including ear/nose/throat, genetial and unirary tract, skin and skin structures, lower respiratory, acute uncomplicated gonorrhea.",
    "azi": "Azithromycin is used to treat many different types of infections caused by bacteria, such as respiratory infections, skin infections, ear infections, and sexually transmitted diseases.",
    "cef": "Azithromycin is used to treat many different types of infections caused by bacteria, such as respiratory infections, skin infections, ear infections, and sexually transmitted diseases.", // Double of azi; legacy
    "bec": "Beclomethasone 50 mcg or 100 mcg inhaler indicated as primary maintenance treatment in patients with persistent symptoms of chronic bronchial asthma.",
    "cex": "Ceftriaxone injection is used to treat certain infections caused by bacteria such as gonorrhea (a sexually transmitted disease), pelvic inflammatory disease (infection of the female reproductive organs that may cause infertility), meningitis (infection of the membranes that surround the brain and spinal cord), and infections of the lungs, ears, skin, urinary tract, blood, bones, joints, and abdomen.",
    "dta": "DTaP-IPV-Hib vaccine protects your child against diphtheria, tetanus, pertussis, polio, and Haemophilus influenzae type b, which are serious and sometimes fatal diseases. When you get your child immunized, you help protect others as well.",
    "hyd": " Hydrochlorothiazide treats fluid retention (edema) in people with congestive heart failure, cirrhosis of the liver, or kidney disorders, or edema caused by taking steroids or estrogen. This medication is also used to treat high blood pressure (hypertension).",
    "ins": "Insulin injection is used to control blood sugar in people who have type 1 diabetes (condition in which the body does not make insulin and therefore cannot control the amount of sugar in the blood) or in people who have type 2 diabetes.",
    "iso": "Isoniazid is used with other medications to treat active tuberculosis (TB) infections. It is also used alone to prevent active TB infections in people who may be infected with the bacteria (people with positive TB skin test). Isoniazid is an antibiotic and works by stopping the growth of bacteria.",
    "lam": "Lamivudine 10 mg/mL solution (240 mL)",
    "med": "Medroxyprogesterone is a progestogen, which is a female hormone. It is used to prevent pregnancy. It is a very effective and safe form of contraception.",
    "met": " Metformin is used in patients with type 2 diabetes. Controlling high blood sugar helps prevent kidney damage, blindness, nerve problems, loss of limbs, and sexual function problems.",
    "partab": "Paracetamol is a pain reliever and a fever reducer. The exact mechanism of action of is not known.",
    "parsyr": "Paracetamol is a pain reliever and a fever reducer. The exact mechanism of action of is not known.",
    "rif150": "FDC regimen for treatment of tuberculosis.",
    "rif60": "FDC regimen for treatment of tuberculosis.",
    "sod": "Sodium Chloride used to flush wounds and skin abrasions, as eye drops, for intravenous infusion, rinsing contact lenses, nasal irrigation, and a variety of other purposes.",
    "ten": "Antiretroviral drugs (ARVs) will be used in the first line treatment of HIV-positive patients.",
    "tet": "Tetanus toxoid vaccine is given to provide protection (immunity) against tetanus (lockjaw) in adults and children 7 years or older.",
    "val": "Sodium valproate is used to prevent epileptic seizures in children.",
    "car": "Sodium valproate is used to prevent epileptic seizures in children.", // Double of VAL; legacy
    "hex": "DTaP-IPV-Hib vaccine protects your child against diphtheria, tetanus, pertussis, polio, and Haemophilus influenzae type b, which are serious and sometimes fatal diseases. When you get your child immunized, you help protect others as well." // Double of DTA; legacy
  };

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
    var $btns = [];
    var dom = {};
    // Create a list of indexes that point us to where each ID is
    // in the the list of province objects so that we don't have to
    // search the array every time we want to find a province
    provinces.forEach(function(province,i) {
      var code = province.code;

      provinceIndex[code] = i;

      $btns.push(createButton(province.name,code,code === 'EC'));
    });

    // Add buttons to DOM
    dom.target = 'prvBtns';
    dom.change = $btns;
    dom.type = 'list';

    view(dom);

    // Capture button DOM
    DOM.$btns = $('.prv-btn');

    // Attach click handlers and display province data as callback
    buttonClickHandlers(displayProvinceData.bind(null,'EC'));
  }

  function createButton(name,code,active) {
    var $btn = $('<button class="btn prv-btn" type="button" data-code="' + code + '">' + name + '</button>');
    var $listItem = $('<li class="list-item"></li>').add($btn);

    if(active) $btn.addClass('active');

    return $listItem;
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

  function buttonClickHandlers(cb) {
    // Event listener should only be attached once we've
    // gotten the data we need
    var $btns = DOM.$btns;

    $btns.on('click', function(e) {
      var $target = $(e.target);
      var code = $target.attr('data-code');

      // Toggle active button classes
      $btns.removeClass('active');
      $target.addClass('active');

      // Show province data
      if(code) {
        displayProvinceData(code);
      } else {
        console.log('Province data does not exist for province with code ' + code);
      }
    });

    if(cb) {
      cb();
    }
  }

  // Generate a row in the medicines table
  function medicineRow(row) {
    var code = row.code;
    var medicine = row.name;
    var stringSplit = medicine.split('(');
    var name = stringSplit[0] ? stringSplit[0] : '';
    var dosage = stringSplit[1] ? '(' + stringSplit[1] : '';
    var $row = $('<div class="' + row.status + '"></div>');
    var $info = $('<div class="med-info" id="' + code + '-heading"></div>');
    var $toggle = $('<div class="med-row row" aria-controls="info-' + code + '" data-toggle="collapse" data-parent="#stock-table" aria-expanded="false" data-target="#info-' + code + '"></div>');
    var $box = $('<div id="info-' + code + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + code + '-heading">' + constants.MEDICINES[code] + '</div>');
    var $medName = $('<div class="med-name col-xs-7">' + name + '</div>');
    var $medDosage = $('<span class="med-dosage">' + dosage + '</span>');
    var $medAvail = $('<div class="med-avail text-xs-center col-xs-3"><strong>' + row.avail + '%</strong></div>');
    var $medChecks = $('<div class="med-checks text-xs-center col-xs-2">' + row.totalChecks + '</div>');

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
              domTarget.html(domChange);
              break;
            case 'list':
              domTarget.append(domChange);
              break;
            case 'img':
              domTarget.attr('src','img/' + domChange);
              break;
            case 'dash':
              domTarget.attr('stroke-dashoffset',domChange);
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
        stockTable.push(medicineRow(row));
      });

      // Create new DOM
      dom.push({ target: 'prvName', change: province.name });
      dom.push({ target: 'prvClinics', change: stats.total_clinics });
      dom.push({ target: 'prvImg', change: constants.PRV_IMAGES[code], type: 'img' });
      dom.push({ target: 'stockTable', change: stockTable, type: 'list' });
      dom.push({ target: 'prvAvail', change: availability + '%' });
      dom.push({ target: 'availDate', change: dateFormat });

      // Set the view
      view(dom);

      // Grab medicine row DOM references
      DOM.$medicines = $('#prv-stock-table .med-row');
    } else {
      console.log('No data for province code ' + code);
      clear();
    }
  }
})(window);
