import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import PlaceholderPage from './pages/PlaceholderPage'
import FirebaseCheck from './pages/FirebaseCheck'

// Pages that will be built in later phases use PlaceholderPage for now,
// so every link works and nothing shows a "not found" error.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Accounts */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="forgot-password"
          element={
            <PlaceholderPage
              title="Reset your password"
              phase="the next step (4B)"
              description="Password reset will be added next."
            />
          }
        />
        <Route
          path="complete-profile"
          element={
            <PlaceholderPage
              title="Complete your profile"
              phase="the next step (4B)"
              description="New Google users will choose their account type here."
            />
          }
        />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner"
          element={
            <ProtectedRoute role="owner">
              <PlaceholderPage
                title="Owner dashboard"
                phase="Phase 5"
                description="Your listings, availability and reservations will appear here."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute admin>
              <PlaceholderPage
                title="Admin dashboard"
                phase="Phase 9"
                description="User, listing and reservation management will appear here."
              />
            </ProtectedRoute>
          }
        />

        {/* Later phases */}
        <Route
          path="explore"
          element={
            <PlaceholderPage
              title="Explore accommodation"
              phase="Phase 5 and 7"
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
              phase="Phase 8"
              description="The AI chatbot will live here."
            />
          }
        />
        <Route
          path="games"
          element={
            <PlaceholderPage
              title="Games"
              phase="Phase 10"
              description="Room Match and Stay Smart Quiz will appear here."
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

        {import.meta.env.DEV && (
          <Route path="dev/firebase-check" element={<FirebaseCheck />} />
        )}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}