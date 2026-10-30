'use client';
import {useState,useEffect} from 'react';import {en,tw} from './translations';
export type Locale='zh-CN'|'zh-TW'|'en';
export function useLocale(){const [locale,setValue]=useState<Locale>('zh-CN');
useEffect(()=>{const saved=localStorage.getItem('miniglow-language');const guessed=navigator.language.toLowerCase();setValue(saved==='en'||saved==='zh-TW'||saved==='zh-CN'?saved:guessed.startsWith('en')?'en':/zh-(tw|hk|hant)/.test(guessed)?'zh-TW':'zh-CN')},[]);
useEffect(()=>{document.documentElement.lang=locale;document.title=locale==='en'?'Miniglow · Little moments, lasting warmth':locale==='zh-TW'?'Miniglow · 幸福在微小處':'Miniglow · 幸福在微小处'},[locale]);
const setLocale=(v:Locale)=>{setValue(v);localStorage.setItem('miniglow-language',v)};
const t=(s:string)=>locale==='en'?(en[s]||s):locale==='zh-TW'?(tw[s]||s):s;return {locale,setLocale,t};}
