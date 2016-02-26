const { ToggleButton } = require('sdk/ui/button/toggle');
const panels = require("sdk/panel");
const self = require("sdk/self");
const prefs = require("sdk/simple-prefs");
const tabs = require("sdk/tabs");
const ss = require("sdk/simple-storage");
const gprefs = require("sdk/preferences/service");
const {Cc, Ci} = require('chrome');
const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);


var start_url = '';
var new_tab_url = '';
//ss.storage.user = "5178081291534336"; // for debugging
if (ss.storage.user) {
      start_url ="http://that.startpage.rocks/firefox_addon/"+ss.storage.user;
      new_tab_url = "http://that.startpage.rocks/"+ss.storage.user;
    } else {
      start_url = 'start.html';
      new_tab_url = 'http://that.startpage.rocks/signup'
}

function getToggleButtonIcon(enabled) {
      return {
        "16": (enabled ? './icon-16-enabled.png' : './icon-16.png'),
        "32": (enabled ? './icon-32-enabled.png' : './icon-32.png'),
        "64": (enabled ? './icon-64-enabled.png' : './icon-64.png')
      }
    }


var button = ToggleButton({
  id: "my-button",
  label: "That Startpage Rocks",
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
    panel.contentURL = self.data.url(start_url);

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
panel.port.on("set-user", function(url) {
  if (url!='') {
    start_url = "http://that.startpage.rocks/firefox_addon/"+url;
    new_tab_url = "http://that.startpage.rocks/"+url;
    panel.contentURL = start_url;
    ss.storage.user = url;
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


// access global startup prefs
var { PrefsTarget } = require("sdk/preferences/event-target");
var target = PrefsTarget({ branchName: "browser.startup."});
// set the newtab url preference on startup / install / enable / upgrade
exports.main = function (options, callbacks) {
          overrideNewTabPage();
};
// overrides the new tab to the (first) homepage
function overrideNewTabPage() {
  // Firefox allows multiple piped homepages, take the first if necessary
  //var homepage = gprefs.getLocalized("browser.startup.homepage", "about:home").split("|")[0];
  aboutNewTabService.newTabURL = new_tab_url;
}
