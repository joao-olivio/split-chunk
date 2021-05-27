let originalFetch;
global.mockFetch = (response) => {
  global.restoreFetch();

  originalFetch = global.fetch;
  global.fetch = jest.fn();

  response = Object.assign({
    json: jest.fn().mockReturnValue(response.responseText)
  }, response);

  global.fetch.mockReturnValue(Promise.resolve(response));
  return global.fetch;
};

global.restoreFetch = () => {
  if (originalFetch) {
    global.fetch = originalFetch;
  }
};
