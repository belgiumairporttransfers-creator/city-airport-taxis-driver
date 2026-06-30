import { getSeoMeta } from "@/lib/get-seo-meta";
import DriverWalletPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Driver Wallet",
  description: "Track your trip earnings, wallet balance, and transaction history.",
});

const DriverWalletPage = () => {
  return <DriverWalletPageView />;
};

export default DriverWalletPage;
