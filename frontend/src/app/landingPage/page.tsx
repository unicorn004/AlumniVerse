import Link from "next/link"
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Users } from "lucide-react"
import { Button } from "@/src/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-6 w-6" />
            <span>AlumniVerse</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect with your Alumni Network
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AlumniVerse brings together students and alumni to foster mentorship, networking, and career
                    opportunities.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px] xl:h-[500px] xl:w-[500px] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-90 animate-pulse">
                  <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/people-connecting-web-network-diagram-background_1017-53236.jpg?t=st=1745125476~exp=1745129076~hmac=02b989a3d5367de04a098e8f909bef379d1e2e929868eb89cffba29d9a0f09e5&w=1380"
                      alt="Alumni connecting"
                      className="h-full w-full object-cover transform scale-70"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything you need to connect</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  AlumniVerse provides all the tools you need to build meaningful connections with your alumni network.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Connect with Alumni</h3>
                <p className="text-center text-muted-foreground">
                  Find and connect with alumni from your institution who share your interests and career goals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Career Opportunities</h3>
                <p className="text-center text-muted-foreground">
                  Discover job opportunities, internships, and mentorship programs shared by alumni.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Knowledge Sharing</h3>
                <p className="text-center text-muted-foreground">
                  Learn from the experiences and insights of successful alumni through posts and discussions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Hear from our community</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  See what students and alumni have to say about their experience with AlumniVerse.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <img
                    alt="User"
                    className="rounded-full"
                    height="40"
                    src="https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=2048x2048&w=is&k=20&c=9oGG0ky5YdK2J5Qy1RIdVRJFV8U3DEBbMCq10aTxTPY="
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width="40"
                  />
                  <div className="grid gap-1">
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Class of 2018, Computer Science</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "AlumniVerse helped me connect with alumni in my field who provided valuable guidance for my career. I
                  landed my dream job through a connection I made on this platform!"
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <img
                    alt="User"
                    className="rounded-full"
                    height="40"
                    src="https://as2.ftcdn.net/jpg/02/24/86/95/1000_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width="40"
                  />
                  <div className="grid gap-1">
                    <h3 className="font-semibold">Michael Chen</h3>
                    <p className="text-sm text-muted-foreground">Class of 2010, Business Administration</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "As an alumnus, I love being able to give back to my alma mater by mentoring current students. AlumniVerse
                  makes it easy to stay connected and share opportunities."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    About AlumniVerse
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Mission</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AlumniVerse was created to bridge the gap between students and alumni, fostering a community of support,
                    mentorship, and opportunity.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    We believe that the collective knowledge and experience of alumni is an invaluable resource for
                    current students and recent graduates.
                  </p>
                  <p className="text-muted-foreground">
                    By connecting these groups, we create a powerful network that benefits everyone involved and
                    strengthens our educational community.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg">Join Our Community</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="About AlumniVerse"
                  className="rounded-lg object-cover"
                  height="400"
                  src="https://blogs.ibo.org/files/2020/10/Learning-environment-1200x800-1.jpg"
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <GraduationCap className="h-6 w-6" />
              <span>AlumniVerse</span>
            </Link>
            <p className="text-sm text-muted-foreground md:max-w-xs">
              Connecting students and alumni to build a stronger community and create opportunities for everyone.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Platform</h3>
              <nav className="grid gap-2 text-sm">
                <Link href="#" className="text-muted-foreground hover:underline">
                  Features
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                  Testimonials
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                  About
                </Link>
              </nav>
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Resources</h3>
              <nav className="grid gap-2 text-sm">
                <Link href="#" className="text-muted-foreground hover:underline">
                  Help Center
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                  Terms of Service
                </Link>
              </nav>
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Contact</h3>
              <nav className="grid gap-2 text-sm">
                <Link href="#" className="text-muted-foreground hover:underline">
                  Email
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                  Twitter
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                  LinkedIn
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="border-t py-6 md:py-8">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} AlumniVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
