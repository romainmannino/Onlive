import fs from 'node:fs';

const path='src/MainApp.tsx';
let src=fs.readFileSync(path,'utf8');

function replaceOnce(oldText,newText,label){
  const count=src.split(oldText).length-1;
  if(count!==1)throw new Error(`${label}: expected 1 match, found ${count}`);
  src=src.replace(oldText,newText);
}

replaceOnce(
  "import{Alert,FlatList,Image,Modal,SafeAreaView,ScrollView,Share,StyleSheet,Text,TextInput,TouchableOpacity,View,useWindowDimensions}from'react-native';",
  "import{Alert,FlatList,Image,Linking,Modal,SafeAreaView,ScrollView,Share,StyleSheet,Text,TextInput,TouchableOpacity,View,useWindowDimensions}from'react-native';",
  'Linking import'
);

replaceOnce(
  "  const[notifyOpen,setNotifyOpen]=useState(false);const[notifySelected,setNotifySelected]=useState<string[]>([]);const[liveSearchOpen,setLiveSearchOpen]=useState(false);const[liveSearch,setLiveSearch]=useState('');",
  "  const[notifyOpen,setNotifyOpen]=useState(false);const[notifySelected,setNotifySelected]=useState<string[]>([]);const[liveSearchOpen,setLiveSearchOpen]=useState(false);const[liveSearch,setLiveSearch]=useState('');const[attentionFlash,setAttentionFlash]=useState(false);",
  'attention state'
);

const authAnchor="  useEffect(()=>{if(userId&&screen!=='auth')setScreen(initialScreen)},[initialScreen]);";
replaceOnce(
  authAnchor,
  "  useEffect(()=>{const handleConfirmed=async(url:string|null)=>{if(!url?.startsWith('onlive://email-confirmed'))return;await supabase.auth.signOut({scope:'local'}).catch(()=>{});setUserId(null);setSelectedProgram(null);setPassword('');setAuthMode('login');setScreen('auth')};Linking.getInitialURL().then(handleConfirmed);const sub=Linking.addEventListener('url',({url})=>handleConfirmed(url));return()=>sub.remove()},[]);\n"+authAnchor,
  'confirmation redirect'
);

replaceOnce(
  "<Text style={s.introText}>{selectedProgram?`${selectedProgram.channel} · ${selectedProgram.title}`:'Clique sur un programme pour indiquer ce que tu regardes.'}</Text>",
  "<Text style={[s.introText,attentionFlash&&s.introTextAttention]}>{selectedProgram?`${selectedProgram.channel} · ${selectedProgram.title}`:'Clique sur un programme pour indiquer ce que tu regardes.'}</Text>",
  'intro attention style'
);

replaceOnce(
  "<TouchableOpacity key={f.userId} disabled={!canChat} activeOpacity={canChat?.7:1} onPress={canChat?()=>onStartChat?.({userId:f.userId,name:f.name,programId:f.programId,programTitle:f.program,channel:f.channel}):undefined} style={[s.friendRow,i<sortedLiveFriends.length-1&&s.friendDivider]}>",
  "<TouchableOpacity key={f.userId} activeOpacity={.7} onPress={()=>{const target={userId:f.userId,name:f.name,programId:f.programId,programTitle:f.program,channel:f.channel};if(canChat){onStartChat?.(target);return}if(!selectedProgram){setAttentionFlash(true);setTimeout(()=>setAttentionFlash(false),3000);return}onStartChat?.(target)}} style={[s.friendRow,i<sortedLiveFriends.length-1&&s.friendDivider]}>",
  'friend tap behavior'
);

replaceOnce(
  "introText:{fontSize:15,color:'#666',marginTop:5},filtersRow:",
  "introText:{fontSize:15,color:'#666',marginTop:5},introTextAttention:{color:'#6b2cff',fontWeight:'800'},filtersRow:",
  'attention style definition'
);

fs.writeFileSync(path,src);
console.log('Applied Onlive mobile UX fixes.');
