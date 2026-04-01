import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

const officersData = {
  "data": [
    {
      "id": 47,
      "name": "Recipient Officer",
      "designation": "সিনিয়র সিস্টেম অ্যানালিস্ট",
      "department": "আইসিটি শাখা",
      "phone": "01712345678",
      "email": "officer@example.gov.bd",
      "photoUrl": "https://picsum.photos/seed/officer1/100/100",
      "isActive": true,
      "createdAt": "2026-04-01T08:21:22.055Z",
      "_count": {
        "assignments": 1
      }
    },
    {
      "id": 48,
      "name": "Sultana Razia",
      "designation": "প্রোগ্রামার",
      "department": "প্রশাসন শাখা",
      "phone": "01812345679",
      "email": "razia@example.gov.bd",
      "photoUrl": "https://picsum.photos/seed/officer2/100/100",
      "isActive": true,
      "createdAt": "2026-03-15T10:00:00.000Z",
      "_count": {
        "assignments": 3
      }
    },
    {
      "id": 49,
      "name": "Md. Abdul Karim",
      "designation": "সহকারী প্রোগ্রামার",
      "department": "আইসিটি শাখা",
      "phone": "01912345680",
      "email": "karim@example.gov.bd",
      "photoUrl": "",
      "isActive": false,
      "createdAt": "2026-02-20T11:30:00.000Z",
      "_count": {
        "assignments": 0
      }
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
};

export default function OfficersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">অফিসার ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium">কর্মকর্তাদের তালিকা ও তাদের বরাদ্দকৃত সম্পদের তথ্য</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/officers/add')}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all"
        >
          <MaterialIcon name="person_add" size={20} />
          নতুন অফিসার যোগ করুন
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant">
        <div className="relative w-full md:w-96">
          <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text"
            placeholder="নাম, পদবি বা ইমেইল দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:flex-none pl-4 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant focus:outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat">
            <option>সকল বিভাগ</option>
            <option>আইসিটি শাখা</option>
            <option>প্রশাসন শাখা</option>
          </select>
          <select className="flex-1 md:flex-none pl-4 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant focus:outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat">
            <option>সকল স্ট্যাটাস</option>
            <option>সক্রিয়</option>
            <option>নিষ্ক্রিয়</option>
          </select>
        </div>
      </div>

      {/* Officers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">কর্মকর্তার নাম</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">পদবি ও বিভাগ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">যোগাযোগ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">বরাদ্দকৃত সম্পদ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">অবস্থা</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {officersData.data.map((officer, index) => (
                <motion.tr 
                  key={officer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-xs font-black text-primary border border-primary/10 overflow-hidden">
                        {officer.photoUrl ? (
                          <img 
                            src={officer.photoUrl} 
                            alt={officer.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          getInitials(officer.name)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-sm">{officer.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">ID: #{officer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{officer.designation || 'পদবি নেই'}</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{officer.department || 'বিভাগ নেই'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                        <MaterialIcon name="phone" size={14} />
                        {officer.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                        <MaterialIcon name="mail" size={14} />
                        {officer.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-high text-sm font-black text-primary border border-outline-variant">
                      {officer._count.assignments}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset ${
                      officer.isActive ? 'bg-green-100 text-green-800 ring-green-600/20' : 'bg-surface-container-high text-on-surface-variant ring-outline-variant'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${officer.isActive ? 'bg-green-600' : 'bg-on-surface-variant/40'}`}></span>
                      {officer.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => navigate(`/officers/edit/${officer.id}`)}
                        className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors" 
                        title="এডিট"
                      >
                        <MaterialIcon name="edit" size={18} />
                      </button>
                      <button className="p-2 hover:bg-error/10 rounded-full text-error transition-colors" title="ডিলিট">
                        <MaterialIcon name="delete" size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant flex items-center justify-between">
          <p className="text-sm text-on-surface-variant font-medium">মোট {officersData.meta.total} জন কর্মকর্তা পাওয়া গেছে</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl border border-outline-variant hover:bg-surface transition-colors disabled:opacity-50" disabled={officersData.meta.page === 1}>
              <MaterialIcon name="chevron_left" size={20} />
            </button>
            <button 
              className="p-2 rounded-xl border border-outline-variant hover:bg-surface transition-colors disabled:opacity-50" 
              disabled={officersData.meta.page === officersData.meta.totalPages}
            >
              <MaterialIcon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
