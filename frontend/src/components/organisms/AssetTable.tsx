import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../atoms/Icons';
import { Badge } from '../atoms/Badge';
import { Pagination } from '../atoms/Pagination';
import { ConfirmDialog } from '../atoms/ConfirmDialog';
import { assetService, Asset } from '../../services/asset.service';
import { categoryService, Category } from '../../services/category.service';

export default function AssetTable() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Custom Confirmation Dialog State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; assetId: number | null }>({
    isOpen: false,
    assetId: null,
  });

  // For dropdown visibility
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  // To track if it's the first render
  const isFirstRender = useRef(true);

  const fetchAssets = useCallback(async (targetPage: number, query: string, catId: string, status: string) => {
    try {
      setLoading(true);
      const response = await assetService.getAll(targetPage, pageSize, query, catId, status);
      setAssets(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    init();
  }, []);

  // Handle Search/Filter Change with Debounce
  useEffect(() => {
    if (isFirstRender.current) {
        fetchAssets(page, searchQuery, selectedCategory, selectedStatus);
        isFirstRender.current = false;
        return;
    }

    const timer = setTimeout(() => {
        setPage(1); // Reset to first page
        fetchAssets(1, searchQuery, selectedCategory, selectedStatus);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Handle Page Change
  useEffect(() => {
    if (!isFirstRender.current) {
        fetchAssets(page, searchQuery, selectedCategory, selectedStatus);
    }
  }, [page]);

  const handleDeleteSuccess = async () => {
    if (confirmDelete.assetId) {
      try {
        await assetService.delete(confirmDelete.assetId);
        setConfirmDelete({ isOpen: false, assetId: null });
        fetchAssets(page, searchQuery, selectedCategory, selectedStatus);
      } catch (error) {
        console.error('Failed to delete asset:', error);
        alert('সম্পদটি ডিলিট করা সম্ভব হয়নি।');
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Available': return 'বরাদ্দযোগ্য';
      case 'Assigned': return 'বরাদ্দ';
      case 'UnderRepair': 
      case 'Under_Repair': return 'মেরামত';
      case 'Damaged': return 'ক্ষতিগ্রস্ত';
      case 'Scrapped': 
      case 'Disposed': return 'বাতিল';
      default: return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'primary';
      case 'Assigned': return 'success';
      case 'UnderRepair':
      case 'Under_Repair': return 'warning';
      case 'Damaged': 
      case 'Disposed': return 'error';
      default: return 'neutral';
    }
  };

  const statusOptions = [
    { value: 'Available', label: 'বরাদ্দযোগ্য' },
    { value: 'Assigned', label: 'বরাদ্দ' },
    { value: 'Under_Repair', label: 'মেরামত' },
    { value: 'Damaged', label: 'ক্ষতিগ্রস্ত' },
    { value: 'Disposed', label: 'বাতিল' },
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden flex flex-col shadow-sm w-full"
      >
        {/* Table Header with Search & Filters */}
        <div className="px-8 py-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between bg-surface-container-lowest gap-6">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${searchQuery ? 'text-primary' : 'text-on-surface-variant'}`}>
                <MaterialIcon name="search" size={20} />
              </div>
              <input 
                type="text"
                placeholder="ট্যাগ, ব্র্যান্ড বা সিরিয়াল নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-10 bg-surface-container-low border border-outline-variant rounded-2xl text-[14px] font-bold text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error transition-colors p-1">
                  <MaterialIcon name="cancel" size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 relative">
              {/* Category Filter */}
              <div className="relative">
                  <button 
                    onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowStatusMenu(false); }}
                    className={`h-12 px-6 flex items-center gap-6 bg-surface-container-low border rounded-2xl text-sm font-bold transition-all ${selectedCategory ? 'border-primary text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                      {selectedCategory ? categories.find(c => c.id.toString() === selectedCategory)?.name : 'সকল ক্যাটাগরি'}
                      <MaterialIcon name="expand_more" size={20} className="text-primary" />
                  </button>
                  <AnimatePresence>
                      {showCategoryMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                          >
                              <button 
                                onClick={() => { setSelectedCategory(''); setShowCategoryMenu(false); }}
                                className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-surface-container-high transition-colors"
                              >
                                  সকল ক্যাটাগরি
                              </button>
                              {categories.map(cat => (
                                  <button 
                                    key={cat.id}
                                    onClick={() => { setSelectedCategory(cat.id.toString()); setShowCategoryMenu(false); }}
                                    className={`w-full px-5 py-3 text-left text-sm font-bold hover:bg-surface-container-high transition-colors ${selectedCategory === cat.id.toString() ? 'text-primary bg-primary/5' : ''}`}
                                  >
                                      {cat.name}
                                  </button>
                              ))}
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

              {/* Status Filter */}
              <div className="relative">
                  <button 
                    onClick={() => { setShowStatusMenu(!showStatusMenu); setShowCategoryMenu(false); }}
                    className={`h-12 px-6 flex items-center gap-6 bg-surface-container-low border rounded-2xl text-sm font-bold transition-all ${selectedStatus ? 'border-primary text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                      {selectedStatus ? statusOptions.find(s => s.value === selectedStatus)?.label : 'সকল স্ট্যাটাস'}
                      <MaterialIcon name="expand_more" size={20} className="text-primary" />
                  </button>
                  <AnimatePresence>
                      {showStatusMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                          >
                              <button 
                                onClick={() => { setSelectedStatus(''); setShowStatusMenu(false); }}
                                className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-surface-container-high transition-colors"
                              >
                                  সকল স্ট্যাটাস
                              </button>
                              {statusOptions.map(opt => (
                                  <button 
                                    key={opt.value}
                                    onClick={() => { setSelectedStatus(opt.value); setShowStatusMenu(false); }}
                                    className={`w-full px-5 py-3 text-left text-sm font-bold hover:bg-surface-container-high transition-colors ${selectedStatus === opt.value ? 'text-primary bg-primary/5' : ''}`}
                                  >
                                      {opt.label}
                                  </button>
                              ))}
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-5 text-[12px] font-black text-on-surface-variant uppercase tracking-widest pl-10 border-r border-outline-variant/10">ডিভাইস ও ট্যাগ</th>
                <th className="px-6 py-5 text-[12px] font-black text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10">ক্যাটাগরি</th>
                <th className="px-6 py-5 text-[12px] font-black text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10">ক্রয় সংক্রান্ত</th>
                <th className="px-6 py-5 text-[12px] font-black text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10">কর্মকর্তা</th>
                <th className="px-6 py-5 text-[12px] font-black text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10">অবস্থা</th>
                <th className="px-8 py-5 text-[12px] font-black text-on-surface-variant uppercase tracking-widest text-right pr-10">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-[5px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                        <span className="text-[14px] font-bold text-primary animate-pulse tracking-tight uppercase">লোড হচ্ছে...</span>
                      </div>
                  </td>
                </tr>
              ) : assets.length > 0 ? (
                  assets.map((asset, idx) => {
                    const assignment = asset.assignments?.[0];
                    const officer = assignment?.officer;
                    
                    return (
                      <motion.tr 
                        key={asset.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => navigate(`/inventory/${asset.id}`)}
                        className="hover:bg-primary/[0.02] transition-colors group cursor-pointer relative"
                      >
                        <td className="px-8 py-6 pl-10">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 relative">
                              {asset.imageUrl || asset.initialImageUrl ? (
                                <img 
                                  src={asset.imageUrl || asset.initialImageUrl || ''} 
                                  alt={asset.model || ''} 
                                  className="w-full h-full object-cover" 
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://placehold.co/100x100/f3f4f6/6b7280?text=Error';
                                    target.onerror = null;
                                  }}
                                />
                              ) : (
                                <MaterialIcon name="devices" size={28} className="text-on-surface-variant/30" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface text-[16px] mb-1 group-hover:text-primary transition-colors leading-tight">
                                {asset.brand} {asset.model}
                              </div>
                              <div className="text-[12px] text-on-surface-variant font-mono tracking-tighter bg-surface-container-high px-2 py-0.5 rounded-md inline-block uppercase font-bold border border-outline-variant/30">
                                {asset.assetTag}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-primary text-center">
                          <span className="inline-flex px-4 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container text-[12px] font-black uppercase tracking-wider border border-on-secondary-container/10">
                            {asset.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                            <div className="font-bold text-on-surface text-[14px] mb-1">{asset.purchaseSource}</div>
                            <div className="text-[12px] text-on-surface-variant font-black opacity-60 flex items-center gap-1.5 leading-none">
                              <MaterialIcon name="calendar_today" size={14} />
                              {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString('en-GB') : 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-6 border-r border-outline-variant/10">
                          {officer ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-xs font-black text-primary uppercase shadow-sm border border-outline-variant/30 transition-transform group-hover:rotate-12">
                                {officer.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-on-surface leading-tight mb-0.5">{officer.name}</span>
                                <span className="text-[11px] text-on-surface-variant font-bold opacity-70 italic">{officer.designation || 'পদবি নেই'}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-on-surface-variant/40 italic text-[13px] font-bold py-2 bg-surface-container-low px-3 rounded-lg border border-dashed border-outline-variant/50">
                                <MaterialIcon name="person_off" size={16} />
                                বরাদ্দ নেই
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-6 text-center">
                          <Badge 
                            label={getStatusLabel(asset.status)} 
                            variant={getStatusVariant(asset.status)}
                          />
                        </td>
                        <td className="px-8 py-6 text-right pr-10">
                          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => navigate(`/inventory/edit/${asset.id}`)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded-full text-primary transition-colors" 
                              title="এডিট"
                            >
                              <MaterialIcon name="edit" size={18} />
                            </button>
                            <button 
                              onClick={() => setConfirmDelete({ isOpen: true, assetId: asset.id })}
                              className="w-8 h-8 flex items-center justify-center hover:bg-error/10 rounded-full text-error transition-colors" 
                              title="ডিলিট"
                            >
                              <MaterialIcon name="delete" size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-40 text-center text-on-surface-variant">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 border border-outline-variant/30">
                        <MaterialIcon name="search_off" size={48} className="opacity-20" />
                      </div>
                      <p className="font-black text-2xl opacity-30 tracking-tight leading-none mb-2">কোনো ফলাফল পাওয়া যায়নি</p>
                      <p className="text-on-surface-variant font-medium opacity-50 text-[16px]">সার্চ কোয়েরি পরিবর্তন করে আবার চেষ্টা করুন</p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={pageSize}
          onPageChange={setPage}
          label="সম্পদ"
        />
      </motion.div>

      {/* Modern Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={confirmDelete.isOpen}
        title="সম্পদ মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে আপনি এই সম্পদটি ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।"
        onConfirm={handleDeleteSuccess}
        onCancel={() => setConfirmDelete({ isOpen: false, assetId: null })}
        variant="error"
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        cancelLabel="না, থাক"
      />
    </>
  );
}
