import {Router} from 'express';
import {z} from 'zod';
import {prisma} from '../db.js';
import {allow,auth} from '../middleware.js';

export const themeRoutes=Router();
const DEFAULT={themeName:'ocean_royale',primaryColor:'#03045E',secondaryColor:'#023EBA',accentColor:'#FBB02D',backgroundColor:'#CAF0F8',textColor:'#03071E'};
const hex=z.string().regex(/^#[0-9A-Fa-f]{6}$/,'Warna harus berupa hex 6 digit');
const schema=z.object({themeName:z.string().min(2).max(40),primaryColor:hex,secondaryColor:hex,accentColor:hex,backgroundColor:hex,textColor:hex});

async function current(){return (await prisma.siteSetting.findFirst({orderBy:{updatedAt:'desc'}}))??DEFAULT}
themeRoutes.get('/settings/theme',async(_req,res)=>res.json(await current()));
themeRoutes.put('/admin/settings/theme',auth,allow('SUPERADMIN'),async(req,res)=>{
 const data=schema.parse(req.body),existing=await prisma.siteSetting.findFirst({orderBy:{updatedAt:'desc'}});
 const setting=existing?await prisma.siteSetting.update({where:{id:existing.id},data:{...data,updatedById:req.user!.id}}):await prisma.siteSetting.create({data:{...data,updatedById:req.user!.id}});
 await prisma.auditLog.create({data:{actorId:req.user!.id,action:'UPDATE_THEME',entityType:'SiteSetting',entityId:setting.id,metadata:{themeName:data.themeName}}});
 res.json(setting);
});
themeRoutes.post('/admin/settings/theme/reset',auth,allow('SUPERADMIN'),async(req,res)=>{
 const existing=await prisma.siteSetting.findFirst({orderBy:{updatedAt:'desc'}});
 const setting=existing?await prisma.siteSetting.update({where:{id:existing.id},data:{...DEFAULT,updatedById:req.user!.id}}):await prisma.siteSetting.create({data:{...DEFAULT,updatedById:req.user!.id}});
 await prisma.auditLog.create({data:{actorId:req.user!.id,action:'RESET_THEME',entityType:'SiteSetting',entityId:setting.id}});
 res.json(setting);
});
