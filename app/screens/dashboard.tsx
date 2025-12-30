import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Truck, 
  Warehouse as WarehouseIcon, 
  Users, 
  ClipboardList, 
  ArrowRight,
} from "lucide-react";
import { dashboardTexts } from "../props/dashBoardProps";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";
import { getTrucks, listTruckInfo } from "~/node_api/trucks";
import { getWH } from "~/node_api/warehouse";
import { getUsers } from "~/node_api/user";
import type { TruckInfo } from "~/props/truckProps";
import type { Warehouse } from "~/props/warehouseProps";

interface User {
  userID?: number;
  username?: string;
  email?: string;
  job?: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    trucks: 0,
    truckInfos: 0,
    warehouses: 0,
    users: 0,
  });
  const [recentData, setRecentData] = useState({
    trucks: [] as TruckInfo[],
    warehouses: [] as Warehouse[],
    users: [] as User[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [trucks, truckInfos, warehouses, users] = await Promise.all([
          getTrucks().catch(() => []),
          listTruckInfo().catch(() => []),
          getWH().catch(() => ({ data: [], total: 0 })),
          getUsers().catch(() => []),
        ]);

        const trucksArray = Array.isArray(trucks) ? trucks : [];
        const truckInfosArray = Array.isArray(truckInfos) ? truckInfos : [];
        const warehousesArray = Array.isArray(warehouses?.data) ? warehouses.data : [];
        const usersArray = Array.isArray(users) ? users : [];

        setStats({
          trucks: trucksArray.length,
          truckInfos: truckInfosArray.length,
          warehouses: warehouses?.total || warehousesArray.length,
          users: usersArray.length,
        });

        setRecentData({
          trucks: truckInfosArray.slice(0, 3),
          warehouses: warehousesArray.slice(0, 3),
          users: usersArray.slice(0, 3),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar {...navbarTexts} />
      
      <main className="p-8 bg-[#f8fafc] min-h-screen">
        <div className="max-w-7xl mx-auto">

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title={dashboardTexts.stats.trucks}
            value={stats.trucks}
            loading={loading}
            icon={<Truck className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title={dashboardTexts.stats.truckInfos}
            value={stats.truckInfos}
            loading={loading}
            icon={<ClipboardList className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title={dashboardTexts.stats.warehouses}
            value={stats.warehouses}
            loading={loading}
            icon={<WarehouseIcon className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title={dashboardTexts.stats.users}
            value={stats.users}
            loading={loading}
            icon={<Users className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{dashboardTexts.quickActions.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title={dashboardTexts.quickActions.trucks}
              description={dashboardTexts.quickActions.trucksDesc}
              onClick={() => navigate("/trucks")}
              icon={<Truck className="w-8 h-8 text-blue-600" />}
            />
            <QuickActionCard
              title={dashboardTexts.quickActions.warehouse}
              description={dashboardTexts.quickActions.warehouseDesc}
              onClick={() => navigate("/warehouse")}
              icon={<WarehouseIcon className="w-8 h-8 text-purple-600" />}
            />
            <QuickActionCard
              title={dashboardTexts.quickActions.users}
              description={dashboardTexts.quickActions.usersDesc}
              onClick={() => navigate("/userManagement")}
              icon={<Users className="w-8 h-8 text-orange-600" />}
            />
          </div>
        </section>

        {/* Son işlemler */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6">{dashboardTexts.recent.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentItemsCard
              title={dashboardTexts.recent.trucks}
              items={recentData.trucks}
              loading={loading}
              onViewAll={() => navigate("/trucks")}
              renderItem={(item: TruckInfo) => (
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-black">
                      {item.plate || dashboardTexts.recent.noPlate}
                    </p>
                    <p className="text-sm text-black">
                      {item.truckBrand} {item.truckModel}
                    </p>
                  </div>
                </div>
              )}
            />
            <RecentItemsCard
              title={dashboardTexts.recent.warehouses}
              items={recentData.warehouses}
              loading={loading}
              onViewAll={() => navigate("/warehouse")}
              renderItem={(item: Warehouse) => (
                <div className="flex items-center gap-3">
                  <WarehouseIcon className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-black">
                      {item.warehouseName || dashboardTexts.recent.noWarehouseName}
                    </p>
                    <p className="text-sm text-black">
                      {item.cityName || dashboardTexts.recent.noCity}
                    </p>
                  </div>
                </div>
              )}
            />
            <RecentItemsCard
              title={dashboardTexts.recent.users}
              items={recentData.users}
              loading={loading}
              onViewAll={() => navigate("/userManagement")}
              renderItem={(item: User) => (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-black">
                      {item.username || dashboardTexts.recent.noUsername}
                    </p>
                    <p className="text-sm text-black">
                      {item.email || dashboardTexts.recent.noEmail}
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </section>
        </div>
      </main>
    </>
  );
}

// components

function StatCard({ title, value, loading, icon, color }: any) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${themes[color as keyof typeof themes]}`}>
          {icon}
        </div>
        {loading ? (
          <div className="h-4 w-12 bg-slate-100 animate-pulse rounded" />
        ) : (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {dashboardTexts.live}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">
          {loading ? dashboardTexts.loading : value}
        </h3>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ title, description, onClick, icon }: any) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-white border border-slate-200 p-8 rounded-2xl text-left shadow-sm hover:shadow-xl hover:border-blue-200 transition-all"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        {title}
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
      </h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
    </motion.button>
  );
}

function RecentItemsCard({
  title,
  items,
  loading,
  onViewAll,
  renderItem,
}: {
  title: string;
  items: any[];
  loading: boolean;
  onViewAll: () => void;
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black">{title}</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          {dashboardTexts.recent.viewAll}
        </button>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-black">{dashboardTexts.loading}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-black">
            {dashboardTexts.recent.empty}
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50/30 transition-all"
            >
              {renderItem(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}