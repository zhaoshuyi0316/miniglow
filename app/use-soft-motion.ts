'use client';
import {useEffect,useRef} from 'react';
// Adapted in spirit from Motion Library #104, with no blur, looping or hidden fallback.
export function useSoftMotion(dependencies:unknown[]){
const seen=useRef(new WeakSet<Element>());
useEffect(()=>{
const preference=matchMedia('(prefers-reduced-motion: reduce)');
if(preference.matches||!('IntersectionObserver' in window))return;
const running=new Set<Animation>();
const observer=new IntersectionObserver(entries=>{
let sequence=0;
for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);
if(seen.current.has(entry.target))continue;seen.current.add(entry.target);
const animation=entry.target.animate([{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:560,delay:Math.min(sequence++*55,165),easing:'cubic-bezier(.22,.68,0,1)',fill:'backwards'});
running.add(animation);animation.onfinish=()=>running.delete(animation);
}},{threshold:.06,rootMargin:'0px 0px -16px 0px'});
document.querySelectorAll('.card').forEach(el=>{if(!seen.current.has(el))observer.observe(el)});
const stop=()=>{if(preference.matches){observer.disconnect();running.forEach(a=>a.cancel())}};
preference.addEventListener('change',stop);
return()=>{observer.disconnect();running.forEach(a=>a.cancel());preference.removeEventListener('change',stop)};
},dependencies);
}