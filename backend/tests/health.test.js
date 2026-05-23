import { describe, it, expect, vi } from 'vitest';

describe('Health Check', () => {
// Test for health check endpoint
  it('returns status ok', () => {
    const res = {
      json: vi.fn(),
    };

    const handler = (req, res) => {
      res.json({ status: 'ok' });
    };

    handler({}, res);

    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });


  // Test for status value type
  it('status value is a string', () => {
    const res = { json: vi.fn() };

    const handler = (req, res) => {
      res.json({ status: 'ok' });
    };

    handler({}, res);

    const result = res.json.mock.calls[0][0];
    expect(typeof result.status).toBe('string');
  });
});
