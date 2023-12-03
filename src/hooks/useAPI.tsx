import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import request from '@utils/request';

const useAPI = (
  endpoint,
  method,
  config,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { param, query, headers, axiosRequestConfig = {}, reactQueryOptions = {} } = config as any;

  const key = config?.key ?? [endpoint, method, param, query].filter(Boolean);
  const isMutation: boolean = (method as string).toLowerCase() !== 'get';
  const isInfinite: boolean = !isMutation && reactQueryOptions?.infinite;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useRequest = (isMutation ? useMutation : isInfinite ? useInfiniteQuery : useQuery) as any

    
  return useRequest(
    key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (variables: any = undefined) => {
      const _param = variables?.pageParam?.param || param;
      const url: string = Object.keys(_param || {}).reduce((url: string, key: string) => {
        return url.replace(new RegExp(`{${key}}`, 'g'), `${_param[key]}`);
      }, endpoint);

      return request({
        url,
        method: method as string,
        params: { ...(query || {}), ...(variables?.pageParam?.query || {}) },
        data: variables,
        headers,
        ...axiosRequestConfig,
      });
    },
    reactQueryOptions,
  );
};

export default useAPI;

