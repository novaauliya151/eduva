import {useEffect,useState} from 'react';
import {api} from '../api';
import type {EduClass} from '../types';
import {Heading} from './FeaturePages';
type Transaction={id:string;amount:string;status:'PENDING'|'PAID'|'FAILED'|'REFUNDED';paymentMethod?:string;createdAt:string;class:{id?:string;title:string};student?:{name:string;email:string}};
const money=(value:string|number)=>`Rp${Number(value).toLocaleString('id-ID')}`;
const date=(value:string)=>new Date(value).toLocaleString('id-ID');

export function CashTransactions(){
 const[items,setItems]=useState<Transaction[]>([]),[classes,setClasses]=useState<EduClass[]>([]),[busy,setBusy]=useState(''),[message,setMessage]=useState('');
 const load=()=>Promise.all([api.get('/transactions'),api.get('/classes')]).then(([transactions,courses])=>{setItems(transactions.data);setClasses(courses.data)});
 useEffect(()=>{load()},[]);
 async function requestCash(classId:string){setBusy(classId);setMessage('');try{await api.post('/payments/cash',{classId});setMessage('Pengajuan berhasil. Serahkan pembayaran kepada admin lalu tunggu persetujuan.');await load()}catch(error:any){setMessage(error.response?.data?.message||'Pengajuan gagal.')}finally{setBusy('')}}
 const pending=new Set(items.filter(item=>item.status==='PENDING').map(item=>item.class.id));
 return <><Heading title="Pembayaran tunai" text="Ajukan pembayaran, serahkan uang kepada admin, lalu tunggu verifikasi."/>{message&&<div className="payment-message">{message}</div>}<div className="data-grid">{classes.map(course=><article className="data-card" key={course.id}><span className="role-pill">TUNAI</span><h3>{course.title}</h3><b>{course.price?money(course.price):'Gratis'}</b><button className="btn approve" disabled={busy===course.id||pending.has(course.id)} onClick={()=>requestCash(course.id)}>{pending.has(course.id)?'Menunggu admin':busy===course.id?'Mengajukan...':'Ajukan pembayaran'}</button></article>)}</div><Heading title="Riwayat pembayaran" text="Pantau hasil moderasi pembayaran tunai."/><div className="table-card"><table><thead><tr><th>Kelas</th><th>Metode</th><th>Jumlah</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td>{item.class.title}</td><td>{item.paymentMethod||'—'}</td><td>{money(item.amount)}</td><td><span className={`status status-${item.status.toLowerCase()}`}>{item.status==='PENDING'?'MENUNGGU ADMIN':item.status}</span></td><td>{date(item.createdAt)}</td></tr>)}</tbody></table></div></>;
}

export function AdminCashPayments(){
 const[items,setItems]=useState<Transaction[]>([]),[filter,setFilter]=useState('PENDING'),[busy,setBusy]=useState('');
 const load=()=>api.get('/admin/transactions',{params:filter==='ALL'?{}:{status:filter}}).then(response=>setItems(response.data));
 useEffect(()=>{load()},[filter]);
 async function review(id:string,status:'PAID'|'FAILED'){setBusy(id);try{await api.patch(`/admin/transactions/${id}/review`,{status});await load()}finally{setBusy('')}}
 return <><Heading title="Moderasi pembayaran tunai" text="Cocokkan uang yang diterima, lalu setujui atau tolak pengajuan." action={<select className="page-select compact" value={filter} onChange={event=>setFilter(event.target.value)}><option value="PENDING">Menunggu</option><option value="PAID">Disetujui</option><option value="FAILED">Ditolak</option><option value="ALL">Semua</option></select>}/><div className="table-card"><table><thead><tr><th>Siswa</th><th>Kelas</th><th>Jumlah</th><th>Diajukan</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td><b>{item.student?.name}</b><small className="block">{item.student?.email}</small></td><td>{item.class.title}</td><td><b>{money(item.amount)}</b></td><td>{date(item.createdAt)}</td><td><span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span></td><td>{item.status==='PENDING'?<><button className="btn approve" disabled={busy===item.id} onClick={()=>review(item.id,'PAID')}>Terima</button><button className="btn danger" disabled={busy===item.id} onClick={()=>review(item.id,'FAILED')}>Tolak</button></>:<span>Sudah dimoderasi</span>}</td></tr>)}</tbody></table>{!items.length&&<div className="empty-state">Tidak ada pembayaran pada status ini.</div>}</div></>;
}
