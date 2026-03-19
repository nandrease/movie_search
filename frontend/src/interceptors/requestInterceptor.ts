export type RequestInterceptor = <T>(
  actionName: string,
  work: () => Promise<T>,
) => Promise<T>;

let activeInterceptor: RequestInterceptor = async <T>(
  _actionName: string,
  work: () => Promise<T>,
) => await work();

export function setRequestInterceptor(interceptor: RequestInterceptor): void {
  activeInterceptor = interceptor;
}

export async function interceptAsyncRequest<T>(
  actionName: string,
  work: () => Promise<T>,
): Promise<T> {
  return await activeInterceptor(actionName, work);
}

