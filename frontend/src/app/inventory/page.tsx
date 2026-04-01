import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/atoms/Icons';

const inventoryData = [
  {
    id: 95,
    categoryId: null,
    assetTag: "LOG-TEST-001",
    brand: "LogTest",
    model: "X1",
    serialNumber: "SN-99283-X",
    purchaseDate: "2024-01-15",
    purchaseSource: "Budget",
    initialImageUrl: "https://picsum.photos/seed/laptop/200/200",
    status: "Assigned",
    category: { name: "Laptop" },
    assignments: [
      {
        id: 27,
        officer: {
          name: "Officer For Log",
          designation: "সিনিয়র সিস্টেম অ্যানালিস্ট",
          initials: "OL"
        }
      }
    ]
  },
  {
    id: 96,
    categoryId: null,
    assetTag: "PRN-OFF-042",
    brand: "HP",
    model: "LaserJet Pro",
    serialNumber: "HP-8821-P",
    purchaseDate: "2023-11-20",
    purchaseSource: "Project",
    initialImageUrl: "https://picsum.photos/seed/printer/200/200",
    status: "Available",
    category: { name: "Printer" },
    assignments: []
  },
  {
    id: 97,
    categoryId: null,
    assetTag: "MON-DESK-118",
    brand: "Dell",
    model: "UltraSharp 27",
    serialNumber: "DELL-7712-M",
    purchaseDate: "2023-08-10",
    purchaseSource: "Budget",
    initialImageUrl: "https://picsum.photos/seed/monitor/200/200",
    status: "In Repair",
    category: { name: "Monitor" },
    assignments: [
      {
        id: 28,
        officer: {
          name: "Sultana Razia",
          designation: "প্রোগ্রামার",
          initials: "SR"
        }
      }
    ]
  }
];

export default function InventoryPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">ইনভেন্টরি ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium">সকল অফিস সম্পদের তালিকা ও অবস্থা</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/inventory/add')}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all"
        >
          <MaterialIcon name="add" size={20} />
          নতুন এসেট যোগ করুন
        </motion.button>
      </div>

      {/* Inventory Table Container */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden flex flex-col h-fit"
      >
        <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <MaterialIcon name="inventory_2" className="text-primary" size={24} />
            <h3 className="text-lg font-bold text-on-surface">সম্পদ তালিকা</h3>
          </div>
          <div className="flex gap-3">
            <select className="pl-4 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat">
              <option>সকল ক্যাটাগরি</option>
              <option>ল্যাপটপ</option>
              <option>প্রিন্টার</option>
              <option>নেটওয়ার্ক</option>
            </select>
            <select className="pl-4 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat">
              <option>সকল স্ট্যাটাস</option>
              <option>বরাদ্দকৃত</option>
              <option>উপলব্ধ</option>
              <option>মেরামতে</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ডিভাইস ও ট্যাগ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ক্যাটাগরি</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ক্রয় সংক্রান্ত</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">কর্মকর্তা ও পদবি</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">অবস্থা</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {inventoryData.map((item, index) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() => navigate(`/inventory/${item.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant">
                        <img 
                          src={item.initialImageUrl || 'https://picsum.photos/seed/device/200/200'} 
                          alt={item.model} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-sm">{item.brand} {item.model}</div>
                        <div className="text-[11px] text-on-surface-variant font-mono">{item.assetTag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                      {item.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{item.purchaseSource}</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{item.purchaseDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.assignments.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-primary font-sans">
                          {item.assignments[0].officer.initials || item.assignments[0].officer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface">{item.assignments[0].officer.name}</span>
                          <span className="text-[11px] text-on-surface-variant font-medium">{item.assignments[0].officer.designation || 'পদবি নেই'}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-on-surface-variant/50 italic">বরাদ্দ নেই</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${
                      item.status === 'Assigned' ? 'bg-green-100 text-green-800 ring-green-600/20' :
                      item.status === 'Available' ? 'bg-blue-100 text-blue-800 ring-blue-600/20' :
                      'bg-error-container text-on-error-container ring-error/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Assigned' ? 'bg-green-600' :
                        item.status === 'Available' ? 'bg-blue-600' :
                        'bg-error'
                      }`}></span>
                      {item.status === 'Assigned' ? 'বরাদ্দকৃত' : item.status === 'Available' ? 'উপলব্ধ' : 'মেরামতে'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors" title="এডিট">
                        <MaterialIcon name="edit" size={18} />
                      </button>
                      <button className="p-2 hover:bg-error/10 rounded-full text-error transition-colors" title="ডিলিট">
                        <MaterialIcon name="delete" size={18} />
                      </button>
                      <button className="p-2 hover:bg-surface-container-highest rounded-full text-on-surface-variant transition-colors">
                        <MaterialIcon name="more_vert" size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant flex items-center justify-between">
          <p className="text-sm text-on-surface-variant font-medium">মোট {inventoryData.length} টি সম্পদ পাওয়া গেছে</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl border border-outline-variant hover:bg-surface transition-colors disabled:opacity-50" disabled>
              <MaterialIcon name="chevron_left" size={20} />
            </button>
            <button className="p-2 rounded-xl border border-outline-variant hover:bg-surface transition-colors">
              <MaterialIcon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
