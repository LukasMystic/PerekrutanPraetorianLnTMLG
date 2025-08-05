'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Search, ArrowUpDown, ExternalLink, LogOut, Loader2, ShieldX, Trash2, Edit, Download, Filter, XCircle, Power, PowerOff } from 'lucide-react';

interface IApplication {
  _id: string;
  fullName: string;
  nim: string;
  major: string;
  lntClass: string;
  position: string;
  binusianEmail: string;
  privateEmail: string;
  resumeUrl: string;
  submissionDate: Date;
}

const LNT_CLASSES_AND_POSITIONS = ["UI/UX Design", "Back-end Development", "Java Programming", "Front-end Development", "C Programming"];

// --- The Admin Page Component ---
export default function AdminDashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof IApplication; direction: 'asc' | 'desc' }>({ key: 'submissionDate', direction: 'desc' });
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  
  const [editingApp, setEditingApp] = useState<IApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<IApplication | null>(null);

  // --- NEW: State for Recruitment Toggle ---
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState<boolean | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [toggleError, setToggleError] = useState('');

  // --- Effect to fetch applications (existing) ---
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/applications');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to fetch applications.');
        }
        const data = await response.json();
        setApplications(data.applications);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [router]);

  // --- NEW: Effect to fetch recruitment status ---
  useEffect(() => {
    const fetchRecruitmentStatus = async () => {
      try {
        const response = await fetch('/api/recruitment-status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setIsRecruitmentOpen(data.isRecruitmentOpen);
      } catch (err) {
        setToggleError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    };
    fetchRecruitmentStatus();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // --- NEW: Handler for toggling recruitment status ---
  const handleToggleRecruitment = async () => {
    setIsToggling(true);
    setToggleError('');
    try {
      const response = await fetch('/api/admin/recruitment', { method: 'POST' });
      if (!response.ok) throw new Error('Server responded with an error');
      
      const data = await response.json();
      if (data.success) {
        setIsRecruitmentOpen(data.isRecruitmentOpen);
      }
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async (id: string) => {
    const originalApplications = [...applications];
    setApplications(applications.filter(app => app._id !== id));
    setDeletingApp(null);
    try {
        const response = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete application.');
        }
    } catch (error) {
        console.error("Delete failed, reverting:", error);
        setApplications(originalApplications); 
        alert("Failed to delete application. Please try again.");
    }
  };
  
  const handleUpdate = async (updatedApp: IApplication) => {
    const originalApplications = [...applications];
    setApplications(applications.map(app => app._id === updatedApp._id ? updatedApp : app));
    setEditingApp(null);
    try {
        const response = await fetch(`/api/admin/applications/${updatedApp._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedApp),
        });
        if (!response.ok) {
            throw new Error('Failed to update application.');
        }
    } catch(error) {
        console.error("Update failed, reverting:", error);
        setApplications(originalApplications); 
        alert("Failed to update application. Please try again.");
    }
  };

  const handleDownloadCSV = () => {
    const dataToExport = filteredAndSortedApplications.map(app => ({
        SubmissionDate: new Date(app.submissionDate).toISOString().split('T')[0],
        FullName: app.fullName,
        NIM: app.nim,
        Major: app.major,
        LnTClass: app.lntClass,
        PositionApplied: app.position,
        BinusianEmail: app.binusianEmail,
        PrivateEmail: app.privateEmail,
        ResumeURL: app.resumeUrl,
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `praetorian_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter(app => 
          (app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.major.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (selectedClasses.length === 0 || selectedClasses.includes(app.lntClass)) &&
          (selectedPositions.length === 0 || selectedPositions.includes(app.position))
      )
      .sort((a, b) => {
          const keyA = a[sortConfig.key];
          const keyB = b[sortConfig.key];
          if (keyA < keyB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (keyA > keyB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [applications, searchQuery, sortConfig, selectedClasses, selectedPositions]);

  const requestSort = (key: keyof IApplication) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ columnKey, label }: { columnKey: keyof IApplication; label: string }) => (
    <th className="p-4 cursor-pointer group" onClick={() => requestSort(columnKey)}>
        <div className="flex items-center gap-2">
            {label}
            <ArrowUpDown className={`h-4 w-4 transition-opacity ${sortConfig.key === columnKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
        </div>
    </th>
  );
  
  if (isLoading) return <div className="bg-[#0d1a2e] min-h-screen flex items-center justify-center text-white"><Loader2 className="h-12 w-12 animate-spin text-[#00a9e0]" /></div>;
  if (error) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white"><div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl"><ShieldX className="h-12 w-12 mx-auto text-red-500" /><h1 className="text-2xl font-bold text-red-500 mt-4">Error</h1><p className="mt-2 text-gray-400">{error}</p></div></div>;

  return (
    <>
      <div className="bg-[#0d1a2e] text-white min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                  <h1 className="text-3xl font-bold">Praetorian Dashboard</h1>
                  <p className="text-gray-400 mt-1">Showing {filteredAndSortedApplications.length} of {applications.length} total applications.</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  <div className="relative flex-grow md:flex-grow-0"><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0]" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /></div>
                  <MultiSelectFilter title="Filter by Class" options={LNT_CLASSES_AND_POSITIONS} selectedOptions={selectedClasses} setSelectedOptions={setSelectedClasses} />
                  <MultiSelectFilter title="Filter by Position" options={LNT_CLASSES_AND_POSITIONS} selectedOptions={selectedPositions} setSelectedOptions={setSelectedPositions} />
                  <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-4 py-2 bg-sky-600/80 hover:bg-sky-600 rounded-lg transition-colors flex-shrink-0"><Download className="h-5 w-5" />Export</button>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors flex-shrink-0"><LogOut className="h-5 w-5" />Logout</button>
              </div>
          </div>
          
          {/* --- NEW: Recruitment Control Panel --- */}
          <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-xl rounded-lg">
            <h2 className="text-xl font-bold text-white mb-3">Recruitment Control</h2>
            {isRecruitmentOpen === null && !toggleError ? (
                <div className="flex items-center gap-2 text-gray-400"> <Loader2 className="h-5 w-5 animate-spin" /> Loading status... </div>
            ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">Public Form Status</p>
                        <p className={`text-2xl font-bold ${isRecruitmentOpen ? 'text-green-400' : 'text-red-400'}`}>
                            {isRecruitmentOpen ? 'Open' : 'Closed'}
                        </p>
                    </div>
                    <button
                        onClick={handleToggleRecruitment}
                        disabled={isToggling}
                        className={`w-full sm:w-auto flex items-center justify-center px-4 py-3 font-bold rounded-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait ${
                            isRecruitmentOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                        >
                        {isToggling ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isRecruitmentOpen ? (
                            <><PowerOff className="mr-2 h-5 w-5" /> Close Recruitment</>
                        ) : (
                            <><Power className="mr-2 h-5 w-5" /> Open Recruitment</>
                        )}
                    </button>
                </div>
            )}
            {toggleError && <p className="text-red-500 mt-2 text-sm">{toggleError}</p>}
          </div>


          {/* Table */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-lg overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-700/50 uppercase text-xs">
                <tr>
                  <SortableHeader columnKey="submissionDate" label="Date" />
                  <SortableHeader columnKey="fullName" label="Full Name" />
                  <SortableHeader columnKey="nim" label="NIM" />
                  <SortableHeader columnKey="lntClass" label="LnT Class" />
                  <SortableHeader columnKey="position" label="Applied For" />
                  <th className="p-4">CV</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedApplications.map((app) => (
                  <tr key={app._id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 text-gray-400">{new Date(app.submissionDate).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{app.fullName}</td>
                    <td className="p-4 text-gray-400">{app.nim}</td>
                    <td className="p-4 text-gray-300">{app.lntClass}</td>
                    <td className="p-4 text-gray-300">{app.position}</td>
                    <td className="p-4"><a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1">View <ExternalLink className="h-4 w-4" /></a></td>
                    <td className="p-4 flex items-center gap-2">
                        <button onClick={() => setEditingApp(app)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-md"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => setDeletingApp(app)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/20 rounded-md"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedApplications.length === 0 && (<div className="text-center py-16 text-gray-500"><p>No applications found.</p>{(searchQuery || selectedClasses.length > 0 || selectedPositions.length > 0) && <p className="text-sm mt-1">Try adjusting your filters.</p>}</div>)}
          </div>
        </div>
      </div>
      {editingApp && <EditModal app={editingApp} onClose={() => setEditingApp(null)} onSave={handleUpdate} />}
      {deletingApp && <DeleteConfirmationModal app={deletingApp} onClose={() => setDeletingApp(null)} onConfirm={handleDelete} />}
    </>
  );
}

// --- Filter Dropdown Component ---
function MultiSelectFilter({ title, options, selectedOptions, setSelectedOptions }: { title: string; options: string[]; selectedOptions: string[]; setSelectedOptions: (options: string[]) => void; }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleOptionChange = (option: string) => {
        setSelectedOptions(
            selectedOptions.includes(option)
                ? selectedOptions.filter(o => o !== option)
                : [...selectedOptions, option]
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors flex-shrink-0">
                <Filter className="h-5 w-5" /> {title} {selectedOptions.length > 0 && `(${selectedOptions.length})`}
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-4 space-y-2">
                        {options.map(option => (
                            <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={selectedOptions.includes(option)} onChange={() => handleOptionChange(option)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#00a9e0] focus:ring-[#00a9e0]"/>
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Edit Modal Component ---
function EditModal({ app, onClose, onSave }: { app: IApplication; onClose: () => void; onSave: (app: IApplication) => void; }) {
    const [formData, setFormData] = useState(app);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Edit Application</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XCircle className="h-6 w-6 text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {Object.entries(formData).filter(([key]) => !['_id', 'submissionDate', 'resumeUrl'].includes(key)).map(([key, value]) => (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input type="text" id={key} name={key} value={value as string} onChange={handleChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]"/>
                        </div>
                    ))}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-[#00a9e0] hover:bg-sky-500 font-semibold">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- Delete Confirmation Modal ---
function DeleteConfirmationModal({ app, onClose, onConfirm }: { app: IApplication; onClose: () => void; onConfirm: (id: string) => void; }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
                <Trash2 className="h-12 w-12 mx-auto text-red-500" />
                <h2 className="text-xl font-bold mt-4">Delete Application?</h2>
                <p className="text-gray-400 mt-2">Are you sure you want to delete the application for <strong className="text-white">{app.fullName}</strong>? This action cannot be undone.</p>
                <div className="flex justify-center gap-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button onClick={() => onConfirm(app._id)} className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-500 font-semibold">Delete</button>
                </div>
            </div>
        </div>
    );
}