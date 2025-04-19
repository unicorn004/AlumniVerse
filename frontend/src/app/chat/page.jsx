"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Send, Search, ArrowLeft, MessageSquare, PlusCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { useToast } from "@/src/hooks/use-toast"
import { useMobile } from "@/src/hooks/use-mobile"
import AppLayout from "@/src/components/app-layout"
import axios from "axios"
import { io } from "socket.io-client"
import { jwtDecode } from "jwt-decode"

import {API_BASE_URL} from "../../routes/apiRoute"

export default function ChatPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(!isMobile)
  
  // Socket.io state
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(true)
  const [rooms, setRooms] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showUsersDropdown, setShowUsersDropdown] = useState(false)
  
  // Get token and user ID
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const decoded = token ? jwtDecode(token) : null
  const currentUserId = decoded?.id

  // Filter contacts based on search query
  const filteredRooms = searchQuery 
    ? rooms.filter(room => {
        const otherUser = room.user1._id === currentUserId ? room.user2 : room.user1
        return otherUser.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : rooms

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      console.warn("No token found. Redirecting to login...")
      router.push("/login")
      return
    }

    // Fetch user data, rooms and users
    const fetchData = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching user rooms and users...")
        const [roomsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/chat/getUserRooms`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/users/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        console.log("Fetched rooms:", roomsRes.data.rooms)
        console.log("Fetched users:", usersRes.data)

        setRooms(roomsRes.data.rooms)
        setUsers(usersRes.data)
        
        // Check if there's a chat recipient from profile page
        const recipientData = localStorage.getItem("nexus-chat-recipient")
        if (recipientData) {
          const recipient = JSON.parse(recipientData)
          
          // Find if room already exists with this user
          const existingRoom = roomsRes.data.rooms.find(room => {
            const otherUser = room.user1._id === currentUserId ? room.user2 : room.user1
            return otherUser._id === recipient.id
          })
          
          if (existingRoom) {
            // Select existing room
            setSelectedRoom(existingRoom)
          } else {
            // Create new room with this user
            try {
              const response = await axios.post(
                `${API_BASE_URL}/api/chat/createRoom`,
                { friend_id: recipient.id },
                { headers: { Authorization: `Bearer ${token}` } }
              )
              console.log("Room created:", response.data)
              // Refresh rooms after creating new one
              const updatedRoomsRes = await axios.get(`${API_BASE_URL}/api/chat/getUserRooms`, {
                headers: { Authorization: `Bearer ${token}` }
              })
              setRooms(updatedRoomsRes.data.rooms)
              
              // Find and select the newly created room
              const newRoom = updatedRoomsRes.data.rooms.find(room => {
                const otherUser = room.user1._id === currentUserId ? room.user2 : room.user1
                return otherUser._id === recipient.id
              })
              
              if (newRoom) setSelectedRoom(newRoom)
            } catch (err) {
              console.error("Error creating room:", err)
              toast({
                title: "Error",
                description: "Failed to create chat room",
                variant: "destructive"
              })
            }
          }
          
          // Clear the recipient data
          localStorage.removeItem("nexus-chat-recipient")

          // Hide sidebar on mobile
          if (isMobile) {
            setShowSidebar(false)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        toast({
          title: "Error",
          description: "Failed to load chat data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    
    // Get user data
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router, token, currentUserId, toast, isMobile])
  
  // Set up socket connection when selected room changes
  useEffect(() => {
    if (!selectedRoom || !token) {
      console.log("Room or token missing, skipping socket setup.")
      return
    }

    console.log("Connecting socket...")
    const newSocket = io(`${API_BASE_URL}`, {
      auth: { token: `Bearer ${token}` },
      withCredentials: true,
      transports: ["polling", "websocket"]
    })

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
      // setIsConnected(true)
      newSocket.emit("joinRoom", selectedRoom._id)
    })

    newSocket.on("previousMessages", (msgs) => {
      console.log("Previous messages:", msgs)
      setMessages(msgs)
    })

    newSocket.on("serverSendsMsg", (msg) => {
      console.log("New message from server:", msg)
      setMessages((prev) => [...prev, msg])
      
      // Show toast notification for new messages
      if (msg.sender?._id !== currentUserId) {
        const otherUser = selectedRoom.user1._id === currentUserId ? selectedRoom.user2 : selectedRoom.user1
        toast({
          title: `New message from ${otherUser.fullName}`,
          description: msg.content.substring(0, 60) + (msg.content.length > 60 ? "..." : ""),
        })
      }
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected.")
      // setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      console.log("Disconnecting socket...")
      newSocket.disconnect()
    }
  }, [selectedRoom, token, toast, currentUserId])
  
  // Handle creating a new chat room with a user
  const handleCreateRoom = async (friendId) => {
    console.log("Creating room with user:", friendId)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/createRoom`,
        { friend_id: friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("Room created:", response.data)
      
      // Refresh rooms after creating new one
      const updatedRoomsRes = await axios.get(`${API_BASE_URL}/api/chat/getUserRooms`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRooms(updatedRoomsRes.data.rooms)
      
      // Find and select the newly created room
      const newRoom = updatedRoomsRes.data.rooms.find(room => {
        const otherUser = room.user1._id === currentUserId ? room.user2 : room.user1
        return otherUser._id === friendId
      })
      
      if (newRoom) setSelectedRoom(newRoom)
      
      // Hide dropdown
      setShowUsersDropdown(false)
      
      toast({
        title: "Success",
        description: "Chat room created successfully",
      })
    } catch (err) {
      console.error("Error creating room:", err)
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      })
    }
  }
  
  // Handle sending a message
  const sendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedRoom || !isConnected) return

    console.log(`Sending: "${newMessage}" to ${selectedRoom._id}`)
    socket.emit("serverRcvsMsg", {
      text: newMessage,
      roomId: selectedRoom._id,
      userId: currentUserId,
    })

    setNewMessage("")
  }

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Contacts Sidebar */}
        {showSidebar && (
          <div className="w-66 md:w-45 border-r flex flex-col">
            <div className="p-4 border-b h-15">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* New Chat Button */}
            <div className="p-4 border-b  h-15">
              <Button
                className="w-full"
                onClick={() => setShowUsersDropdown(!showUsersDropdown)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              
              {/* User List Dropdown */}
              {showUsersDropdown && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg " style={{ maxHeight: '30vh', overflowY: 'auto' }}>
                  {users.filter(user => user._id !== currentUserId).length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No users available</div>
                  ) : (
                    users
                      .filter(user => user._id !== currentUserId)
                      .map(user => (
                        <div
                          key={user._id}
                          onClick={() => handleCreateRoom(user._id)}
                          className="p-3 hover:bg-muted cursor-pointer flex items-center"
                        >
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user.profileImage} alt={user.fullName} />
                            <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.fullName}</div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Contacts List - Replaced ScrollArea with scrollable div */}
            <div className="flex-1"  style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="divide-y">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => {
                    const otherUser = room.user1._id === currentUserId ? room.user2 : room.user1
                    const isActive = selectedRoom?._id === room._id
                    
                    // Get the last message for this room
                    const lastMessage = room.lastMessage || "Start a conversation"
                    const timestamp = room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleDateString() : "No messages"
                    
                    return (
                      <div
                        key={room._id}
                        className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                          isActive ? "bg-muted" : ""
                        }`}
                        onClick={() => {
                          setSelectedRoom(room)
                          // Hide sidebar on mobile
                          if (isMobile) {
                            setShowSidebar(false)
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser.profileImage} alt={otherUser.fullName} />
                            <AvatarFallback>{otherUser.fullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate">{otherUser.fullName}</h3>
                              <span className="text-xs text-muted-foreground">{timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-60">
          {selectedRoom ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 h-15">
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                
                {selectedRoom && (
                  <>
                    <Avatar className="h-10 w-10">
                      {selectedRoom.user1 && selectedRoom.user2 && (
                        <>
                          <AvatarImage 
                            src={selectedRoom.user1._id === currentUserId ? selectedRoom.user2.profileImage : selectedRoom.user1.profileImage} 
                            alt={selectedRoom.user1._id === currentUserId ? selectedRoom.user2.fullName : selectedRoom.user1.fullName} 
                          />
                          <AvatarFallback>
                            {(selectedRoom.user1._id === currentUserId ? selectedRoom.user2.fullName : selectedRoom.user1.fullName)?.charAt(0)}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedRoom.user1 && selectedRoom.user2 && 
                          (selectedRoom.user1._id === currentUserId ? selectedRoom.user2.fullName : selectedRoom.user1.fullName)}
                      </h3>
                      {/* <div className="text-sm text-muted-foreground">
                        {isConnected ? "Online" : "Offline"}
                      </div> */}
                    </div>
                  </>
                )}
              </div>

              {/* Messages Area - Replaced ScrollArea with scrollable div */}
              <div
  className="flex-1 p-4"
  style={{ maxHeight: '68vh', overflowY: 'auto' }}
>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                      <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.sender?._id === currentUserId ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender?._id === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender?._id === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    // disabled={!isConnected}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {isMobile && (
                <Button variant="outline" className="mb-4" onClick={toggleSidebar}>
                  Show Contacts
                </Button>
              )}
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-2">Welcome to Nexus Chat</h2>
                <p className="text-muted-foreground">
                  Select a contact to start messaging or create a new chat with an alumni.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}