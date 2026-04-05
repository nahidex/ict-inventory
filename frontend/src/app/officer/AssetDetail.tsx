import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MaterialIcon } from "../../components/atoms/Icons";
import { Badge } from "../../components/atoms/Badge";
import { assetService, Asset } from "../../services/asset.service";
import Avatar from "../../components/atoms/Avatar";
import config from "../../utils/config";

export default function OfficerAssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await assetService.getById(id);
        setAsset(data);
      } catch (error) {
        console.error("Failed to fetch asset details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  const getFullUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${config.apiUrl}/${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest gap-4">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <span className="text-sm font-black text-primary uppercase tracking-widest">
          লোড হচ্ছে...
        </span>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest p-6">
        <MaterialIcon name="error" size={64} className="text-error mb-4" />
        <h2 className="text-2xl font-black text-on-surface mb-2">
          সম্পদ খুঁজে পাওয়া যায়নি
        </h2>
        <button
          onClick={() => navigate("/officer/dashboard")}
          className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold"
        >
          ড্যাশবোর্ডে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest font-sans">
      {/* Dynamic Top Bar */}
      <nav className="sticky top-0 z-50 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/officer/dashboard")}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-all group"
          >
            <MaterialIcon
              name="arrow_back"
              size={24}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>

          <div className="flex-1 px-4 text-center md:text-left">
            <h1 className="text-lg font-black text-on-surface truncate tracking-tight">
              {asset.name || `${asset.brand} ${asset.model}`}
            </h1>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              সম্পদ বিস্তারিত
            </p>
          </div>

          <Badge label="Active" variant="success" showDot />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image Gallery Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 aspect-square rounded-[3rem] bg-surface-container-high border border-outline-variant overflow-hidden relative shadow-inner group"
          >
            {asset.photoUrl ? (
              <img
                src={getFullUrl(asset.photoUrl)}
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/20">
                <MaterialIcon name="devices" size={120} />
                <span className="text-xs font-black uppercase tracking-[0.2em] mt-4">
                  No Image Available
                </span>
              </div>
            )}
            <div className="absolute top-6 left-6">
              <div className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white">
                <MaterialIcon
                  name={asset.category?.icon || "devices"}
                  size={24}
                />
              </div>
            </div>
          </motion.div>

          {/* Core Info Side */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-flex px-4 py-1.5 bg-primary-container text-primary rounded-full text-[11px] font-black uppercase tracking-widest mb-4">
                {asset.category?.name || "Uncategorized"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-tight mb-4">
                {asset.name}
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-2xl border border-outline-variant">
                  <MaterialIcon
                    name="qr_code_2"
                    size={20}
                    className="text-secondary"
                  />
                  <span className="text-sm font-black text-on-surface-variant">
                    Tag: {asset.tagNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-2xl border border-outline-variant">
                  <MaterialIcon
                    name="fingerprint"
                    size={20}
                    className="text-tertiary"
                  />
                  <span className="text-sm font-black text-on-surface-variant">
                    SN: {asset.serialNumber || "N/A"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-surface-container-low border border-outline-variant rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <MaterialIcon name="description" size={16} />
                বিবরণ ও অবস্থা
              </h3>
              <p className="text-on-surface-variant font-medium leading-relaxed italic">
                উক্ত {asset.category?.name || "ডিভাইসটি"} বর্তমানে আপনার নামে
                ইস্যু করা হয়েছে। কোনো কারিগরি ত্রুটি বা সাপোর্টের প্রয়োজনে
                মেইনটেন্যান্স রিকোয়েস্ট করুন।
              </p>
            </motion.div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-container-low border border-outline-variant p-8 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-secondary-container text-secondary rounded-2xl flex items-center justify-center">
                <MaterialIcon name="settings_system_daydream" size={24} />
              </div>
              <h3 className="text-xl font-black text-on-surface tracking-tight">
                টেকনিক্যাল স্পেসিফিকেশন
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/30">
                <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  ব্র্যান্ড
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {asset.brand || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/30">
                <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  মডেল
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {asset.model || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/30">
                <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  লোকেশন
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {asset.locationDetails || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  সরবরাহকারী (Source)
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {asset.purchaseSource || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Support & Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-container-low border border-outline-variant p-8 rounded-[2.5rem] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-error-container text-error rounded-2xl flex items-center justify-center">
                  <MaterialIcon name="support_agent" size={24} />
                </div>
                <h3 className="text-xl font-black text-on-surface tracking-tight">
                  সাহায্য ও সাপোর্ট
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-6">
                অ্যাসেটটি হারিয়ে গেলে বা চুরি হলে অবিলম্বে বিষয়টি সংশ্লিষ্ট
                দপ্তরকে অবহিত করুন। কোনো হার্ডওয়্যার সমস্যার ক্ষেত্রে নিচের
                বাটনে ক্লিক করে রিকোয়েস্ট পাঠান।
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button className="w-full py-4 bg-primary text-on-primary rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
                <MaterialIcon name="build" size={20} />
                মেইনটেন্যান্স রিকোয়েস্ট পাঠান
              </button>
              <button className="w-full py-4 bg-surface-container-highest text-on-surface border border-outline-variant rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                <MaterialIcon name="help" size={20} />
                অ্যাডমিনের সাথে কথা বলুন
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Small Decorative Footer */}
      <footer className="mt-10 py-12 text-center">
        <div className="w-12 h-1 bg-outline-variant mx-auto rounded-full opacity-30" />
      </footer>
    </div>
  );
}
