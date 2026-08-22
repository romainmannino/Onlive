const fs=require('fs');
const path='src/MainApp.tsx';
let s=fs.readFileSync(path,'utf8');
const from=`<Switch value={tvBrowsing&&!selectedProgram} onValueChange={v=>setBrowsingPresence(v)} disabled={Boolean(selectedProgram)} trackColor={{false:'#d8d8de',true:'#b9a6ff'}} thumbColor={tvBrowsing&&!selectedProgram?'#6b2cff':'#f4f4f6'}/>`;
const to=`<Switch value={tvBrowsing&&!selectedProgram} onValueChange={v=>setBrowsingPresence(v)} disabled={Boolean(selectedProgram)} trackColor={{false:'#d8d8de',true:'#b9a6ff'}} thumbColor={tvBrowsing&&!selectedProgram?'#6b2cff':'#f4f4f6'} style={Platform.OS==='ios'?{transform:[{translateY:2},{scaleX:.75},{scaleY:.75}],marginLeft:-8}:undefined}/>`;
if(s.includes(to)){
  console.log('iOS Je glande switch already polished.');
  process.exit(0);
}
if(!s.includes(from)) throw new Error('Switch anchor not found in src/MainApp.tsx');
s=s.replace(from,to);
fs.writeFileSync(path,s);
console.log('iOS Je glande switch polished: smaller and vertically aligned; Android unchanged.');
