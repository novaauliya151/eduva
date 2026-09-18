import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,GraduationCap} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {api} from '../api';

type Question={id:string;question:string;options:Record<string,string>;order:number};
type Result={score:number;level:'basic'|'intermediate'|'advanced'};

export function PlacementTest(){
 const navigate=useNavigate();
 const[questions,setQuestions]=useState<Question[]>([]),[answers,setAnswers]=useState<Record<string,string>>({}),[index,setIndex]=useState(0),[result,setResult]=useState<Result|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{api.get('/placement/status').then(({data})=>{if(data.completed){navigate('/classes',{replace:true});return}return api.get('/placement/questions')}).then(response=>{if(response)setQuestions(response.data)}).catch(()=>setError('Placement test belum dapat dimuat.')).finally(()=>setLoading(false))},[navigate]);
 async function finish(){setLoading(true);setError('');try{const{data}=await api.post('/placement/submit',{answers:Object.entries(answers).map(([questionId,selectedAnswer])=>({questionId,selectedAnswer}))});setResult(data);setTimeout(()=>navigate(`/classes?level=${data.level}`,{replace:true}),2500)}catch(response){setError('Pastikan semua soal sudah dijawab.')}finally{setLoading(false)}}
 if(loading&&!questions.length)return <div className="placement-loading">Menyiapkan placement test…</div>;
 if(error&&!questions.length)return <div className="placement-loading error">{error}</div>;
 if(result)return <main className="placement-shell"><section className="result-card"><div className="result-icon"><CheckCircle2/></div><span className="eyebrow purple">TES SELESAI</span><h1>Level kamu: {result.level}</h1><div className="score-ring">{Math.round(result.score)}<small>/100</small></div><p>Kami sedang mengarahkanmu ke kelas yang sesuai dengan kemampuanmu.</p></section></main>;
 const question=questions[index];
 if(!question)return <div className="placement-loading">Soal belum tersedia.</div>;
 const answered=Object.keys(answers).length;
 return <main className="placement-shell"><section className="test-card"><header className="test-header"><div className="brand placement-brand"><GraduationCap/> Eduva</div><span>Placement Test</span></header><div className="test-progress"><i style={{width:`${(answered/questions.length)*100}%`}}/></div><div className="test-meta"><span>SOAL {index+1} DARI {questions.length}</span><b>{answered}/{questions.length} terjawab</b></div><h1>{question.question}</h1><div className="answer-list">{Object.entries(question.options).map(([key,value])=><button key={key} className={answers[question.id]===key?'selected':''} onClick={()=>setAnswers(current=>({...current,[question.id]:key}))}><strong>{key.toUpperCase()}</strong><span>{value}</span></button>)}</div>{error&&<p className="form-error">{error}</p>}<footer><button className="test-secondary" disabled={index===0} onClick={()=>setIndex(value=>value-1)}><ArrowLeft/> Sebelumnya</button>{index<questions.length-1?<button className="test-primary" disabled={!answers[question.id]} onClick={()=>setIndex(value=>value+1)}>Berikutnya <ArrowRight/></button>:<button className="test-primary" disabled={answered!==questions.length||loading} onClick={finish}>Lihat hasil <ArrowRight/></button>}</footer></section></main>;
}
