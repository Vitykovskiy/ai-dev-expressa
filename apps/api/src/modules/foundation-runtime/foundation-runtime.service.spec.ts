import { FoundationRuntimeService } from './foundation-runtime.service';

describe('FoundationRuntimeService', () => {
  it('returns the shared foundation health contract', () => {
    const service = new FoundationRuntimeService();

    expect(service.getHealth()).toEqual({
      status: 'ok',
      service: 'api',
    });
  });
});
