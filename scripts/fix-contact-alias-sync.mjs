import fs from 'node:fs';

const path='src/MainApp.tsx';
let src=fs.readFileSync(path,'utf8');

const oldText="const found:Match[]=rows.flatMap((p:any)=>{const normalized=normalizePhone(p.phone_e164||''),c=local.get(normalized);if(!c)return[];return[{userId:p.user_id,name:c.name||'Contact',phone:normalized,image:avatarMap.get(p.user_id)}]});setMatches(found);await refreshLiveFriends(found)";
const newText="const found:Match[]=rows.flatMap((p:any)=>{const normalized=normalizePhone(p.phone_e164||''),c=local.get(normalized);if(!c)return[];return[{userId:p.user_id,name:c.name||'Contact',phone:normalized,image:avatarMap.get(p.user_id)}]});if(userId&&found.length){const aliasRows=[...new Map(found.map(m=>[m.userId,m])).values()].map(m=>({owner_user_id:userId,contact_user_id:m.userId,local_name:m.name,updated_at:new Date().toISOString()}));const{error:aliasError}=await supabase.from('contact_aliases').upsert(aliasRows,{onConflict:'owner_user_id,contact_user_id'});if(aliasError)console.warn('Contact alias sync failed',aliasError)}setMatches(found);await refreshLiveFriends(found)";

const count=src.split(oldText).length-1;
if(count!==1)throw new Error(`Expected exactly 1 loadContacts match, found ${count}`);
src=src.replace(oldText,newText);
fs.writeFileSync(path,src);
console.log('Fixed contact alias sync after contacts load.');
// Trigger workflow after workflow creation.
