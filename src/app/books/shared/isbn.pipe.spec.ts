import { IsbnPipe } from './isbn.pipe';

describe('IsbnPipe', () => {
  let pipe: IsbnPipe;
  beforeEach(() => {
    pipe = new IsbnPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should transform an ISBN number with dash', function () {
    expect(pipe.transform('987654321')).toEqual('987-654321');
  });
});
