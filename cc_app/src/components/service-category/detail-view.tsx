'use client';

import { paths } from "@/src/routes/paths";
import { DashboardContent } from "@/src/layouts/dashboard";
import { CustomBreadcrumbs } from "@/src/components/custom-breadcrumbs";

import { IServicesCategory } from "@/src/types/app";

import { getSingleServiceCategory } from "@/src/services/serviceCategory";
import { useEffect, useState } from "react";
import { ServiceDetailView } from "../monitoring/service-detail";
import ServiceCategoryDetail from "./detail";

type Props = {
  serviceCategory: IServicesCategory;
};

const ServiceCategoryDetailView = (id: any) => {
  const [serviceCategory, setServiceCategory] = useState<IServicesCategory | undefined>(undefined);

  const fetchServiceCategory = async () => {
    try {
      const serviceCategory = await getSingleServiceCategory(id.id);
      setServiceCategory(serviceCategory);
    } catch (error) {
      console.error("Error fetching service category", error);
    };
  };

  useEffect(() => {
    fetchServiceCategory();
  }, []);
  console.log(serviceCategory);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={serviceCategory?.name}
        links={[
          { name: "Configuración", href: paths.setup.main },
          { name: "Categorías", href: paths.categories.main },
          { name: serviceCategory?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ServiceCategoryDetail category={serviceCategory} />
    </DashboardContent>
  );
}

export default ServiceCategoryDetailView;