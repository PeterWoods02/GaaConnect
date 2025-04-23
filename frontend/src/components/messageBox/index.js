import React, { useEffect, useState, useMemo, useRef} from 'react';
import {Box,IconButton,Drawer,Typography,TextField,Button,List,ListItem,ListItemText,Divider,CircularProgress,} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { getMessages, sendMessage } from '../../api/messageApi';
import { getTeamById } from '../../api/teamsApi';
import { connectSocket, joinUserRoom, listenToUserMessages, leaveUserRoom, sendSocketMessage } from '../../services/socketClient';

const FloatingMessageBox = () => {
  const [open, setOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [viewingThreadWith, setViewingThreadWith] = useState(null);
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const viewingThreadRef = useRef(null);
  const [tick, setTick] = useState(0);

  const token = localStorage.getItem('token');
  const user = useMemo(() => token ? JSON.parse(atob(token.split('.')[1])) : null, [token]);

  const userId = useMemo(() => user?.id, [token]);

  useEffect(() => {
    viewingThreadRef.current = viewingThreadWith;
  }, [viewingThreadWith]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 20000); // every 20 seconds
  
    return () => clearInterval(interval); // cleanup
  }, []);

  
  useEffect(() => {
    if (!userId) return;
  
    connectSocket();
    joinUserRoom(userId);
  
    listenToUserMessages((msg) => {
      const msgSenderId = msg.sender?._id || msg.sender;
      const msgRecipientId = msg.recipient?._id || msg.recipient;
  
      const isSender = msgSenderId === user.id;
      const isRecipient = msgRecipientId === user.id;
  
      if (isRecipient && !isSender) {
        setMessages((prev) => [...prev, msg]);
        const currentThread = viewingThreadRef.current;
        const isInThread =
          currentThread &&
          (msgSenderId === currentThread._id || msgRecipientId === currentThread._id);
        if (!isInThread) {
          const senderName = typeof msg.sender === 'object' ? msg.sender.name : 'Someone';
          toast.info(`📨 New message from ${senderName}`);
        } else {
          console.log('Belongs to open thread ');
        }
      }
    });
  
    return () => {
      leaveUserRoom(userId);
    };
  }, [userId]);
  
   

  useEffect(() => {
    const loadMessages = async () => {
      if (!token) return;
      try {
        const data = await getMessages(token);
        setMessages(data);
      } catch (err) {
        console.error('failed to refresh messages', err);
      }
    };
  
    loadMessages();
  }, [tick, token]);
  

  // prefill recipient for players
  useEffect(() => {
    const fetchManager = async () => {
      if (!user || user.role !== 'player' || !user.team?.length) return;

      try {
        const team = await getTeamById(user.team[0]);
        const managerId = team?.manager?.[0]?._id;
        if (managerId) setRecipient(managerId);
      } catch (err) {
        console.error('could not fetch manager');
      }
    };

    fetchManager();
  }, [user]);

  useEffect(() => {
    const loadRecipients = async () => {
      if (!user || !user.team?.length) return;
  
      try {
        const team = await getTeamById(user.team[0]);
        const allUsers = [...(team.players || []), ...(team.manager || [])];
        const filtered = allUsers.filter((u) => {
          if (u._id === user.id) return false;
          if (user.role === 'player') return u.role === 'manager' || u.role === 'admin';
          return true;
        });
        setAvailableRecipients(filtered);
      } catch (err) {
        console.error('could not load recipients', err);
      }
    };
    loadRecipients();
  }, [user?.team?.[0], user?.id, user?.role]);
   
  const currentThreadMessages =
  viewingThreadWith && messages.length
    ? messages.filter((msg) => {
        const senderId = msg.sender?._id || msg.sender;
        const recipientId = msg.recipient?._id || msg.recipient;
        return senderId === viewingThreadWith._id || recipientId === viewingThreadWith._id;
      })
    : [];
  

  const handleViewThread = async (senderUser) => {
    try {
      setViewingThreadWith(senderUser);
      setRecipient(senderUser._id);
      setLoadingMessages(true);

      const filtered = messages.filter(
        (msg) =>
          msg.sender._id === senderUser._id ||
          msg.recipient === senderUser._id
      );

    } catch (err) {
      console.error('failed to load thread:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!recipient || !messageBody.trim()) return;
  
    try {
      setSending(true);
      sendSocketMessage({ sender: user.id, recipient, body: messageBody });
      setMessageBody('');
      
    } catch (err) {
      console.error('failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          bgcolor: '#1976d2',
          color: 'white',
          '&:hover': { bgcolor: '#1565c0' },
        }}
      >
        <MessageIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          setOpen(false);
          setViewingThreadWith(null);
        }}
        PaperProps={{
          sx: { width: 350, p: 2, display: 'flex', flexDirection: 'column' },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {viewingThreadWith ? `conversation with ${viewingThreadWith.name}` : 'messages'}
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
        {viewingThreadWith ? (
            <>
              <Button size="small" onClick={() => setViewingThreadWith(null)}>
                ← back
              </Button>
              {loadingMessages ? (
                <CircularProgress />
              ) : currentThreadMessages.length === 0 ? (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  no messages yet
                </Typography>
              ) : (
                <List>
                  {currentThreadMessages.map((msg) => (
                    <ListItem key={msg._id}>
                      <ListItemText
                        primary={`${typeof msg.sender === 'object' ? msg.sender.name : 'Someone'}: ${msg.body}`}
                        secondary={new Date(msg.createdAt).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          ) : loadingMessages ? (
            <CircularProgress />
          ) : messages.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              no messages yet
            </Typography>
          ) : (
            <List>
              {[...messages]
                .reduce((acc, msg) => {
                  if (!acc.find((m) => m.sender._id === msg.sender._id)) {
                    acc.push(msg);
                  }
                  return acc;
                }, [])
                .map((msg) => (
                  <React.Fragment key={msg._id}>
                    <ListItem component="button" onClick={() => handleViewThread(msg.sender)}>
                      <ListItemText
                        primary={`from: ${msg.sender.name}`}
                        secondary={`${msg.body.substring(0, 50)}...`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>

          )}
        </Box>

                {availableRecipients.length > 0 && (
          <TextField
            select
            fullWidth
            label="Send to"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="">Select recipient</option>
            {availableRecipients.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </TextField>
        )}

        {/* Composer */}
        <Box mt={2}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="type a message..."
          />
          <Button
            fullWidth
            sx={{ mt: 1 }}
            variant="contained"
            onClick={handleSend}
            disabled={sending || !messageBody || !recipient}
          >
            {sending ? 'sending...' : 'send'}
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default FloatingMessageBox;
