import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Circle, Wifi, WifiOff } from "lucide-react";

function Messagerie() {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connecté au serveur!');
            setIsConnected(true);
        });

        newSocket.on('chat message', (arg) => {
            console.log('Message du serveur:', arg);
            setMessages(prev => [...prev, { 
                type: 'server', 
                text: arg,
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
        });

        newSocket.on('disconnect', () => {
            console.log('Déconnecté du serveur');
            setIsConnected(false);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim()) {
            socket.emit('chat message', message);
            setMessages(prev => [...prev, { 
                type: 'client', 
                text: message,
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
            setMessage("");
        } 
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[600px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Circle className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Messagerie en temps réel</h1>
                            <p className="text-xs text-white/80">Chat instantané via Socket.IO</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                        {isConnected ? (
                            <>
                                <Wifi className="w-4 h-4 text-green-300" />
                                <span className="text-sm text-white font-medium">Connecté</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 text-red-300" />
                                <span className="text-sm text-white font-medium">Déconnecté</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                    <Send className="w-10 h-10 text-purple-600" />
                                </div>
                                <p className="text-gray-400 text-lg">Aucun message pour le moment</p>
                                <p className="text-gray-300 text-sm mt-1">Envoyez votre premier message !</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.type === 'client' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div className={`flex gap-2 max-w-[70%] ${msg.type === 'client' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        msg.type === 'client' 
                                            ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                                            : 'bg-gradient-to-br from-gray-400 to-gray-600'
                                    }`}>
                                        <span className="text-white text-xs font-bold">
                                            {msg.type === 'client' ? 'V' : 'S'}
                                        </span>
                                    </div>
                                    
                                    {/* Message Bubble */}
                                    <div className="flex flex-col">
                                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                            msg.type === 'client'
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                                        }`}>
                                            <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                                        </div>
                                        <span className={`text-xs text-gray-400 mt-1 ${
                                            msg.type === 'client' ? 'text-right' : 'text-left'
                                        }`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Écrivez votre message..."
                            disabled={!isConnected}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!isConnected || !message.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            <span>Envoyer</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Messagerie;