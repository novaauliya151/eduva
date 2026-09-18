import axios from 'axios';
const baseURL=import.meta.env.VITE_API_URL??'http://localhost:4000/api';
export const api=axios.create({baseURL,withCredentials:true});
api.interceptors.request.use(config=>{const token=localStorage.getItem('eduva_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config});
let refreshing:Promise<string>|null=null;
api.interceptors.response.use(response=>response,async error=>{const request=error.config;if(error.response?.status!==401||request?._retry||String(request?.url).includes('/auth/'))throw error;request._retry=true;refreshing??=axios.post(`${baseURL}/auth/refresh`,{},{withCredentials:true}).then(response=>{const token=response.data.token;localStorage.setItem('eduva_token',token);return token}).finally(()=>{refreshing=null});try{const token=await refreshing;request.headers.Authorization=`Bearer ${token}`;return api(request)}catch(refreshError){localStorage.removeItem('eduva_token');localStorage.removeItem('eduva_user');location.href='/login';throw refreshError}});
