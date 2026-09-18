export type Role='STUDENT'|'MENTOR'|'PARENT'|'SUPERADMIN';
export interface User{id:string;name:string;email:string;role:Role;status:string;avatarUrl?:string}
export interface EduClass{id:string;title:string;description:string;type:string;price?:string;status:string;subject:{name:string;gradeLevel:string};mentor?:User;materials:{id:string;title:string;type:string;contentUrl:string}[];_count:{enrollments:number}}
