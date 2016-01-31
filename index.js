const { ToggleButton } = require('sdk/ui/button/toggle');
const panels = require("sdk/panel");
const self = require("sdk/self");
const prefs = require("sdk/simple-prefs");
const tabs = require("sdk/tabs");

function getToggleButtonIcon(enabled) {
      return {
        "16": (enabled ? './icon-16-enabled.png' : './icon-16.png'),
        "32": (enabled ? './icon-32-enabled.png' : './icon-32.png'),
        "64": (enabled ? './icon-64-enabled.png' : './icon-64.png')
      }
    }

var start_url = '';

if ((prefs.prefs.spURL.indexOf('http://that.startpage.rocks/firefox_addon/') === 0)) {
      start_url =prefs.prefs.spURL;
    } else {
      start_url = 'start.html';
}


var button = ToggleButton({
  id: "my-button",
  label: "That Startpage Rocks - Apps",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});


var panel = panels.Panel({
  contentURL: self.data.url(start_url),
  onHide: handleHide,
  contentScriptFile: self.data.url("main.js"),
  width:300,
  height:500
});

panel.port.on("open-link", function(url) {
  if (url == '#settings') {
    panel.contentURL = self.data.url('settings.html')
  }
  if (url == '#start') {
    panel.contentURL = self.data.url(prefs.prefs.spURL);
  }
  if (url == '#reload') {
    panel.contentURL = self.data.url('start.html');
  }
  if (url == '#sp-edit') {
    tabs.open('http://that.startpage.rocks/edit');
    panel.hide();
  }
  if (url == '#sp-add') {
    let taburl = tabs.activeTab.url;
    tabs.open('http://that.startpage.rocks/add?url='+taburl);
    panel.hide();
  }
  if (url == '#report') {
    tabs.open('https://github.com/the-duck/tsr-firefox/issues/new');
    panel.hide();
  }
  if (url == '#review') {
    tabs.open('https://addons.mozilla.org/en-US/firefox/addon/that-startpage-rocks/');
    panel.hide();
  }
});
panel.port.on("set-url", function(url) {
  if (url!='') {
    panel.contentURL = url;
    prefs.prefs.spURL = url;
  }
});


function handleChange(state) {
  if (state.checked) {
    button.icon = getToggleButtonIcon(state.checked);
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
    button.icon = getToggleButtonIcon(false);
}
