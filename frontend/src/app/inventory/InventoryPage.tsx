import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/atoms/Icons';
import { Badge } from '../../components/atoms/Badge';
import { Pagination } from '../../components/atoms/Pagination';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedAssetId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // এখানে এপিআই কল হবে ডিলিট করার জন্য
    console.log('Deleting asset:', selectedAssetId);
    setIsDeleteDialogOpen(false);
    setSelectedAssetId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
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
        <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <MaterialIcon name="inventory_2" className="text-primary" size={20} />
            <h3 className="text-base md:text-lg font-bold text-on-surface">সম্পদ তালিকা</h3>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="flex-1 md:flex-none pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 md:py-2 bg-surface-container-low border border-outline-variant rounded-full text-[10px] md:text-xs font-bold text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] md:bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] md:bg-[right_0.75rem_center] bg-no-repeat">
              <option>সকল ক্যাটাগরি</option>
              <option>ল্যাপটপ</option>
              <option>প্রিন্টার</option>
              <option>নেটওয়ার্ক</option>
            </select>
            <select className="flex-1 md:flex-none pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 md:py-2 bg-surface-container-low border border-outline-variant rounded-full text-[10px] md:text-xs font-bold text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] md:bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] md:bg-[right_0.75rem_center] bg-no-repeat">
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
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">ডিভাইস ও ট্যাগ</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">ক্যাটাগরি</th>
                <th className="hidden lg:table-cell px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ক্রয় সংক্রান্ত</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">কর্মকর্তা</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">অবস্থা</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অ্যাকশন</th>
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
                  <td className="px-4 md:px-8 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant">
                        <img 
                          src={item.initialImageUrl || 'https://picsum.photos/seed/device/200/200'} 
                          alt={item.model} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-xs md:text-sm">{item.brand} {item.model}</div>
                        <div className="text-[9px] md:text-[11px] text-on-surface-variant font-mono">{item.assetTag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <Badge 
                      label={item.category?.name || 'N/A'} 
                      variant="secondary" 
                      showDot={false}
                    />
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{item.purchaseSource}</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{item.purchaseDate}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    {item.assignments.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-container flex items-center justify-center text-[8px] md:text-[10px] font-bold text-primary font-sans">
                          {item.assignments[0].officer.initials || item.assignments[0].officer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-bold text-on-surface">{item.assignments[0].officer.name}</span>
                          <span className="hidden md:block text-[11px] text-on-surface-variant font-medium">{item.assignments[0].officer.designation || 'পদবি নেই'}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs md:text-sm text-on-surface-variant/50 italic">বরাদ্দ নেই</span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <Badge 
                      label={item.status === 'Assigned' ? 'বরাদ্দ' : item.status === 'Available' ? 'উপলব্ধ' : 'মেরামত'} 
                      variant={
                        item.status === 'Assigned' ? 'success' : 
                        item.status === 'Available' ? 'primary' : 'error'
                      }
                    />
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-4 text-right">
                    <div className="flex justify-end gap-0.5 md:gap-1" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => navigate(`/inventory/edit/${item.id}`)}
                        className="p-1.5 md:p-2 hover:bg-primary/10 rounded-full text-primary transition-colors" 
                        title="এডিট"
                      >
                        <MaterialIcon name="edit" size={16} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, item.id)}
                        className="p-1.5 md:p-2 hover:bg-error/10 rounded-full text-error transition-colors" 
                        title="ডিলিট"
                      >
                        <MaterialIcon name="delete" size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={1}
          totalPages={1}
          totalItems={inventoryData.length}
          itemsPerPage={10}
          onPageChange={() => {}}
          label="এসেট"
        />
      </motion.div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="সম্পদ মুছে ফেলতে চান?"
        message="আপনি কি নিশ্চিত যে এই সম্পদটি ইনভেন্টরি থেকে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।"
        confirmLabel="হ্যাঁ, ডিলেট করুন"
        cancelLabel="না, থাক"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
