


function openTab(url){self.port.emit('open-link', url.toString())}

window.addEventListener('click', function(event) {
  var t = event.target;
   if (t.id == 'settings') {
     self.port.emit('open-link', '#settings');
   }
   if (t.id == 'back') {
     self.port.emit('open-link', '#start');
   }
   if (t.id == 'reload') {
     self.port.emit('open-link', '#reload');
   }
   if (t.id == 'sp-edit') {
     self.port.emit('open-link', '#sp-edit');
   }
   if (t.id == 'sp-add') {
     self.port.emit('open-link', '#sp-add');
   }
   if (t.id == 'report') {
     self.port.emit('open-link', '#report');
   }
   if (t.id == 'review') {
     self.port.emit('open-link', '#review');
   }

  }, false)

window.addEventListener('submit', function(event) {
    var t = document.getElementById('text');
    if ((t.value.indexOf('http://that.startpage.rocks/') === 0) || (t.value.indexOf('that.startpage.rocks/') === 0)){
      id = t.value.split('/');
      id = id[id.length - 1];
      var new_url =id;
      self.port.emit('set-user',new_url);
    } else {
      /*do something */
    }

    }, false)
