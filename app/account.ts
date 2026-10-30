import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {scrypt,timingSafeEqual,randomBytes,createHash} from 'node:crypto';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export const passwordHash=(p:string,salt:string)=>new Promise<string>((resolve,reject)=>scrypt(p,salt,64,{N:16384,r:8,p:5,maxmem:32*1024*1024},(err,key)=>err?reject(err):resolve(key.toString('hex'))));
export function equal(a:string,b:string){return a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b))}
export const token=()=>randomBytes(32).toString('hex');
export async function getAccount(){const h=await headers();const raw=h.get('cookie')?.match(/(?:^|;\s*)miniglow_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!raw)return null;const row:any=await env.DB!.prepare('SELECT a.id,a.name FROM sessions s JOIN accounts a ON a.id=s.user WHERE s.token=? AND s.expires>?').bind(digest(raw),Date.now()).first();return row?{userId:row.id,fullName:row.name}:null;}
export function sessionCookie(req:Request,value:string,age=2592000){return 'miniglow_session='+value+'; Path=/; HttpOnly; SameSite=Lax; Max-Age='+age+(new URL(req.url).protocol==='https:'?'; Secure':'')}
