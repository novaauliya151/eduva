import {useEffect,useRef,useState,type ComponentType} from 'react';
import {Award,Banknote,Bell,BookOpen,CalendarDays,ExternalLink,FileCheck2,GraduationCap,LayoutDashboard,LogOut,Medal,Menu,MessageCircle,Palette,Settings,TrendingUp,UserCircle,Users,WalletCards,X} from 'lucide-react';
import {Link,useLocation} from 'react-router-dom';
import {api} from '../api';
import {useAuth} from '../store';
import type {EduClass,Role} from '../types';
import {AdminClasses,AdminReports,AdminUsers,Certificates,LiveSessions,MentorReports,Notifications,ParentPortal,Revenue} from './FeaturePages';
import {AdminCashPayments,CashTransactions} from './CashPayments';
import {ClassDetail,MentorLearning,Profile,ProgressPage,QuizPlay} from './LearningPages';
import {ClassesPage} from './ClassesPage';
import {ForumFull} from './ForumFull';
import {MentorClassManager} from './MentorClassManager';
import {Leaderboard} from './Leaderboard';
import {AdminAnalytics,AdminParentLinks,CashAdminAdvanced,CashStudentAdvanced,LiveManager,MentorMonitoring,ParentTryouts} from './AdvancedPages';
import {ThemeSettings} from './ThemeSettings';

type NavItem={to:string;label:string;Icon:ComponentType<{size?:number}>};
const nav:Record<Role,NavItem[]>={
 STUDENT:[{to:'/dashboard',label:'Ringkasan',Icon:LayoutDashboard},{to:'/classes',label:'Kelas',Icon:BookOpen},{to:'/leaderboard',label:'Leaderboard',Icon:Medal},{to:'/forum',label:'Forum',Icon:MessageCircle},{to:'/live',label:'Live class',Icon:CalendarDays},{to:'/progress',label:'Progres',Icon:TrendingUp},{to:'/certificates',label:'Sertifikat',Icon:Award},{to:'/transactions',label:'Pembayaran',Icon:WalletCards},{to:'/notifications',label:'Notifikasi',Icon:Bell},{to:'/profile',label:'Profil',Icon:UserCircle}],
 MENTOR:[{to:'/dashboard',label:'Ringkasan',Icon:LayoutDashboard},{to:'/mentor/classes',label:'Kelola kelas',Icon:BookOpen},{to:'/mentor/learning',label:'Materi & kuis',Icon:GraduationCap},{to:'/mentor/monitoring',label:'Monitoring siswa',Icon:TrendingUp},{to:'/mentor/reports',label:'Laporan siswa',Icon:FileCheck2},{to:'/forum',label:'Forum',Icon:MessageCircle},{to:'/live',label:'Live class',Icon:CalendarDays},{to:'/notifications',label:'Notifikasi',Icon:Bell},{to:'/profile',label:'Profil',Icon:UserCircle}],
 PARENT:[{to:'/parent',label:'Anak & progres',Icon:Users},{to:'/parent/tryouts',label:'Hasil tryout',Icon:Medal},{to:'/notifications',label:'Notifikasi',Icon:Bell}],
 SUPERADMIN:[{to:'/admin',label:'Ringkasan',Icon:LayoutDashboard},{to:'/admin/users',label:'Pengguna',Icon:Users},{to:'/admin/parents',label:'Parent & anak',Icon:Users},{to:'/admin/classes',label:'Approval kelas',Icon:BookOpen},{to:'/admin/payments',label:'Pembayaran tunai',Icon:WalletCards},{to:'/admin/reports',label:'Approval laporan',Icon:FileCheck2},{to:'/admin/analytics',label:'Analitik & audit',Icon:TrendingUp},{to:'/admin/theme',label:'Pengaturan tema',Icon:Palette},{to:'/notifications',label:'Notifikasi',Icon:Bell}]
};

export function Dashboard(){
 const{user,logout}=useAuth(),path=useLocation().pathname;
 const[menuOpen,setMenuOpen]=useState(false),[settingsOpen,setSettingsOpen]=useState(false);
 useEffect(()=>{setMenuOpen(false);setSettingsOpen(false)},[path]);
 const admin=user!.role==='SUPERADMIN';
 return <div className={`app-shell ${admin?'admin-shell':''}`}>
  <button className="mobile-menu-button" aria-label="Buka menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(x=>!x)}>{menuOpen?<X/>:<Menu/>}</button>
  {menuOpen&&<button className="nav-backdrop" aria-label="Tutup menu" onClick={()=>setMenuOpen(false)}/>}
  <aside className={menuOpen?'mobile-open':''}>
   <div className="sidebar-brand"><div className="brand dark"><GraduationCap/> Eduva</div>{admin&&<small>ADMIN CONSOLE</small>}</div>
   <nav className="sidebar-nav">{nav[user!.role].map(({to,label,Icon})=><Link key={to} to={to} className={path===to?'active':''}><Icon size={19}/> <span>{label}</span>{to==='/notifications'&&<NotificationBadge/>}</Link>)}</nav>
   {admin?<div className="sidebar-user"><UserAvatar name={user!.name} avatarUrl={user!.avatarUrl}/><div className="sidebar-user-copy"><b>{user!.name}</b><span>Superadmin</span></div><div className="admin-settings sidebar-settings"><button aria-label="Pengaturan akun" aria-expanded={settingsOpen} onClick={()=>setSettingsOpen(x=>!x)}><Settings/></button>{settingsOpen&&<div className="admin-account-menu"><div><UserAvatar name={user!.name} avatarUrl={user!.avatarUrl}/><p><b>{user!.name}</b><small>{user!.email}</small></p></div><Link to="/profile"><UserCircle/> Profil</Link><button onClick={logout}><LogOut/> Keluar</button></div>}</div></div>:<button className="logout" onClick={logout}><LogOut/> Keluar</button>}
  </aside>
  <main className="content">
   {admin?<header className="admin-header"><div className="admin-header-title"><span>ADMINISTRATOR</span><h1>{adminPageTitle(path)}</h1></div><div className="admin-header-actions"><a href="/" target="_blank" rel="noreferrer">Lihat Website <ExternalLink/></a></div></header>:<header><div><span className="eyebrow purple">DASHBOARD {user!.role}</span><h1>Halo, {user!.name.split(' ')[0]}! 👋</h1><p>{roleText(user!.role)}</p></div><UserAvatar name={user!.name} avatarUrl={user!.avatarUrl}/></header>}
   <div className={admin?'admin-page-content':''}><Content path={path} role={user!.role}/></div>
  </main>
 </div>
}

function adminPageTitle(path:string){const item=nav.SUPERADMIN.find(x=>x.to===path);if(path==='/profile')return 'Profil Admin';return item?.label||'Dashboard Admin'}
function UserAvatar({name,avatarUrl}:{name:string;avatarUrl?:string}){const apiOrigin=(import.meta.env.VITE_API_URL??'http://localhost:4000/api').replace(/\/api\/?$/,'');const src=avatarUrl?(avatarUrl.startsWith('http')?avatarUrl:`${apiOrigin}${avatarUrl}`):'';return <span className="avatar user-avatar">{src?<img src={src} alt={`Foto profil ${name}`}/>:name[0]}</span>}
function NotificationBadge(){const[count,setCount]=useState(0),previous=useRef(0);useEffect(()=>{const poll=()=>api.get('/notifications').then(r=>{const next=r.data.unread;if(next>previous.current&&previous.current>0&&'Notification'in window&&Notification.permission==='granted')new Notification('Notifikasi Eduva',{body:`Ada ${next} notifikasi belum dibaca.`});previous.current=next;setCount(next)});poll();const timer=setInterval(poll,15000);if('Notification'in window&&Notification.permission==='default')Notification.requestPermission();return()=>clearInterval(timer)},[]);return count?<b className="notification-badge">{count>99?'99+':count}</b>:null}

function roleText(role:Role){return role==='SUPERADMIN'?'Kelola seluruh operasional platform Eduva.':role==='MENTOR'?'Kelola kelas dan perkembangan siswa Anda.':role==='PARENT'?'Pantau perjalanan belajar anak dengan mudah.':'Lanjutkan perjalanan belajarmu hari ini.'}

function Content({path,role}:{path:string;role:Role}){
 if(path==='/profile')return <Profile/>;
 if(path==='/classes')return <ClassesPage/>;
 if(path==='/progress')return <ProgressPage/>;
 if(path==='/leaderboard')return <Leaderboard/>;
 if(path.startsWith('/classes/'))return <ClassDetail/>;
 if(path.startsWith('/quiz/'))return <QuizPlay/>;
 if(path==='/notifications')return <Notifications/>;
 if(path==='/forum')return <ForumFull/>;
 if(path==='/live')return role==='MENTOR'?<LiveManager/>:<LiveSessions/>;
 if(path==='/certificates')return <Certificates/>;
 if(path==='/transactions')return <CashStudentAdvanced/>;
 if(path==='/mentor/classes')return <MentorClassManager/>;
 if(path==='/mentor/learning')return <MentorLearning/>;
 if(path==='/mentor/monitoring')return <MentorMonitoring/>;
 if(path==='/mentor/reports')return <MentorReports/>;
 if(path==='/parent')return <ParentPortal/>;
 if(path==='/parent/tryouts')return <ParentTryouts/>;
 if(path==='/admin/users')return <AdminUsers/>;
 if(path==='/admin/classes')return <AdminClasses/>;
 if(path==='/admin/payments')return <CashAdminAdvanced/>;
 if(path==='/admin/parents')return <AdminParentLinks/>;
 if(path==='/admin/reports')return <AdminReports/>;
 if(path==='/admin/theme')return <ThemeSettings/>;
 if(path==='/admin/revenue'||path==='/admin/analytics')return <AdminAnalytics/>;
 return <Overview role={role} classesOnly={path==='/classes'} progressOnly={path==='/progress'}/>;
}

function Overview({role,classesOnly=false,progressOnly=false}:{role:Role;classesOnly?:boolean;progressOnly?:boolean}){const[classes,setClasses]=useState<EduClass[]>([]),[stats,setStats]=useState<Record<string,number>>({});useEffect(()=>{if(role==='STUDENT'||role==='MENTOR')api.get('/classes').then(r=>setClasses(r.data));if(role==='SUPERADMIN')api.get('/admin/dashboard').then(r=>setStats(r.data))},[role]);if(role==='SUPERADMIN')return <><div className="page-heading"><div><h2>Ringkasan platform</h2><p>Data operasional Eduva saat ini.</p></div></div><section className="stats"><Stat value={stats.users||0} label="Pengguna"/><Stat value={stats.classes||0} label="Kelas"/><Stat value={stats.enrollments||0} label="Enrollment"/><Stat value={stats.pendingMentors||0} label="Mentor menunggu"/></section></>;if(role==='PARENT')return <ParentPortal/>;return <>{!classesOnly&&<section className="hero"><div><span className="eyebrow">{role==='MENTOR'?'AKTIVITAS MENGAJAR':'TARGET MINGGU INI'}</span><h2>{role==='MENTOR'?'Bantu siswa tumbuh melalui pembelajaran terarah.':'Konsisten sedikit demi sedikit, hasilnya luar biasa.'}</h2><p>{role==='MENTOR'?`${classes.length} kelas berada dalam pengelolaan Anda.`:'3 dari 5 sesi belajar telah diselesaikan.'}</p><div className="progress"><i/></div></div><div className="hero-score"><strong>{role==='MENTOR'?classes.length:'60%'}</strong><span>{role==='MENTOR'?'kelas':'progres'}</span></div></section>}{progressOnly?null:<><div className="section-title"><h2>{classesOnly?'Semua kelas':'Kelas terbaru'}</h2><p>Kelas yang tersedia di Eduva.</p></div><section className="class-grid">{classes.map((item,i)=><article className="class-card" key={item.id}><div className={`cover cover-${i%3}`}><span>{item.subject.gradeLevel}</span><BookOpen size={34}/></div><div className="class-body"><small>{item.subject.name}</small><h3>{item.title}</h3><p>{item.description}</p><div className="class-meta"><span><Users size={15}/> {item._count.enrollments} siswa</span><b>{item.price?`Rp${Number(item.price).toLocaleString('id-ID')}`:'Gratis'}</b></div></div></article>)}</section></>}</>}
function Stat({value,label}:{value:number;label:string}){return <article><div><strong>{value}</strong><span>{label}</span></div></article>}
