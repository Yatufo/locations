var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['scraper.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--start-maximized']
    }
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 1000000000,
    showColors: true
  },
  onPrepare: () => {
    var width = 1440;
    var height = 900;
    browser.driver.manage().window().setSize(width, height);
    browser.driver.manage().window().maximize();

    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: '/tmp/screenshots'
    }));

    browser.waitForAngularEnabled(false);
    global.EC = protractor.ExpectedConditions;
  },

};
