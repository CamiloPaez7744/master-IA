import { describe, it, expect } from 'vitest';
import { health } from '../../src/shared/health';

describe('health()', () => {
  it('should return status "ok", a numeric uptime >= 0 and a valid ISO timestamp', () => {
  const h = health();

    expect(h).toHaveProperty('status', 'ok');
    expect(typeof h.uptime).toBe('number');
    expect(h.uptime).toBeGreaterThanOrEqual(0);

    // timestamp should be an ISO string produced by toISOString()
    const reconstructed = new Date(h.timestamp).toISOString();
    expect(reconstructed).toBe(h.timestamp);

    // timestamp should be recent (within 5s)
    const now = Date.now();
    const diff = Math.abs(new Date(h.timestamp).getTime() - now);
    expect(diff).toBeLessThan(5000);
  });
});
