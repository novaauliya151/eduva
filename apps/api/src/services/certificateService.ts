import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {PDFDocument,rgb,StandardFonts} from 'pdf-lib';
import {prisma} from '../db.js';

export async function issueCertificate(studentId:string,classId:string){
 const existing=await prisma.certificate.findUnique({where:{studentId_classId:{studentId,classId}}});
 if(existing)return existing;
 const progress=await prisma.studentProgress.findUnique({where:{studentId_classId:{studentId,classId}},include:{student:true,class:true}});
 if(!progress||progress.totalMaterial<1||progress.materialCompleted<progress.totalMaterial)return null;
 const pdf=await PDFDocument.create(),page=pdf.addPage([842,595]);
 const bold=await pdf.embedFont(StandardFonts.HelveticaBold),regular=await pdf.embedFont(StandardFonts.Helvetica);
 page.drawRectangle({x:22,y:22,width:798,height:551,borderColor:rgb(.36,.24,.88),borderWidth:4});
 page.drawText('SERTIFIKAT KELULUSAN',{x:220,y:440,size:34,font:bold,color:rgb(.12,.16,.32)});
 page.drawText('Diberikan kepada',{x:344,y:385,size:16,font:regular,color:rgb(.4,.44,.55)});
 page.drawText(progress.student.name,{x:230,y:330,size:32,font:bold,color:rgb(.36,.24,.88)});
 page.drawText(`atas keberhasilan menyelesaikan kelas ${progress.class.title}`,{x:170,y:275,size:17,font:regular,color:rgb(.25,.28,.38)});
 page.drawText(`Eduva • ${new Date().toLocaleDateString('id-ID')}`,{x:325,y:110,size:13,font:regular,color:rgb(.4,.44,.55)});
 const filename=`${studentId}-${classId}.pdf`,dir=path.resolve('storage/certificates');
 await mkdir(dir,{recursive:true});await writeFile(path.join(dir,filename),await pdf.save());
 return prisma.certificate.create({data:{studentId,classId,certificateUrl:`/certificates/${filename}`}});
}
