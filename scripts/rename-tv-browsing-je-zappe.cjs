const fs=require('fs');
const path='src/MainApp.tsx';
let s=fs.readFileSync(path,'utf8');
// UI wording only: internal browsing/presence semantics stay unchanged.
s=s.replace(/<Text style=\{s\.tvPresenceLabel\}>Je suis devant la TV<\/Text>/g,'<View style={s.tvPresenceLabelWrap}><Ionicons name="remote-control-outline" size={19} color="#6b2cff"/><Text style={s.tvPresenceLabel}>Je zappe</Text></View>');
s=s.replace(/\{text:'Je suis devant la TV',onPress:/g,"{text:'Je zappe',onPress:");
// Deliberately keep friend presence copy as “est devant la TV”.
if(!s.includes('tvPresenceLabelWrap:{'))s=s.replace("tvPresenceLabel:{fontSize:15,fontWeight:'700',color:'#111'},","tvPresenceLabelWrap:{flexDirection:'row',alignItems:'center',gap:7},tvPresenceLabel:{fontSize:15,fontWeight:'700',color:'#111'},");
fs.writeFileSync(path,s);
console.log('Je zappe UI wording applied; friend status remains est devant la TV.');
