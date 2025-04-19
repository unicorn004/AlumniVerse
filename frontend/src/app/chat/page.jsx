"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Send, PlusCircle, MessageSquare } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const ChatApp = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;

  useEffect(() => {
    if (!token) {
      console.warn("No token found. Redirecting to login...");
      return router.push("/login");
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching user rooms and users...");
        const [roomsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/chat/getUserRooms", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/users/", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        console.log("Fetched rooms:", roomsRes.data.rooms);
        console.log("Fetched users:", usersRes.data.users);

        setRooms(roomsRes.data.rooms);
        setUsers(usersRes.data.users);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  const handleCreateRoom = async (friendId) => {
    console.log("Creating room with user:", friendId);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/createRoom",
        { friend_id: friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Room created:", response.data);
      window.location.reload();
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Your Chats
          </h2>
        </div>

        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="mr-2" size={18} />
            New Chat
          </button>

          {showDropdown && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {users.filter(user => user._id !== currentUserId).length === 0 ? (
                <div className="text-center text-gray-500 p-4">No other users available</div>
              ) : (
                users
                  .filter((user) => user._id !== currentUserId)
                  .map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleCreateRoom(user._id)}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div className="font-medium text-gray-700">{user.fullName}</div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-indigo-600"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">No chats yet.</div>
          ) : (
            rooms.map((room) => {
              const otherUser =
                room.user1._id === currentUserId ? room.user2 : room.user1;

              const isActive = selectedRoom?._id === room._id;

              return (
                <div
                  key={room._id}
                  onClick={() => {
                    console.log("Selected room:", room._id);
                    setSelectedRoom(room);
                  }}
                  className={`p-3 rounded-lg mb-2 flex items-center cursor-pointer transition-colors ${
                    isActive
                      ? "bg-indigo-50 border border-indigo-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                    {otherUser.fullName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{otherUser.fullName}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <RightChatArea
        selectedRoom={selectedRoom}
        currentUserId={currentUserId}
        token={token}
      />
    </div>
  );
};

const RightChatArea = ({ selectedRoom, currentUserId, token }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!selectedRoom || !token) {
      console.log("Room or token missing, skipping socket setup.");
      return;
    }

    console.log("Connecting socket...");
    const newSocket = io("http://localhost:5000", {
      auth: { token: `Bearer ${token}` },
      withCredentials: true,
      transports: ["polling", "websocket"]
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("joinRoom", selectedRoom._id);
    });

    newSocket.on("previousMessages", (msgs) => {
      console.log("Previous messages:", msgs);
      setMessages(msgs);
    });

    newSocket.on("serverSendsMsg", (msg) => {
      console.log("New message from server:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected.");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, [selectedRoom, token]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    console.log(`Sending: "${inputMessage}" to ${selectedRoom._id}`);
    socket.emit("serverRcvsMsg", {
      text: inputMessage,
      roomId: selectedRoom._id,
      userId: currentUserId,
    });

    setInputMessage("");
  };

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  const otherUser =
    selectedRoom.user1._id === currentUserId ? selectedRoom.user2 : selectedRoom.user1;

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
          {otherUser.fullName?.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-800">{otherUser.fullName}</div>
          <div className="text-sm text-gray-500">
            {isConnected ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <MessageSquare size={36} className="mx-auto mb-2" />
            No messages yet.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${
                msg.sender?._id === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-lg ${
                  msg.sender?._id === currentUserId
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white border border-gray-300 rounded-bl-none"
                }`}
              >
                {msg.sender?._id !== currentUserId && (
                  <div className="text-xs text-indigo-500 font-semibold mb-1">
                    {msg.sender?.name}
                  </div>
                )}
                <div>{msg.content}</div>
                <div className="text-xs text-right mt-1 text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 flex">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={!isConnected}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || !isConnected}
          className={`px-4 rounded-r-lg ${
            inputMessage.trim() && isConnected
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300"
          } text-white`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
