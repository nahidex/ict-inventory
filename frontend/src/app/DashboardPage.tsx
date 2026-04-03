import StatCard from '../components/molecules/StatCard';
import ActivityTable from '../components/organisms/ActivityTable';
import DistributionCard from '../components/organisms/DistributionCard';
import TipCard from '../components/molecules/TipCard';
import { Inventory, PersonCheck, Build, PendingActions } from '../components/atoms/Icons';

export default function DashboardPage() {
  return (
    <>
      {/* Summary Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
        <StatCard 
          icon={Inventory} 
          label="সম্পদ" 
          value="১২৮০" 
          description="মোট নিবন্ধিত সম্পদ" 
          variant="primary"
          delay={0.1}
        />
        <StatCard 
          icon={PersonCheck} 
          label="বরাদ্দকৃত" 
          value="৯৪৫" 
          description="সক্রিয় ব্যবহারকারী" 
          variant="primary"
          delay={0.2}
        />
        <StatCard 
          icon={Build} 
          label="মেরামতে" 
          value="৪২" 
          description="বর্তমানে মেরামতে আছে" 
          variant="error"
          delay={0.3}
        />
        <StatCard 
          icon={PendingActions} 
          label="NOC" 
          value="১২" 
          description="অপেক্ষমাণ আবেদন" 
          variant="tertiary"
          delay={0.4}
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <ActivityTable />
        </div>
        <div className="space-y-6">
          <DistributionCard />
          <TipCard />
        </div>
      </div>
    </>
  );
}
