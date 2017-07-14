$(function() {

});

$('#1').click(function(){
    defineRequest(1);
});

$('#2').click(function(){
    defineRequest(2);
});

$('#3').click(function(){
    defineRequest(3);
});


function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
      var value = properties[p];
      if (p && p.substr(-2, 2) == '[]') {
        var adjustedName = p.replace('[]', '');
        if (value) {
          normalizedProps[adjustedName] = value.split(',');
        }
        delete normalizedProps[p];
      }
    }
    for (var p in normalizedProps) {
      // Leave properties that don't have values out of inserted resource.
      if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
        var propArray = p.split('.');
        var ref = resource;
        for (var pa = 0; pa < propArray.length; pa++) {
          var key = propArray[pa];
          if (pa == propArray.length - 1) {
            ref[key] = normalizedProps[p];
          } else {
            ref = ref[key] = ref[key] || {};
          }
        }
      };
    }
    return resource;
  }

function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

function executeRequest(request) {
    request.execute(function(response) {
      maxIndex = response.items.length - 1;
      i = Math.floor(Math.random() * maxIndex);
      playlistId = response.items[i].id.playlistId;
      $.get("player/player.html", function(data) {
        embeddedVideo = data.replace('{{id}}',playlistId);
        $("#results").empty();
        $("#results").append(embeddedVideo);
      });

    });
  }

function buildApiRequest(requestMethod, path, parameters, properties = null) {
    var params = this.removeEmptyParams(parameters);
    var request;
    if (properties) {
      var resource = this.createResource(properties);
      request = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    this.executeRequest(request);
  }

  
function defineRequest(requestId) {
  if (requestId == 1) {
    query = 'slow vibes';
  } else if (requestId == 2) {
    query = 'indie apartment party';
  } else if (requestId == 3) {
    query = 'instrumental';
  }
	buildApiRequest('GET',
                '/youtube/v3/search',
                {'q': query,
                 'maxResults': '5',
                 'part': 'snippet',
                 'order': 'viewCount',
                 'type': 'playlist',
                 'key': 'AIzaSyCc5f8x3S-0X3eBeZ5eAZ-2lO9qd4fB3eY' });

  }