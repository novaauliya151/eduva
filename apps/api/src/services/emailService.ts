import nodemailer from 'nodemailer';import {env} from '../config.js';
const transport=env.SMTP_HOST?nodemailer.createTransport({host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_PORT===465,auth:env.SMTP_USER?{user:env.SMTP_USER,pass:env.SMTP_PASSWORD}:undefined}):null;
export async function sendEmail(to:string,subject:string,html:string){if(!transport){if(env.NODE_ENV==='development')console.log(`[DEV EMAIL] ${to} — ${subject}`);return false}await transport.sendMail({from:env.SMTP_FROM,to,subject,html});return true}
export const verificationEmail=(name:string,url:string)=>`<h2>Halo ${name}</h2><p>Verifikasi akun Eduva melalui tautan berikut:</p><p><a href="${url}">Verifikasi email</a></p><p>Tautan berlaku 24 jam.</p>`;
export const resetEmail=(name:string,url:string)=>`<h2>Halo ${name}</h2><p>Atur ulang password Eduva:</p><p><a href="${url}">Reset password</a></p><p>Tautan berlaku 30 menit.</p>`;
