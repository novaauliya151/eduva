import {create} from 'zustand';
import type {User} from './types';
type State={user:User|null;token:string|null;setSession:(u:User,t:string)=>void;logout:()=>void};
export const useAuth=create<State>(set=>({user:JSON.parse(localStorage.getItem('eduva_user')??'null'),token:localStorage.getItem('eduva_token'),setSession:(user,token)=>{localStorage.setItem('eduva_user',JSON.stringify(user));localStorage.setItem('eduva_token',token);set({user,token})},logout:()=>{localStorage.removeItem('eduva_user');localStorage.removeItem('eduva_token');set({user:null,token:null})}}));
