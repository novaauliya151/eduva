import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const db=new PrismaClient();

async function main(){
 const rows=[
  ['Admin Eduva',process.env.SEED_ADMIN_EMAIL||'admin@eduva.id',process.env.SEED_ADMIN_PASSWORD||'Admin123!','SUPERADMIN'],
  ['Mentor Eduva','mentor@eduva.id','Mentor123!','MENTOR'],
  ['Siswa Eduva','siswa@eduva.id','Siswa123!','STUDENT'],
  ['Orang Tua Eduva','parent@eduva.id','Parent123!','PARENT']
 ] as const;
 const users=[];
 for(const[name,email,password,role]of rows)users.push(await db.user.upsert({where:{email},update:{},create:{name,email,password:await bcrypt.hash(password,12),role}}));
 await db.studentProfile.upsert({where:{userId:users[2].id},update:{parentId:users[3].id},create:{userId:users[2].id,parentId:users[3].id,gradeLevel:'SMA'}});
 const subject=await db.subject.upsert({where:{name_gradeLevel:{name:'Matematika',gradeLevel:'SMA'}},update:{},create:{name:'Matematika',gradeLevel:'SMA'}});
 await db.class.upsert({where:{id:'00000000-0000-4000-8000-000000000001'},update:{},create:{id:'00000000-0000-4000-8000-000000000001',title:'Matematika Intensif SMA',description:'Kuasai konsep dan strategi soal Matematika SMA secara terarah.',subjectId:subject.id,mentorId:users[1].id,createdById:users[1].id,type:'BIMBEL_TERJADWAL',status:'PUBLISHED',price:299000}});
 await db.enrollment.upsert({where:{studentId_classId:{studentId:users[2].id,classId:'00000000-0000-4000-8000-000000000001'}},update:{status:'ACTIVE'},create:{studentId:users[2].id,classId:'00000000-0000-4000-8000-000000000001'}});
 await db.classMaterial.upsert({where:{id:'00000000-0000-4000-a000-000000000001'},update:{},create:{id:'00000000-0000-4000-a000-000000000001',classId:'00000000-0000-4000-8000-000000000001',title:'Pengantar Aljabar',type:'TEXT',contentUrl:'Pelajari variabel, koefisien, dan persamaan dasar.',order:1}});
 const demoQuestions=[
  ['00000000-0000-4000-b000-000000000001','Hasil 2x + 4 = 12 adalah x = ...',{a:'2',b:'4',c:'6',d:'8'},'b','Kurangi kedua sisi dengan 4 lalu bagi 2.'],
  ['00000000-0000-4000-b000-000000000002','Nilai dari 5² adalah ...',{a:'10',b:'20',c:'25',d:'50'},'c','Lima kuadrat berarti 5 × 5.']
 ] as const;
 for(const[id,question,options,correctAnswer,explanation]of demoQuestions)await db.questionBank.upsert({where:{id},update:{question,options,correctAnswer,explanation},create:{id,subjectId:subject.id,topic:'Aljabar Dasar',difficulty:'EASY',question,options,correctAnswer,explanation,createdById:users[1].id}});
 await db.quiz.upsert({where:{id:'00000000-0000-4000-c000-000000000001'},update:{},create:{id:'00000000-0000-4000-c000-000000000001',classId:'00000000-0000-4000-8000-000000000001',title:'Latihan Aljabar Dasar',type:'DRILLING',durationMinutes:10,createdById:users[1].id}});
 for(const question of demoQuestions)await db.quizQuestion.upsert({where:{quizId_questionId:{quizId:'00000000-0000-4000-c000-000000000001',questionId:question[0]}},update:{},create:{quizId:'00000000-0000-4000-c000-000000000001',questionId:question[0]}});
 const placementQuestions=[
  ['00000000-0000-4000-9000-000000000001','Hasil dari 3² + 4² adalah?',{a:'7',b:'12',c:'25',d:'49'},'c'],
  ['00000000-0000-4000-9000-000000000002','Jika 2x + 6 = 16, nilai x adalah?',{a:'4',b:'5',c:'6',d:'8'},'b'],
  ['00000000-0000-4000-9000-000000000003','Sinonim kata “konsisten” adalah?',{a:'berubah-ubah',b:'tetap',c:'ragu',d:'cepat'},'b'],
  ['00000000-0000-4000-9000-000000000004','Planet yang paling dekat dengan Matahari adalah?',{a:'Venus',b:'Bumi',c:'Mars',d:'Merkurius'},'d'],
  ['00000000-0000-4000-9000-000000000005','Bentuk sederhana dari 6/8 adalah?',{a:'2/3',b:'3/4',c:'4/6',d:'5/7'},'b']
 ] as const;
 for(const[id,question,options,correctAnswer]of placementQuestions)await db.placementQuestion.upsert({where:{id},update:{question,options,correctAnswer},create:{id,question,options,correctAnswer,order:placementQuestions.findIndex(item=>item[0]===id)+1}});
}

main().finally(()=>db.$disconnect());
