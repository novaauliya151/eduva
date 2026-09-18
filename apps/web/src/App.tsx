import {useEffect,useState} from 'react';
import {Navigate,Route,Routes} from 'react-router-dom';
import {api} from './api';
import {useAuth} from './store';
import type {Role} from './types';
import {Login} from './pages/Login';
import {Dashboard} from './pages/Dashboard';
import {PlacementTest} from './pages/PlacementTest';
import {ForgotPassword,Register,ResetPassword} from './pages/AuthExtras';

function Guard({roles}:{roles?:Role[]}){
 const user=useAuth(s=>s.user);
 if(!user)return <Navigate to="/login" replace/>;
 if(roles&&!roles.includes(user.role))return <Navigate to="/" replace/>;
 return <Dashboard/>;
}

function StudentGuard(){
 const user=useAuth(s=>s.user);
 const[completed,setCompleted]=useState<boolean|null>(null);
 useEffect(()=>{if(user?.role==='STUDENT')api.get('/placement/status').then(({data})=>setCompleted(data.completed)).catch(()=>setCompleted(true))},[user?.role]);
 if(!user)return <Navigate to="/login" replace/>;
 if(user.role!=='STUDENT')return <Dashboard/>;
 if(completed===null)return <div className="placement-loading">Memuat profil belajar…</div>;
 if(!completed)return <Navigate to="/placement-test" replace/>;
 return <Dashboard/>;
}

function PlacementRoute(){
 const user=useAuth(s=>s.user);
 if(!user)return <Navigate to="/login" replace/>;
 if(user.role!=='STUDENT')return <Navigate to="/" replace/>;
 return <PlacementTest/>;
}

export function App(){return <Routes>
 <Route path="/login" element={<Login/>}/>
 <Route path="/register" element={<Register/>}/>
 <Route path="/forgot-password" element={<ForgotPassword/>}/>
 <Route path="/reset-password" element={<ResetPassword/>}/>
 <Route path="/placement-test" element={<PlacementRoute/>}/>
 <Route path="/" element={<StudentGuard/>}/>
 <Route path="/classes" element={<StudentGuard/>}/>
 <Route path="/classes/:id" element={<StudentGuard/>}/>
 <Route path="/quiz/:id" element={<StudentGuard/>}/>
 <Route path="/progress" element={<StudentGuard/>}/>
 <Route path="/leaderboard" element={<StudentGuard/>}/>
 <Route path="/forum" element={<StudentGuard/>}/>
 <Route path="/live" element={<StudentGuard/>}/>
 <Route path="/certificates" element={<StudentGuard/>}/>
 <Route path="/transactions" element={<StudentGuard/>}/>
 <Route path="/notifications" element={<Guard/>}/>
 <Route path="/profile" element={<Guard/>}/>
 <Route path="/mentor/classes" element={<Guard roles={['MENTOR']}/>}/>
 <Route path="/mentor/learning" element={<Guard roles={['MENTOR']}/>}/>
 <Route path="/mentor/reports" element={<Guard roles={['MENTOR']}/>}/>
 <Route path="/mentor/monitoring" element={<Guard roles={['MENTOR']}/>}/>
 <Route path="/parent" element={<Guard roles={['PARENT']}/>}/>
 <Route path="/parent/tryouts" element={<Guard roles={['PARENT']}/>}/>
 <Route path="/admin" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/users" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/parents" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/classes" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/payments" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/reports" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/revenue" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="/admin/analytics" element={<Guard roles={['SUPERADMIN']}/>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}
