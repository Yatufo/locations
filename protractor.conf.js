var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  params: {
    startId: undefined
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['scraper.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--start-maximized', '--no-sandbox', '--test-type=browser'],
      'prefs' : {
        'profile.managed_default_content_settings.images' : 2
      }
    }
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 1000000000,
    showColors: true
  },
  baseUrl: 'http://www.centris.ca/en',
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
    global.waitAndClick = (element, timeout) => {
      browser.wait(EC.elementToBeClickable(element), timeout || 5000);
      return element.click();
    }
  },

};
