import {prisma} from '../db.js';

export type PlacementSubmission={questionId:string;selectedAnswer:string}[];

export function placementLevel(score:number){
 if(score>80)return 'advanced';
 if(score>=50)return 'intermediate';
 return 'basic';
}

export async function getPlacementStatus(studentId:string){
 const profile=await prisma.studentProfile.upsert({where:{userId:studentId},update:{},create:{userId:studentId}});
 return {completed:Boolean(profile.placementCompletedAt),level:profile.placementLevel,score:profile.placementScore===null?null:Number(profile.placementScore)};
}

export async function getPlacementQuestions(){
 return prisma.placementQuestion.findMany({where:{isActive:true},select:{id:true,question:true,options:true,order:true},orderBy:{order:'asc'}});
}

export async function submitPlacement(studentId:string,answers:PlacementSubmission){
 const profile=await prisma.studentProfile.upsert({where:{userId:studentId},update:{},create:{userId:studentId}});
 if(profile.placementCompletedAt)throw new Error('PLACEMENT_ALREADY_COMPLETED');
 const questions=await prisma.placementQuestion.findMany({where:{isActive:true}});
 if(!questions.length)throw new Error('PLACEMENT_HAS_NO_QUESTIONS');
 const unique=new Map(answers.map(answer=>[answer.questionId,answer.selectedAnswer]));
 if(unique.size!==questions.length||questions.some(question=>!unique.has(question.id)))throw new Error('PLACEMENT_INCOMPLETE');
 const graded=questions.map(question=>({questionId:question.id,selectedAnswer:unique.get(question.id)!,isCorrect:unique.get(question.id)===question.correctAnswer}));
 const score=graded.filter(answer=>answer.isCorrect).length/questions.length*100;
 const level=placementLevel(score);
 await prisma.$transaction([
  prisma.placementAttempt.create({data:{studentId,score,level,answers:{create:graded}}}),
  prisma.studentProfile.update({where:{userId:studentId},data:{placementLevel:level,placementScore:score,placementCompletedAt:new Date()}})
 ]);
 const recommendations=await prisma.class.findMany({where:{status:'PUBLISHED',subject:{gradeLevel:profile.gradeLevel}},include:{subject:true,mentor:{select:{id:true,name:true}},materials:true,_count:{select:{enrollments:true}}},take:6,orderBy:{createdAt:'desc'}});
 return {score,level,recommendations};
}

export async function getRecommendations(studentId:string){
 const profile=await prisma.studentProfile.findUnique({where:{userId:studentId}});
 if(!profile?.placementCompletedAt)return [];
 return prisma.class.findMany({where:{status:'PUBLISHED',subject:{gradeLevel:profile.gradeLevel}},include:{subject:true,mentor:{select:{id:true,name:true}},materials:true,_count:{select:{enrollments:true}}},take:6,orderBy:{createdAt:'desc'}});
}
