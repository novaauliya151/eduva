import {create} from 'zustand';
import {api} from './api';

export type Theme={themeName:string;primaryColor:string;secondaryColor:string;accentColor:string;backgroundColor:string;textColor:string};
export const DEFAULT_THEME:Theme={themeName:'ocean_royale',primaryColor:'#03045E',secondaryColor:'#023EBA',accentColor:'#FBB02D',backgroundColor:'#CAF0F8',textColor:'#03071E'};
export const THEME_PRESETS:Record<string,Theme>={
 emerald_prestige:{themeName:'emerald_prestige',primaryColor:'#081C15',secondaryColor:'#1B4322',accentColor:'#FBB02D',backgroundColor:'#EBF2FA',textColor:'#081C15'},
 royal_crimson:{themeName:'royal_crimson',primaryColor:'#5400DE',secondaryColor:'#9E2A2B',accentColor:'#E09F3E',backgroundColor:'#FFF8F0',textColor:'#2B2024'},
 imperial_purple:{themeName:'imperial_purple',primaryColor:'#240046',secondaryColor:'#E0AAFF',accentColor:'#FBB02D',backgroundColor:'#ECCAFF',textColor:'#03071E'},
 ocean_royale:DEFAULT_THEME,
 rose_royale:{themeName:'rose_royale',primaryColor:'#602437',secondaryColor:'#8A2846',accentColor:'#E05780',backgroundColor:'#FFCAD4',textColor:'#35121D'}
};
export function applyTheme(theme:Theme){const root=document.documentElement;root.style.setProperty('--color-primary',theme.primaryColor);root.style.setProperty('--color-secondary',theme.secondaryColor);root.style.setProperty('--color-accent',theme.accentColor);root.style.setProperty('--color-background',theme.backgroundColor);root.style.setProperty('--color-text',theme.textColor)}
type ThemeState={theme:Theme;loaded:boolean;load:()=>Promise<void>;setTheme:(theme:Theme)=>void};
export const useTheme=create<ThemeState>(set=>({theme:DEFAULT_THEME,loaded:false,load:async()=>{try{const{data}=await api.get('/settings/theme');applyTheme(data);set({theme:data,loaded:true})}catch{applyTheme(DEFAULT_THEME);set({theme:DEFAULT_THEME,loaded:true})}},setTheme:theme=>{applyTheme(theme);set({theme})}}));
