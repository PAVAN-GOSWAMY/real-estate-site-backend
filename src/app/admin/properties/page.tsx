import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listPropertiesAction } from "@/modules/properties/actions";
import { listBuildersAction } from "@/modules/builders/actions";
import { PropertyFilters } from "@/modules/properties/types/property";
import { PropertyStatus, PropertyType, PropertyAvailability } from "@/modules/properties/types/enums";
import { PropertiesFilter } from "./_components/PropertiesFilter";
import { PropertiesList } from "./_components/PropertiesList";
import { AdminPagination } from "@/components/common/admin-pagination";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const rawLimit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit, 10) : 10;
  const limit = isNaN(rawLimit) ? 10 : rawLimit;

  const filters: PropertyFilters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    builderId: typeof searchParams.builderId === 'string' ? searchParams.builderId : undefined,
    propertyType: typeof searchParams.propertyType === 'string' ? searchParams.propertyType as PropertyType : undefined,
    status: typeof searchParams.status === 'string' ? searchParams.status as PropertyStatus : undefined,
    featured: searchParams.featured === 'true' ? true : searchParams.featured === 'false' ? false : undefined,
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1,
    limit,
  };

  const [propertiesResult, buildersResult] = await Promise.all([
    listPropertiesAction(filters),
    listBuildersAction({ active: true, limit: 100 })
  ]);

  if (!propertiesResult.success) {
    throw new Error(propertiesResult.error);
  }

  const builders = buildersResult.success ? buildersResult.data.items : [];
  
  // Create a map for quick builder name lookups in the list
  const buildersMap = builders.reduce((acc, builder) => {
    acc[builder.id] = builder;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        description="Manage all real estate properties."
        action={
          <Button asChild>
            <Link href="/admin/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        }
      />
      
      <PropertiesFilter builders={builders} />
      
      <PropertiesList properties={propertiesResult.data.items} buildersMap={buildersMap} />
      
      {propertiesResult.data.total > 0 && (
        <div className="pt-4 pb-8">
          <AdminPagination 
            total={propertiesResult.data.total}
            page={propertiesResult.data.page}
            limit={propertiesResult.data.limit}
          />
        </div>
      )}
    </div>
  );
}
