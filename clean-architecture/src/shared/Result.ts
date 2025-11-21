export type Result<T, E> = 
    | { success: true; data: T; isSuccess: true; isFailure: false, value: T }
    | { success: false; error: E; isSuccess: false; isFailure: true, value: E };

export const ok = <T, E>(data: T): Result<T, E> => ({
    success: true,
    data,
    isSuccess: true,
    isFailure: false,
    value: data,
});

export const fail = <T, E>(error: E): Result<T, E> => ({
    success: false,
    error,
    isSuccess: false,
    isFailure: true,
    value: error,
});