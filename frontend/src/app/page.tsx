"use client";

import LandingPage from "./landingPage/page"
import GlobalProvider from "../context/GlobalProvider"

export default function App() {
  return (
    <GlobalProvider>
      <LandingPage/>
    </GlobalProvider>
  )
}
