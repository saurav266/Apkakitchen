import { Outlet } from "react-router-dom";
import BottomNav from "../Delivery-components/BottomNav";

export default function DeliveryLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
}
