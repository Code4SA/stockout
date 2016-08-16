(function(window) {
  var qs = document.querySelector.bind(document);
  var qsa = document.querySelectorAll.bind(document);
  var stockoutData = null;
  var images = {
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
  // Cache the DOM for each province so that we don't have to
  // remake it all every time a province is selected
  var domCache = {};
  var provinceIndex = {};

  // DOM Containers
  var $inStock = qs('#prv-in-stock tbody');
  var $stockouts = qs('#prv-stockouts tbody');
  var $btns = qsa('.prv-btn');
  var $clinicsTotal = qs('#clinics-total');
  var $prvClinics = qs('#prv-clinics');
  var $prvName = qs('#prv-name');
  var $prvImg = qs('#prv-image');

  // Pull in data
  fetch('result.json')
    .then(function(res) {
        if(!res.ok) console.log('Error with response.');
        else {
          return res.json()
          .then(function(data) {
            stockoutData = data;

            // Update total number of clinics
            $clinicsTotal.innerHTML = stockoutData.total_clinics;

            // Create a list of indexes that point us to where each ID is
            // in the the list of province objects so that we don't have to
            // search the array every time we want to find a province
            stockoutData.provinces.forEach(function(province,i) {
              provinceIndex[province.code] = i;
            });

            displayProvinceData('EC');

            // Event listener should only be attached once we've
            // gotten the data we need
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
          });
        }
      })
    .catch(function(err) {
      console.log('Request errored with following message: ' + err.message);
    });

  // Generate a row in the medicines table
  function medicineRow(medicine) {
    var stringSplit = medicine.split('(');
    var name = stringSplit[0] ? stringSplit[0] : '';
    var dosage = stringSplit[1] ? '(' + stringSplit[1] : '';

    return '<tr><td>' + name + '<span class="dosage">' + dosage + '</span></td></tr>';
  }

  // Clear DOM
  function clear() {
    $inStock.innerHTML = '';
    $stockouts.innerHTML = '';
  }

  // Insert the correct DOM
  function displayProvinceData(code) {
    var province = stockoutData.provinces[provinceIndex[code]];

    if(!!province) {
      var inStock = '';
      var stockouts = '';
      var clinics = {};
      var provinceCache = domCache[code];

      if(!!provinceCache) {
        clinics = provinceCache.clinics;
        inStock = provinceCache.inStock;
        stockouts = provinceCache.stockouts;
      } else {
        var stats = province.stats;
        var medsInStock = stats.medicine_instock;
        var medsStockouts = stats.medicine_stockouts;
        var medicineNames = stockoutData.medicines;

        // Provincial clinics
        $prvName.innerHTML = province.name;
        $prvClinics.innerHTML = 5;
        $prvImg.setAttribute('src','img/' + images[code]);

        // In Stock
        for(var med in medsInStock) {
          inStock = inStock += medicineRow(medicineNames[med]);
        }

        // Stockouts
        for(var med in medsStockouts) {
          stockouts = stockouts += medicineRow(medicineNames[med]);
        }

        // Add these to the cache
        var provinceCache = {};

        provinceCache.inStock = inStock;
        provinceCache.stockouts = stockouts;
        provinceCache.clinics = clinics;
        domCache[code] = provinceCache;
      }

      // Push these to the DOM
      $inStock.innerHTML = inStock;
      $stockouts.innerHTML = stockouts;
    } else {
      console.log('No data for province code ' + code);
      clear();
    }
  }
})(window);
