import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Mic, X, Calendar, Pill, Stethoscope, DollarSign, Heart } from 'lucide-react';
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
  { disease: 'Common Cold', symptoms: ['fever', 'cough', 'sore throat', 'runny nose', 'sneezing'], advice: 'Rest, stay hydrated, and take over-the-counter cold medication. Consult a doctor if symptoms persist.' },
  { disease: 'Flu', symptoms: ['fever', 'cough', 'sore throat', 'body aches', 'fatigue', 'headache'], advice: 'Rest, drink fluids, and consider antivirals if prescribed. Seek help if symptoms worsen.' },
  { disease: 'Strep Throat', symptoms: ['sore throat', 'fever', 'swollen lymph nodes', 'difficulty swallowing', 'red tonsils'], advice: 'See a doctor for a test and antibiotics. Gargle with salt water.' },
  { disease: 'Migraine', symptoms: ['headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'dizziness'], advice: 'Rest in a quiet, dark room. Take pain relief and consult a doctor if frequent.' },
  { disease: 'Gastroenteritis', symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach pain', 'fever'], advice: 'Stay hydrated with electrolyte drinks. See a doctor if symptoms persist beyond 48 hours.' },
  { disease: 'Anxiety', symptoms: ['anxiety', 'restlessness', 'racing thoughts', 'sweating', 'difficulty sleeping'], advice: 'Try deep breathing or mindfulness. Contact our Mental Health team if needed.' },
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
  const [symptomLog, setSymptomLog] = useState<{ symptom: string; duration: string }[]>([]);
  const [reminders, setReminders] = useState<{ time: string; medication: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (chatInput.trim()) {
      const possibleSuggestions = [
        'Check wait time', 'Book appointment', 'Cancel appointment', 'Department info',
        'How long will I wait?', 'Predict my disease', 'Track my symptoms', 'Set a reminder',
        'Check my bill', 'Contact my doctor', 'I’m feeling anxious', 'List all departments',
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
    const userMessage: ChatMessage = { id: Date.now().toString(), text: reply, isUser: true, timestamp: new Date(), seen: false };
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev => prev.map(msg => msg.id === userMessage.id ? { ...msg, seen: true } : msg));
    }, 500);

    const delay = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const aiResponse = await getAIResponse(reply);
    setIsTyping(false);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(), text: aiResponse, isUser: false, timestamp: new Date(),
      quickReplies: getQuickReplies(aiResponse), richContent: getRichContent(aiResponse),
    };
    setChatMessages(prev => [...prev, aiMessage]);
  };

  const getQuickReplies = (response: string): string[] => {
    const lowercaseResponse = response.toLowerCase();
    if (lowercaseResponse.includes('wait time')) return ['How long will I wait?', 'Check another department', 'Book appointment'];
    if (lowercaseResponse.includes('appointment')) return ['Book appointment', 'Check my appointment', 'Cancel appointment'];
    if (lowercaseResponse.includes('department')) return ['Emergency', 'General', 'List all departments'];
    if (lowercaseResponse.includes('doctor')) return ['Contact my doctor', 'Book appointment', 'Department info'];
    if (lowercaseResponse.includes('symptoms') || lowercaseResponse.includes('disease')) return ['Track my symptoms', 'Predict my disease', 'Book appointment'];
    if (lowercaseResponse.includes('reminder')) return ['Set a reminder', 'Check my reminders', 'Book appointment'];
    if (lowercaseResponse.includes('bill')) return ['Check my bill', 'Payment options', 'Contact support'];
    if (lowercaseResponse.includes('anxious') || lowercaseResponse.includes('stressed')) return ['More tips', 'Mental Health referral', 'Book appointment'];
    return ['Check wait time', 'Book appointment', 'Predict my disease', 'Set a reminder'];
  };

  const getRichContent = (response: string) => {
    const lowercaseResponse = response.toLowerCase();
    if (lowercaseResponse.includes('upcoming') && appointments.length > 0) {
      return { type: 'appointmentCard', data: appointments[0] };
    }
    if (lowercaseResponse.includes('possible disease')) {
      const predictedDiseaseMatch = response.match(/Possible disease: (.+?)\./);
      const adviceMatch = response.match(/Advice: (.+)/);
      if (predictedDiseaseMatch && adviceMatch) {
        return { type: 'diseasePredictionCard', data: { disease: predictedDiseaseMatch[1], advice: adviceMatch[1] } };
      }
    }
    if (lowercaseResponse.includes('reminder set')) {
      const timeMatch = response.match(/at (.+?) for/);
      const medMatch = response.match(/for (.+)/);
      if (timeMatch && medMatch) {
        return { type: 'reminderCard', data: { time: timeMatch[1], medication: medMatch[1] } };
      }
    }
    return null;
  };

  const predictDisease = (symptoms: string[]): { disease: string; advice: string } | null => {
    let bestMatch = null;
    let maxMatches = 0;
    for (const entry of diseaseDatabase) {
      const matchedSymptoms = symptoms.filter(symptom => entry.symptoms.includes(symptom.toLowerCase())).length;
      if (matchedSymptoms > maxMatches) {
        maxMatches = matchedSymptoms;
        bestMatch = entry;
      }
    }
    return maxMatches >= 2 ? { disease: bestMatch!.disease, advice: bestMatch!.advice } : null;
  };

  const getAIResponse = async (message: string): Promise<string> => {
    const lowercaseMessage = message.toLowerCase().trim();
    const patient = currentPatient || searchResult?.patient;

    if (chatContext === 'appointment' || lowercaseMessage.includes('appointment')) {
      setChatContext('appointment');
      if (lowercaseMessage.includes('book')) return 'Let’s get you booked! Click "Book Appointment" at the top right and pick your department, date, and time.';
      if (lowercaseMessage.includes('cancel')) return appointments.length > 0 ? 'To cancel, click "Cancel" next to your appointment in "Your Appointments".' : 'No appointments to cancel yet—want to book one?';
      if (lowercaseMessage.includes('check') || lowercaseMessage.includes('my appointment')) return appointments.length > 0 ? `Your next appointment is on ${format(new Date(appointments[0].date), 'MMMM dd, yyyy')} at ${appointments[0].time} in ${appointments[0].department}.` : 'No upcoming appointments. Shall I help you book one?';
      return 'I can help you book, check, or cancel an appointment. What do you need?';
    }

    if (chatContext === 'wait' || lowercaseMessage.includes('wait time') || lowercaseMessage.includes('how long')) {
      setChatContext('wait');
      if (!hasBookedAppointment) return 'You’ll need to book an appointment first to check wait times. Want to do that now?';
      if (!patient) return 'Please provide your patient ID so I can check your wait time.';
      if (lowercaseMessage.includes('how long')) return patient.status === 'waiting' ? `You’re at position ${patient.queuePosition} with an estimated wait of ${patient.estimatedWaitTime} minutes.` : 'You’re not in a queue right now.';
      return 'The average wait time across departments is about 20 minutes. Want your personal wait time?';
    }

    if (chatContext === 'department' || lowercaseMessage.includes('department') || lowercaseMessage.includes('list all departments')) {
      setChatContext('department');
      if (lowercaseMessage.includes('list')) return `Here are our departments: ${departments.map(d => d.name).join(', ')}. Which one interests you?`;
      const deptName = departments.find(d => lowercaseMessage.includes(d.name.toLowerCase()))?.name;
      if (deptName) return `${deptName} has ${departments.find(d => d.name === deptName)?.patientsWaiting} patients waiting, averaging ${departments.find(d => d.name === deptName)?.averageWaitTime} minutes.`;
      return 'Which department would you like to know about?';
    }

    if (lowercaseMessage.includes('visiting hours')) {
      setChatContext('visiting');
      return 'Visiting hours are 9:00 AM to 8:00 PM daily. Some areas like Emergency might have restrictions—need specifics?';
    }

    if (lowercaseMessage.includes('doctor') || lowercaseMessage.includes('contact my doctor')) {
      setChatContext('doctors');
      return 'Dr. Smith in General Medicine is your doctor. Reach them at (555) 123-4567, available 9 AM - 5 PM. Want to book with them?';
    }

    if (lowercaseMessage.includes('services')) {
      setChatContext('services');
      return 'We offer emergency care, general medicine, surgery, diagnostics, and more. Need details on a specific service?';
    }

    if (lowercaseMessage.includes('remind me') || lowercaseMessage.includes('reminder')) {
      setChatContext('reminder');
      const timeMatch = lowercaseMessage.match(/at (\d{1,2}(:\d{2})? ?[ap]m)/i);
      if (timeMatch) {
        const medication = lowercaseMessage.includes('for') ? lowercaseMessage.split('for')[1].trim() : 'your medication';
        setReminders(prev => [...prev, { time: timeMatch[0], medication }]);
        return `Reminder set at ${timeMatch[0]} for ${medication}. Anything else I can do?`;
      }
      return 'Tell me when to remind you, like "Remind me at 8 PM to take my pills."';
    }

    if (lowercaseMessage.includes('track my symptoms') || chatContext === 'symptomTracker') {
      setChatContext('symptomTracker');
      const symptoms = ['fever', 'cough', 'headache', 'nausea', 'sore throat'].filter(s => lowercaseMessage.includes(s));
      if (symptoms.length > 0) {
        const durationMatch = lowercaseMessage.match(/for (\d+ days|\d+ hours)/i);
        const duration = durationMatch ? durationMatch[0] : 'unknown duration';
        setSymptomLog(prev => [...prev, { symptom: symptoms[0], duration }]);
        return `I’ve logged your ${symptoms[0]} (${duration}). Any other symptoms to add?`;
      }
      return 'Tell me your symptoms, like "I’ve had a fever for 3 days."';
    }

    if (lowercaseMessage.includes('bill') || lowercaseMessage.includes('payment')) {
      setChatContext('billing');
      return 'Your latest bill is $150 for your March 15, 2025 visit. Want payment options or more details?';
    }

    if (lowercaseMessage.includes('anxious') || lowercaseMessage.includes('stressed')) {
      setChatContext('mentalHealth');
      return 'I’m sorry you’re feeling that way. Try taking slow, deep breaths. Want more tips or a referral to our Mental Health team?';
    }

    if (chatContext === 'disease' || lowercaseMessage.includes('predict my disease') || lowercaseMessage.includes('i have')) {
      setChatContext('disease');
      if (lowercaseMessage.includes('predict')) return 'Tell me your symptoms, like "I have a fever and cough," and I’ll help you out.';
      const symptomKeywords = ['fever', 'cough', 'sore throat', 'headache', 'nausea', 'anxiety', 'fatigue'];
      const symptoms = symptomKeywords.filter(keyword => lowercaseMessage.includes(keyword));
      if (symptoms.length > 0) {
        const prediction = predictDisease(symptoms);
        if (prediction) return `Based on your symptoms (${symptoms.join(', ')}): \n**Possible disease:** ${prediction.disease}. \n**Advice:** ${prediction.advice}`;
        return `With ${symptoms.join(', ')}, I can’t pinpoint a disease yet. How long have you had these?`;
      }
      return 'What symptoms are you experiencing? Say something like "I have a fever."';
    }

    if (lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
      return `Hi ${user.name}! I’m here to help with appointments, wait times, symptoms, reminders, billing, and more. What’s on your mind today?`;
    }

    setChatContext('');
    return 'I can assist with appointments, wait times, disease prediction, reminders, billing, and more. How can I help you today?';
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: chatInput, isUser: true, timestamp: new Date(), seen: false };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setSuggestions([]);
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev => prev.map(msg => msg.id === userMessage.id ? { ...msg, seen: true } : msg));
    }, 500);

    const delay = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const aiResponse = await getAIResponse(chatInput);
    setIsTyping(false);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(), text: aiResponse, isUser: false, timestamp: new Date(),
      quickReplies: getQuickReplies(aiResponse), richContent: getRichContent(aiResponse),
    };
    setChatMessages(prev => [...prev, aiMessage]);
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition isn’t supported in your browser. Try Chrome!');
      return;
    }

    const recognition = new ((window as any).webkitSpeechRecognition as typeof SpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);
      if (transcript.trim()) await handleChatSubmit(new Event('submit') as unknown as React.FormEvent);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      alert(`Speech recognition error: ${event.error}. Try again!`);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleClearChat = () => {
    setChatMessages([]);
    setChatContext('');
    setSymptomLog([]);
    setReminders([]);
  };

  return (
    <>
      <div className="relative group">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`fixed bottom-12 right-12 p-4 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-teal-700 transition-all duration-300 transform ${isChatOpen ? 'rotate-45' : 'rotate-0'} animate-pulse group-hover:animate-none hover:scale-110 z-40`}
          title="Chat with Health Assistant"
          aria-label="Toggle chatbot"
        >
          <MessageSquare size={28} />
        </button>
        <span className="absolute bottom-24 right-4 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with MediQueue Assistant
        </span>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="w-full max-w-lg h-[650px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 flex flex-col transform transition-all duration-300 scale-100">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-teal-300 flex items-center justify-center">
                    <Stethoscope size={24} />
                  </div>
                  <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">MediQueue Assistant</h3>
                  <p className="text-sm opacity-80">Your Health Companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handleClearChat} className="px-2 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-400 transition-colors">
                  <X size={16} className="mr-1 inline" /> Clear
                </button>
                <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200 transition-colors" aria-label="Close chatbot">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-300 mt-10 animate-fade-in">
                  <p className="text-lg font-medium">Welcome to MediQueue Assistant!</p>
                  <p className="text-sm mt-2">I’m here to help with appointments, symptoms, reminders, and more. How can I assist you?</p>
                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    {['Check wait time', 'Book appointment', 'Predict my disease', 'Set a reminder'].map(reply => (
                      <button key={reply} onClick={() => handleQuickReply(reply)} className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-700 dark:text-teal-200 rounded-full text-sm hover:bg-teal-200 dark:hover:bg-teal-600 transition-colors">
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className="mb-4 animate-fade-in">
                    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl shadow-md ${message.isUser ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">{format(message.timestamp, 'HH:mm')}</span>
                          {message.isUser && message.seen && <span className="text-xs text-blue-200">Seen</span>}
                        </div>
                      </div>
                    </div>
                    {message.richContent && !message.isUser && (
                      <div className="mt-2">
                        {message.richContent.type === 'appointmentCard' && (
                          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Upcoming Appointment</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Department:</strong> {message.richContent.data.department}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Date:</strong> {format(new Date(message.richContent.data.date), 'MMMM dd, yyyy')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Time:</strong> {message.richContent.data.time}</p>
                          </div>
                        )}
                        {message.richContent.type === 'diseasePredictionCard' && (
                          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-2">
                              <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Disease Prediction</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Possible Disease:</strong> {message.richContent.data.disease}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Advice:</strong> {message.richContent.data.advice}</p>
                          </div>
                        )}
                        {message.richContent.type === 'reminderCard' && (
                          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-2">
                              <Pill className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Medication Reminder</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Time:</strong> {message.richContent.data.time}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Medication:</strong> {message.richContent.data.medication}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {message.quickReplies && !message.isUser && (
                      <div className="flex flex-wrap gap-2 mt-2 justify-start">
                        {message.quickReplies.map(reply => (
                          <button key={reply} onClick={() => handleQuickReply(reply)} className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-700 dark:text-teal-200 rounded-full text-sm hover:bg-teal-200 dark:hover:bg-teal-600 transition-colors">
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
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white dark:bg-gray-800 rounded-b-2xl relative">
              {suggestions.length > 0 && (
                <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md p-2 flex flex-wrap gap-2 animate-fade-in">
                  {suggestions.map(suggestion => (
                    <button key={suggestion} onClick={() => { setChatInput(suggestion); setSuggestions([]); }} className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
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
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                  {isListening && (
                    <div className="absolute -bottom-6 left-0 text-teal-500 dark:text-teal-400 text-sm animate-pulse">Listening...</div>
                  )}
                </div>
                <button type="button" onClick={handleVoiceInput} className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white relative animate-pulse' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'}`}>
                  <Mic size={20} />
                  {isListening && <div className="absolute inset-0 rounded-full bg-red-500 opacity-50 animate-ping"></div>}
                </button>
                <button type="submit" className="p-3 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full hover:from-blue-600 hover:to-teal-700 transition-colors">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;