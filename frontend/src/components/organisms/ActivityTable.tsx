import { motion } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';
import { Badge } from '../atoms/Badge';

const activities = [
  {
    id: 1,
    device: 'Dell XPS 15',
    tag: 'TAG-ICT-2024-001',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkHtvu9UXyS_uIIgFdTLoMFX_V7zFcOv25w-brTlDuFtcUQaSwuMDaIXlCKENwiK47rViCvBaVlS7xKFI6O8-rcMblpxtWw6-2mQgzrC9vYJTWbCsTRI9tHorHa206BEIvY9C73N4OckZ__7i-o5q1ZOVHrZMLg8NSy0Hj3ckgHj-uOKJcDHP5QUDpHVFHtv9udigvCAZ0CSeBl2XniVVYbGUfyPJggioh0dQaOci3mvCmpd4MebXMjjNg8iHea6Fl5aZ2mbw55MA',
    employee: 'আব্দুল করিম',
    initials: 'AK',
    type: 'নতুন বরাদ্দ',
    date: '১৫ জানুয়ারি, ২০২৪',
    status: 'ভালো',
    statusColor: 'bg-green-100 text-green-800 ring-green-600/20',
    dotColor: 'bg-green-600'
  },
  {
    id: 2,
    device: 'Logitech MX Keys',
    tag: 'TAG-ICT-2023-452',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFbZk0o2NKqsX_5P9gzq8az9pqKSh-pcTK15oNbO5VbARvDa6YWlpLo_mbFnk88hNzm5XS3nPv4Ec5jybEGXpkA9ahGPJI6r3XbFaReGxfV4pke7o5-2TEma2kGA3qs0FehJgP-N2QoaXkZGa_RaaH-RkdyvJz6iyXRMPoqntUkAGymwHbGV9FeU6ZfeALey2_LkDpdKY5LZujjECF_3I0k4bVpxFaY__OfsocTRDjzndjFJngQiPXpHUbPDcKHjGrY1Y8S05i3aQ',
    employee: 'নাসরিন সুলতানা',
    initials: 'NS',
    type: 'মেরামত ফেরত',
    date: '১২ জানুয়ারি, ২০২৪',
    status: 'মোটামুটি',
    statusColor: 'bg-surface-variant text-on-surface-variant ring-outline-variant',
    dotColor: 'bg-outline'
  },
  {
    id: 3,
    device: 'HP EliteDisplay E243',
    tag: 'TAG-ICT-2022-118',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdFjEBf6wr7S_OivYlkWgH3EKM-UJ-7yikGbFvzIFqMWQ35cDQdCUFYfU_YFCypdDr_LWumuyz7DZzhkbKt9Xcqxyskg7llQ6vW1hyJTlWYkpupZq5U02B3PGU_sca3zIcnbzKKjP0n5gUblxtUjK15sqD0H1zv-3AUsTAEuTf0uPLXuloBfXKZj23YlkZ-OritDNfjqujq3ylT3bi5ni_ozJq-_zXfJi9OKSUqO-7N4u-AausmS6b1_-ztDVRxmTs9_6fA3tFu7I',
    employee: 'রকিবুল ইসলাম',
    initials: 'RJ',
    type: 'ফেরত প্রদান',
    date: '১০ জানুয়ারি, ২০২৪',
    status: 'ক্ষতিগ্রস্ত',
    statusColor: 'bg-error-container text-on-error-container ring-error/20',
    dotColor: 'bg-error'
  }
];

export default function ActivityTable() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden flex flex-col h-fit"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ডিভাইস</th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">কর্মকর্তা</th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ধরণ</th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">তারিখ</th>
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অবস্থা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {activities.map((activity, idx) => (
              <motion.tr 
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
              >
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant">
                      <img src={activity.image} alt={activity.device} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="font-bold text-on-surface text-sm">{activity.device}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">{activity.tag}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-primary font-sans">
                      {activity.initials}
                    </div>
                    <span className="text-sm font-medium text-on-surface">{activity.employee}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                    {activity.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{activity.date}</td>
                <td className="px-8 py-4 text-right">
                  <Badge 
                    label={activity.status} 
                    variant={
                      activity.status === 'ভালো' ? 'success' : 
                      activity.status === 'ক্ষতিগ্রস্ত' ? 'error' : 'neutral'
                    }
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
        <div className="text-sm text-on-surface-variant">
          মোট <span className="font-bold text-on-surface">১২৮</span> টি এসেটের মধ্যে <span className="font-bold text-on-surface">১-১০</span> দেখানো হচ্ছে
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50 transition-all" disabled>
            <MaterialIcon name="chevron_left" size={20} />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold text-sm shadow-sm">১</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all">২</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all">৩</button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all">১৩</button>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-high text-on-surface-variant transition-all">
            <MaterialIcon name="chevron_right" size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
