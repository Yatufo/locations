const artoo = require('artoo-js');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['scrapper.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--start-maximized']
    }
  },
  onPrepare: () => {
    var width = 1400;
    var height = 800;
    browser.driver.manage().window().setSize(width, height);

    browser.waitForAngularEnabled(false);
    global.EC = protractor.ExpectedConditions;
    global.artoo = artoo;
  },
  
};
