// src/shared/health.ts
const START_TIME = Date.now();

export type Health = {
    status: 'ok';
    uptime: number;
    timestamp: string;
};

/**
 * Función trivial para comprobar el correcto arranque/tooling.
 */
export const health = (): Health => {
    return {
        status: 'ok',
        uptime: (Date.now() - START_TIME) / 1000,
        timestamp: new Date().toISOString(),
    };
};
