import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PaperPlaneTilt, Sparkle } from 'phosphor-react-native';
import { DEMO_USER_ID } from '../../utils/lynkPrototypeData';
import { getMessages, sendMessage } from '../../utils/lynkData';
import { LynkMessage } from '../../utils/lynkTypes';

const MATCH_ID = 'match-ama';
const ICEBREAKERS = ['Study session this week?', 'What club should I join first?', 'Best food spot near campus?'];

export default function MessagesScreen() {
  const [messages, setMessages] = useState<LynkMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    getMessages(MATCH_ID).then(setMessages);
  }, []);

  async function submit(text = draft, type: LynkMessage['type'] = 'text') {
    const body = text.trim();
    if (!body) return;
    const message = await sendMessage(MATCH_ID, body, type);
    setMessages((items) => [...items, message]);
    setDraft('');
    setTyping(true);
    setTimeout(() => setTyping(false), 1200);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Real-time chat prototype</Text>
        <Text style={styles.title}>Ama</Text>
        <Text style={styles.subtitle}>{typing ? 'Typing...' : 'Matched through Tech Society interests'}</Text>
      </View>

      <View style={styles.iceBreakerRail}>
        {ICEBREAKERS.map((item) => (
          <TouchableOpacity key={item} style={styles.iceBreaker} onPress={() => submit(item, 'icebreaker')}>
            <Sparkle size={14} color="#7C3AED" weight="fill" />
            <Text style={styles.iceBreakerText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const mine = item.senderId === DEMO_USER_ID;
          return (
            <View style={[styles.messageBubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.messageText, mine && styles.mineText]}>{item.body}</Text>
            </View>
          );
        }}
      />

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Message your match"
          placeholderTextColor="#9C92A8"
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => submit()}>
          <PaperPlaneTilt size={21} color="#FFFFFF" weight="fill" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF', paddingTop: 54 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  kicker: { color: '#766A87', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  title: { color: '#1A1028', fontSize: 32, fontWeight: '900' },
  subtitle: { color: '#766A87', fontWeight: '700', marginTop: 4 },
  iceBreakerRail: { paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iceBreaker: { minHeight: 38, borderRadius: 19, paddingHorizontal: 12, backgroundColor: '#F1EBFF', flexDirection: 'row', alignItems: 'center', gap: 6 },
  iceBreakerText: { color: '#4C357A', fontSize: 12, fontWeight: '800' },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18 },
  messageBubble: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, marginBottom: 10 },
  mine: { alignSelf: 'flex-end', backgroundColor: '#FF4D6D', borderBottomRightRadius: 6 },
  theirs: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: '#F0E9F8' },
  messageText: { color: '#2E2438', fontSize: 15, lineHeight: 21, fontWeight: '600' },
  mineText: { color: '#FFFFFF' },
  composer: { padding: 14, paddingBottom: 26, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0E9F8', flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  input: { flex: 1, minHeight: 48, maxHeight: 104, borderRadius: 24, backgroundColor: '#F8F4FF', paddingHorizontal: 16, paddingVertical: 13, color: '#1A1028', fontSize: 15, fontWeight: '600' },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FF4D6D', alignItems: 'center', justifyContent: 'center' },
});
