const mock = (function () {
  return {
    AnalyticsHandler: {
      push(data) {
        window.dataLayer.push(data);
      },
      log(text, type = 'log', data) {
        console.log(text, type, data);
      }
    },
    Analyticsvariables: {
      currentcy: 'USD'
    }
  };
}());

Object.defineProperty(window, 'dataLayer', { value: [] });
Object.defineProperty(window, 'wsf', { value: mock });
