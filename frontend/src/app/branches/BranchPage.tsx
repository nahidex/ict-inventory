import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { branchService } from '../../services/branch.service';
import { Badge } from '../../components/atoms/Badge';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';

export interface Branch {
  id: string;
  name: string;
  code: string;
  location?: string;
  room_number?: string;
  status: 'Active' | 'Inactive';
  _count?: {
    assets: number;
    officers: number;
  };
}

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const [currentBranch, setCurrentBranch] = useState<Partial<Branch> | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '', 
    location: '', 
    room_number: '', 
    status: 'Active' as 'Active' | 'Inactive'
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
          setBranchToDelete(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isDeleteModalOpen]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setCurrentBranch(branch);
      setFormData({ 
        name: branch.name, 
        code: branch.code, 
        location: branch.location || '',
        room_number: branch.room_number || '',
        status: branch.status
      });
    } else {
      setCurrentBranch(null);
      setFormData({ 
        name: '', 
        code: '', 
        location: '', 
        room_number: '', 
        status: 'Active' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentBranch?.id) {
        await branchService.update(currentBranch.id, formData);
      } else {
        await branchService.create(formData);
      }
      setIsModalOpen(false);
      fetchBranches();
    } catch (error) {
      console.error('Failed to save branch:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setBranchToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!branchToDelete) return;
    try {
      await branchService.delete(branchToDelete);
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
      fetchBranches();
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans text-left">ব্রাঞ্চ ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium text-left">অফিসের সকল শাখা বা ব্রাঞ্চের তালিকা</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all self-start"
        >
          <MaterialIcon name="add" size={20} />
          নতুন ব্রাঞ্চ যোগ করুন
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-outline-variant">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <MaterialIcon name="domain" size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-left">মোট ব্রাঞ্চ</p>
              <h3 className="text-2xl font-black text-on-surface leading-none text-left">{branches.length}টি</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-48 rounded-3xl border border-outline-variant animate-pulse" />
          ))
        ) : branches.map((branch) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white p-6 rounded-[28px] border border-outline-variant hover:border-primary/50 transition-all shadow-sm hover:shadow-xl text-left"
          >
            <div className="flex justify-between items-start mb-4 text-left">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <MaterialIcon name="location_on" size={24} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(branch)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-all"
                >
                  <MaterialIcon name="edit" size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(branch.id)}
                  className="w-8 h-8 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error flex items-center justify-center transition-all"
                >
                  <MaterialIcon name="delete" size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-on-surface mb-1 group-hover:text-primary transition-colors text-left">{branch.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant font-mono">{branch.code}</span>
              <Badge 
                label={branch.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} 
                variant={branch.status === 'Active' ? 'success' : 'error'} 
              />
            </div>
            
            <div className="space-y-2 mb-4 bg-surface-container-high/30 p-3 rounded-2xl">
              {branch.location && (
                <div className="flex items-center gap-2 text-on-surface-variant/70">
                  <MaterialIcon name="place" size={16} />
                  <span className="text-xs font-medium">{branch.location}</span>
                </div>
              )}
              {branch.room_number && (
                <div className="flex items-center gap-2 text-on-surface-variant/70">
                  <MaterialIcon name="meeting_room" size={16} />
                  <span className="text-xs font-medium">রুম: {branch.room_number}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/50 text-left">
              <div className="flex items-center gap-1.5 text-left">
                <MaterialIcon name="inventory_2" size={16} className="text-primary" />
                <span className="text-xs font-black text-left">{branch._count?.assets || 0} Assets</span>
              </div>
              <div className="flex items-center gap-1.5 text-left">
                <MaterialIcon name="people" size={16} className="text-tertiary" />
                <span className="text-xs font-black text-left">{branch._count?.officers || 0} Officers</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] border border-outline-variant p-8 shadow-2xl text-left"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-7 w-10 h-10 rounded-full hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-all z-10"
              >
                <MaterialIcon name="close" size={24} />
              </button>

              <h2 className="text-2xl font-black text-on-surface mb-2 font-sans text-left pr-8">
                {currentBranch ? 'ব্রাঞ্চ আপডেট করুন' : 'নতুন ব্রাঞ্চ যোগ করুন'}
              </h2>
              <p className="text-sm text-on-surface-variant font-medium mb-8 text-left">সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন</p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 text-left">ব্রাঞ্চ নাম</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                      placeholder="সল্টলেক ব্রাঞ্চ"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 text-left">ব্রাঞ্চ কোড</label>
                    <input 
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                      placeholder="SL-001"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 text-left">ঠিকানা / লোকেশন</label>
                  <input 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                    placeholder="সেক্টর ৫, সল্টলেক"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 text-left">রুম নম্বর</label>
                  <input 
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                    placeholder="২০৫"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-container-high/20 rounded-2xl border border-outline-variant">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1 text-left block">পাবলিশ স্ট্যাটাস</label>
                    <p className="text-xs font-bold text-on-surface-variant/70">ব্রাঞ্চটি সিস্টেমে সক্রিয় থাকবে কি না</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active' })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                      formData.status === 'Active' ? 'bg-primary' : 'bg-outline'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        formData.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-3 pt-4 text-left">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-surface-container-high text-on-surface font-bold py-4 rounded-2xl transition-all hover:bg-outline-variant"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-on-primary font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                  >
                    {currentBranch ? 'আপডেট' : 'যোগ করুন'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="ব্রাঞ্চ মুছে ফেলতে চান?"
        message="আপনি কি নিশ্চিত যে এই ব্রাঞ্চটি ডিলিট করতে চান? এই অ্যাকশনটি আর ফিরিয়ে আনা যাবে না।"
        confirmLabel="হ্যাঁ, ডিলেট করুন"
        cancelLabel="না, থাক"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setBranchToDelete(null);
        }}
      />
    </div>
  );
}
