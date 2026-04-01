import ActivityTable from '../components/organisms/ActivityTable';

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-on-surface">ইনভেন্টরি ম্যানেজমেন্ট</h2>
        <p className="text-on-surface-variant">আপনার সকল সম্পদের তালিকা এবং বর্তমান অবস্থা এখানে দেখুন।</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <ActivityTable />
      </div>
    </div>
  );
}
