import {useState} from 'react';
import {Check,Eye,RotateCcw,Save} from 'lucide-react';
import {api} from '../api';
import {DEFAULT_THEME,THEME_PRESETS,applyTheme,useTheme,type Theme} from '../theme';

const labels:Record<string,string>={emerald_prestige:'Emerald Prestige',royal_crimson:'Royal Crimson',imperial_purple:'Imperial Purple',ocean_royale:'Ocean Royale',rose_royale:'Rose Royale',custom:'Kustom'};
const fields:[keyof Theme,string][]=[['primaryColor','Primary'],['secondaryColor','Secondary'],['accentColor','Accent / CTA'],['backgroundColor','Background'],['textColor','Text']];
export function ThemeSettings(){
 const {theme,setTheme}=useTheme(),[draft,setDraft]=useState<Theme>(theme),[saving,setSaving]=useState(false),[message,setMessage]=useState('');
 const select=(item:Theme)=>{setDraft(item);setMessage('')};
 const preview=()=>{applyTheme(draft);setMessage('Preview aktif. Simpan untuk menerapkan ke semua pengguna.')};
 const save=async()=>{setSaving(true);setMessage('');try{const{data}=await api.put('/admin/settings/theme',draft);setTheme(data);setDraft(data);setMessage('Tema berhasil disimpan dan diterapkan.')}catch(e:any){setMessage(e.response?.data?.message||'Tema gagal disimpan.')}finally{setSaving(false)}};
 const reset=async()=>{setSaving(true);try{const{data}=await api.post('/admin/settings/theme/reset');setTheme(data);setDraft(data);setMessage('Tema dikembalikan ke Ocean Royale.')}catch{setMessage('Tema gagal direset.')}finally{setSaving(false)}};
 const custom=(key:keyof Theme,value:string)=>setDraft(prev=>({...prev,themeName:'custom',[key]:value}));
 return <div className="theme-settings"><div className="page-heading"><div><span className="eyebrow purple">TAMPILAN WEBSITE</span><h2>Pengaturan Tema</h2><p>Pilih palet atau susun warna kustom. Preview hanya terlihat di perangkat ini sampai disimpan.</p></div></div>
  <section className="theme-presets">{Object.values(THEME_PRESETS).map(item=><button key={item.themeName} className={draft.themeName===item.themeName?'selected':''} onClick={()=>select(item)}><div className="swatches">{fields.map(([key])=><i key={key} style={{background:item[key]}}/>)}</div><span>{labels[item.themeName]}</span>{item.themeName==='ocean_royale'&&<small>DEFAULT</small>}{draft.themeName===item.themeName&&<Check/>}</button>)}</section>
  <section className="custom-theme"><div><h3>Warna kustom</h3><p>Gunakan pemilih warna atau masukkan kode hex.</p></div><div className="color-fields">{fields.map(([key,label])=><label key={key}><span>{label}</span><div><input type="color" value={draft[key]} onChange={e=>custom(key,e.target.value.toUpperCase())}/><input type="text" pattern="#[0-9A-Fa-f]{6}" maxLength={7} value={draft[key]} onChange={e=>custom(key,e.target.value.toUpperCase())}/></div></label>)}</div></section>
  <div className="theme-preview"><div style={{background:draft.backgroundColor,color:draft.textColor}}><span style={{background:draft.primaryColor,color:'#fff'}}>Eduva</span><h3>Belajar lebih fokus.</h3><p>Contoh tampilan kartu dengan tema pilihan Anda.</p><button style={{background:draft.accentColor,color:'#19130a'}}>Mulai belajar</button></div></div>
  {message&&<p className="theme-message">{message}</p>}<div className="theme-actions"><button className="secondary-action" onClick={reset} disabled={saving}><RotateCcw/> Reset ke Default</button><button className="secondary-action" onClick={preview}><Eye/> Preview</button><button className="primary-action" onClick={save} disabled={saving}><Save/> {saving?'Menyimpan...':'Simpan & Terapkan'}</button></div>
 </div>
}
