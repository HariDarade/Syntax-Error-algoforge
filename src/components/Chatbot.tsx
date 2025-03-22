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

interface ChatbotProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  user: { patientId: string; name: string };
  patients: any[];
  departments: any[];
  appointments: any[];
  hasBookedAppointment: boolean;
  currentPatient: any;
  searchResult: any;
}

const diseaseDatabase = [
  {
    disease: 'Common Cold',
    symptoms: ['fever', 'cough', 'sore throat', 'runny nose', 'sneezing'],
    advice: 'Rest, stay hydrated, and take over-the-counter cold medication. If symptoms persist for more than 10 days or worsen, consult a doctor.',
  },
  {
    disease: 'Flu',
    symptoms: ['fever', 'cough', 'sore throat', 'body aches', 'fatigue', 'headache'],
    advice: 'Rest, drink plenty of fluids, and consider antiviral medication if prescribed by a doctor. Seek medical attention if you experience severe symptoms like difficulty breathing.',
  },
  {
    disease: 'Strep Throat',
    symptoms: ['sore throat', 'fever', 'swollen lymph nodes', 'difficulty swallowing', 'red tonsils'],
    advice: 'Visit a doctor for a throat swab test. You may need antibiotics to treat the infection. Gargle with warm salt water and stay hydrated.',
  },
  {
    disease: 'Migraine',
    symptoms: ['headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'dizziness'],
    advice: 'Rest in a dark, quiet room. Take over-the-counter pain relief like ibuprofen. If migraines are frequent, consult a doctor for preventive treatment.',
  },
  {
    disease: 'Gastroenteritis',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach pain', 'fever'],
    advice: 'Stay hydrated by sipping water or electrolyte drinks. Avoid solid food for a few hours, then eat bland foods like rice or bananas. See a doctor if symptoms last more than 48 hours.',
  },
];

const Chatbot: React.FC<ChatbotProps> = ({
  isChatOpen,
  setIsChatOpen,
  user,
  patients,
  departments,
  appointments,
  hasBookedAppointment,
  currentPatient,
  searchResult,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatContext, setChatContext] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (chatInput.trim()) {
      const possibleSuggestions = [
        'Check wait time',
        'Book appointment',
        'Cancel appointment',
        'Department info',
        'How long will I wait?',
        'What’s the average wait time?',
        'List all departments',
        'Check my appointment',
        'What are the visiting hours?',
        'Are there any doctors available?',
        'What services does the hospital offer?',
        'Can I reschedule my appointment?',
        'Predict my disease',
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
    if (lowercaseResponse.includes('wait time') || lowercaseResponse.includes('queue')) {
      return ['How long will I wait?', 'What’s the average wait time?', 'Check another department'];
    } else if (lowercaseResponse.includes('appointment')) {
      return ['How to book?', 'Check my appointment', 'Cancel appointment', 'Reschedule appointment'];
    } else if (lowercaseResponse.includes('department')) {
      return ['Emergency', 'General', 'List all departments'];
    } else if (lowercaseResponse.includes('doctor') || lowercaseResponse.includes('doctors')) {
      return ['Check doctor availability', 'List departments', 'Book appointment'];
    } else if (lowercaseResponse.includes('visiting hours')) {
      return ['Visiting hours', 'Department info', 'Hospital services'];
    } else if (lowercaseResponse.includes('services')) {
      return ['Hospital services', 'Department info', 'Doctor availability'];
    } else if (lowercaseResponse.includes('disease') || lowercaseResponse.includes('symptoms')) {
      return ['Predict my disease', 'Book appointment', 'What are the visiting hours?'];
    } else {
      return ['Check wait time', 'Book appointment', 'Department info', 'Visiting hours', 'Predict my disease'];
    }
  };

  const getRichContent = (response: string) => {
    const lowercaseResponse = response.toLowerCase();
    if (lowercaseResponse.includes('upcoming') && appointments.length > 0) {
      return {
        type: 'appointmentCard',
        data: appointments[0],
      };
    } else if (lowercaseResponse.includes('possible disease')) {
      const predictedDiseaseMatch = response.match(/Possible disease: (.+?)\./);
      const adviceMatch = response.match(/Advice: (.+)/);
      if (predictedDiseaseMatch && adviceMatch) {
        return {
          type: 'diseasePredictionCard',
          data: {
            disease: predictedDiseaseMatch[1],
            advice: adviceMatch[1],
          },
        };
      }
    }
    return null;
  };

  const predictDisease = (symptoms: string[]): { disease: string; advice: string } | null => {
    let bestMatch = null;
    let maxMatches = 0;

    for (const entry of diseaseDatabase) {
      const matchedSymptoms = symptoms.filter(symptom =>
        entry.symptoms.includes(symptom.toLowerCase())
      ).length;
      if (matchedSymptoms > maxMatches) {
        maxMatches = matchedSymptoms;
        bestMatch = entry;
      }
    }

    if (bestMatch && maxMatches >= 2) {
      return {
        disease: bestMatch.disease,
        advice: bestMatch.advice,
      };
    }
    return null;
  };

  const getAIResponse = async (message: string): Promise<string> => {
    const lowercaseMessage = message.toLowerCase().trim();
    const patient = currentPatient || searchResult?.patient;

    if (chatContext === 'appointment' || lowercaseMessage.includes('appointment') || lowercaseMessage.includes('how to book') || lowercaseMessage.includes('check my appointment') || lowercaseMessage.includes('cancel appointment') || lowercaseMessage.includes('reschedule appointment')) {
      setChatContext('appointment');
      if (lowercaseMessage.includes('how') || lowercaseMessage.includes('book')) {
        return 'To book an appointment, click the "Book Appointment" button at the top right, then select your department, date, time, and reason.';
      } else if (lowercaseMessage.includes('cancel')) {
        return appointments.length > 0 
          ? 'To cancel an appointment, click the "Cancel" button next to your appointment in the "Your Appointments" section.'
          : 'You don’t have any appointments to cancel. Would you like to book one?';
      } else if (lowercaseMessage.includes('reschedule')) {
        return appointments.length > 0 
          ? 'To reschedule your appointment, please cancel your current appointment and book a new one with your preferred date and time.'
          : 'You don’t have any appointments to reschedule. Would you like to book one?';
      } else if (lowercaseMessage.includes('upcoming') || lowercaseMessage.includes('my appointment')) {
        return appointments.length > 0 
          ? `You have ${appointments.length} upcoming appointment(s). The next one is on ${format(new Date(appointments[0].date), 'MMMM dd, yyyy')} at ${appointments[0].time} in ${appointments[0].department}.`
          : 'You don’t have any upcoming appointments scheduled.';
      } else {
        return 'Would you like help booking an appointment, checking upcoming appointments, cancelling, or rescheduling an appointment?';
      }
    }

    if (chatContext === 'wait' || lowercaseMessage.includes('wait time') || lowercaseMessage.includes('waiting') || lowercaseMessage.includes('how long') || lowercaseMessage.includes('average wait time')) {
      setChatContext('wait');
      if (!hasBookedAppointment) {
        return 'Please book an appointment first to check wait times or queue status.';
      }
      if (!patient) {
        return 'Please enter your patient ID to check your wait time.';
      }
      if (lowercaseMessage.includes('how long')) {
        if (patient.department === 'Emergency') {
          return `As an emergency patient, you are currently being attended to with priority 'emergency'. Your wait time is estimated at ${patient.estimatedWaitTime || 5} minutes or less.`;
        }
        return patient.status === 'waiting' 
          ? `Your estimated wait time is ${patient.estimatedWaitTime} minutes. You’re currently at position ${patient.queuePosition} in the queue.`
          : 'You’re not currently in a waiting status.';
      } else if (lowercaseMessage.includes('average')) {
        const avgWait = Math.round(departments.reduce((acc, dept) => acc + dept.averageWaitTime, 0) / departments.length);
        return `The average wait time across all departments is ${avgWait} minutes right now.`;
      } else {
        return 'I can tell you your personal wait time or the average across departments. Which would you like?';
      }
    }

    if (chatContext === 'department' || lowercaseMessage.includes('department') || lowercaseMessage.includes('emergency') || lowercaseMessage.includes('general') || lowercaseMessage.includes('list all departments')) {
      setChatContext('department');
      const deptName = departments.find(d => lowercaseMessage.includes(d.name.toLowerCase()))?.name;
      if (deptName) {
        const dept = departments.find(d => d.name === deptName);
        return `${deptName} currently has ${dept?.patientsWaiting} patients waiting, with an average wait time of ${dept?.averageWaitTime} minutes.`;
      } else if (lowercaseMessage.includes('list') || lowercaseMessage.includes('available') || lowercaseMessage.includes('all departments')) {
        return `Available departments are: ${departments.map(d => d.name).join(', ')}. Which one would you like details about?`;
      } else {
        return 'Which department would you like information about? I can give you wait times or patient counts.';
      }
    }

    if (lowercaseMessage.includes('visiting hours')) {
      setChatContext('visiting');
      return 'The hospital’s visiting hours are from 9:00 AM to 8:00 PM daily. However, some departments like Emergency may have restricted access. Would you like more details about a specific department?';
    }

    if (lowercaseMessage.includes('doctor') || lowercaseMessage.includes('doctors') || lowercaseMessage.includes('doctor availability')) {
      setChatContext('doctors');
      return 'Doctors are available in the following departments: Emergency and General. For specific doctor availability, you may need to contact the hospital directly or book an appointment. Would you like to book an appointment now?';
    }

    if (lowercaseMessage.includes('services') || lowercaseMessage.includes('hospital offer')) {
      setChatContext('services');
      return 'The hospital offers a range of services including emergency care, general medicine, surgery, diagnostics, and outpatient care. Specialized services like cardiology or neurology may require a referral. Would you like to know more about a specific service?';
    }

    if (lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
      return user.patientId === '1' 
        ? 'Hello, John Smith! I’m here to assist you with your appointments, wait times, department info, visiting hours, doctor availability, hospital services, and disease prediction. How can I help you today?'
        : 'Hello! I’m here to assist you with booking an appointment, checking wait times, visiting hours, disease prediction, and more. How can I help you today?';
    }

    if (lowercaseMessage.includes('prediction') || lowercaseMessage.includes('arrivals')) {
      return 'I’m sorry, but that information is not available for patients. I can help with your appointments, wait times, or other hospital services. What would you like to know?';
    }

    if (chatContext === 'disease' || lowercaseMessage.includes('predict my disease') || lowercaseMessage.includes('symptoms') || lowercaseMessage.includes('i have')) {
      setChatContext('disease');
      if (lowercaseMessage.includes('predict my disease')) {
        return 'Please tell me your symptoms (e.g., "I have a fever and cough"). I’ll try to predict a possible disease and provide advice.';
      }

      const symptomKeywords = [
        'fever', 'cough', 'sore throat', 'runny nose', 'sneezing', 'body aches', 'fatigue',
        'headache', 'swollen lymph nodes', 'difficulty swallowing', 'red tonsils', 'nausea',
        'vomiting', 'diarrhea', 'stomach pain', 'sensitivity to light', 'sensitivity to sound', 'dizziness'
      ];
      const symptoms = symptomKeywords.filter(keyword => lowercaseMessage.includes(keyword));

      if (symptoms.length === 0) {
        return 'I couldn’t identify any symptoms in your message. Please describe your symptoms, like "I have a fever and cough," and I’ll try to help.';
      }

      const prediction = predictDisease(symptoms);
      if (prediction) {
        return `Based on your symptoms (${symptoms.join(', ')}), you might have: \n**Possible disease:** ${prediction.disease}. \n**Advice:** ${prediction.advice}`;
      } else {
        return `I couldn’t confidently predict a disease based on your symptoms (${symptoms.join(', ')}). It’s best to consult a doctor for a proper diagnosis. Would you like to book an appointment?`;
      }
    }

    setChatContext('');
    return user.patientId === '1' 
      ? 'I can help with managing your appointments, wait times, department info, visiting hours, doctor availability, hospital services, and disease prediction. What would you like to know about?'
      : 'I can help with booking an appointment, checking wait times, visiting hours, disease prediction, and more. What would you like to know about?';
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
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform ${isChatOpen ? 'rotate-45' : 'rotate-0'}`}
        title="Chat with Health Assistant"
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
                <h3 className="font-semibold text-lg">Health Assistant</h3>
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
                <p className="text-lg font-medium">Welcome to MediQueue Assistant!</p>
                <p className="text-sm mt-2">I can help with appointments, wait times, disease prediction, and more. How can I assist you today?</p>
                <div className="flex justify-center gap-2 mt-4">
                  {['Check wait time', 'Book appointment', 'Department info', 'Visiting hours', 'Predict my disease'].map(reply => (
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
                      {message.richContent.type === 'appointmentCard' && (
                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">Upcoming Appointment</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Department:</strong> {message.richContent.data.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {format(new Date(message.richContent.data.date), 'MMMM dd, yyyy')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Time:</strong> {message.richContent.data.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Reason:</strong> {message.richContent.data.reason}
                          </p>
                        </div>
                      )}
                      {message.richContent.type === 'diseasePredictionCard' && (
                        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">Disease Prediction</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Possible Disease:</strong> {message.richContent.data.disease}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Advice:</strong> {message.richContent.data.advice}
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

export default Chatbot;