const fs=require('fs');
const path='src/MainApp.tsx';
let text=fs.readFileSync(path,'utf8');
function rep(search,replacement,label){const next=text.replace(search,replacement);if(next===text)throw new Error('Patch not applied: '+label);text=next;}

rep(
"const[notifyOpen,setNotifyOpen]=useState(false);const[notifySelected,setNotifySelected]=useState<string[]>([]);const[liveSearchOpen,setLiveSearchOpen]=useState(false);const[liveSearch,setLiveSearch]=useState('');const[attentionFlash,setAttentionFlash]=useState(false);const[favoritesOpen,setFavoritesOpen]=useState(false);const[favoriteSearch,setFavoriteSearch]=useState('');const[favoriteSection,setFavoriteSection]=useState<'Sports'|'Émissions'|'Films & séries'>('Sports');const[favorites,setFavorites]=useState<string[]>([]);",
"const[notifyOpen,setNotifyOpen]=useState(false);const[notifySelected,setNotifySelected]=useState<string[]>([]);const[liveSearchOpen,setLiveSearchOpen]=useState(false);const[liveSearch,setLiveSearch]=useState('');const[attentionFlash,setAttentionFlash]=useState(false);const[favoritesOpen,setFavoritesOpen]=useState(false);const[favoriteSearch,setFavoriteSearch]=useState('');const[favoriteSection,setFavoriteSection]=useState<'Sports'|'Émissions'|'Films & séries'>('Sports');const[favorites,setFavorites]=useState<string[]>([]);const[expandedSport,setExpandedSport]=useState<string|null>(null);const[suggestionText,setSuggestionText]=useState('');const[suggestionSaving,setSuggestionSaving]=useState(false);",
'states');

rep(
"  async function toggleFavorite(id:string){const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];setFavorites(next);await AsyncStorage.setItem(FAVORITES_KEY,JSON.stringify(next))}\n",
"  async function toggleFavorite(id:string){const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];setFavorites(next);await AsyncStorage.setItem(FAVORITES_KEY,JSON.stringify(next))}\n  async function submitFavoriteSuggestion(section:string,sport?:string){const label=suggestionText.trim();if(!label||!userId)return;if(suggestionSaving)return;setSuggestionSaving(true);try{const{error}=await supabase.from('favorite_suggestions').insert({user_id:userId,label,section,sport:sport||null,status:'pending'});if(error)throw error;setSuggestionText('');Alert.alert('Merci','Ta proposition a bien été envoyée. Elle pourra être ajoutée au catalogue Onlive.')}catch(e:any){Alert.alert('Envoi impossible',e?.message||'Impossible d’envoyer ta proposition.')}finally{setSuggestionSaving(false)}}\n",
'suggestion function');

rep(
"return<SafeAreaView style={s.screen}><StatusBar style=\"dark\"/><View style={s.onliveTopBar}><Image source={LOGO_ON} resizeMode=\"contain\" style={s.onLogo}/><TouchableOpacity accessibilityLabel=\"Mes favoris\" onPress={()=>setFavoritesOpen(true)} style={s.favoriteTopButton}><Ionicons name={favorites.length?'star':'star-outline'} size={30} color={favorites.length?'#FFD43B':'#111111'}/></TouchableOpacity></View>",
"return<SafeAreaView style={s.screen}><StatusBar style=\"dark\"/><View style={s.onliveTopBar}><Image source={LOGO_ON} resizeMode=\"contain\" style={s.onLogo}/><TouchableOpacity accessibilityLabel=\"Mes favoris\" onPress={()=>setFavoritesOpen(true)} style={s.favoriteTopButton}><Ionicons name={favorites.length?'star':'star-outline'} size={26} color={favorites.length?'#FFD43B':'#111111'}/></TouchableOpacity></View>",
'topbar icon');

rep(
"<View style={s.liveSectionHead}><Text style={s.sectionTitle}>Ils sont Onlive ({liveFriends.length})</Text>",
"<View style={s.liveSectionHead}><Text style={[s.sectionTitle,s.liveSectionTitle]}>Ils sont Onlive ({liveFriends.length})</Text>",
'live title style');

const oldSports="{sportFavorites.map((item:any)=><FavoriteRow key={item.id} item={item} active={favorites.includes(item.id)} onPress={()=>toggleFavorite(item.id)}/>)}{selectedSports.length>0&&<><Text style={[s.favoriteBlockTitle,{marginTop:18}]}>Affiner tes sports <Text style={s.favoriteOptional}>(facultatif)</Text></Text><Text style={s.favoriteBlockHint}>Ajoute seulement les clubs, équipes ou compétitions qui t’intéressent particulièrement.</Text>{selectedSports.map((sport:any)=>{const related=relatedForSport(sport.id);if(!related.length)return null;return<View key={sport.id} style={s.favoriteRelatedCard}><View style={s.favoriteRelatedHead}><Ionicons name={sport.icon as any} size={19} color=\"#111\"/><Text style={s.favoriteRelatedTitle}>{sport.label}</Text></View><View style={s.favoriteRelatedChips}>{related.map((item:any)=>{const active=favorites.includes(item.id);return<TouchableOpacity key={item.id} onPress={()=>toggleFavorite(item.id)} style={[s.favoriteRelatedChip,active&&s.favoriteRelatedChipActive]}><Text style={[s.favoriteRelatedChipText,active&&s.favoriteRelatedChipTextActive]}>{item.label}</Text></TouchableOpacity>})}</View></View>})}</>}";
const newSports="{sportFavorites.map((item:any)=>{const open=expandedSport===item.id;const related=relatedForSport(item.id);return<View key={item.id}><SportFavoriteRow item={item} active={favorites.includes(item.id)} open={open} onToggleOpen={()=>{setExpandedSport(open?null:item.id);setSuggestionText('')}} onToggleFavorite={()=>toggleFavorite(item.id)}/>{open&&<View style={s.sportAccordion}><Text style={s.favoriteBlockHint}>Affiner {item.label} <Text style={s.favoriteOptional}>(facultatif)</Text></Text>{['Clubs','Équipes','Compétitions'].map(group=>{const items=related.filter((x:any)=>x.group===group);if(!items.length)return null;return<View key={group} style={s.sportAccordionGroup}><Text style={s.sportAccordionLabel}>{group}</Text><View style={s.favoriteRelatedChips}>{items.map((x:any)=>{const active=favorites.includes(x.id);return<TouchableOpacity key={x.id} onPress={()=>toggleFavorite(x.id)} style={[s.favoriteRelatedChip,active&&s.favoriteRelatedChipActive]}><Text style={[s.favoriteRelatedChipText,active&&s.favoriteRelatedChipTextActive]}>{x.label}</Text></TouchableOpacity>})}</View></View>})}<SuggestionBox value={suggestionText} onChange={setSuggestionText} placeholder={`Ajouter un club, une compétition ou une discipline liée à ${item.label}`} disabled={suggestionSaving} onSubmit={()=>submitFavoriteSuggestion('Sports',item.id)}/></View>}</View>})}";
rep(oldSports,newSports,'sports accordion');

rep(
"favoriteSection==='Sports'?<><Text style={s.favoriteBlockTitle}>Choisis tes sports</Text><Text style={s.favoriteBlockHint}>Tu recevras les alertes importantes liées aux sports sélectionnés.</Text>",
"favoriteSection==='Sports'?<><Text style={s.favoriteBlockTitle}>Choisis tes sports</Text><Text style={s.favoriteBlockHint}>Appuie sur un sport pour l’ouvrir. Pour suivre tout le sport, touche uniquement son étoile.</Text>",
'sports hint');

rep(
"<><Text style={s.favoriteBlockTitle}>{favoriteSection}</Text>{sectionFavorites.map((item:any)=><FavoriteRow key={item.id} item={item} active={favorites.includes(item.id)} onPress={()=>toggleFavorite(item.id)}/>)}</>",
"<><Text style={s.favoriteBlockTitle}>{favoriteSection}</Text>{sectionFavorites.map((item:any)=><FavoriteRow key={item.id} item={item} active={favorites.includes(item.id)} onPress={()=>toggleFavorite(item.id)}/>)}<SuggestionBox value={suggestionText} onChange={setSuggestionText} placeholder={favoriteSection==='Émissions'?'Ajouter une émission ou un programme':'Ajouter un genre, une série ou un programme'} disabled={suggestionSaving} onSubmit={()=>submitFavoriteSuggestion(favoriteSection)}/></>",
'section suggestion');

rep(
"function FavoriteRow({item,active,onPress}:{item:any;active:boolean;onPress:()=>void}){return<TouchableOpacity onPress={onPress} style={s.favoriteRow}><View style={[s.favoriteIcon,{backgroundColor:active?'#17171c':'#ececf2'}]}><Ionicons name={item.icon as any} size={23} color={active?'#fff':'#666'}/></View><View style={{flex:1}}><Text style={s.favoriteLabel}>{item.label}</Text><Text style={s.favoriteMeta}>{item.group}</Text></View><Ionicons name={active?'star':'star-outline'} size={25} color={active?'#FFD43B':'#aaa'}/></TouchableOpacity>}\n",
"function FavoriteRow({item,active,onPress}:{item:any;active:boolean;onPress:()=>void}){return<TouchableOpacity onPress={onPress} style={s.favoriteRow}><View style={[s.favoriteIcon,{backgroundColor:active?'#17171c':'#ececf2'}]}><Ionicons name={item.icon as any} size={23} color={active?'#fff':'#666'}/></View><View style={{flex:1}}><Text style={s.favoriteLabel}>{item.label}</Text><Text style={s.favoriteMeta}>{item.group}</Text></View><Ionicons name={active?'star':'star-outline'} size={25} color={active?'#FFD43B':'#aaa'}/></TouchableOpacity>}\nfunction SportFavoriteRow({item,active,open,onToggleOpen,onToggleFavorite}:{item:any;active:boolean;open:boolean;onToggleOpen:()=>void;onToggleFavorite:()=>void}){return<View style={s.favoriteRow}><TouchableOpacity onPress={onToggleOpen} style={s.sportFavoriteMain}><View style={[s.favoriteIcon,{backgroundColor:active?'#17171c':'#ececf2'}]}><Ionicons name={item.icon as any} size={23} color={active?'#fff':'#666'}/></View><View style={{flex:1}}><Text style={s.favoriteLabel}>{item.label}</Text><Text style={s.favoriteMeta}>{open?'Masquer les options':'Voir clubs, équipes et compétitions'}</Text></View><Ionicons name={open?'chevron-up':'chevron-down'} size={19} color=\"#888\"/></TouchableOpacity><TouchableOpacity accessibilityLabel={`Mettre ${item.label} en favori`} onPress={onToggleFavorite} style={s.favoriteStarButton}><Ionicons name={active?'star':'star-outline'} size={25} color={active?'#FFD43B':'#aaa'}/></TouchableOpacity></View>}\nfunction SuggestionBox({value,onChange,placeholder,onSubmit,disabled}:{value:string;onChange:(v:string)=>void;placeholder:string;onSubmit:()=>void;disabled:boolean}){return<View style={s.suggestionBox}><Text style={s.suggestionTitle}>Tu ne trouves pas ce que tu veux ?</Text><View style={s.suggestionRow}><TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor=\"#999\" style={s.suggestionInput}/><TouchableOpacity disabled={disabled||!value.trim()} onPress={onSubmit} style={[s.suggestionButton,(disabled||!value.trim())&&s.suggestionButtonDisabled]}><Ionicons name=\"add\" size={20} color=\"#fff\"/></TouchableOpacity></View></View>}\n",
'components');

rep(
"onliveTopBar:{height:54,backgroundColor:'#fff',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#eeeeF3'},onLogo:{width:42,height:42,borderRadius:10},favoriteTopButton:{width:42,height:42,alignItems:'center',justifyContent:'center'},",
"onliveTopBar:{height:54,backgroundColor:'transparent',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},onLogo:{width:48,height:48,borderRadius:11},favoriteTopButton:{width:34,height:34,alignItems:'center',justifyContent:'center'},",
'topbar styles');

rep(
"introTitle:{fontSize:23,fontWeight:'900',marginTop:16,color:'#111'},",
"introTitle:{fontSize:21,fontWeight:'800',marginTop:14,color:'#111'},",
'intro title');

rep(
"sectionTitle:{fontSize:20,fontWeight:'800',marginVertical:12},liveSectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},",
"sectionTitle:{fontSize:20,fontWeight:'800',marginVertical:12},liveSectionTitle:{fontSize:19,fontWeight:'700'},liveSectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},",
'live section style');

rep(
"favoriteRelatedChipTextActive:{color:'#fff'},profileModalHead:",
"favoriteRelatedChipTextActive:{color:'#fff'},sportFavoriteMain:{flex:1,flexDirection:'row',alignItems:'center',gap:12},favoriteStarButton:{width:42,height:42,alignItems:'center',justifyContent:'center'},sportAccordion:{backgroundColor:'#fff',borderRadius:18,padding:13,marginTop:-2,marginBottom:10,borderTopWidth:1,borderTopColor:'#f0f0f3'},sportAccordionGroup:{marginTop:9},sportAccordionLabel:{fontSize:12,fontWeight:'900',color:'#666',marginBottom:7,textTransform:'uppercase'},suggestionBox:{marginTop:14,paddingTop:12,borderTopWidth:1,borderTopColor:'#eeeef3'},suggestionTitle:{fontSize:12,fontWeight:'800',color:'#666',marginBottom:8},suggestionRow:{flexDirection:'row',gap:8,alignItems:'center'},suggestionInput:{flex:1,height:44,borderWidth:1,borderColor:'#dddde5',borderRadius:14,paddingHorizontal:12,fontSize:13,backgroundColor:'#fff',color:'#111'},suggestionButton:{width:44,height:44,borderRadius:14,backgroundColor:'#17171c',alignItems:'center',justifyContent:'center'},suggestionButtonDisabled:{opacity:.35},profileModalHead:",
'new styles');

fs.writeFileSync(path,text);
console.log('Favorites accordion polish applied');
