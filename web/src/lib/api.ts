import { NEXT_PUBLIC_SERVER_URL } from '@/config';
import axios, { type AxiosRequestConfig } from 'axios';

const baseURL = `${NEXT_PUBLIC_SERVER_URL}/api`;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken') || '';
    config.headers.Authorization = accessToken;
  }
  return config;
});

const fetcher = async (url: string, options: AxiosRequestConfig = {}) => {
  try {
    const { method = 'GET', params, data, headers = {} } = options;

    const config: AxiosRequestConfig = {
      method,
      url,
      params,
      data,
      headers,
    };

    if (data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const api = {
  charity: {
    getList: (params) => fetcher('/charity', { params }),
    getFeatured: () => fetcher('/charity/featured'),
    getBySlug: (slug) => fetcher(`/charity/slug/${slug}`),
    getById: (id) => fetcher(`/charity/${id}`),
    register: (data) => fetcher('/charity', { method: 'POST', data }),
    login: (data) => fetcher('/charity/login', { method: 'POST', data }),
    update: (id, data) => fetcher(`/charity/${id}`, { method: 'PUT', data }),
  },
  project: {
    getList: (params) => fetcher('/project', { params }),
    getOfCharity: (params) => fetcher('/project/charity', { params }),
    getFeatured: () => fetcher('/project/featured'),
    getBySlug: (slug) => fetcher(`/project/slug/${slug}`),
    getById: (id) => fetcher(`/project/${id}`),
    create: (data) => fetcher('/project', { method: 'POST', data }),
    update: (id, data) => fetcher(`/project/${id}`, { method: 'PUT', data }),
  },
  transaction: {
    getList: (params) => fetcher('/transaction', { params }),
  },
  setting: {
    get: () => fetcher('/setting'),
  },
};
