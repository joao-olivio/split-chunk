const originalLog = {};
global.mockConsole = () => {
  global.restoreConsole();

  originalLog.error = window.console.error;
  originalLog.warn = window.console.warn;
  originalLog.info = window.console.info;

  window.console.error = jest.fn();
  window.console.warn = jest.fn();
  window.console.info = jest.fn();

  return window.console;
};

global.restoreConsole = () => {
  if (originalLog.error) {
    window.console.error = originalLog.error;
    window.console.warn = originalLog.warn;
    window.console.info = originalLog.info;
  }
};
