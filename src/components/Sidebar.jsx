import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import react from '../assets/react.svg';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true);
    const [showDialog, setShowDialog] = useState(false); 
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User'; 

    
    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login'); 
    };

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-5 pb-2 flex justify-between items-center">
                    <img src={react} className={`overflow-hidden transition-all ${expanded ? "w-22" : "w-0"}`} alt="React Logo" />
                    <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>
                <SidebarContext.Provider value={{ expanded }}>
                    <ul className='flex-1 px-3'>
                        {children}
                    </ul>
                </SidebarContext.Provider>
                <div className='border-t flex p-3'>
                    <img src={react} className='mr-2 w-10 h-10 rounded-md' alt="User Avatar" />
                    <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                        <div className='leading-4'>
                            <h4 className='font-semibold'>{username}</h4>
                        </div>
                        <div className="relative">
                            <MoreVertical size={20} onClick={() => setShowDialog(true)} className="cursor-pointer" />
                        </div>
                    </div>
                </div>
            </nav>

            
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Logout</h2>
                        <p>Are you sure you want to logout?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowDialog(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

export function SidebarItem({ icon, text, route, active }) {
    const { expanded } = useContext(SidebarContext);
    const navigate = useNavigate();

    const handleClick = () => {
        if (route) {
            navigate(route);
        }
    };

    return (
        <li
            onClick={handleClick}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-green-200 to-green-100 text-green-600" : "hover:bg-green-50 text-gray-600"}`}
        >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>

            {!expanded && (
                <div
                    className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-green-100 text-green-800 text-sm invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-hover:-translate-x-3 z-50`}
                    style={{ zIndex: 50 }}
                >
                    {text}
                </div>
            )}
        </li>
    );
}
