import type {Request,Response} from 'express';
import {z} from 'zod';
import {getPlacementQuestions,getPlacementStatus,getRecommendations,submitPlacement} from '../services/placementService.js';

const submission=z.object({answers:z.array(z.object({questionId:z.string().uuid(),selectedAnswer:z.string().min(1)})).min(1)});

export async function status(req:Request,res:Response){res.json(await getPlacementStatus(req.user!.id))}
export async function questions(_req:Request,res:Response){res.json(await getPlacementQuestions())}
export async function recommendations(req:Request,res:Response){res.json(await getRecommendations(req.user!.id))}
export async function submit(req:Request,res:Response){
 try{res.status(201).json(await submitPlacement(req.user!.id,submission.parse(req.body).answers))}
 catch(error){
  if(error instanceof Error&&error.message==='PLACEMENT_ALREADY_COMPLETED')return res.status(409).json({message:'Placement test sudah pernah diselesaikan'});
  if(error instanceof Error&&error.message==='PLACEMENT_INCOMPLETE')return res.status(400).json({message:'Semua soal wajib dijawab'});
  if(error instanceof Error&&error.message==='PLACEMENT_HAS_NO_QUESTIONS')return res.status(503).json({message:'Soal placement test belum tersedia'});
  throw error;
 }
}
