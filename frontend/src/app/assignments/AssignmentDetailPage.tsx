import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { assignmentService } from '../../services/assignment.service';

export default function AssignmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await assignmentService.getById(id);
        setAssignment(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching assignment details:', err);
        setError('বরাদ্দ তথ্য লোড করা সম্ভব হয়নি।');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant font-medium font-sans">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="text-center py-20">
        <div className="text-error font-bold mb-4">{error || 'বরাদ্দ তথ্য পাওয়া যায়নি!'}</div>
        <button onClick={() => navigate('/assignments')} className="btn btn-primary">ফিরে যান</button>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/assignments')}
            className="w-12 h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
          >
            <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
          </motion.button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-primary tracking-tight font-sans">বরাদ্দ বিস্তারিত</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                !assignment.actualReturnDate 
                  ? 'bg-amber-100 text-amber-800 ring-amber-600/20' 
                  : 'bg-green-100 text-green-800 ring-green-600/20'
              }`}>
                {!assignment.actualReturnDate ? 'ইস্যুকৃত' : 'ফেরতকৃত'}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">ট্র্যাকিং আইডি: #{assignment.id}</p>
          </div>
        </div>
        
        {!assignment.actualReturnDate && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/assignments/return/${assignment.id}`)}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all"
          >
            <MaterialIcon name="assignment_return" size={20} />
            এসেট ফেরত নিন
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Asset & Officer Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Asset Info Card */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <MaterialIcon name="devices" className="text-primary" size={20} />
              <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">এসেট তথ্য</h2>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant flex-shrink-0">
                {assignment.asset.initialImageUrl ? (
                  <img src={assignment.asset.initialImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <MaterialIcon name="image" size={48} />
                  </div>
                )}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <DetailItem label="এসেট ট্যাগ" value={assignment.asset.assetTag} isBold />
                <DetailItem label="সিরিয়াল নম্বর" value={assignment.asset.serialNumber} />
                <DetailItem label="ব্র্যান্ড ও মডেল" value={`${assignment.asset.brand} ${assignment.asset.model}`} />
                <DetailItem label="ক্রয়ের উৎস" value={assignment.asset.purchaseSource} />
                <DetailItem label="বর্তমান অবস্থা" value={assignment.asset.status} />
              </div>
            </div>
          </div>

          {/* Officer Info Card */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <MaterialIcon name="person" className="text-primary" size={20} />
              <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">অফিসার তথ্য</h2>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 rounded-2xl bg-primary-container overflow-hidden border border-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-black text-2xl">
                {assignment.officer.photoUrl ? (
                  <img src={assignment.officer.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  assignment.officer.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <DetailItem label="নাম" value={assignment.officer.name} isBold />
                <DetailItem label="পদবি" value={assignment.officer.designation} />
                <DetailItem label="বিভাগ/শাখা" value={assignment.officer.department} />
                <DetailItem label="ফোন নম্বর" value={assignment.officer.phone} />
                <DetailItem label="ইমেইল" value={assignment.officer.email} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assignment Timeline & Actions */}
        <div className="space-y-8">
          {/* Timeline Card */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <MaterialIcon name="history" className="text-primary" size={20} />
              <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">বরাদ্দ টাইমলাইন</h2>
            </div>
            <div className="p-6 space-y-6">
              <TimelineItem 
                icon="outbox" 
                title="ইস্যু করা হয়েছে" 
                date={formatDate(assignment.issueDate)} 
                subtext={`ইস্যু করেছেন: ${assignment.issuedBy}`}
                isLast={!assignment.actualReturnDate}
              />
              {assignment.actualReturnDate && (
                <TimelineItem 
                  icon="inbox" 
                  title="ফেরত পাওয়া গেছে" 
                  date={formatDate(assignment.actualReturnDate)} 
                  subtext={`অবস্থা: ${assignment.returnCondition}`}
                  isLast={true}
                  isSuccess
                />
              )}
            </div>
          </div>

          {/* Comments Card */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <MaterialIcon name="comment" className="text-primary" size={20} />
              <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">মন্তব্য</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-on-surface-variant font-medium italic leading-relaxed">
                {assignment.comments || "কোনো মন্তব্য নেই।"}
              </p>
            </div>
          </div>

          {/* Return Image if exists */}
          {assignment.returnImageUrl && (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
                <MaterialIcon name="photo_library" className="text-primary" size={20} />
                <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">রিটার্ন ফটো</h2>
              </div>
              <div className="p-4">
                <img src={assignment.returnImageUrl} alt="Return condition" className="w-full rounded-2xl border border-outline-variant" referrerPolicy="no-referrer" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, isBold = false }: { label: string, value: string | null, isBold?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className={`text-sm ${isBold ? 'font-black text-primary' : 'font-medium text-on-surface'}`}>{value || '---'}</p>
    </div>
  );
}

function TimelineItem({ icon, title, date, subtext, isLast = false, isSuccess = false }: { icon: string, title: string, date: string, subtext: string, isLast?: boolean, isSuccess?: boolean }) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-outline-variant"></div>
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-primary-container text-primary'}`}>
        <MaterialIcon name={icon} size={20} />
      </div>
      <div className="space-y-1 pb-2">
        <p className="text-sm font-bold text-on-surface">{title}</p>
        <p className="text-xs font-black text-primary/80">{date}</p>
        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{subtext}</p>
      </div>
    </div>
  );
}
