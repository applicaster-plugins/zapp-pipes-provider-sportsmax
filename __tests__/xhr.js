export function XHRMock() {
  return {
    open: jest.fn(),
    send: jest.fn(() => {
      onload = this.onload.bind(this);
      onerror = this.onerror.bind(this);
      onreadystatechange = this.onreadystatechange.bind(this);
    }),
    setRequestHeaders: jest.fn(),
  };
}
