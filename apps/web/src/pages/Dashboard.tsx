import {useEffect,useState,type ComponentType} from 'react';
import {Award,Banknote,Bell,BookOpen,CalendarDays,FileCheck2,GraduationCap,LayoutDashboard,LogOut,Medal,MessageCircle,TrendingUp,UserCircle,Users,WalletCards} from 'lucide-react';
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

type NavItem={to:string;label:string;Icon:ComponentType<{size?:number}>};
const nav:Record<Role,NavItem[]>={
 STUDENT:[{to:'/',label:'Ringkasan',Icon:LayoutDashboard},{to:'/classes',label:'Kelas',Icon:BookOpen},{to:'/leaderboard',label:'Leaderboard',Icon:Medal},{to:'/forum',label:'Forum',Icon:MessageCircle},{to:'/live',label:'Live class',Icon:CalendarDays},{to:'/progress',label:'Progres',Icon:TrendingUp},{to:'/certificates',label:'Sertifikat',Icon:Award},{to:'/transactions',label:'Pembayaran',Icon:WalletCards},{to:'/notifications',label:'Notifikasi',Icon:Bell},{to:'/profile',label:'Profil',Icon:UserCircle}],
 MENTOR:[{to:'/',label:'Ringkasan',Icon:LayoutDashboard},{to:'/mentor/classes',label:'Kelola kelas',Icon:BookOpen},{to:'/mentor/learning',label:'Materi & kuis',Icon:GraduationCap},{to:'/mentor/reports',label:'Laporan siswa',Icon:FileCheck2},{to:'/forum',label:'Forum',Icon:MessageCircle},{to:'/live',label:'Live class',Icon:CalendarDays},{to:'/notifications',label:'Notifikasi',Icon:Bell},{to:'/profile',label:'Profil',Icon:UserCircle}],
 PARENT:[{to:'/parent',label:'Anak & progres',Icon:Users},{to:'/notifications',label:'Notifikasi',Icon:Bell}],
 SUPERADMIN:[{to:'/admin',label:'Ringkasan',Icon:LayoutDashboard},{to:'/admin/users',label:'Pengguna',Icon:Users},{to:'/admin/classes',label:'Approval kelas',Icon:BookOpen},{to:'/admin/payments',label:'Pembayaran tunai',Icon:WalletCards},{to:'/admin/reports',label:'Approval laporan',Icon:FileCheck2},{to:'/admin/revenue',label:'Pendapatan',Icon:Banknote},{to:'/notifications',label:'Notifikasi',Icon:Bell}]
};

export function Dashboard(){const{user,logout}=useAuth();const path=useLocation().pathname;return <div className="app-shell"><aside><div className="brand dark"><GraduationCap/> Eduva</div><nav>{nav[user!.role].map(({to,label,Icon})=><Link key={to} to={to} className={path===to?'active':''}><Icon size={19}/> {label}</Link>)}</nav><button className="logout" onClick={logout}><LogOut/> Keluar</button></aside><main className="content"><header><div><span className="eyebrow purple">DASHBOARD {user!.role}</span><h1>Halo, {user!.name.split(' ')[0]}! 👋</h1><p>{roleText(user!.role)}</p></div><div className="avatar">{user!.name[0]}</div></header><Content path={path} role={user!.role}/></main></div>}

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
 if(path==='/live')return <LiveSessions mentor={role==='MENTOR'}/>;
 if(path==='/certificates')return <Certificates/>;
 if(path==='/transactions')return <CashTransactions/>;
 if(path==='/mentor/classes')return <MentorClassManager/>;
 if(path==='/mentor/learning')return <MentorLearning/>;
 if(path==='/mentor/reports')return <MentorReports/>;
 if(path==='/parent')return <ParentPortal/>;
 if(path==='/admin/users')return <AdminUsers/>;
 if(path==='/admin/classes')return <AdminClasses/>;
 if(path==='/admin/payments')return <AdminCashPayments/>;
 if(path==='/admin/reports')return <AdminReports/>;
 if(path==='/admin/revenue')return <Revenue/>;
 return <Overview role={role} classesOnly={path==='/classes'} progressOnly={path==='/progress'}/>;
}

function Overview({role,classesOnly=false,progressOnly=false}:{role:Role;classesOnly?:boolean;progressOnly?:boolean}){const[classes,setClasses]=useState<EduClass[]>([]),[stats,setStats]=useState<Record<string,number>>({});useEffect(()=>{if(role==='STUDENT'||role==='MENTOR')api.get('/classes').then(r=>setClasses(r.data));if(role==='SUPERADMIN')api.get('/admin/dashboard').then(r=>setStats(r.data))},[role]);if(role==='SUPERADMIN')return <><div className="page-heading"><div><h2>Ringkasan platform</h2><p>Data operasional Eduva saat ini.</p></div></div><section className="stats"><Stat value={stats.users||0} label="Pengguna"/><Stat value={stats.classes||0} label="Kelas"/><Stat value={stats.enrollments||0} label="Enrollment"/><Stat value={stats.pendingMentors||0} label="Mentor menunggu"/></section></>;if(role==='PARENT')return <ParentPortal/>;return <>{!classesOnly&&<section className="hero"><div><span className="eyebrow">{role==='MENTOR'?'AKTIVITAS MENGAJAR':'TARGET MINGGU INI'}</span><h2>{role==='MENTOR'?'Bantu siswa tumbuh melalui pembelajaran terarah.':'Konsisten sedikit demi sedikit, hasilnya luar biasa.'}</h2><p>{role==='MENTOR'?`${classes.length} kelas berada dalam pengelolaan Anda.`:'3 dari 5 sesi belajar telah diselesaikan.'}</p><div className="progress"><i/></div></div><div className="hero-score"><strong>{role==='MENTOR'?classes.length:'60%'}</strong><span>{role==='MENTOR'?'kelas':'progres'}</span></div></section>}{progressOnly?null:<><div className="section-title"><h2>{classesOnly?'Semua kelas':'Kelas terbaru'}</h2><p>Kelas yang tersedia di Eduva.</p></div><section className="class-grid">{classes.map((item,i)=><article className="class-card" key={item.id}><div className={`cover cover-${i%3}`}><span>{item.subject.gradeLevel}</span><BookOpen size={34}/></div><div className="class-body"><small>{item.subject.name}</small><h3>{item.title}</h3><p>{item.description}</p><div className="class-meta"><span><Users size={15}/> {item._count.enrollments} siswa</span><b>{item.price?`Rp${Number(item.price).toLocaleString('id-ID')}`:'Gratis'}</b></div></div></article>)}</section></>}</>}
function Stat({value,label}:{value:number;label:string}){return <article><div><strong>{value}</strong><span>{label}</span></div></article>}
