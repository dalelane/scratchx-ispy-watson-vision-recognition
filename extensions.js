(function(ext) {

    ext.resultscache = {};

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.classify_image = function (location, callback) {
      $.ajax({
        url: 'https://scratch-ispy.eu-gb.mybluemix.net/recognise?url=' + location,
        dataType: 'jsonp',
        success: function( myresults ) {
          console.log(myresults);

          var filtered = myresults.filter(function (obj) {
              return obj.score >= 0.59 &&
                     obj.name.indexOf(' color') === -1;
          });

          ext.resultscache[location] = filtered;
          callback(filtered.length);
        },
        error: function (err) {
          console.log(err);
          callback([]);
        }
      });
    };

    ext.get_image_class = function (idx, location) {
      if (ext.resultscache[location] && ext.resultscache[location].length > idx) {
        return ext.resultscache[location][idx].name;
      }
      else {
        return '';
      }
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'recognise objects in %s', 'classify_image', 'url'],
            ['r', 'get recognised object %d from %s', 'get_image_class', 0, 'url']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Watson Vision Recognition', descriptor, ext);
})({});
