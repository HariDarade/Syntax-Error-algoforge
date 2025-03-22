import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Mic, X } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickReplies?: string[];
  richContent?: { type: string; data: any };
  seen?: boolean;
}

interface StaffChatbotProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  patients: any[];
  departments: any[];
  addPatient: (name: string, department: string, priority: string) => Promise<void>;
  updatePatientStatus: (patientId: string, newStatus: string) => Promise<void>;
}

// Mock inventory data (for demonstration)
const mockInventory = [
  { id: '1', item: 'Syringes', stock: 150, minStock: 50, status: 'In Stock' },
  { id: '2', item: 'Gloves', stock: 300, minStock: 100, status: 'In Stock' },
  { id: '3', item: 'Masks', stock: 20, minStock: 50, status: 'Low Stock' },
  { id: '4', item: 'IV Fluids', stock: 80, minStock: 30, status: 'In Stock' },
];

// Mock patient arrival prediction data (simulated)
const mockArrivalPredictions = {
  today: { expectedPatients: 25, peakHours: '10:00 AM - 2:00 PM' },
  tomorrow: { expectedPatients: 30, peakHours: '9:00 AM - 1:00 PM' },
};

const StaffChatbot: React.FC<StaffChatbotProps> = ({
  isChatOpen,
  setIsChatOpen,
  patients,
  departments,
  addPatient,
  updatePatientStatus,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatContext, setChatContext] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [addPatientState, setAddPatientState] = useState<{
    name?: string;
    department?: string;
    priority?: string;
    stage: 'name' | 'department' | 'priority' | 'confirm';
  }>({ stage: 'name' });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (chatInput.trim()) {
      const possibleSuggestions = [
        'Check patient queue',
        'Add a patient',
        'Update patient status',
        'Check department status',
        'Check inventory',
        'Request restocking',
        'Predict patient arrivals',
        'How many patients are waiting?',
        'What’s the status of Emergency department?',
        'Show low stock items',
      ];
      const filteredSuggestions = possibleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(chatInput.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [chatInput]);

  const handleQuickReply = async (reply: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: reply,
      isUser: true,
      timestamp: new Date(),
      seen: false,
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, seen: true } : msg
        )
      );
    }, 500);

    const delay = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const aiResponse = await getAIResponse(reply);
    setIsTyping(false);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
      quickReplies: getQuickReplies(aiResponse),
      richContent: getRichContent(aiResponse),
    };

    setChatMessages(prev => [...prev, aiMessage]);
  };

  const getQuickReplies = (response: string): string[] => {
    const lowercaseResponse = response.toLowerCase();
    if (lowercaseResponse.includes('patient queue') || lowercaseResponse.includes('patients')) {
      return ['How many patients are waiting?', 'Update patient status', 'Add a patient'];
    } else if (lowercaseResponse.includes('add a patient')) {
      if (addPatientState.stage === 'name') {
        return [];
      } else if (addPatientState.stage === 'department') {
        return departments.map(dept => dept.name);
      } else if (addPatientState.stage === 'priority') {
        return ['Low', 'Medium', 'High', 'Emergency'];
      } else if (addPatientState.stage === 'confirm') {
        return ['Confirm', 'Cancel'];
      }
      return ['Check patient queue', 'Check department status'];
    } else if (lowercaseResponse.includes('update patient status')) {
      return patients.slice(0, 3).map(patient => patient.name);
    } else if (lowercaseResponse.includes('department status')) {
      return departments.map(dept => dept.name);
    } else if (lowercaseResponse.includes('inventory') || lowercaseResponse.includes('stock')) {
      return ['Show low stock items', 'Request restocking', 'Check patient queue'];
    } else if (lowercaseResponse.includes('patient arrivals')) {
      return ['Today', 'Tomorrow', 'Check patient queue'];
    } else {
      return ['Check patient queue', 'Add a patient', 'Check department status', 'Check inventory', 'Predict patient arrivals'];
    }
  };

  const getRichContent = (response: string) => {
    const lowercaseResponse = response.toLowerCase();
    if (lowercaseResponse.includes('patient queue')) {
      return {
        type: 'patientQueueCard',
        data: {
          waiting: patients.filter(p => p.status === 'waiting').length,
          inProgress: patients.filter(p => p.status === 'in-progress').length,
          completed: patients.filter(p => p.status === 'completed').length,
        },
      };
    } else if (lowercaseResponse.includes('department status') && lowercaseResponse.includes(':')) {
      const deptNameMatch = response.match(/Department: (.+?)\./);
      if (deptNameMatch) {
        const deptName = deptNameMatch[1];
        const dept = departments.find(d => d.name === deptName);
        if (dept) {
          return {
            type: 'departmentStatusCard',
            data: dept,
          };
        }
      }
    } else if (lowercaseResponse.includes('inventory')) {
      return {
        type: 'inventoryCard',
        data: mockInventory,
      };
    } else if (lowercaseResponse.includes('low stock items')) {
      const lowStockItems = mockInventory.filter(item => item.status === 'Low Stock');
      return {
        type: 'inventoryCard',
        data: lowStockItems,
      };
    } else if (lowercaseResponse.includes('patient arrivals')) {
      const periodMatch = response.match(/(Today|Tomorrow)/);
      if (periodMatch) {
        const period = periodMatch[1].toLowerCase();
        return {
          type: 'arrivalPredictionCard',
          data: mockArrivalPredictions[period as keyof typeof mockArrivalPredictions],
        };
      }
    }
    return null;
  };

  const getAIResponse = async (message: string): Promise<string> => {
    const lowercaseMessage = message.toLowerCase().trim();

    if (chatContext === 'patient-queue' || lowercaseMessage.includes('patient queue') || lowercaseMessage.includes('patients') || lowercaseMessage.includes('how many')) {
      setChatContext('patient-queue');
      if (lowercaseMessage.includes('how many') || lowercaseMessage.includes('waiting')) {
        const waiting = patients.filter(p => p.status === 'waiting').length;
        return `There are currently ${waiting} patients waiting in the queue.`;
      }
      return `Here’s the current patient queue status: \n- Waiting: ${patients.filter(p => p.status === 'waiting').length}\n- In Progress: ${patients.filter(p => p.status === 'in-progress').length}\n- Completed: ${patients.filter(p => p.status === 'completed').length}`;
    }

    if (chatContext === 'add-patient' || lowercaseMessage.includes('add a patient')) {
      setChatContext('add-patient');
      if (addPatientState.stage === 'name') {
        setAddPatientState({ stage: 'name' });
        return 'Please provide the patient’s name.';
      }

      if (addPatientState.stage === 'name' && lowercaseMessage !== 'add a patient') {
        setAddPatientState(prev => ({ ...prev, name: message, stage: 'department' }));
        return `Got it, the patient’s name is ${message}. Which department should they be assigned to?`;
      }

      if (addPatientState.stage === 'department') {
        const selectedDept = departments.find(dept => dept.name.toLowerCase() === lowercaseMessage);
        if (selectedDept) {
          setAddPatientState(prev => ({ ...prev, department: selectedDept.name, stage: 'priority' }));
          return `Assigned to ${selectedDept.name}. What’s the priority level for this patient?`;
        }
        return 'Please select a valid department: ' + departments.map(dept => dept.name).join(', ') + '.';
      }

      if (addPatientState.stage === 'priority') {
        const priority = ['low', 'medium', 'high', 'emergency'].find(p => lowercaseMessage.includes(p));
        if (priority) {
          setAddPatientState(prev => ({ ...prev, priority, stage: 'confirm' }));
          return `Priority set to ${priority}. Here’s the summary: \n- Name: ${addPatientState.name}\n- Department: ${addPatientState.department}\n- Priority: ${priority}\nWould you like to confirm or cancel?`;
        }
        return 'Please select a valid priority: Low, Medium, High, or Emergency.';
      }

      if (addPatientState.stage === 'confirm') {
        if (lowercaseMessage.includes('confirm')) {
          if (addPatientState.name && addPatientState.department && addPatientState.priority) {
            await addPatient(addPatientState.name, addPatientState.department, addPatientState.priority);
            setAddPatientState({ stage: 'name' });
            setChatContext('');
            return `Patient ${addPatientState.name} has been added successfully to ${addPatientState.department} with ${addPatientState.priority} priority.`;
          }
          return 'There was an error adding the patient. Please try again.';
        } else if (lowercaseMessage.includes('cancel')) {
          setAddPatientState({ stage: 'name' });
          setChatContext('');
          return 'Patient addition cancelled.';
        }
        return 'Please confirm or cancel the patient addition.';
      }
    }

    if (chatContext === 'update-status' || lowercaseMessage.includes('update patient status')) {
      setChatContext('update-status');
      const patient = patients.find(p => p.name.toLowerCase() === lowercaseMessage);
      if (patient) {
        if (patient.status === 'waiting') {
          await updatePatientStatus(patient.id, 'in-progress');
          return `Updated ${patient.name}'s status to "In Progress".`;
        } else if (patient.status === 'in-progress') {
          await updatePatientStatus(patient.id, 'completed');
          return `Updated ${patient.name}'s status to "Completed".`;
        } else {
          return `${patient.name} is already in "${patient.status}" status and cannot be updated further.`;
        }
      }
      return `Please select a patient to update their status. Here are some patients: ${patients.slice(0, 3).map(p => p.name).join(', ')}.`;
    }

    if (chatContext === 'department-status' || lowercaseMessage.includes('department status') || lowercaseMessage.includes('status of')) {
      setChatContext('department-status');
      const deptName = departments.find(d => lowercaseMessage.includes(d.name.toLowerCase()))?.name;
      if (deptName) {
        const dept = departments.find(d => d.name === deptName);
        return `Department: ${deptName}.\n- Current Load: ${dept?.currentLoad}%\n- Average Wait Time: ${dept?.averageWaitTime} minutes\n- Patients Waiting: ${dept?.patientsWaiting}`;
      }
      return 'Which department would you like to check? Available departments: ' + departments.map(d => d.name).join(', ') + '.';
    }

    if (chatContext === 'inventory' || lowercaseMessage.includes('inventory') || lowercaseMessage.includes('stock') || lowercaseMessage.includes('low stock') || lowercaseMessage.includes('restocking')) {
      setChatContext('inventory');
      if (lowercaseMessage.includes('low stock')) {
        const lowStockItems = mockInventory.filter(item => item.status === 'Low Stock');
        if (lowStockItems.length > 0) {
          return `Here are the low stock items:\n${lowStockItems.map(item => `- ${item.item}: ${item.stock} units (Min: ${item.minStock})`).join('\n')}`;
        }
        return 'There are no low stock items at the moment.';
      } else if (lowercaseMessage.includes('request restocking')) {
        const lowStockItems = mockInventory.filter(item => item.status === 'Low Stock');
        if (lowStockItems.length > 0) {
          return `Restocking request sent for:\n${lowStockItems.map(item => `- ${item.item}`).join('\n')}\nThe inventory team has been notified.`;
        }
        return 'No items need restocking at the moment.';
      }
      return `Here’s the current inventory status:\n${mockInventory.map(item => `- ${item.item}: ${item.stock} units (${item.status})`).join('\n')}`;
    }

    if (chatContext === 'arrivals' || lowercaseMessage.includes('predict patient arrivals') || lowercaseMessage.includes('arrivals')) {
      setChatContext('arrivals');
      if (lowercaseMessage.includes('today')) {
        return `Patient Arrivals for Today:\n- Expected Patients: ${mockArrivalPredictions.today.expectedPatients}\n- Peak Hours: ${mockArrivalPredictions.today.peakHours}`;
      } else if (lowercaseMessage.includes('tomorrow')) {
        return `Patient Arrivals for Tomorrow:\n- Expected Patients: ${mockArrivalPredictions.tomorrow.expectedPatients}\n- Peak Hours: ${mockArrivalPredictions.tomorrow.peakHours}`;
      }
      return 'Would you like to see patient arrival predictions for today or tomorrow?';
    }

    if (lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
      return 'Hello! I’m here to assist you with managing patients, departments, inventory, and more. How can I help you today?';
    }

    setChatContext('');
    return 'I can help with managing patients, checking department status, inventory, and predicting patient arrivals. What would you like to do?';
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
      seen: false,
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setSuggestions([]);
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, seen: true } : msg
        )
      );
    }, 500);

    const delay = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const aiResponse = await getAIResponse(chatInput);
    setIsTyping(false);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
      quickReplies: getQuickReplies(aiResponse),
      richContent: getRichContent(aiResponse),
    };

    setChatMessages(prev => [...prev, aiMessage]);
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use a modern browser like Chrome.');
      return;
    }

    const recognition = new ((window as any).webkitSpeechRecognition as typeof SpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);

      if (transcript.trim()) {
        const syntheticEvent = new Event('submit', { cancelable: true, bubbles: true }) as unknown as React.FormEvent;
        await handleChatSubmit(syntheticEvent);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      alert(`Speech recognition error: ${event.error}. Please try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleClearChat = () => {
    setChatMessages([]);
    setChatContext('');
    setAddPatientState({ stage: 'name' });
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform ${
          isChatOpen ? 'rotate-45' : 'rotate-0'
        } hover:scale-110 motion-safe:animate-bounce-slow`}
        title="Chat with Staff Assistant"
      >
        <MessageSquare size={28} />
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-lg h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transform transition-all duration-300 scale-100">
          {/* Chatbot Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Staff Assistant</h3>
                <p className="text-sm opacity-80">Online • Ready to assist</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleClearChat}
                className="flex items-center px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors"
                title="Clear Chat"
              >
                <X size={16} className="mr-1" />
                Clear Chat
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                title="Close Chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-5 overflow-y-auto bg-gray-50"
            style={{ backgroundImage: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)' }}
          >
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 animate-fade-in">
                <p className="text-lg font-medium">Welcome to Staff Assistant!</p>
                <p className="text-sm mt-2">I can help with managing patients, departments, inventory, and predicting patient arrivals. How can I assist you today?</p>
                <div className="flex justify-center gap-2 mt-4">
                  {['Check patient queue', 'Add a patient', 'Check department status', 'Check inventory', 'Predict patient arrivals'].map(reply => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="mb-4 animate-fade-in">
                  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                        message.isUser 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {format(message.timestamp, 'HH:mm')}
                        </span>
                        {message.isUser && message.seen && (
                          <span className="text-xs text-blue-300">Seen</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {message.richContent && !message.isUser && (
                    <div className="mt-2">
                      {message.richContent.type === 'patientQueueCard' && (
                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">Patient Queue Status</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Waiting:</strong> {message.richContent.data.waiting}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>In Progress:</strong> {message.richContent.data.inProgress}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Completed:</strong> {message.richContent.data.completed}
                          </p>
                        </div>
                      )}
                      {message.richContent.type === 'departmentStatusCard' && (
                        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">{message.richContent.data.name} Status</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Current Load:</strong> {message.richContent.data.currentLoad}%
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Avg. Wait Time:</strong> {message.richContent.data.averageWaitTime} min
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Patients Waiting:</strong> {message.richContent.data.patientsWaiting}
                          </p>
                        </div>
                      )}
                      {message.richContent.type === 'inventoryCard' && (
                        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">Inventory Status</h4>
                          {message.richContent.data.map((item: any) => (
                            <p key={item.id} className="text-sm text-gray-600">
                              <strong>{item.item}:</strong> {item.stock} units ({item.status})
                            </p>
                          ))}
                        </div>
                      )}
                      {message.richContent.type === 'arrivalPredictionCard' && (
                        <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">Patient Arrival Prediction</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Expected Patients:</strong> {message.richContent.data.expectedPatients}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Peak Hours:</strong> {message.richContent.data.peakHours}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {message.quickReplies && !message.isUser && (
                    <div className="flex flex-wrap gap-2 mt-2 justify-start">
                      {message.quickReplies.map(reply => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start mb-4 animate-fade-in">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl relative">
            {suggestions.length > 0 && (
              <div className="absolute bottom-16 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-md p-2 flex flex-wrap gap-2">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setChatInput(suggestion);
                      setSuggestions([]);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleChatSubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {isListening && (
                  <div className="absolute -bottom-6 left-0 text-gray-500 text-sm animate-pulse">
                    Listening...
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-3 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Mic size={20} />
              </button>
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffChatbot;