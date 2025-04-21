import React, { useEffect, useState } from 'react';
import {Box,IconButton,Drawer,Typography,TextField,Button,List,ListItem,ListItemText,Divider,CircularProgress,} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';

import { getMessages, sendMessage } from '../../api/messageApi';
import { getTeamById } from '../../api/teamsApi';
import { connectSocket, joinUserRoom, listenToUserMessages, leaveUserRoom } from '../../services/socketClient';

const FloatingMessageBox = () => {
  const [open, setOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [viewingThreadWith, setViewingThreadWith] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);

  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  useEffect(() => {
    if (!user?.id) return; 
  
    connectSocket();
    joinUserRoom(user.id);
  
    listenToUserMessages((msg) => {
      console.log('📥 real-time message:', msg);
    });
  
    // leave room on unmount
    return () => {
      leaveUserRoom(user.id);
    };
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!open || !token) return;
      setLoadingMessages(true);
      try {
        const data = await getMessages(token);
        setMessages(data);
      } catch (err) {
        console.error('failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [open, token]);

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

      setThreadMessages(filtered);
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
      await sendMessage({ recipient, body: messageBody }, token);
      setMessageBody('');
      const updated = await getMessages(token);
      setMessages(updated);

      // update thread view too
      if (viewingThreadWith) {
        const filtered = updated.filter(
          (msg) =>
            msg.sender._id === viewingThreadWith._id ||
            msg.recipient === viewingThreadWith._id
        );
        setThreadMessages(filtered);
      }
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
              ) : threadMessages.length === 0 ? (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  no messages yet
                </Typography>
              ) : (
                <List>
                  {threadMessages.map((msg) => (
                    <React.Fragment key={msg._id}>
                      <ListItem>
                        <ListItemText
                          primary={`${msg.sender.name}: ${msg.body}`}
                          secondary={new Date(msg.createdAt).toLocaleString()}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
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
              {messages.map((msg, i) => (
                <React.Fragment key={msg._id || i}>
                  <ListItem button onClick={() => handleViewThread(msg.sender)}>
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
