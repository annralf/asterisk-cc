import { CONFIG } from 'src/config-global';
import ServiceCategoryDetailView from '@/src/components/service-category/detail-view';

type Props = {
    params: { id: string };
};

const ServiceCategoryDetailPage = ({ params }: Props) => {
    const { id } = params;
    return <ServiceCategoryDetailView id={id} />;
};

export default ServiceCategoryDetailPage;