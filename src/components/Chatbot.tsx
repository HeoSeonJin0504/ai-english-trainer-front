import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { apiService, type ChatMessage, type ConversationSession } from '../services/api';

const FloatingButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isOpen ? '#dc3545' : '#007bff'};
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 999;
  overflow: hidden;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: calc(100vh - 140px);
    right: 20px;
    bottom: 90px;
  }
`;

const ChatHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.$isUser ? '#007bff' : '#e9ecef'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  word-wrap: break-word;
  white-space: pre-wrap;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #666;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: #666;
  margin-top: 50px;

  h3 {
    font-size: 32px;
    margin-bottom: 16px;
  }

  p {
    margin: 8px 0;
    font-size: 16px;
  }
`;

const SuggestionsContainer = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
`;

const SuggestionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const HistoryTitle = styled.h4`
  margin: 0 0 16px 0;
  color: #333;
`;

const HistoryItem = styled.div`
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const HistoryPreview = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HistoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6c757d;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  background: #dc3545;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
  }
`;

const InputContainer = styled.form`
  border-top: 1px solid #dee2e6;
  background: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: none;
  resize: none;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  min-height: 60px;

  &:disabled {
    background: #f8f9fa;
  }
`;

const InputFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f8f9fa;
`;

const CharCount = styled.span<{ $isNearLimit: boolean }>`
  font-size: 12px;
  color: ${props => props.$isNearLimit ? '#dc3545' : '#6c757d'};
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #0056b3;
    transform: translateX(2px);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 18px;
    height: 18px;
    transform: rotate(45deg);
  }
`;

// Component
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 1000;

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      loadConversations();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const convs = await apiService.getChatConversations();
      setConversations(convs);
    } catch (err: any) {
      console.error('대화 목록 로딩 실패:', err);
    }
  };

  const loadHistory = async (conversationId: string) => {
    try {
      const history = await apiService.getChatHistory(conversationId);
      setMessages(history.messages);
      setCurrentConversationId(conversationId);
      setShowHistory(false);
      setSuggestions([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    setError(null);
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await apiService.sendChatMessage(text, currentConversationId);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentConversationId(response.conversationId);
      setSuggestions(response.suggestions || []);
      
      await loadConversations();
    } catch (err: any) {
      setError(err.message);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setSuggestions([]);
    setShowHistory(false);
    setError(null);
  };

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('이 대화를 삭제하시겠습니까?')) return;

    try {
      await apiService.deleteChatConversation(conversationId);
      await loadConversations();
      
      if (currentConversationId === conversationId) {
        startNewConversation();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${year}년 ${month}월 ${day}일 ${hours.toString().padStart(2, '0')}시 ${minutes.toString().padStart(2, '0')}분`;
  };

  return (
    <>
      <FloatingButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        {isOpen ? '✕' : '💬'}
      </FloatingButton>

      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <HeaderTitle>Chatbot</HeaderTitle>
            <HeaderButtons>
              <IconButton onClick={() => setShowHistory(!showHistory)} title="대화 목록">
                📋
              </IconButton>
              <IconButton onClick={startNewConversation} title="새 대화">
                ➕
              </IconButton>
            </HeaderButtons>
          </ChatHeader>

          {showHistory ? (
            <HistoryList>
              <HistoryTitle>대화 목록</HistoryTitle>
              {conversations.length === 0 ? (
                <EmptyState>아직 대화가 없습니다</EmptyState>
              ) : (
                conversations.map(conv => (
                  <HistoryItem key={conv.conversationId} onClick={() => loadHistory(conv.conversationId)}>
                    <HistoryPreview>{conv.preview}</HistoryPreview>
                    <HistoryMeta>
                      <span>{conv.messageCount}개 메시지</span>
                      <span>{formatTime(conv.lastActivity)}</span>
                    </HistoryMeta>
                    <DeleteButton onClick={(e) => deleteConversation(conv.conversationId, e)}>
                      🗑️
                    </DeleteButton>
                  </HistoryItem>
                ))
              )}
            </HistoryList>
          ) : (
            <>
              <MessagesContainer>
                {messages.length === 0 ? (
                  <WelcomeMessage>
                    <h3>Hello!</h3>
                    <p>AI ENGLSIH TRAINER 챗봇입니다.</p>
                    <p>궁금한 것을 물어보세요!</p>
                  </WelcomeMessage>
                ) : (
                  messages.map((msg, idx) => (
                    <MessageBubble key={idx} $isUser={msg.role === 'user'}>
                      {msg.content}
                    </MessageBubble>
                  ))
                )}
                {isSending && (
                  <MessageBubble $isUser={false}>
                    <TypingIndicator>
                      <span></span>
                      <span></span>
                      <span></span>
                    </TypingIndicator>
                  </MessageBubble>
                )}
                <div ref={messagesEndRef} />
              </MessagesContainer>

              {suggestions.length > 0 && (
                <SuggestionsContainer>
                  {suggestions.map((suggestion, idx) => (
                    <SuggestionButton key={idx} onClick={() => sendMessage(suggestion)}>
                      {suggestion}
                    </SuggestionButton>
                  ))}
                </SuggestionsContainer>
              )}
            </>
          )}

          {error && (
            <ErrorMessage>
              {error}
              <button onClick={() => setError(null)}>✕</button>
            </ErrorMessage>
          )}

          {!showHistory && (
            <InputContainer onSubmit={handleSubmit}>
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, MAX_CHARS))}
                onKeyPress={handleKeyPress}
                placeholder="메세지를 입력하세요"
                disabled={isSending}
                maxLength={MAX_CHARS}
              />
              <InputFooter>
                <CharCount $isNearLimit={inputText.length > 900}>
                  {inputText.length} / {MAX_CHARS}
                </CharCount>
                <SendButton type="submit" disabled={!inputText.trim() || isSending}>
                  {isSending ? (
                    '⏳'
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </SendButton>
              </InputFooter>
            </InputContainer>
          )}
        </ChatWindow>
      )}
    </>
  );
}
