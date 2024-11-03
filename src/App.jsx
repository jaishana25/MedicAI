import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar, { SidebarItem } from './components/Sidebar';
import { FileIcon, Home, LayoutDashboard, LogInIcon, Settings } from 'lucide-react';
import HomePage from './components/Home'; 
import AIPage from './components/AI';
import LoginPage from './components/LoginPage';
import ReportAnalysis from './components/ReportAnalysis';
import FileUpload from './components/FileUpload';
import FilesDisplay from './components/FilesDisplay';
import VitalAnalysis from './components/VitalAnalysis';
import HealthRisks from './components/HealthRisks'; 
import { useState } from 'react';
import { Analytics, Dangerous } from '@mui/icons-material';

function SettingsPage() {
  return <h2>Settings Page</h2>;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [files, setFiles] = useState([]);

  return (
    <Router>
      <div className="flex">
        <Sidebar>
          <SidebarItem icon={<Home size={20}/>} text="Home" route="/" />
          <SidebarItem icon={<LayoutDashboard size={20}/>} text="AI Doctor" route="/aidoc" />
          <SidebarItem icon={<Settings size={20}/>} text="Settings" route="/settings" />
          <SidebarItem icon={<FileIcon size={20}/>} text="Report Analysis" route="/report" />
          <SidebarItem icon={<LogInIcon size={20}/>} text="Login" route="/login" />
          <SidebarItem icon={<Analytics size={20}/>} text="Vital Analysis" route="/vitalanalysis" /> {/* New Sidebar Item */}
          <SidebarItem icon={<Dangerous size={20}/>} text="Health Risk" route="/healthrisks" /> {/* New Sidebar Item */}
          
        </Sidebar>
        
        <div className="flex-1 p-5">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/aidoc" element={<AIPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
            <Route path="/report" element={<ReportAnalysis />} />
            <Route path="/upload" element={
              currentUser ? 
              <FileUpload currentUser={currentUser} files={files} setFiles={setFiles} /> :
              <LoginPage setCurrentUser={setCurrentUser} />
            } />
            <Route path="/files" element={
              currentUser ?
              <FilesDisplay currentUser={currentUser} files={files} /> :
              <LoginPage setCurrentUser={setCurrentUser} />
            } />
            <Route path="/vitalanalysis" element={<VitalAnalysis />} /> 
            <Route path="/healthrisks" element={<HealthRisks />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
