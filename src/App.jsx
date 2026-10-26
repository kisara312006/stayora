import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import PlaceholderPage from './pages/PlaceholderPage'

// Pages that will be built in later phases use PlaceholderPage for now,
// so every menu link works and nothing shows a "not found" error.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        <Route
          path="explore"
          element={
            <PlaceholderPage
              title="Explore accommodation"
              phase="Phase 5 and 6"
              description="Search, filters and results will appear here."
            />
          }
        />
        <Route
          path="accommodation/:id"
          element={
            <PlaceholderPage
              title="Accommodation details"
              phase="Phase 5"
              description="Full listing details, photos and map will appear here."
            />
          }
        />
        <Route
          path="assistant"
          element={
            <PlaceholderPage
              title="Stayora AI assistant"
              phase="Phase 7"
              description="The AI chatbot will live here."
            />
          }
        />
        <Route
          path="games"
          element={
            <PlaceholderPage
              title="Games"
              phase="Phase 9"
              description="Room Match and Stay Smart Quiz will appear here."
            />
          }
        />
        <Route
          path="login"
          element={
            <PlaceholderPage
              title="Login"
              phase="Phase 4"
              description="Sign-in will be built with Firebase Authentication."
            />
          }
        />
        <Route
          path="register"
          element={
            <PlaceholderPage
              title="Register"
              phase="Phase 4"
              description="Registration for seekers and owners will appear here."
            />
          }
        />
        <Route
          path="privacy"
          element={
            <PlaceholderPage
              title="Privacy Policy"
              phase="a later phase"
              description="Your real privacy policy text must be written and added before launch."
            />
          }
        />
        <Route
          path="terms"
          element={
            <PlaceholderPage
              title="Terms and Conditions"
              phase="a later phase"
              description="Your real terms text must be written and added before launch."
            />
          }
        />
        <Route
          path="safety"
          element={
            <PlaceholderPage
              title="Help and Safety Guidelines"
              phase="a later phase"
              description="Safety guidance for seekers and owners will appear here."
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}