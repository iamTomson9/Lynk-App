import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { CaretLeft, PaperPlaneRight } from 'phosphor-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { auth } from '../../firebaseConfig';
import { getSupabaseProfileId } from '../../utils/supabaseUtils';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [clubName, setClubName] = useState('Group Chat');
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    // Resolve my Supabase profile UUID
    getSupabaseProfileId().then((pid) => setMyProfileId(pid));

    // Load group name
    supabase.from('clubs').select('name').eq('id', id).single().then(({ data }) => {
      if (data) setClubName(data.name);
    });

    // Load messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('club_messages')
        .select(`
          id,
          body,
          created_at,
          sender_id,
          profiles:sender_id ( display_name )
        `)
        .eq('club_id', id)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`club_messages_${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'club_messages', filter: `club_id=eq.${id}` },
        async (payload) => {
          // Fetch the profile for the new message to get the display_name
          const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', payload.new.sender_id).single();
          
          const newMessage = {
            ...payload.new,
            profiles: profile || { display_name: 'Unknown' }
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function handleSend() {
    if (!inputText.trim() || !myProfileId || !id) return;

    const { error } = await supabase.from('club_messages').insert({
      club_id: id,
      sender_id: myProfileId,
      body: inputText.trim()
    });

    if (!error) {
      setInputText('');
    }
  }

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender_id === myProfileId;
    
    return (
      <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperOther]}>
        {!isMe && <Text style={styles.senderName}>{item.profiles?.display_name || 'User'}</Text>}
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.body}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <CaretLeft color="#1A1028" size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{clubName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
          disabled={!inputText.trim()}
          onPress={handleSend}
        >
          <PaperPlaneRight size={20} color="#FFF" weight="fill" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0E9F8', backgroundColor: '#FFFFFF' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FBF9FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0E9F8' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1028' },
  messageList: { padding: 20, gap: 12 },
  messageWrapper: { maxWidth: '80%', marginBottom: 12 },
  messageWrapperMe: { alignSelf: 'flex-end' },
  messageWrapperOther: { alignSelf: 'flex-start' },
  senderName: { fontSize: 11, color: '#766A87', marginBottom: 4, marginLeft: 4, fontWeight: '600' },
  messageBubble: { padding: 14, borderRadius: 20 },
  messageBubbleMe: { backgroundColor: '#FF4D6D', borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#F0E9F8' },
  messageText: { fontSize: 15, lineHeight: 21 },
  messageTextMe: { color: '#FFFFFF' },
  messageTextOther: { color: '#1A1028' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0E9F8' },
  input: { flex: 1, backgroundColor: '#FBF9FF', borderRadius: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, minHeight: 48, maxHeight: 100, color: '#1A1028', borderWidth: 1, borderColor: '#F0E9F8', fontSize: 15 },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  sendButtonDisabled: { backgroundColor: '#D4C6F4' }
});
