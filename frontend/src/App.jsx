import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import BadgeModal from './components/common/BadgeModal';

// Pages
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import SyllabusTracker from './pages/SyllabusTracker';
import LabExperiments from './pages/LabExperiments';
import LabSimulator from './pages/LabSimulator';
import VivaTrainer from './pages/VivaTrainer';
import CodeAnalyzer from './pages/CodeAnalyzer';
import VisualizersPage from './pages/VisualizersPage';
import LastMinuteRevision from './pages/LastMinuteRevision';
import QuestionBank from './pages/QuestionBank';
import PlacementMode from './pages/PlacementMode';
import Login from './pages/Login';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
            {/* Global Navbar */}
            <Navbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Layout Body: Sidebar + Main Content */}
            <div className="flex-1 flex">
              <Sidebar
                isOpen={isSidebarOpen}
                closeSidebar={() => setIsSidebarOpen(false)}
              />

              {/* Main Content Area */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tutor" element={<AITutor />} />
                  <Route path="/syllabus" element={<SyllabusTracker />} />
                  <Route path="/labs" element={<LabExperiments />} />
                  <Route path="/lab-simulator" element={<LabSimulator />} />
                  <Route path="/viva" element={<VivaTrainer />} />
                  <Route path="/analyzer" element={<CodeAnalyzer />} />
                  <Route path="/visualizers" element={<VisualizersPage />} />
                  <Route path="/revision" element={<LastMinuteRevision />} />
                  <Route path="/questions" element={<QuestionBank />} />
                  <Route path="/placement" element={<PlacementMode />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
            </div>

            {/* Badge Unlock Celebration Modal */}
            <BadgeModal />
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}
