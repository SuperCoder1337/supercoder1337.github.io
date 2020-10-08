/**
 *  USED BY CommunityWidget (community_messages.js)
 */

var STATE = 0, xhr, reqTimeout;

addEventListener('message', function(e) {
  var data = e.data;
  switch(data.cmd) {
    case 'request':
      queueReq(data.data);
      break;
    case 'release_key':
      queueReleaseKey(data.data);
      break;
  }
}, false);
postMessage({type: 'inited'});

function ajaxQuery(url, query, onDone, onFail) {
  clearTimeout(reqTimeout);
  if (STATE != 0) {
    return;
  }
  STATE = 1;

  xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) {
      return;
    }
    STATE = 0;
    if (xhr.status == 200) {
      if (onDone) onDone(xhr.responseText);
    } else {
      if (xhr.status == 0) {
        return;
      }
      if (onFail) onFail();
    }
    clearTimeout(reqTimeout);
  };

  var query_arr = [];
  for(var i in query) {
    query_arr.push(i + '=' + query[i]);
  }

  xhr.open('POST', url, true);
  xhr.send(query_arr.join('&'));

  // network connection error check
  reqTimeout = setTimeout(function() {
    console.log('Network error!');
    try {
      xhr.abort();
    } catch(e) { }
    setTimeout(function() {
      STATE = 0;
      ajaxQuery(url, query, onDone, onFail);
    }, 3000);
  }, (query.wait * 1000) + 1000);
}

function queueReq(data) {
  var keys = [], ts = [];
  for(var i in data.keys) {
    keys.push(data.keys[i].key);
    ts.push(data.keys[i].ts);
  }

  var query = {
    act: 'a_check',
    id: data.uid,
    wait: data.wait,
    key: keys.join(''),
    ts: ts.join('_'),
    version: data.version || 1,
    mode: 202,
  };

  ajaxQuery(data.serverUrl, query, function(response) {
    queueParseResponse(response, data.keys);
  }, function() {
    queueError();
  });
}

function queueParseResponse(res, keys) {
  try {
    res = JSON.parse(res);
  } catch(e) {
    res = null;
  }
  if (!isArray(res)) {
    res = [res];
  }

  var keys_key = Object.keys(keys), fails = [], events = [];
  for(var i in res) {
    var item = res[i], key = keys_key[i];
    if (item.ts) {
      keys[key].ts = item.ts;

      if (item.updates) {
        for(var j in item.updates) events.push(item.updates[j]);
      } else {
        for(var j in item.events) events.push(item.events[j]);
      }
    } else {
      fails.push(key);
    }
  }
  postMessage({type: 'request_complete', fails: fails, events: events, keys: keys});
}

function queueError() {
  console.log('Queue error');
}

function queueReleaseKey(d) {
  try {
    xhr.abort();
  } catch(e) { }
  STATE = 0;
  var query = {
    act: 'a_release',
    id: d.queueInfo.uid,
    wait: d.queueInfo.wait,
    key: d.key_data.key,
    ts: d.key_data.ts,
  };
  ajaxQuery(d.queueInfo.serverUrl, query, function() {
    postMessage({type: 'released'});
  }, function() {
    postMessage({type: 'released'});
  });
}

function isArray(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; }
