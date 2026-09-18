import {ArrowRight,BarChart3,BookOpen,CalendarDays,CheckCircle2,GraduationCap,MessageCircle,Play,ShieldCheck,Users} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useAuth} from '../store';

const programs=[
 {icon:<BookOpen/>,title:'Belajar Mandiri',text:'Materi video, modul, kuis, dan pembahasan yang bisa dipelajari sesuai ritmemu.'},
 {icon:<CalendarDays/>,title:'Kelas Terjadwal',text:'Belajar langsung bersama mentor melalui jadwal yang jelas dan terarah.'},
 {icon:<BarChart3/>,title:'Tryout & Progres',text:'Ukur kemampuan, pantau peningkatan, dan fokus pada materi yang perlu diperbaiki.'}
];

export function HomePage(){
 const user=useAuth(s=>s.user);
 return <div className="home-page">
  <nav className="home-nav">
   <Link className="home-logo" to="/"><span><GraduationCap/></span>Eduva</Link>
   <div className="home-nav-links"><a href="#program">Program</a><a href="#fitur">Fitur</a><a href="#cara">Cara belajar</a></div>
   <div className="home-nav-actions">{user?<Link className="home-btn primary small" to="/dashboard">Buka dashboard <ArrowRight/></Link>:<><Link className="home-login" to="/login">Masuk</Link><Link className="home-btn primary small" to="/register">Daftar gratis</Link></>}</div>
  </nav>

  <main>
   <section className="home-hero">
    <div className="hero-copy">
     <span className="home-kicker">PLATFORM BELAJAR TERPADU</span>
     <h1>Belajar lebih fokus.<br/><em>Hasil lebih terukur.</em></h1>
     <p>Materi, kelas langsung, tryout, dan laporan progres dalam satu ruang belajar yang membantu siswa mencapai targetnya.</p>
     <div className="hero-actions"><Link className="home-btn primary" to={user?'/dashboard':'/register'}>{user?'Lanjut belajar':'Mulai belajar gratis'} <ArrowRight/></Link><a className="watch-link" href="#cara"><span><Play fill="currentColor"/></span>Lihat cara kerja</a></div>
     <div className="hero-trust"><div><strong>100%</strong><span>progres terpantau</span></div><div><strong>4 peran</strong><span>saling terhubung</span></div><div><strong>24/7</strong><span>akses materi</span></div></div>
    </div>
    <div className="hero-visual">
     <div className="dashboard-mock">
      <div className="mock-top"><div className="mock-logo"><GraduationCap/> Eduva</div><div className="mock-avatar">AR</div></div>
      <div className="mock-body"><aside><i/><i/><i/><i/></aside><div className="mock-content"><small>SELAMAT DATANG KEMBALI</small><h3>Target belajar minggu ini</h3><div className="mock-progress"><span style={{width:'72%'}}/></div><div className="mock-stats"><div><b>7</b><span>Materi selesai</span></div><div><b>86</b><span>Rata-rata nilai</span></div><div><b>3</b><span>Sertifikat</span></div></div><div className="mock-lessons"><span/><span/><span/></div></div></div>
     </div>
     <div className="float-card score"><CheckCircle2/><div><b>Tryout selesai!</b><span>Nilai kamu meningkat 12%</span></div></div>
     <div className="float-card live"><span className="live-dot"/><div><b>Live class</b><span>Matematika · 19.00</span></div></div>
    </div>
   </section>

   <section className="home-partners"><span>Belajar efektif untuk</span><b>Siswa</b><b>Orang Tua</b><b>Mentor</b><b>Sekolah</b></section>
   <section className="home-section" id="program"><div className="section-intro"><span className="home-kicker">PROGRAM EDUVA</span><h2>Semua yang dibutuhkan untuk<br/>belajar lebih terarah.</h2><p>Tidak sekadar menonton materi. Eduva membuat setiap langkah belajar dapat dilakukan, dinilai, dan dipantau.</p></div><div className="program-grid">{programs.map((item,i)=><article key={item.title}><span className={`program-icon icon-${i}`}>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><Link to={user?'/dashboard':'/register'}>Pelajari lebih lanjut <ArrowRight/></Link></article>)}</div></section>
   <section className="feature-section" id="fitur"><div className="feature-art"><div className="result-card"><span>PROGRES BELAJAR</span><strong>84%</strong><div><i style={{width:'84%'}}/></div><small>Naik 18% bulan ini</small></div><div className="mini-chat"><MessageCircle/><p><b>Mentor Rina</b><br/>Kerja bagus! Lanjutkan bab berikutnya.</p></div></div><div className="feature-copy"><span className="home-kicker">TERHUBUNG & TRANSPARAN</span><h2>Siswa berkembang,<br/>orang tua tetap tenang.</h2><p>Setiap aktivitas dan hasil belajar tercatat otomatis. Orang tua dapat melihat progres, sementara mentor mengetahui siswa yang perlu dibantu.</p><ul><li><CheckCircle2/> Laporan progres dan hasil tryout</li><li><CheckCircle2/> Forum diskusi bersama mentor</li><li><CheckCircle2/> Notifikasi jadwal dan pembayaran</li><li><CheckCircle2/> Sertifikat setelah kelas selesai</li></ul></div></section>
   <section className="home-section steps-section" id="cara"><div className="section-intro centered"><span className="home-kicker">MUDAH DIMULAI</span><h2>Tiga langkah menuju targetmu.</h2></div><div className="steps"><article><b>01</b><span><Users/></span><h3>Buat akun</h3><p>Daftar sesuai peranmu dan lengkapi profil.</p></article><i/><article><b>02</b><span><BookOpen/></span><h3>Pilih kelas</h3><p>Temukan program sesuai kebutuhan belajar.</p></article><i/><article><b>03</b><span><BarChart3/></span><h3>Pantau hasil</h3><p>Kerjakan materi dan lihat perkembanganmu.</p></article></div></section>
   <section className="home-cta"><div><ShieldCheck/><span>Mulai perjalanan belajarmu hari ini</span><h2>Satu langkah kecil sekarang,<br/>hasil besar kemudian.</h2></div><Link className="home-btn light" to={user?'/dashboard':'/register'}>{user?'Buka dashboard':'Daftar gratis sekarang'} <ArrowRight/></Link></section>
  </main>
  <footer className="home-footer"><Link className="home-logo" to="/"><span><GraduationCap/></span>Eduva</Link><p>Belajar Terarah, Sukses Terukur.</p><small>© 2026 Eduva. Platform e-learning Indonesia.</small></footer>
 </div>
}
