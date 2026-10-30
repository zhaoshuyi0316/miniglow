import {env} from 'cloudflare:workers';
import {getAccount} from '../../account';
import {seeds} from '../../seeds';
export const dynamic='force-dynamic';
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){try{const user=await getAccount();const db=env.DB!;
const [p,l,c]=await Promise.all([db.prepare('SELECT * FROM posts ORDER BY created DESC LIMIT 200').all(),db.prepare('SELECT post,COUNT(*) AS count FROM likes GROUP BY post').all(),db.prepare('SELECT id,post,name,body,created FROM comments ORDER BY created ASC LIMIT 2000').all()]);
const mine=user?(await db.prepare('SELECT post FROM likes WHERE user=?').bind(user.userId).all()).results:[];
return json({user:user?{id:user.userId,name:user.fullName||'拾光旅人'}:null,posts:[...p.results,...seeds].map((p:any)=>({...p,images:JSON.parse(p.images),likes:Number((l.results.find((r:any)=>r.post===p.id) as any)?.count||0),liked:mine.some((r:any)=>r.post===p.id),comments:c.results.filter((r:any)=>r.post===p.id),demo:p.owner==='demo',mine:p.owner===user?.userId,owner:undefined}))});}catch(e){console.error(e);return json({error:'暂时无法加载，请稍后重试'},503)}}
export async function POST(req:Request){
if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return json({error:'请求来源无效'},403);
const user=await getAccount();if(!user)return json({error:'请先登录再分享'},401);
try{const x:any=await req.json();const db=env.DB!;const id=String(x.id||'');
const existing:any=id?(seeds.find(p=>p.id===id)||await db.prepare('SELECT * FROM posts WHERE id=?').bind(id).first()):null;
if(['like','comment','delete','edit'].includes(x.action)&&!existing)return json({error:'这条瞬间已不存在'},404);
if(x.action==='like'){if(x.liked)await db.prepare('INSERT OR IGNORE INTO likes(post,user) VALUES(?,?)').bind(id,user.userId).run();else await db.prepare('DELETE FROM likes WHERE post=? AND user=?').bind(id,user.userId).run();}
else if(x.action==='comment'){const body=String(x.body||'').trim();if(!body||body.length>500)return json({error:'评论需为 1–500 字'},400);await db.prepare('INSERT INTO comments VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),id,user.userId,String(x.name||'拾光旅人').slice(0,24),body,Date.now()).run();}
else if(x.action==='delete'){if(existing.owner!==user.userId)return json({error:'只能管理自己的内容'},403);await db.batch([db.prepare('DELETE FROM posts WHERE id=? AND owner=?').bind(id,user.userId),db.prepare('DELETE FROM comments WHERE post=?').bind(id),db.prepare('DELETE FROM likes WHERE post=?').bind(id)]);}
else if(x.action==='create'||x.action==='edit'){if(x.action==='edit'&&existing.owner!==user.userId)return json({error:'只能管理自己的内容'},403);const title=String(x.title||'').trim(),body=String(x.body||'').trim(),name=String(x.name||'拾光旅人').trim().slice(0,24),tag=String(x.tag||'日常小美好');if(!title||title.length>60||!body||body.length>3000)return json({error:'请填写标题（最多 60 字）和正文（最多 3000 字）'},400);
const images=Array.isArray(x.images)?x.images:[];if(images.length>4||images.some((s:any)=>typeof s!=='string'||(!s.startsWith('/api/images/'+user.userId+'/')&&!(x.action==='edit'&&JSON.parse(existing.images).includes(s)))))return json({error:'图片无效，请重新上传'},400);
const pid=x.action==='edit'?id:crypto.randomUUID();if(x.action==='edit')await db.prepare('UPDATE posts SET title=?,body=?,name=?,tag=?,images=? WHERE id=? AND owner=?').bind(title,body,name,tag,JSON.stringify(images),pid,user.userId).run();else await db.prepare('INSERT INTO posts VALUES(?,?,?,?,?,?,?,?)').bind(pid,user.userId,name,title,body,tag,JSON.stringify(images),Date.now()).run();return json({ok:true,id:pid});
}else return json({error:'操作无效'},400);return json({ok:true});}catch(e){console.error(e);return json({error:'保存失败，请稍后重试'},500)}}
