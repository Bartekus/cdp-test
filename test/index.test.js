const path = require('path');

require('chai').should();
const co = require('co'); // Note: poor mans async/await

const cdpTest = require('..');

describe('cdpTest', function () {
    let browser, window;

    this.timeout(55000); // Note: end-to-end tests are slow...

    before(function () {
        return co(function* () {
            browser = yield cdpTest.launching({
                browser: 'chrome',
                port: 9444,
                userDataDir: path.join(__dirname, '../.tmp/userData'),
                verbose: false
            });
            window = yield browser.connecting();
        });
    });

    it('should search on github.com', function () {
        return co(function* () {
            yield window.navigating('https://github.com/search');
            yield window.waitForElement("input[name='q']");
            yield window.type('cdp-test', "input[name='q']");
            yield window.click("button[type='submit']");
            yield window.waitForElement("ul.repo-list");
            (yield window.textOf("ul.repo-list")).should.contain('bartekus');
        });
    });

    after(function () {
        if (window) window.close();
        if (browser) browser.close();
    });
});