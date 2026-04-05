import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MaterialIcon } from "../../components/atoms/Icons";
import { authService } from "../../services/auth.service";
import { officerService } from "../../services/officer.service";
import Avatar from "../../components/atoms/Avatar";
import { Badge } from "../../components/atoms/Badge";
import StatCard from "../../components/molecules/StatCard";
import config from "../../utils/config";

export default function OfficerDashboard() {
  const [officerInfo, setOfficerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = authService.getUser();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        // Need to find the officer associated with this user
        // We'll update getProfile in auth logic or user controller to include officer info
        const response: any = await officerService.getProfile();
        setOfficerInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch officer profile");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficerData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getFullUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${config.apiUrl}/${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest font-sans selection:bg-primary/20">
      {/* Material 3 Top App Bar */}
      <nav className="sticky top-0 z-50 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container text-primary rounded-[1.5rem] flex items-center justify-center shadow-sm">
              <MaterialIcon name="inventory" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-on-surface tracking-tight leading-tight">
                অ্যাসেট পোর্টাল
              </h1>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                অভ্যন্তরীণ ব্যবহারের জন্য
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              src={officerInfo?.photoUrl}
              name={user?.name || "User"}
              size="lg"
              className="border-2 border-primary/10 shadow-lg"
            />

            <div className="hidden md:flex flex-col items-start px-2">
              <span className="text-sm font-black text-on-surface leading-tight">
                {user?.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-primary bg-primary-container px-2 py-0.5 rounded-md uppercase tracking-tighter">
                  {officerInfo?.designation || "Officer"}
                </span>
                <span className="w-1 h-1 bg-outline rounded-full" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  {officerInfo?.branch?.name || "Main Branch"}
                </span>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-outline-variant mx-2 hidden md:block" />

            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-error-container text-on-error-container hover:bg-error hover:text-on-error rounded-[1.25rem] transition-all flex items-center justify-center group"
              title="Logout"
            >
              <MaterialIcon
                name="logout"
                size={22}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Welcome Header */}
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-stretch justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge label="সক্রিয় প্রোফাইল" variant="success" showDot />
              </div>
              <h2 className="text-4xl font-black text-on-surface tracking-tight mb-2">
                স্বাগতম, {user?.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
                  <MaterialIcon
                    name="badge"
                    size={14}
                    className="text-primary"
                  />
                  <span className="text-xs font-bold text-on-surface-variant">
                    {officerInfo?.designation || "পদবি নেই"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
                  <MaterialIcon
                    name="account_tree"
                    size={14}
                    className="text-secondary"
                  />
                  <span className="text-xs font-bold text-on-surface-variant">
                    {officerInfo?.branch?.name || "শাখা নেই"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
                  <MaterialIcon
                    name="id_card"
                    size={14}
                    className="text-tertiary"
                  />
                  <span className="text-xs font-bold text-on-surface-variant">
                    ID: {officerInfo?.idNumber || "N/A"}
                  </span>
                </div>
              </div>
              <p className="text-on-surface-variant font-medium max-w-lg leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                আপনার প্রয়োজনীয় সেবা এবং বরাদ্দের সকল তথ্য এখানে সংরক্ষিত আছে।
                আপনি এখান থেকে নতুন সার্ভিস রিকোয়েস্ট করতে পারবেন।
              </p>
            </div>

            <div className="w-full md:w-80">
              <StatCard
                icon="inventory_2"
                label="মোট মালামাল"
                value={(officerInfo?.assignments?.length || 0).toString()}
                description="বর্তমানে আপনার অধীনে থাকা মোট অ্যাসেট"
                variant="primary"
              />
            </div>
          </motion.div>
        </header>

        {/* M3 Quick Actions / Services Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-tertiary-container text-on-tertiary-container rounded-xl flex items-center justify-center">
              <MaterialIcon name="bolt" size={20} />
            </div>
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em]">
              সার্ভিস রিকোয়েস্ট (Quick Services)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                id: "dnothi",
                title: "ডি-নথি আইডি",
                icon: "account_balance",
                color: "bg-green-100 text-green-700 border-green-200",
              },
              {
                id: "profile-update",
                title: "তথ্য আপডেট",
                icon: "manage_accounts",
                color: "bg-rose-100 text-rose-700 border-rose-200",
              },
              {
                id: "net",
                title: "নেটওয়ার্কিং",
                icon: "router",
                color: "bg-blue-100 text-blue-700 border-blue-200",
              },
              {
                id: "maint",
                title: "মেইনটেন্যান্স",
                icon: "build",
                color: "bg-orange-100 text-orange-700 border-orange-200",
              },
              {
                id: "zoom",
                title: "জুম মিটিং লিঙ্ক",
                icon: "videocam",
                color: "bg-sky-100 text-sky-700 border-sky-200",
              },
              {
                id: "noc",
                title: "এনওসি রিকোয়েস্ট",
                icon: "description",
                color: "bg-amber-100 text-amber-700 border-amber-200",
              },
              {
                id: "digipass",
                title: "ডিজিটাল পাস",
                icon: "faceid",
                color: "bg-purple-100 text-purple-700 border-purple-200",
              },
            ].map((service, idx) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex flex-col items-center justify-center p-6 bg-surface-container-low border border-outline-variant rounded-[2rem] hover:bg-surface-container-high transition-all shadow-sm group`}
              >
                <div
                  className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform`}
                >
                  <MaterialIcon name={service.icon} size={32} />
                </div>
                <span className="text-sm font-black text-on-surface text-center tracking-tight">
                  {service.title}
                </span>
                <div className="mt-2 w-6 h-1 bg-outline-variant rounded-full group-hover:w-full transition-all duration-500" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Assets Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center">
              <MaterialIcon name="list" size={20} />
            </div>
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em]">
              বরাদ্দের তালিকা (Assigned Assets)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {officerInfo?.assignments &&
              officerInfo.assignments.length > 0 ? (
                officerInfo.assignments.map(
                  (assignment: any, index: number) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/officer/inventory/${assignment.asset?.id}`)}
                      className="bg-surface-container-low border border-outline-variant rounded-[2.5rem] p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden cursor-pointer"
                    >
                      {/* Top Header Section: Profile/Photo + Brand info */}
                      <div className="flex gap-5 items-center mb-6 relative">
                        <div className="w-20 h-20 bg-primary-container/30 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary group-hover:rotate-6 transition-all duration-500 shadow-inner overflow-hidden border border-outline-variant/30 shrink-0">
                          {assignment.asset?.photoUrl ? (
                            <img 
                              src={getFullUrl(assignment.asset.photoUrl)} 
                              alt={assignment.asset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <MaterialIcon
                              name={assignment.asset?.category?.icon || "devices"}
                              size={36}
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                           <h4 className="text-2xl font-black text-on-surface group-hover:text-primary transition-colors leading-tight truncate">
                              {assignment.asset?.name}
                           </h4>
                           {(assignment.asset?.brand || assignment.asset?.model) && (
                              <div className="flex items-center gap-1.5 mt-1 text-secondary font-bold text-sm">
                                <MaterialIcon name="branding_watermark" size={16} />
                                <span className="truncate">{assignment.asset?.brand} {assignment.asset?.model}</span>
                              </div>
                           )}
                           <div className="mt-3 flex gap-2">
                             <Badge label="সক্রিয়" variant="success" size="md" showDot />
                             <div className="bg-surface-container-high px-3 py-1 rounded-lg border border-outline-variant/50 shadow-sm flex items-center justify-center">
                               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none">বরাদ্দকৃত</span>
                             </div>
                           </div>
                        </div>

                        <div className="absolute top-0 right-0">
                          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <MaterialIcon name="arrow_outward" size={18} className="text-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        {/* Secondary Info: Tag & Category (Horizontal Pill Layout) */}
                        <div className="flex flex-wrap gap-2 mb-4">
                           <div className="px-4 py-2 bg-primary-container/20 text-primary border border-primary/10 rounded-full flex items-center gap-2 shadow-sm">
                             <MaterialIcon name="qr_code_2" size={16} />
                             <span className="text-xs font-black uppercase tracking-wider">
                               কোড: {assignment.asset?.assetTag || assignment.asset?.tagNumber}
                             </span>
                           </div>
                           <div className="px-4 py-2 bg-surface-container-high text-on-surface-variant border border-outline-variant/30 rounded-full flex items-center gap-2">
                             <MaterialIcon name={assignment.asset?.category?.icon || "category"} size={16} />
                             <span className="text-xs font-black uppercase tracking-wider">
                               {assignment.asset?.category?.name || "Device"}
                             </span>
                           </div>
                        </div>

                        {/* Assigned Date Area */}
                        <div className="bg-surface-container-highest/50 rounded-2xl p-3 border border-outline-variant/30 flex items-center justify-between group-hover:bg-white transition-colors duration-500">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <MaterialIcon
                                name="calendar_today"
                                size={14}
                                className="text-tertiary"
                              />
                            </div>
                            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">
                              ইস্যু তারিখ
                            </span>
                          </div>
                          <span className="text-sm font-black text-on-surface">
                            {assignment.issueDate ? new Date(assignment.issueDate).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }) : assignment.assignmentDate ? new Date(assignment.assignmentDate).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }) : 'তারিখ নেই'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ),
                )
              ) : (
                <div className="col-span-full py-20 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-[3rem] flex flex-col items-center justify-center text-on-surface-variant">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-4">
                    <MaterialIcon
                      name="inbox"
                      size={40}
                      className="text-outline"
                    />
                  </div>
                  <p className="font-bold text-lg text-on-surface">
                    বর্তমানে কোনো অ্যাসেট বরাদ্দ নেই
                  </p>
                  <p className="text-sm opacity-60">
                    নতুন বরাদ্দের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-outline-variant text-center bg-surface-container-low">
        <p className="text-xs font-black text-on-surface-variant uppercase tracking-[0.5em]">
          অ্যাসেট লাইফসাইকেল ম্যানেজমেন্ট সিস্টেম &bull; ২০২৬
        </p>
      </footer>
    </div>
  );
}
