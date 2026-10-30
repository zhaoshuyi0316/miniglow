import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {digest,passwordHash,equal,token,sessionCookie} from '../../account';
const reply=(v:unknown,status=200,cookie?:string)=>Response.json(v,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
export async function POST(req:Request){
if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'请求来源无效'},403);
try{
const raw=await req.text();if(raw.length>4096)return reply({error:'请求过大'},413);
const x=JSON.parse(raw), db=env.DB!;
if(x.action==='logout'){const value=req.headers.get('cookie')?.match(/(?:^|;\s*)miniglow_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(value)await db.prepare('DELETE FROM sessions WHERE token=?').bind(digest(value)).run();return reply({ok:true},200,sessionCookie(req,'',0));}
if(!['login','register'].includes(x.action))return reply({error:'操作无效'},400);
const username=String(x.username||'').toLowerCase().trim(),password=String(x.password||''),name=String(x.name||username).trim();
if(!/^[a-z0-9_]{3,24}$/.test(username)||password.length<12||password.length>128||!name||name.length>24)return reply({error:'用户名需为 3–24 位字母、数字或下划线；密码需为 12–128 位'},400);
const now=Date.now(),window=Math.floor(now/900000),ip=req.headers.get('cf-connecting-ip')||'local';
for(const [key,limit] of [[digest('ip:'+ip+window),30],[digest('user:'+username+window),10]] as [string,number][]){const hit:any=await db.prepare('INSERT INTO auth_attempts(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+900000).first();if(hit.count>limit)return reply({error:'尝试次数过多，请 15 分钟后再试'},429);}
await db.batch([db.prepare('DELETE FROM auth_attempts WHERE expires<?').bind(now),db.prepare('DELETE FROM sessions WHERE expires<?').bind(now)]);
let account:any=await db.prepare('SELECT * FROM accounts WHERE username=?').bind(username).first();
if(x.action==='register'){if(account)return reply({error:'这个用户名已被使用'},409);const id=crypto.randomUUID(),salt=token(),hash=await passwordHash(password,salt);await db.prepare('INSERT INTO accounts VALUES(?,?,?,?,?,?)').bind(id,username,name,hash,salt,now).run();account={id,name};const legacy=await getChatGPTUser();if(legacy)await db.batch([db.prepare('UPDATE posts SET owner=? WHERE owner=?').bind(id,legacy.userId),db.prepare('UPDATE comments SET user=? WHERE user=?').bind(id,legacy.userId),db.prepare('UPDATE likes SET user=? WHERE user=?').bind(id,legacy.userId)]);}
else{const candidate=await passwordHash(password,account?.salt||'miniglow-dummy-salt');if(!account||!equal(candidate,account.hash))return reply({error:'用户名或密码不正确'},401);}
const value=token();await db.prepare('INSERT INTO sessions VALUES(?,?,?)').bind(digest(value),account.id,now+2592000000).run();return reply({ok:true,user:{id:account.id,name:account.name}},200,sessionCookie(req,value));
}catch(e){console.error('Auth request failed');return reply({error:'暂时无法登录，请稍后再试'},500)}}
