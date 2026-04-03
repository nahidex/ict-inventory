import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

const mockAssignments = [
  {
    "id": 30,
    "assetId": 100,
    "officerId": 50,
    "issueDate": "2026-04-01T00:00:00.000Z",
    "actualReturnDate": null,
    "returnCondition": null,
    "returnImageUrl": null,
    "comments": null,
    "issuedBy": "Admin",
    "asset": {
      "id": 100,
      "categoryId": 72,
      "assetTag": "OFF-DEL-01",
      "brand": "Dell",
      "model": "Latitude 5420",
      "serialNumber": "SN-12345",
      "purchaseDate": "2025-01-10",
      "purchaseSource": "Budget",
      "initialImageUrl": null,
      "status": "Assigned"
    },
    "officer": {
      "id": 50,
      "name": "Assigned Officer",
      "designation": "সিস্টেম অ্যানালিস্ট",
      "department": "আইসিটি শাখা",
      "phone": "01712345678",
      "email": "officer@example.gov.bd",
      "photoUrl": null,
      "isActive": true,
      "createdAt": "2026-04-01T09:40:20.731Z"
    }
  },
  {
    "id": 31,
    "assetId": 101,
    "officerId": 51,
    "issueDate": "2026-03-15T00:00:00.000Z",
    "actualReturnDate": "2026-03-25T10:00:00.000Z",
    "returnCondition": "Good",
    "returnImageUrl": null,
    "comments": "Returned on time",
    "issuedBy": "Admin",
    "asset": {
      "id": 101,
      "categoryId": 72,
      "assetTag": "PRN-HP-05",
      "brand": "HP",
      "model": "LaserJet Pro",
      "serialNumber": "SN-67890",
      "purchaseDate": "2024-11-05",
      "purchaseSource": "Project",
      "initialImageUrl": null,
      "status": "Available"
    },
    "officer": {
      "id": 51,
      "name": "Sultana Razia",
      "designation": "প্রোগ্রামার",
      "department": "প্রশাসন শাখা",
      "phone": "01812345679",
      "email": "razia@example.gov.bd",
      "photoUrl": "https://picsum.photos/seed/officer2/100/100",
      "isActive": true,
      "createdAt": "2026-03-10T09:00:00.000Z"
    }
  }
];

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">ইস্যু ও রিটার্ন ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium">সম্পদ বরাদ্দ এবং ফেরত প্রদানের বিস্তারিত তালিকা</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all"
          >
            <MaterialIcon name="add_task" size={20} />
            নতুন ইস্যু করুন
          </motion.button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant">
        <div className="relative w-full md:w-96">
          <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text"
            placeholder="এসেট ট্যাগ বা অফিসারের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:flex-none pl-4 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant focus:outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat">
            <option>সকল স্ট্যাটাস</option>
            <option>ইস্যুকৃত (Issued)</option>
            <option>ফেরতকৃত (Returned)</option>
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">এসেট তথ্য</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">অফিসার</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">ইস্যুর তারিখ</th>
                <th className="hidden lg:table-cell px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">রিটার্ন তারিখ</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">অবস্থা</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {mockAssignments.map((item, index) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/assignments/${item.id}`)}
                >
                  <td className="px-4 md:px-8 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                        <MaterialIcon name="devices" size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-xs md:text-sm">{item.asset.assetTag}</div>
                        <div className="text-[9px] md:text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                          {item.asset.brand} {item.asset.model}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-container flex items-center justify-center text-[8px] md:text-[10px] font-black text-primary border border-primary/10 overflow-hidden">
                        {item.officer.photoUrl ? (
                          <img src={item.officer.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          getInitials(item.officer.name)
                        )}
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-bold text-on-surface">{item.officer.name}</div>
                        <div className="hidden md:block text-[10px] text-on-surface-variant font-medium">{item.officer.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="text-xs md:text-sm font-medium text-on-surface">{formatDate(item.issueDate)}</div>
                    <div className="hidden md:block text-[10px] text-on-surface-variant uppercase tracking-wider">ইস্যু করেছেন: {item.issuedBy || 'N/A'}</div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <div className="text-sm font-medium text-on-surface">{formatDate(item.actualReturnDate)}</div>
                    {item.returnCondition && (
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">অবস্থা: {item.returnCondition}</div>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-bold ring-1 ring-inset ${
                      !item.actualReturnDate 
                        ? 'bg-amber-100 text-amber-800 ring-amber-600/20' 
                        : 'bg-green-100 text-green-800 ring-green-600/20'
                    }`}>
                      <span className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${!item.actualReturnDate ? 'bg-amber-600' : 'bg-green-600'}`}></span>
                      {!item.actualReturnDate ? 'ইস্যুকৃত' : 'ফেরতকৃত'}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-4 text-right">
                    {!item.actualReturnDate ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/assignments/return/${item.id}`);
                        }}
                        className="text-[10px] md:text-xs font-bold text-primary hover:bg-primary/10 px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-colors flex items-center gap-1 ml-auto"
                      >
                        <MaterialIcon name="assignment_return" size={14} />
                        ফেরত
                      </button>
                    ) : (
                      <button className="p-1.5 md:p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors" title="বিস্তারিত">
                        <MaterialIcon name="visibility" size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
