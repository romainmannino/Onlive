const fs=require('fs');

function patchFile(path, patches){
  let s=fs.readFileSync(path,'utf8');
  for(const [from,to,label] of patches){
    if(s.includes(to)) continue;
    if(!s.includes(from)) throw new Error(`${path}: anchor missing: ${label}`);
    s=s.replace(from,to);
  }
  fs.writeFileSync(path,s);
}

patchFile('src/MainApp.tsx',[
  ['<View style={s.topPresence}>','<View style={[s.topPresence,Platform.OS===\'android\'&&{top:30}]}>','android top presence'],
  ['<View style={s.tvPresenceRow}><View style={s.tvPresenceLabelWrap}><Ionicons name="options-outline" size={19} color="#6b2cff"/><Text style={s.tvPresenceLabel}>Je zappe</Text></View><Switch value={tvBrowsing&&!selectedProgram}','<View style={s.tvPresenceRow}><View style={s.tvPresenceLabelWrap}><LinearGradient colors={[\'#4932ff\',\'#ed00b3\']} style={s.boredEmojiBadge}><Text style={s.boredEmojiText}>🥱</Text></LinearGradient><Text style={s.tvPresenceLabel}>Je glande (devant la TV)</Text></View><Switch value={tvBrowsing&&!selectedProgram}','glande row'],
  ["tvPresenceRow:{minHeight:44,marginTop:8,marginBottom:4,paddingHorizontal:2,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},tvPresenceLabelWrap:{flexDirection:'row',alignItems:'center',gap:7},tvPresenceLabel:{fontSize:15,fontWeight:'700',color:'#111'},","tvPresenceRow:{minHeight:44,marginTop:8,marginBottom:4,paddingHorizontal:2,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:10},tvPresenceLabelWrap:{flexDirection:'row',alignItems:'center',gap:7},boredEmojiBadge:{width:26,height:26,borderRadius:13,alignItems:'center',justifyContent:'center'},boredEmojiText:{fontSize:16,lineHeight:19},tvPresenceLabel:{fontSize:15,fontWeight:'700',color:'#111'},",'presence styles'],
  ["f.programId?`${f.startTime&&(()=>{const[h,m]=f.startTime.split(':').map(Number);const d=new Date();d.setHours(h||0,m||0,0,0);return Date.now()<d.getTime()})()?'va regarder':'regarde'} ${f.channel}`:'est devant la TV'","f.programId?`${f.startTime&&(()=>{const[h,m]=f.startTime.split(':').map(Number);const d=new Date();d.setHours(h||0,m||0,0,0);return Date.now()<d.getTime()})()?'va regarder':'regarde'} ${f.channel}`:'🥱 glande devant la TV'",'friend browsing wording'],
  ["Alert.alert('Passer Onlive',`Pour discuter avec ${f.name}, indique que tu es devant la TV.`,[{text:'Rester Offlive',style:'cancel'},{text:'Je zappe',onPress:async()=>{await setBrowsingPresence(true);onStartChat?.(target)}}])","Alert.alert('Passer Onlive',`Pour discuter avec ${f.name}, indique que tu glandes devant la TV.`,[{text:'Rester Offlive',style:'cancel'},{text:'Je glande',onPress:async()=>{await setBrowsingPresence(true);onStartChat?.(target)}}])",'join browsing wording'],
  ['<View style={s.emptyFriends}><ActivityIndicator size="small" color="#6b2cff"/><Text style={[s.emptyTitle,{fontWeight:\'500\',marginTop:8}]}>ONLIVE</Text></View>','<View style={s.emptyFriends}><ActivityIndicator size="small" color="#6b2cff"/></View>','loader label'],
  ["<Switch style={Platform.OS==='ios'?{transform:[{scaleX:.72},{scaleY:.72},{translateY:1}],marginLeft:-8}:undefined}","<Switch style={Platform.OS==='ios'?{transform:[{scaleX:.72},{scaleY:.72},{translateY:14}],marginLeft:-8}:undefined}",'ios switch vertical alignment'],
]);

let c=fs.readFileSync('src/ChatScreen.tsx','utf8');
if(!c.includes('AppState')){
  c=c.replace("import{Alert,FlatList,Image,Keyboard,KeyboardAvoidingView,Linking,Platform,SafeAreaView,StyleSheet,TouchableOpacity,View}from'react-native';","import{Alert,AppState,FlatList,Image,Keyboard,KeyboardAvoidingView,Linking,Platform,SafeAreaView,StyleSheet,TouchableOpacity,View}from'react-native';");
}
if(!c.includes('waitForActiveApp')){
  c=c.replace("const activityTime=(value:string|null)=>{if(!value)return'';const d=new Date(value),now=new Date();const start=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime(),day=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();if(day===start)return messageTime(value);if(day===start-86400000)return'Hier';return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})};",
  "const activityTime=(value:string|null)=>{if(!value)return'';const d=new Date(value),now=new Date();const start=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime(),day=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();if(day===start)return messageTime(value);if(day===start-86400000)return'Hier';return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})};\nconst waitForActiveApp=async()=>{for(let i=0;i<20;i++){if(AppState.currentState==='active'){await new Promise(r=>setTimeout(r,180));return}await new Promise(r=>setTimeout(r,100))}throw new Error('L’app doit être active pour utiliser le microphone.');};");
}
const start=c.indexOf('async function toggleRecording(){');
const end=c.indexOf('async function playAudio',start);
if(start<0||end<0) throw new Error('src/ChatScreen.tsx: toggleRecording anchor missing');
const newToggle=`async function toggleRecording(){if(!roomId||mediaBusy)return;if(recording){try{await recording.stopAndUnloadAsync();const uri=recording.getURI();setRecording(null);await waitForActiveApp();await Audio.setAudioModeAsync({allowsRecordingIOS:false,playsInSilentModeIOS:true,staysActiveInBackground:false,shouldDuckAndroid:true,playThroughEarpieceAndroid:false});if(uri)await uploadAttachment(uri,'audio','message-onlive.m4a','audio/mp4')}catch(e:any){setRecording(null);Alert.alert('Audio impossible',e?.message||'Impossible d’envoyer cet audio.')}return}const perm=await Audio.requestPermissionsAsync();if(!perm.granted)return Alert.alert('Microphone','Autorise Onlive à utiliser le microphone pour envoyer un message audio.');try{await waitForActiveApp();await Audio.setAudioModeAsync({allowsRecordingIOS:true,playsInSilentModeIOS:true,staysActiveInBackground:false,shouldDuckAndroid:true,playThroughEarpieceAndroid:false});const rec=new Audio.Recording();await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);await rec.startAsync();setRecording(rec)}catch(e:any){setRecording(null);Alert.alert('Microphone impossible',e?.message||'Impossible de démarrer l’enregistrement.')}}\n `;
c=c.slice(0,start)+newToggle+c.slice(end);
c=c.replace("currentPresence.mode==='browsing'?<Text style={s.currentProgramOff}>Tu es Onlive · devant la TV</Text>","currentPresence.mode==='browsing'?<Text style={s.currentProgramOff}>Tu es Onlive · 🥱 tu glandes devant la TV</Text>");
fs.writeFileSync('src/ChatScreen.tsx',c);
console.log('Onlive polish applied: UI presence, loader, chat audio foreground handling.');
