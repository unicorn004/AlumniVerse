// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { User, MessageSquare, Heart, Share2, ImageIcon, X } from "lucide-react"
// import { Button } from "@/src/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
// import { Textarea } from "@/src/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
// import AppLayout from "@/src/components/app-layout"

// import { makeCommunityPost, getAllPosts, likePost, commentOnPost } from "../../api/home";

// export default function HomePage() {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)
//   const [posts, setPosts] = useState<any[]>([])
//   const [newPost, setNewPost] = useState("")
//   const [activeTab, setActiveTab] = useState("all")
//   const [isLoading, setIsLoading] = useState(true)
//   const [postImage, setPostImage] = useState<string | null>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   useEffect(() => {
//     // Check if user is logged in
//     const userData = localStorage.getItem("user")
//     if (!userData) {
//       router.push("/login")
//       return
//     }

//     setUser(JSON.parse(userData))

//     // Mock posts data
//     const mockPosts = [
//       {
//         id: "1",
//         author: {
//           id: "2",
//           name: "Jane Smith",
//           role: "alumni",
//           profileImage: "/placeholder.svg?height=40&width=40",
//           currentJob: "Senior Software Engineer",
//           company: "Tech Innovations Inc.",
//         },
//         content: "Just published a new article on scaling microservices architecture. Check it out on my LinkedIn!",
//         timestamp: new Date(Date.now() - 3600000).toISOString(),
//         likes: 24,
//         comments: 5,
//         liked: false,
//         image: null,
//       },
//       {
//         id: "2",
//         author: {
//           id: "3",
//           name: "Alex Johnson",
//           role: "alumni",
//           profileImage: "/placeholder.svg?height=40&width=40",
//           currentJob: "Product Manager",
//           company: "InnovateTech",
//         },
//         content:
//           "Excited to announce that I'll be speaking at the upcoming Tech Conference 2023 about product management in AI startups!",
//         timestamp: new Date(Date.now() - 86400000).toISOString(),
//         likes: 42,
//         comments: 8,
//         liked: true,
//         image: "/placeholder.svg?height=300&width=600",
//       },
//       {
//         id: "3",
//         author: {
//           id: "4",
//           name: "Sarah Williams",
//           role: "student",
//           profileImage: "/placeholder.svg?height=40&width=40",
//           degree: "Computer Science",
//         },
//         content:
//           "Looking for summer internship opportunities in software development. Any alumni have leads at their companies?",
//         timestamp: new Date(Date.now() - 172800000).toISOString(),
//         likes: 15,
//         comments: 12,
//         liked: false,
//         image: null,
//       },
//     ]

//     setPosts(mockPosts)
//     setIsLoading(false)
//   }, [router])

//   const handlePostSubmit = () => {
//     if (newPost.trim() === "" && !postImage) return

//     const newPostObj = {
//       id: Date.now().toString(),
//       author: {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//         profileImage: user.profileImage || "/placeholder.svg?height=40&width=40",
//         currentJob: user.currentJob,
//         company: user.company,
//       },
//       content: newPost,
//       timestamp: new Date().toISOString(),
//       likes: 0,
//       comments: 0,
//       liked: false,
//       image: postImage,
//     }

//     setPosts([newPostObj, ...posts])
//     setNewPost("")
//     setPostImage(null)
//   }

//   const handleLike = (postId: string) => {
//     setPosts(
//       posts.map((post) => {
//         if (post.id === postId) {
//           return {
//             ...post,
//             likes: post.liked ? post.likes - 1 : post.likes + 1,
//             liked: !post.liked,
//           }
//         }
//         return post
//       }),
//     )
//   }

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // In a real app, you would upload this to a server
//       // For demo purposes, we'll use a local URL
//       const imageUrl = URL.createObjectURL(file)
//       setPostImage(imageUrl)
//     }
//   }

//   const removeImage = () => {
//     setPostImage(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   const formatTimestamp = (timestamp: string) => {
//     const date = new Date(timestamp)
//     const now = new Date()
//     const diffMs = now.getTime() - date.getTime()
//     const diffSecs = Math.floor(diffMs / 1000)
//     const diffMins = Math.floor(diffSecs / 60)
//     const diffHours = Math.floor(diffMins / 60)
//     const diffDays = Math.floor(diffHours / 24)

//     if (diffSecs < 60) {
//       return "just now"
//     } else if (diffMins < 60) {
//       return `${diffMins}m ago`
//     } else if (diffHours < 24) {
//       return `${diffHours}h ago`
//     } else if (diffDays < 7) {
//       return `${diffDays}d ago`
//     } else {
//       return date.toLocaleDateString()
//     }
//   }

//   if (isLoading) {
//     return (
//       <AppLayout>
//         <div className="container mx-auto py-8 px-4">
//           <div className="flex flex-col gap-4 animate-pulse">
//             <div className="h-32 bg-muted rounded-lg"></div>
//             <div className="h-64 bg-muted rounded-lg"></div>
//             <div className="h-64 bg-muted rounded-lg"></div>
//           </div>
//         </div>
//       </AppLayout>
//     )
//   }

//   const filteredPosts =
//     activeTab === "all"
//       ? posts
//       : activeTab === "alumni"
//         ? posts.filter((post) => post.author.role === "alumni")
//         : posts.filter((post) => post.author.role === "student")

//   return (
//     <AppLayout>
//       <div className="container mx-auto py-8 px-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 space-y-6">
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex gap-4">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={user?.profileImage || "/placeholder.svg?height=40&width=40"} alt={user?.name} />
//                     <AvatarFallback>{user?.name?.charAt(0) || <User />}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 space-y-4">
//                     <Textarea
//                       placeholder="Share something with the community..."
//                       value={newPost}
//                       onChange={(e) => setNewPost(e.target.value)}
//                       className="resize-none"
//                     />

//                     {postImage && (
//                       <div className="relative mt-2 rounded-md overflow-hidden">
//                         <div className="relative h-48 w-full">
//                           <Image src={postImage || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="absolute top-2 right-2 bg-background/80 rounded-full"
//                           onClick={removeImage}
//                         >
//                           <X className="h-4 w-4" />
//                           <span className="sr-only">Remove image</span>
//                         </Button>
//                       </div>
//                     )}

//                     <div className="flex justify-between items-center">
//                       <div>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           ref={fileInputRef}
//                           onChange={handleImageUpload}
//                         />
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-muted-foreground"
//                           onClick={() => fileInputRef.current?.click()}
//                         >
//                           <ImageIcon className="h-4 w-4 mr-2" />
//                           Add Image
//                         </Button>
//                       </div>
//                       <Button onClick={handlePostSubmit}>Post</Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="all">All Posts</TabsTrigger>
//                 <TabsTrigger value="alumni">Alumni</TabsTrigger>
//                 <TabsTrigger value="students">Students</TabsTrigger>
//               </TabsList>
//               <TabsContent value="all" className="mt-6 space-y-6">
//                 {filteredPosts.map((post) => (
//                   <PostCard key={post.id} post={post} onLike={handleLike} formatTimestamp={formatTimestamp} />
//                 ))}
//               </TabsContent>
//               <TabsContent value="alumni" className="mt-6 space-y-6">
//                 {filteredPosts.map((post) => (
//                   <PostCard key={post.id} post={post} onLike={handleLike} formatTimestamp={formatTimestamp} />
//                 ))}
//               </TabsContent>
//               <TabsContent value="students" className="mt-6 space-y-6">
//                 {filteredPosts.map((post) => (
//                   <PostCard key={post.id} post={post} onLike={handleLike} formatTimestamp={formatTimestamp} />
//                 ))}
//               </TabsContent>
//             </Tabs>
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <h3 className="text-lg font-semibold">Upcoming Events</h3>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <h4 className="font-medium">Alumni Networking Mixer</h4>
//                   <p className="text-sm text-muted-foreground">May 15, 2023 • 6:00 PM</p>
//                   <p className="text-sm mt-1">Connect with fellow alumni and expand your professional network.</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium">Career Fair</h4>
//                   <p className="text-sm text-muted-foreground">June 2, 2023 • 10:00 AM</p>
//                   <p className="text-sm mt-1">Meet recruiters from top companies in the industry.</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium">Tech Talk: AI in Healthcare</h4>
//                   <p className="text-sm text-muted-foreground">June 10, 2023 • 2:00 PM</p>
//                   <p className="text-sm mt-1">Learn about the latest applications of AI in healthcare.</p>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" className="w-full">
//                   View All Events
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <h3 className="text-lg font-semibold">Suggested Connections</h3>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Avatar>
//                     <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Michael Chen" />
//                     <AvatarFallback>MC</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <p className="font-medium">Michael Chen</p>
//                     <p className="text-sm text-muted-foreground">Data Scientist at DataTech</p>
//                   </div>
//                   <Button size="sm" variant="outline">
//                     Connect
//                   </Button>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Avatar>
//                     <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
//                     <AvatarFallback>PS</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <p className="font-medium">Priya Sharma</p>
//                     <p className="text-sm text-muted-foreground">UX Designer at DesignHub</p>
//                   </div>
//                   <Button size="sm" variant="outline">
//                     Connect
//                   </Button>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Avatar>
//                     <AvatarImage src="/placeholder.svg?height=40&width=40" alt="David Kim" />
//                     <AvatarFallback>DK</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <p className="font-medium">David Kim</p>
//                     <p className="text-sm text-muted-foreground">Software Engineer at TechCorp</p>
//                   </div>
//                   <Button size="sm" variant="outline">
//                     Connect
//                   </Button>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" className="w-full">
//                   View More
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   )
// }

// interface PostCardProps {
//   post: any
//   onLike: (postId: string) => void
//   formatTimestamp: (timestamp: string) => string
// }

// function PostCard({ post, onLike, formatTimestamp }: PostCardProps) {
//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <div className="flex items-start gap-4">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={post.author.profileImage || "/placeholder.svg"} alt={post.author.name} />
//             <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
//           </Avatar>
//           <div className="flex-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">{post.author.name}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {post.author.role === "alumni"
//                     ? `${post.author.currentJob} at ${post.author.company}`
//                     : `${post.author.role}`}{" "}
//                   • {formatTimestamp(post.timestamp)}
//                 </p>
//               </div>
//             </div>
//             <p className="mt-2">{post.content}</p>
//             {post.image && (
//               <div className="mt-3 relative rounded-md overflow-hidden">
//                 <div className="relative h-64 w-full">
//                   <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardFooter className="flex justify-between pt-0">
//         <div className="flex gap-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             className={`gap-1 ${post.liked ? "text-primary" : "text-muted-foreground"}`}
//             onClick={() => onLike(post.id)}
//           >
//             <Heart className="h-4 w-4" fill={post.liked ? "currentColor" : "none"} />
//             <span>{post.likes}</span>
//           </Button>
//           <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
//             <MessageSquare className="h-4 w-4" />
//             <span>{post.comments}</span>
//           </Button>
//         </div>
//         <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
//           <Share2 className="h-4 w-4" />
//           <span>Share</span>
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  MessageSquare,
  Heart,
  Share2,
  ImageIcon,
  X,
  Send,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import AppLayout from "@/src/components/app-layout";

import {
  makeCommunityPost,
  getAllPosts,
  likePost,
  commentOnPost,
} from "../../api/home";

function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [postImage, setPostImage] = useState(null);
  const [postImageFile, setPostImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPosts();

      if (response && Array.isArray(response)) {
        // Transform API response to match our component's expected format
        const formattedPosts = response.map((post) => ({
          id: post._id,
          author: {
            id: post.author?.id || "unknown",
            name: post.author?.name || "Anonymous User",
            role: post.author?.role || "user",
            profileImage:
              post.author?.profileImage ||
              "/placeholder.svg?height=40&width=40",
            currentJob: post.author?.currentJob || "",
            company: post.author?.company || "",
          },
          content: post.content || "",
          timestamp: post.createdAt || new Date().toISOString(),
          likes: post.likes?.length || 0,
          liked: user ? post.likes?.includes(user.id) : false,
          image: post.image || null,
          comments:
            post.comments?.map((comment) => ({
              id: comment._id,
              author: {
                id: comment.user,
                name: comment.user.name || "Anonymous",
                role: "user",
                profileImage:
                  comment.user.profileImage ||
                  "/placeholder.svg?height=40&width=40",
              },
              content: comment.comment,
              timestamp: comment.createdAt || new Date().toISOString(),
            })) || [],
          commentCount: post.comments?.length || 0,
          showComments: false,
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUserData = JSON.parse(userData);
    setUser(parsedUserData);

    // Fetch posts from API
    fetchPosts();
  }, [router]);

  // Update the liked status of posts when user changes
  useEffect(() => {
    if (user && posts.length > 0) {
      setPosts(
        posts.map((post) => ({
          ...post,
          liked: post.likes?.includes(user.id),
        }))
      );
    }
  }, [user]);

  const handlePostSubmit = async () => {
    if (newPost.trim() === "" && !postImage && !postImageFile) return;

    try {
      // Prepare post data
      // const postData = {
      //   content: newPost,
      //   image: postImage || null
      // }
      // console.log("postImage = ",postImage);
      const formData = new FormData();
      formData.append("content", newPost);
      if (postImageFile) {
        formData.append("image", postImageFile); // This should match the backend field name
      }

      // Make API call to create post
      const response = await makeCommunityPost(formData);

      if (response) {
        // Refresh posts to show the new post
        fetchPosts();

        // Clear form
        setNewPost("");
        setPostImage(null);
        setPostImageFile(null);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleLike = async (postId) => {
    try {
      // Make API call to like/unlike post
      await likePost(postId);

      // Update local state optimistically
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const wasLiked = post.liked;
            return {
              ...post,
              likes: wasLiked ? post.likes - 1 : post.likes + 1,
              liked: !wasLiked,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert optimistic update on error
      fetchPosts();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For demo purposes, we'll use a local URL
      //console.log("file = ",file);
      const imageUrl = URL.createObjectURL(file);
      setPostImage(imageUrl);
      setPostImage(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setPostImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const toggleComments = (postId) => {
  //   setPosts(
  //     posts.map((post) => {
  //       if (post.id === postId) {
  //         return {
  //           ...post,
  //           showComments: !post.showComments,
  //         }
  //       }
  //       return post
  //     }),
  //   )
  // }
  const toggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const addComment = async (postId, commentText) => {
    if (commentText.trim() === "") return;

    try {
      // Prepare comment data
      const commentData = {
        comment: commentText,
      };

      // Make API call to add comment
      await commentOnPost(postId, commentData);

      // Refresh posts to get updated comments
      fetchPosts();
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return "just now";
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const filteredPosts =
    activeTab === "all"
      ? posts
      : activeTab === "alumni"
      ? posts.filter((post) => post.author.role === "alumni")
      : posts.filter((post) => post.author.role === "student");

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        user?.profileImage ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || <User />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="Share something with the community..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="resize-none"
                    />

                    {postImage && (
                      <div className="relative mt-2 rounded-md overflow-hidden">
                        <div className="relative h-48 w-full">
                          <Image
                            src={postImage || "/placeholder.svg"}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 rounded-full"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                      </div>
                      <Button onClick={handlePostSubmit}>Post</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="alumni">Alumni</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6 space-y-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    formatTimestamp={formatTimestamp}
                    toggleComments={toggleComments}
                    addComment={addComment}
                    currentUser={user}
                  />
                ))}
              </TabsContent>
              <TabsContent value="alumni" className="mt-6 space-y-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    formatTimestamp={formatTimestamp}
                    toggleComments={toggleComments}
                    addComment={addComment}
                    currentUser={user}
                  />
                ))}
              </TabsContent>
              <TabsContent value="students" className="mt-6 space-y-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    formatTimestamp={formatTimestamp}
                    toggleComments={toggleComments}
                    addComment={addComment}
                    currentUser={user}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Alumni Networking Mixer</h4>
                  <p className="text-sm text-muted-foreground">
                    May 15, 2025 • 6:00 PM
                  </p>
                  <p className="text-sm mt-1">
                    Connect with fellow alumni and expand your professional
                    network.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Career Fair</h4>
                  <p className="text-sm text-muted-foreground">
                    June 2, 2025 • 10:00 AM
                  </p>
                  <p className="text-sm mt-1">
                    Meet recruiters from top companies in the industry.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Tech Talk: AI in Healthcare</h4>
                  <p className="text-sm text-muted-foreground">
                    June 10, 2025 • 2:00 PM
                  </p>
                  <p className="text-sm mt-1">
                    Learn about the latest applications of AI in healthcare.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Suggested Connections</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Michael Chen"
                    />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">
                      Data Scientist at DataTech
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Priya Sharma"
                    />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">
                      UX Designer at DesignHub
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="David Kim"
                    />
                    <AvatarFallback>DK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">David Kim</p>
                    <p className="text-sm text-muted-foreground">
                      Software Engineer at TechCorp
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface PostCardProps {
  post: any;
  onLike: (postId: string) => void;
  formatTimestamp: (timestamp: string) => string;
  toggleComments: (postId: string) => void;
  addComment: (postId: string, commentText: string) => void;
  currentUser: any;
}

function PostCard({
  post,
  onLike,
  formatTimestamp,
  toggleComments,
  addComment,
  currentUser,
}: PostCardProps) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    addComment(post.id, newComment);
    setNewComment("");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.author.profileImage || "/placeholder.svg"}
              alt={post.author.name || "User"}
            />
            <AvatarFallback>
              {post.author.name ? post.author.name.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {post.author.name || "Anonymous User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {post.author.role === "alumni"
                    ? `${post.author.currentJob || "Professional"} at ${
                        post.author.company || "Company"
                      }`
                    : `${post.author.role || "User"}`}{" "}
                  • {formatTimestamp(post.timestamp)}
                </p>
              </div>
            </div>
            <p className="mt-2">{post.content}</p>
            {post.image && (
              <div className="mt-3 relative rounded-md overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${
                post.liked ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => onLike(post.id)}
            >
              <Heart
                className="h-4 w-4"
                fill={post.liked ? "currentColor" : "none"}
              />
              <span>{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${
                post.showComments ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => toggleComments(post.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        {post.showComments && (
          <div className="w-full mt-4 space-y-4">
            <div className="border-t pt-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.author?.profileImage || "/placeholder.svg"}
                        alt={comment.author?.name || "User"}
                      />
                      <AvatarFallback>
                        {comment.author?.name
                          ? comment.author.name.charAt(0)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {comment.author?.name || "Anonymous User"}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No comments yet. Be the first to comment!
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      currentUser?.profileImage ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt={currentUser?.name || "User"}
                  />
                  <AvatarFallback>
                    {currentUser?.name ? currentUser.name.charAt(0) : <User />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none min-h-0 h-10 py-2"
                  />
                  <Button
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default HomePage;
