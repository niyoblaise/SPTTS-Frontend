import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ChatWindow({ roomId, title }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        api.get(`/messages/${roomId}`).then(res => {
            setMessages(res.data);
            setLoading(false);
        }).catch(() => {
            setMessages([]);
            setLoading(false);
        });

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const msg = JSON.parse(message.body);
                    setMessages(prev => [...prev, msg]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => { if (client) client.deactivate(); };
    }, [roomId]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = () => {
        if (newMessage.trim() && clientRef.current?.connected) {
            const chatMessage = {
                senderId: user.userId,
                senderName: user.fullName,
                content: newMessage,
                type: 'CHAT',
                chatId: roomId
            };
            clientRef.current.publish({
                destination: `/app/chat/${roomId}/sendMessage`,
                body: JSON.stringify(chatMessage)
            });
            setNewMessage('');
        }
    };

    return (
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{title.charAt(0)}</Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="700">{title}</Typography>
                    <Typography variant="caption" color="success.main" fontWeight={600}>
                        Live
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user.userId;
                        return (
                            <Box key={index} sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                {!isMe && (
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, fontWeight: 500 }}>
                                        {msg.senderName}
                                    </Typography>
                                )}
                                <Paper sx={{
                                    p: 1.5, px: 2, borderRadius: 2,
                                    borderTopRightRadius: isMe ? 4 : 16,
                                    borderTopLeftRadius: isMe ? 16 : 4,
                                    bgcolor: isMe ? 'primary.main' : '#334155',
                                    color: 'text.primary',
                                    border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <Typography variant="body2">{msg.content}</Typography>
                                </Paper>
                                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, mx: 1, fontSize: '0.7rem' }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    variant="outlined"
                    size="small"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <IconButton
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    color="primary"
                    size="small"
                >
                    <Send fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    );
}
