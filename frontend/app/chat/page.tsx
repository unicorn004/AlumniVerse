"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Send, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import AppLayout from "@/components/app-layout"

// Mock chat contacts
const mockContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the information!",
    timestamp: "2 hours ago",
    unread: 0,
  },
  {
    id: 2,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Would you be interested in attending our workshop next month?",
    timestamp: "Yesterday",
    unread: 2,
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll send you more details about the internship opportunity.",
    timestamp: "3 days ago",
    unread: 0,
  },
]

// Mock chat messages
const mockMessages = {
  1: [
    {
      id: 101,
      senderId: 1,
      text: "Hi there! I saw you're interested in machine learning. Are you working on any projects currently?",
      timestamp: "2023-04-10T10:30:00Z",
    },
    {
      id: 102,
      senderId: "me",
      text: "Hi Sarah! Yes, I'm working on a natural language processing project for my final year. It's challenging but exciting!",
      timestamp: "2023-04-10T10:35:00Z",
    },
    {
      id: 103,
      senderId: 1,
      text: "That sounds interesting! I'm actually working on something similar at Google. Would you like me to share some resources that might help?",
      timestamp: "2023-04-10T10:40:00Z",
    },
    {
      id: 104,
      senderId: "me",
      text: "That would be amazing! I'm particularly struggling with transformer models and attention mechanisms.",
      timestamp: "2023-04-10T10:45:00Z",
    },
    {
      id: 105,
      senderId: 1,
      text: "I'll put together some papers and tutorials that helped me understand those concepts. Also, would you be interested in a virtual coffee chat sometime next week? I could give you more specific advice.",
      timestamp: "2023-04-10T10:50:00Z",
    },
    {
      id: 106,
      senderId: "me",
      text: "That would be incredible! Thank you so much for offering to help.",
      timestamp: "2023-04-10T10:55:00Z",
    },
    {
      id: 107,
      senderId: 1,
      text: "No problem at all! That's what the alumni network is for. I'll send you some available times for next week.",
      timestamp: "2023-04-10T11:00:00Z",
    },
    {
      id: 108,
      senderId: "me",
      text: "Looking forward to it!",
      timestamp: "2023-04-10T11:05:00Z",
    },
    {
      id: 109,
      senderId: 1,
      text: "Great! By the way, here's a link to a great tutorial on transformer models: https://example.com/transformers",
      timestamp: "2023-04-10T11:10:00Z",
    },
    {
      id: 110,
      senderId: 1,
      text: "Thanks for the information!",
      timestamp: "2023-04-10T11:15:00Z",
    },
  ],
  2: [
    {
      id: 201,
      senderId: 2,
      text: "Hello! I'm organizing a workshop on 'Entrepreneurship 101' next month. Would you be interested in attending?",
      timestamp: "2023-04-09T14:00:00Z",
    },
    {
      id: 202,
      senderId: "me",
      text: "Hi David! That sounds interesting. Could you share more details about the workshop?",
      timestamp: "2023-04-09T14:10:00Z",
    },
    {
      id: 203,
      senderId: 2,
      text: "Of course! It's a two-day workshop covering business model development, pitching to investors, and early-stage funding. We'll have several successful entrepreneurs as guest speakers.",
      timestamp: "2023-04-09T14:20:00Z",
    },
    {
      id: 204,
      senderId: 2,
      text: "Would you be interested in attending our workshop next month?",
      timestamp: "2023-04-09T14:25:00Z",
    },
  ],
  3: [
    {
      id: 301,
      senderId: 3,
      text: "Hi! I noticed you're in your final year. Are you looking for internship opportunities?",
      timestamp: "2023-04-07T09:00:00Z",
    },
    {
      id: 302,
      senderId: "me",
      text: "Hello Priya! Yes, I'm definitely interested in internships in the hardware engineering field.",
      timestamp: "2023-04-07T09:15:00Z",
    },
    {
      id: 303,
      senderId: 3,
      text: "Great! We have an opening in our team at Microsoft for a summer internship. Would you like me to refer you?",
      timestamp: "2023-04-07T09:30:00Z",
    },
    {
      id: 304,
      senderId: "me",
      text: "That would be amazing! Thank you so much for the offer.",
      timestamp: "2023-04-07T09:45:00Z",
    },
    {
      id: 305,
      senderId: 3,
      text: "No problem! I'll send you more details about the internship opportunity.",
      timestamp: "2023-04-07T10:00:00Z",
    },
  ],
}

export default function ChatPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contacts, setContacts] = useState(mockContacts)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredContacts, setFilteredContacts] = useState(mockContacts)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(!isMobile)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("nexus-user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Check if there's a chat recipient from profile page
    const recipientData = localStorage.getItem("nexus-chat-recipient")
    if (recipientData) {
      const recipient = JSON.parse(recipientData)

      // Check if recipient is already in contacts
      const existingContact = contacts.find((contact) => contact.id === recipient.id)

      if (!existingContact) {
        // Add recipient to contacts
        const newContact = {
          id: recipient.id,
          name: recipient.name,
          avatar: recipient.avatar,
          lastMessage: "Start a conversation",
          timestamp: "Just now",
          unread: 0,
        }

        setContacts((prev) => [newContact, ...prev])
        setSelectedContact(newContact)
        setMessages([])
      } else {
        // Select existing contact
        setSelectedContact(existingContact)
        setMessages(mockMessages[existingContact.id] || [])
      }

      // Clear the recipient data
      localStorage.removeItem("nexus-chat-recipient")

      // Hide sidebar on mobile
      if (isMobile) {
        setShowSidebar(false)
      }
    }

    setIsLoading(false)
  }, [router])

  // Filter contacts based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [searchQuery, contacts])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle contact selection
  const selectContact = (contact: any) => {
    setSelectedContact(contact)
    setMessages(mockMessages[contact.id] || [])

    // Mark messages as read
    if (contact.unread > 0) {
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c)))
    }

    // Hide sidebar on mobile
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Send a new message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedContact) return

    const newMsg = {
      id: Date.now(),
      senderId: "me",
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    // Add message to chat
    setMessages((prev) => [...prev, newMsg])

    // Update last message in contacts
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              lastMessage: newMessage,
              timestamp: "Just now",
            }
          : contact,
      ),
    )

    // Clear input
    setNewMessage("")

    // Simulate reply after delay
    setTimeout(() => {
      // Create a mock reply
      const reply = {
        id: Date.now() + 1,
        senderId: selectedContact.id,
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toISOString(),
      }

      // Add reply to chat
      setMessages((prev) => [...prev, reply])

      // Update last message in contacts
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                lastMessage: reply.text,
                timestamp: "Just now",
              }
            : contact,
        ),
      )

      // Show toast notification
      toast({
        title: `New message from ${selectedContact.name}`,
        description: reply.text.substring(0, 60) + (reply.text.length > 60 ? "..." : ""),
      })
    }, 2000)
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
          <div className="w-full md:w-80 border-r flex flex-col">
            <div className="p-4 border-b">
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

            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                      selectedContact?.id === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => selectContact(contact)}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">{contact.name}</h3>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                            {contact.unread > 0 && (
                              <div className="ml-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                                {contact.unread}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredContacts.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No contacts found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
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
                  Select a contact to start messaging or search for alumni to connect with.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
