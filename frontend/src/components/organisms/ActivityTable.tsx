import { motion } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';
import { Badge } from '../atoms/Badge';

const recentActivity = [
  {
    id: 1,
    assetTag: "ICT-LPT-042",
    brand: "Dell",
    model: "Latitude 5420",
    officer: "মোঃ রহিম আহমেদ",
    designation: "সহকারী ব্যবস্থাপক",
    status: "Assigned",
    date: "৩ এপ্রিল, ২০২৬"
  },
  {
    id: 2,
    assetTag: "ICT-MON-118",
    brand: "Samsung",
    model: "24-inch Curved",
    officer: "নাসরিন সুলতানা",
    designation: "সিনিয়র সিস্টেম অ্যানালিস্ট",
    status: "Available",
    date: "২ এপ্রিল, ২০২৬"
  },
  {
    id: 3,
    assetTag: "ICT-PRN-001",
    brand: "Epson",
    model: "L3210 EcoTank",
    officer: "করিম উল্লাহ",
    designation: "হিসাবরক্ষণ কর্মকর্তা",
    status: "Under_Repair",
    date: "১ এপ্রিল, ২০২৬"
  }
];

export default function ActivityTable() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden flex flex-col shadow-sm w-full"
    >
      <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
        <h2 className="text-xl font-black text-on-surface tracking-tight">সাম্প্রতিক এক্টিভিটি</h2>
        <button className="text-sm font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors">
          সব দেখুন
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-8 py-4 text-[12px] font-black text-on-surface-variant uppercase tracking-widest pl-10 border-r border-outline-variant/10">সম্পদ ও ট্যাগ</th>
              <th className="px-6 py-4 text-[12px] font-black text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10">কর্মকর্তা</th>
              <th className="px-6 py-4 text-[12px] font-black text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10">অবস্থা</th>
              <th className="px-8 py-4 text-[12px] font-black text-on-surface-variant uppercase tracking-widest text-right pr-10">তারিখ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-left">
            {recentActivity.map((item, idx) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-primary/[0.01] transition-colors group cursor-pointer"
              >
                <td className="px-8 py-5 pl-10">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-on-surface text-[15px] leading-tight mb-1">{item.brand} {item.model}</span>
                    <span className="text-[11px] text-on-surface-variant font-mono tracking-tighter bg-surface-container-high px-2 py-0.5 rounded-md inline-block uppercase font-bold border border-outline-variant/30 w-fit">
                      {item.assetTag}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-left">
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] font-bold text-on-surface leading-tight mb-0.5">{item.officer}</span>
                    <span className="text-[11px] text-on-surface-variant font-medium opacity-70">{item.designation}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-left">
                  <Badge 
                    label={item.status === 'Assigned' ? 'বরাদ্দ' : item.status === 'Available' ? 'উপলব্ধ' : 'মেরামত'} 
                    variant={item.status === 'Assigned' ? 'success' : item.status === 'Available' ? 'primary' : 'warning'}
                  />
                </td>
                <td className="px-8 py-5 text-right pr-10 text-[13px] font-bold text-on-surface-variant">
                  {item.date}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
