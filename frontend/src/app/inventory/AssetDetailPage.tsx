import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

// Mock data for the specific asset (matching the structure provided)
const assetDetail = {
  id: 99,
  assetTag: "LOG-TEST-001",
  brand: "LogTest",
  model: "X1",
  serialNumber: "SN-99283-X",
  purchaseDate: "2024-01-15",
  purchaseSource: "Budget",
  initialImageUrl: "https://picsum.photos/seed/laptop/400/400",
  status: "Assigned",
  category: { name: "Laptop" },
  description: "High-performance laptop for development work.",
  specifications: [
    { label: "Processor", value: "Intel Core i7" },
    { label: "RAM", value: "16GB DDR4" },
    { label: "Storage", value: "512GB SSD" },
    { label: "Display", value: "14-inch Full HD" },
  ],
  currentOfficer: {
    name: "Recipient Officer",
    designation: "সিনিয়র সিস্টেম অ্যানালিস্ট",
    department: "ICT Division",
    phone: "+880 1712-345678",
    email: "officer@example.gov.bd",
    initials: "RO"
  }
};

const timelineData = [
  {
    id: 42,
    assetId: 99,
    actionType: "RETURN",
    description: "Asset returned. Condition: Good condition",
    performedAt: "2026-04-01T08:21:22.241Z",
    performedBy: "Admin User"
  },
  {
    id: 41,
    assetId: 99,
    actionType: "ASSIGNMENT",
    description: "Asset assigned to officer Recipient Officer",
    performedAt: "2026-04-01T08:21:22.222Z",
    performedBy: "Admin User"
  },
  {
    id: 40,
    assetId: 99,
    actionType: "REGISTRATION",
    description: "Asset registered in the system",
    performedAt: "2026-03-15T10:00:00.000Z",
    performedBy: "System Admin"
  }
];

export default function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Back Button and Title */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/inventory')}
          className="w-12 h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
        >
          <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">সম্পদ বিস্তারিত</h1>
          <p className="text-sm text-on-surface-variant font-medium">সম্পদ আইডি: {assetDetail.assetTag}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Asset Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="w-full md:w-64 h-64 rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant flex-shrink-0">
                  <img 
                    src={assetDetail.initialImageUrl} 
                    alt={assetDetail.model} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Basic Info Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
                        {assetDetail.category.name}
                      </span>
                      <h2 className="text-3xl font-black text-on-surface mt-2">{assetDetail.brand} {assetDetail.model}</h2>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold ring-1 ring-inset ${
                      assetDetail.status === 'Assigned' ? 'bg-green-100 text-green-800 ring-green-600/20' :
                      assetDetail.status === 'Available' ? 'bg-blue-100 text-blue-800 ring-blue-600/20' :
                      'bg-error-container text-on-error-container ring-error/20'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        assetDetail.status === 'Assigned' ? 'bg-green-600' :
                        assetDetail.status === 'Available' ? 'bg-blue-600' :
                        'bg-error'
                      }`}></span>
                      {assetDetail.status === 'Assigned' ? 'বরাদ্দকৃত' : assetDetail.status === 'Available' ? 'উপলব্ধ' : 'মেরামতে'}
                    </span>
                  </div>

                  <p className="text-on-surface-variant font-medium leading-relaxed">
                    {assetDetail.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">সিরিয়াল নম্বর</p>
                      <p className="font-mono font-bold text-primary">{assetDetail.serialNumber}</p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">ক্রয়ের উৎস</p>
                      <p className="font-bold text-on-surface">{assetDetail.purchaseSource}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Specifications Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-8"
          >
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <MaterialIcon name="settings_input_component" className="text-primary" size={20} />
              টেকনিক্যাল স্পেসিফিকেশন
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assetDetail.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <span className="text-sm font-medium text-on-surface-variant">{spec.label}</span>
                  <span className="text-sm font-bold text-on-surface">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Current Officer Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-8"
          >
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <MaterialIcon name="person" className="text-primary" size={20} />
              বর্তমান ব্যবহারকারী
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-2xl font-black text-primary shadow-inner">
                {assetDetail.currentOfficer.initials}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">নাম</p>
                  <p className="font-bold text-on-surface">{assetDetail.currentOfficer.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">পদবি</p>
                  <p className="font-bold text-on-surface">{assetDetail.currentOfficer.designation}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">বিভাগ</p>
                  <p className="font-bold text-on-surface">{assetDetail.currentOfficer.department}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">ইমেইল</p>
                  <p className="font-bold text-on-surface">{assetDetail.currentOfficer.email}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Timeline */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-8 h-full"
          >
            <h3 className="text-lg font-bold text-on-surface mb-8 flex items-center gap-2">
              <MaterialIcon name="history" className="text-primary" size={20} />
              অ্যাসেট টাইমলাইন
            </h3>
            
            <div className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
              {timelineData.map((event, i) => (
                <div key={event.id} className="relative pl-10">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm ${
                    event.actionType === 'ASSIGNMENT' ? 'bg-primary text-on-primary' :
                    event.actionType === 'RETURN' ? 'bg-secondary text-on-secondary' :
                    'bg-tertiary text-on-tertiary'
                  }`}>
                    <MaterialIcon name={
                      event.actionType === 'ASSIGNMENT' ? 'person_add' :
                      event.actionType === 'RETURN' ? 'assignment_return' : 'app_registration'
                    } size={16} />
                  </div>
                  
                  {/* Event Content */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black text-on-surface leading-none">
                        {event.actionType === 'ASSIGNMENT' ? 'বরাদ্দ প্রদান' : 
                         event.actionType === 'RETURN' ? 'ফেরত গ্রহণ' : 'নিবন্ধন সম্পন্ন'}
                      </p>
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
                        {new Date(event.performedAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-1 pt-1">
                      <MaterialIcon name="person_outline" size={12} className="text-on-surface-variant" />
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        By: {event.performedBy}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
