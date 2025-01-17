const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mock = new MockBrowser();

global['navigator'] = mock.getNavigator();