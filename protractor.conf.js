var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html'
});

exports.config = {
  params: {
    matrixUrl: "http://matrix.centris.ca/Matrix/Public/Portal.aspx?ID=1-1123550629-11&L=1",
    rmaxUrl: "http://www.remax-quebec.com/en/recherche/residentielle/index.rmx"
  },
  specs: ['js/scraper.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--start-maximized', '--no-sandbox', '--test-type=browser'], //'--headless', '--disable-gpu', '--remote-debugging-port=9222',
      'prefs': {
        'profile.managed_default_content_settings.images': 2
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
    var height = 1024;
    browser.driver.manage().window().setSize(width, height);
    browser.driver.manage().window().maximize();

    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(reporter);


    browser.ignoreSynchronization = true; // or false
    global.EC = protractor.ExpectedConditions;


    function toElement(selector) {
      if (typeof selector === 'string' || selector instanceof String) {
        return element.all(by.css(selector)).first();
      }
      return selector;
    }

    function waitFor(selector, timeout) {
      const e = toElement(selector)
      return browser.wait(EC.elementToBeClickable(e), timeout || 5000);
    }

    global.toElement = toElement;

    global.waitFor = waitFor;

    global.waitAndClick = (selector, timeout) => {
      const e = toElement(selector);
      return waitFor(e, timeout).then(e.click);
    }
  },
  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve) {
      reporter.beforeLaunch(resolve);
    });
  },
  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve) {
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
};
