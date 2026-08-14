import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';

type Program = {
  id: string;
  title: string;
  channel: string;
  category: 'Divertissement' | 'Film' | 'Série' | 'Sport' | 'Foot';
  time: string;
  image: string;
};

type Friend = {
  id: string;
  name: string;
  program: string;
  channel: string;
  since: string;
  initials: string;
};

const PROGRAMS: Program[] = [
  {
    id: 'tf1-1',
    title: 'Une famille en or',
    channel: 'TF1',
    category: 'Divertissement',
    time: '21:10',
    image:
      'https://tf1pro.com/sites/default/files/styles/fiches/public/media-import/Famille%20en%20or%20Ruquier%20Bernier.jpg?itok=AMIwCdSl',
  },
  {
    id: 'f2-1',
    title: 'Capitaine Marleau',
    channel: 'France 2',
    category: 'Série',
    time: '21:10',
    image:
      'https://www.serie-news.com/app/uploads/2026/08/capitaine-marleau-france2-corinne-masiero-14-aout-1-1280x640.webp',
  },
  {
    id: 'm6-1',
    title: 'La Chambre des merveilles',
    channel: 'M6',
    category: 'Film',
    time: '21:10',
    image:
      'https://www.serie-news.com/app/uploads/2026/08/la-chambre-des-merveilles-m6-alexandra-lamy-14-aout-1280x640.webp',
  },
  {
    id: 'arte-1',
    title: 'Meurtres à Sandhamn',
    channel: 'Arte',
    category: 'Série',
    time: '20:55',
    image:
      'https://www.serie-news.com/app/uploads/2026/08/meurtres-a-sandhamn-arte-14-aout-1280x640.webp',
  },
  {
    id: 'bein-1',
    title: 'Saint-Étienne – Clermont',
    channel: 'beIN Sports 1',
    category: 'Foot',
    time: '20:40',
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'euro-1',
    title: 'Masters 1000 de Cincinnati',
    channel: 'Eurosport',
    category: 'Sport',
    time: '19:00',
    image:
      'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?auto=format&fit=crop&w=900&q=80',
  },
];

const FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Élodie',
    program: 'Une famille en or',
    channel: 'TF1',
    since: 'depuis 12 min',
    initials: 'EL',
  },
  {
    id: '2',
    name: 'Mike',
    program: 'Saint-Étienne – Clermont',
    channel: 'beIN Sports 1',
    since: 'depuis 4 min',
    initials: 'MI',
  },
  {
    id: '3',
    name: 'Romain',
    program: 'Capitaine Marleau',
    channel: 'France 2',
    since: 'depuis 21 min',
    initials: 'RO',
  },
];

const FILTERS = ['Tous', 'Divertissement', 'Film', 'Série', 'Sport', 'Foot'] as const;

type Screen = 'auth' | 'home' | 'contacts';

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.logoWrap, compact && styles.logoWrapCompact]}>
      <View style={styles.logoLeft}>
        <LinearGradient colors={['#2438ff', '#ff00a8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoCircle} />
        <Text style={styles.logoOn}>on</Text>
      </View>
      <LinearGradient colors={['#4324f4', '#ff00a8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoRight}>
        <Text style={styles.logoLive}>LIVE</Text>
        <Text style={styles.logoTv}>tv</Text>
      </LinearGradient>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Tous');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [deviceContacts, setDeviceContacts] = useState<Contacts.Contact[]>([]);
  const [contactsPermission, setContactsPermission] = useState<'idle' | 'granted' | 'denied'>('idle');

  const visiblePrograms = useMemo(() => {
    if (filter === 'Tous') return PROGRAMS;
    return PROGRAMS.filter((program) => program.category === filter);
  }, [filter]);

  const submitAuth = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Encore un petit effort', 'Entre ton e-mail et ton mot de passe pour continuer.');
      return;
    }
    setScreen('home');
  };

  const socialAuth = (provider: 'Apple' | 'Google') => {
    Alert.alert(
      `Connexion ${provider}`,
      `Le bouton est déjà prévu dans l’interface. La connexion réelle ${provider} sera branchée à l’authentification serveur dans la prochaine étape.`
    );
  };

  const chooseProgram = (program: Program) => {
    if (selectedProgram?.id === program.id) {
      setSelectedProgram(null);
      return;
    }
    setSelectedProgram(program);
  };

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      setContactsPermission('denied');
      Alert.alert('Accès refusé', 'Tu pourras autoriser l’accès aux contacts plus tard dans les réglages du téléphone.');
      return;
    }

    setContactsPermission('granted');
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      pageSize: 100,
    });
    setDeviceContacts(data);
  };

  const inviteContact = async (name: string) => {
    await Share.share({
      message: `Salut ${name} ! Je teste Onlive, l’app qui permet de voir ce que regardent tes proches à la TV et de se mettre Onlive sur un programme. Rejoins-moi sur Onlive 📺✨`,
    });
  };

  if (screen === 'auth') {
    return (
      <SafeAreaView style={styles.authScreen}>
        <StatusBar style="light" />
        <LinearGradient colors={['#09090b', '#15101f', '#09090b']} style={styles.authGradient}>
          <View style={styles.authTop}>
            <Logo />
            <Text style={styles.authTitle}>La télé devient sociale.</Text>
            <Text style={styles.authSubtitle}>Dis ce que tu regardes. Vois ce que regardent tes proches.</Text>
          </View>

          <View style={styles.authCard}>
            <View style={styles.authTabs}>
              <TouchableOpacity onPress={() => setAuthMode('register')} style={[styles.authTab, authMode === 'register' && styles.authTabActive]}>
                <Text style={[styles.authTabText, authMode === 'register' && styles.authTabTextActive]}>Créer un compte</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAuthMode('login')} style={[styles.authTab, authMode === 'login' && styles.authTabActive]}>
                <Text style={[styles.authTabText, authMode === 'login' && styles.authTabTextActive]}>Connexion</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Adresse e-mail"
              placeholderTextColor="#9a9aa3"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Mot de passe"
              placeholderTextColor="#9a9aa3"
              style={styles.input}
            />

            <TouchableOpacity onPress={submitAuth} activeOpacity={0.85}>
              <LinearGradient colors={['#4932ff', '#ed00b3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{authMode === 'register' ? 'Créer mon compte' : 'Me connecter'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.separatorRow}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separator} />
            </View>

            <TouchableOpacity style={styles.socialButton} onPress={() => socialAuth('Apple')}>
              <Ionicons name="logo-apple" size={22} color="#101014" />
              <Text style={styles.socialButtonText}>Continuer avec Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => socialAuth('Google')}>
              <Ionicons name="logo-google" size={21} color="#101014" />
              <Text style={styles.socialButtonText}>Continuer avec Google</Text>
            </TouchableOpacity>

            <Text style={styles.legal}>En continuant, tu acceptes les conditions d’utilisation et la politique de confidentialité Onlive.</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (screen === 'contacts') {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.contactsHeader}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.roundButton}>
            <Ionicons name="chevron-back" size={23} color="#17171c" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Mes contacts</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.contactsContent}>
          <View style={styles.contactsHero}>
            <LinearGradient colors={['#4932ff', '#ed00b3']} style={styles.contactIcon}>
              <Ionicons name="people" size={30} color="white" />
            </LinearGradient>
            <Text style={styles.contactsHeroTitle}>Retrouve tes proches sur Onlive</Text>
            <Text style={styles.contactsHeroText}>Onlive compare les numéros de ton téléphone avec les membres inscrits. Les autres pourront être invités par SMS, WhatsApp ou l’app de ton choix.</Text>
            <TouchableOpacity onPress={loadContacts} style={styles.contactsButton}>
              <Text style={styles.contactsButtonText}>{contactsPermission === 'granted' ? 'Actualiser mes contacts' : 'Autoriser mes contacts'}</Text>
            </TouchableOpacity>
          </View>

          {contactsPermission === 'granted' && (
            <>
              <Text style={styles.sectionTitle}>{deviceContacts.length} contacts disponibles</Text>
              {deviceContacts.slice(0, 20).map((contact) => (
                <View key={contact.id} style={styles.contactRow}>
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarSmallText}>{(contact.name || '?').slice(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{contact.name || 'Sans nom'}</Text>
                    <Text style={styles.contactMeta}>{contact.phoneNumbers?.[0]?.number || 'Aucun numéro'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => inviteContact(contact.name || 'toi')} style={styles.inviteButton}>
                    <Text style={styles.inviteButtonText}>Inviter</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </ScrollView>

        <BottomNav active="contacts" onHome={() => setScreen('home')} onContacts={() => setScreen('contacts')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Logo compact />
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, selectedProgram ? styles.statusDotOn : styles.statusDotOff]} />
            <Text style={styles.statusText}>{selectedProgram ? 'ONLIVE' : 'OFFLIVE'}</Text>
          </View>
        </View>

        <Text style={styles.introTitle}>Informe tes proches de ce que tu regardes</Text>
        <Text style={styles.introText}>Clique sur un programme pour passer Onlive. Tu peux aussi simplement parcourir l’app en restant Offlive.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((item) => (
            <TouchableOpacity key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={visiblePrograms}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.programList}
          renderItem={({ item }) => {
            const selected = selectedProgram?.id === item.id;
            return (
              <TouchableOpacity onPress={() => chooseProgram(item)} activeOpacity={0.9} style={[styles.programCard, selected && styles.programCardSelected]}>
                <Image source={{ uri: item.image }} style={styles.programImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.82)']} style={styles.programOverlay} />
                <View style={styles.programTopRow}>
                  <View style={styles.timeBadge}><Text style={styles.timeBadgeText}>{item.time}</Text></View>
                  {selected && <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>ONLIVE</Text></View>}
                </View>
                <View style={styles.programInfo}>
                  <Text style={styles.programChannel}>{item.channel}</Text>
                  <Text style={styles.programTitle} numberOfLines={2}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {selectedProgram && (
          <View style={styles.nowLiveCard}>
            <LinearGradient colors={['#4932ff', '#ed00b3']} style={styles.nowLiveIcon}>
              <Ionicons name="radio" size={22} color="white" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.nowLiveLabel}>Tu es Onlive</Text>
              <Text style={styles.nowLiveTitle}>{selectedProgram.title}</Text>
              <Text style={styles.nowLiveMeta}>{selectedProgram.channel} · {selectedProgram.time}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedProgram(null)} style={styles.offButton}>
              <Text style={styles.offButtonText}>Offlive</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Tes proches Onlive</Text>
            <Text style={styles.sectionSubtitle}>Ce qu’ils regardent maintenant</Text>
          </View>
          <View style={styles.countBadge}><Text style={styles.countBadgeText}>{FRIENDS.length}</Text></View>
        </View>

        {FRIENDS.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.friendRow} activeOpacity={0.85}>
            <LinearGradient colors={['#4932ff', '#ed00b3']} style={styles.avatar}>
              <Text style={styles.avatarText}>{friend.initials}</Text>
            </LinearGradient>
            <View style={styles.friendInfo}>
              <View style={styles.friendNameRow}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <View style={styles.greenDot} />
              </View>
              <Text style={styles.friendProgram} numberOfLines={1}>{friend.program}</Text>
              <Text style={styles.friendMeta}>{friend.channel} · {friend.since}</Text>
            </View>
            <Ionicons name="chevron-forward" size={19} color="#b4b4ba" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => setScreen('contacts')} style={styles.findFriendsCard}>
          <View style={styles.findFriendsIcon}><Ionicons name="person-add" size={22} color="#7834ef" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.findFriendsTitle}>Trouver plus de proches</Text>
            <Text style={styles.findFriendsText}>Regarde qui utilise déjà Onlive dans tes contacts.</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color="#b4b4ba" />
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav active="home" onHome={() => setScreen('home')} onContacts={() => setScreen('contacts')} />
    </SafeAreaView>
  );
}

function BottomNav({ active, onHome, onContacts }: { active: 'home' | 'contacts'; onHome: () => void; onContacts: () => void }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={onHome} style={styles.navItem}>
        <Ionicons name={active === 'home' ? 'home' : 'home-outline'} size={24} color={active === 'home' ? '#7b2cf0' : '#8a8a94'} />
        <Text style={[styles.navText, active === 'home' && styles.navTextActive]}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onContacts} style={styles.navItem}>
        <Ionicons name={active === 'contacts' ? 'people' : 'people-outline'} size={25} color={active === 'contacts' ? '#7b2cf0' : '#8a8a94'} />
        <Text style={[styles.navText, active === 'contacts' && styles.navTextActive]}>Contacts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f7fa' },
  authScreen: { flex: 1, backgroundColor: '#09090b' },
  authGradient: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 },
  authTop: { alignItems: 'center', paddingTop: 20 },
  authTitle: { marginTop: 26, color: 'white', fontSize: 30, fontWeight: '800', letterSpacing: -0.8, textAlign: 'center' },
  authSubtitle: { marginTop: 10, color: '#bdbdc8', fontSize: 16, lineHeight: 22, textAlign: 'center', paddingHorizontal: 20 },
  authCard: { backgroundColor: 'white', borderRadius: 30, padding: 18, shadowColor: '#000', shadowOpacity: 0.24, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 12 },
  authTabs: { flexDirection: 'row', backgroundColor: '#f0f0f4', borderRadius: 14, padding: 4, marginBottom: 14 },
  authTab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 11 },
  authTabActive: { backgroundColor: 'white' },
  authTabText: { fontSize: 14, fontWeight: '700', color: '#81818a' },
  authTabTextActive: { color: '#15151a' },
  input: { backgroundColor: '#f6f6f9', borderWidth: 1, borderColor: '#ebebef', borderRadius: 14, paddingHorizontal: 15, height: 52, fontSize: 16, color: '#15151a', marginBottom: 10 },
  primaryButton: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '800' },
  separatorRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  separator: { flex: 1, height: 1, backgroundColor: '#e7e7eb' },
  separatorText: { marginHorizontal: 12, color: '#9a9aa3', fontSize: 13 },
  socialButton: { height: 50, borderRadius: 15, borderWidth: 1, borderColor: '#e5e5e9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 9 },
  socialButtonText: { fontSize: 15, fontWeight: '700', color: '#16161b' },
  legal: { textAlign: 'center', color: '#a0a0a9', fontSize: 11, lineHeight: 16, marginTop: 4, paddingHorizontal: 8 },
  logoWrap: { height: 72, flexDirection: 'row', alignItems: 'stretch', borderRadius: 36, overflow: 'hidden' },
  logoWrapCompact: { height: 46, borderRadius: 23 },
  logoLeft: { backgroundColor: 'white', minWidth: 104, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  logoCircle: { position: 'absolute', width: 39, height: 39, borderRadius: 20, left: 14 },
  logoOn: { fontSize: 48, fontWeight: '300', letterSpacing: -4, color: '#15151a', marginLeft: 6 },
  logoRight: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  logoLive: { color: 'white', fontSize: 35, fontWeight: '800', letterSpacing: 2 },
  logoTv: { color: 'white', fontSize: 17, alignSelf: 'flex-start', marginTop: 10, marginLeft: 2 },
  homeContent: { paddingTop: 10 },
  headerCard: { marginHorizontal: 16, backgroundColor: '#111115', borderRadius: 24, minHeight: 78, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#27272d', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDotOn: { backgroundColor: '#35d36b' },
  statusDotOff: { backgroundColor: '#8d8d96' },
  statusText: { color: 'white', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  introTitle: { marginHorizontal: 18, marginTop: 20, fontSize: 20, fontWeight: '800', color: '#15151a' },
  introText: { marginHorizontal: 18, marginTop: 6, fontSize: 14, lineHeight: 20, color: '#7d7d86' },
  filtersRow: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 8 },
  filterChip: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e5ea', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9 },
  filterChipActive: { backgroundColor: '#18181d', borderColor: '#18181d' },
  filterText: { color: '#6e6e77', fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: 'white' },
  programList: { paddingHorizontal: 16, paddingVertical: 4, gap: 12 },
  programCard: { width: 170, height: 225, borderRadius: 20, overflow: 'hidden', backgroundColor: '#25252b', borderWidth: 2, borderColor: 'transparent' },
  programCardSelected: { borderColor: '#d700bf' },
  programImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  programOverlay: { ...StyleSheet.absoluteFillObject },
  programTopRow: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between' },
  timeBadge: { backgroundColor: 'rgba(0,0,0,0.72)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  timeBadgeText: { color: 'white', fontSize: 11, fontWeight: '800' },
  liveBadge: { backgroundColor: '#e600b6', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  liveBadgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
  programInfo: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  programChannel: { color: '#d7d7df', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  programTitle: { color: 'white', fontSize: 16, lineHeight: 20, fontWeight: '800' },
  nowLiveCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: 'white', borderRadius: 20, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#ebe7f1' },
  nowLiveIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nowLiveLabel: { fontSize: 11, fontWeight: '800', color: '#b0009e', textTransform: 'uppercase' },
  nowLiveTitle: { fontSize: 15, fontWeight: '800', color: '#18181d', marginTop: 2 },
  nowLiveMeta: { fontSize: 12, color: '#8b8b94', marginTop: 2 },
  offButton: { borderRadius: 12, backgroundColor: '#f0f0f3', paddingHorizontal: 11, paddingVertical: 8 },
  offButtonText: { color: '#585860', fontSize: 12, fontWeight: '800' },
  sectionHeader: { marginHorizontal: 18, marginTop: 24, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#17171c' },
  sectionSubtitle: { fontSize: 13, color: '#888891', marginTop: 3 },
  countBadge: { minWidth: 29, height: 29, borderRadius: 15, backgroundColor: '#ece7fb', alignItems: 'center', justifyContent: 'center' },
  countBadgeText: { color: '#7437e4', fontWeight: '800' },
  friendRow: { marginHorizontal: 16, marginBottom: 9, padding: 12, borderRadius: 18, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ededf0' },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 14, fontWeight: '900' },
  friendInfo: { flex: 1, marginLeft: 11 },
  friendNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  friendName: { fontSize: 15, fontWeight: '800', color: '#18181d' },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#34cf68' },
  friendProgram: { fontSize: 13, fontWeight: '700', color: '#55555d', marginTop: 3 },
  friendMeta: { fontSize: 11, color: '#9999a2', marginTop: 2 },
  findFriendsCard: { marginHorizontal: 16, marginTop: 5, padding: 14, borderRadius: 18, backgroundColor: '#f1ecff', flexDirection: 'row', alignItems: 'center', gap: 11 },
  findFriendsIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  findFriendsTitle: { fontSize: 14, fontWeight: '800', color: '#34245f' },
  findFriendsText: { fontSize: 12, lineHeight: 17, color: '#776b94', marginTop: 2 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 76, backgroundColor: 'rgba(255,255,255,0.97)', borderTopWidth: 1, borderTopColor: '#e7e7eb', flexDirection: 'row', paddingBottom: 8 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navText: { fontSize: 11, fontWeight: '700', color: '#8a8a94' },
  navTextActive: { color: '#7b2cf0' },
  contactsHeader: { height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e7e7eb' },
  pageTitle: { fontSize: 18, fontWeight: '800', color: '#17171c' },
  contactsContent: { paddingHorizontal: 16, paddingBottom: 100 },
  contactsHero: { backgroundColor: 'white', padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#ececf0' },
  contactIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  contactsHeroTitle: { fontSize: 20, fontWeight: '800', color: '#17171c', textAlign: 'center' },
  contactsHeroText: { color: '#7d7d87', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  contactsButton: { marginTop: 16, backgroundColor: '#18181d', paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14 },
  contactsButtonText: { color: 'white', fontSize: 14, fontWeight: '800' },
  contactRow: { backgroundColor: 'white', borderRadius: 16, padding: 11, marginTop: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ededf0' },
  avatarSmall: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#ece8fb', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarSmallText: { color: '#6937d7', fontSize: 12, fontWeight: '900' },
  contactName: { fontSize: 14, fontWeight: '800', color: '#19191e' },
  contactMeta: { fontSize: 12, color: '#92929a', marginTop: 2 },
  inviteButton: { backgroundColor: '#f0ebff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  inviteButtonText: { color: '#7037df', fontSize: 12, fontWeight: '800' },
});
