import { PageHeader } from "@/components/admin/ui/PageHeader";
import { getAllBannersAction } from "@/modules/banners/actions/banners.actions";
import { BannersList } from "./_components/BannersList";
import { BannerFormDialog } from "./_components/BannerFormDialog";

export default async function BannersPage() {
  const result = await getAllBannersAction();
  const banners = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Deals & Offers" description="Manage promotional banners displayed on the website." />
        <BannerFormDialog />
      </div>
      
      <BannersList banners={banners} />
    </div>
  );
}
