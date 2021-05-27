global.mockEventEmit = () => {
  global.restoreEventEmit();
  window.eventBus = window.eventBus || {};
  window.eventBus.$emit = jest.fn();
  return window.eventBus.$emit;
};

global.restoreEventEmit = () => {
  if (window.eventBus && window.eventBus.$emit) {
    window.eventBus.$emit = undefined;
  }
};


global.mockEventOn = () => {
  global.restoreEventOn();
  window.eventBus = window.eventBus || {};
  window.eventBus.$on = jest.fn();
  return window.eventBus.$on;
};

global.restoreEventOn = () => {
  if (window.eventBus && window.eventBus.$on) {
    window.eventBus.$on = undefined;
  }
};
