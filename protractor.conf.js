var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  params: {
    startId: undefined
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
    var height = 900;
    browser.driver.manage().window().setSize(width, height);
    browser.driver.manage().window().maximize();

    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: '/tmp/screenshots'
    }));

    browser.waitForAngularEnabled(false);
    global.EC = protractor.ExpectedConditions;


    function toElement(selector) {
      if (typeof selector === 'string' || selector instanceof String){
        return element.all(by.css(selector)).first();
      }
      return selector;
    }

    function waitFor(selector, timeout) {
      const e = toElement(selector)
      return browser.wait(EC.elementToBeClickable(e), timeout || 5000);
    }

    global.waitFor = waitFor;

    global.waitAndClick = (selector, timeout) => {
      const e = toElement(selector);
      return waitFor(e, timeout).then(e.click);
    }
  },

};
