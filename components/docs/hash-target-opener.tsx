'use client';
import { useEffect } from 'react';

/** Opens every collapsed <details> around the URL's #anchor so deep field links (Mintlify-style) land on the field. */
export function HashTargetOpener() {
 useEffect(()=>{
  const reveal=()=>{
   const id=decodeURIComponent(window.location.hash.slice(1));
   const target=id?document.getElementById(id):null;
   if(!target)return;
   for(let node=target.parentElement;node;node=node.parentElement)if(node instanceof HTMLDetailsElement)node.open=true;
   target.scrollIntoView({block:'start'});
  };
  reveal();
  window.addEventListener('hashchange',reveal);
  return()=>window.removeEventListener('hashchange',reveal);
 },[]);
 return null;
}
