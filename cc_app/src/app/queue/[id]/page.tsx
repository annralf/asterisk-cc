import { CONFIG } from 'src/config-global';

import CampaignDetailView from '@/src/components/campaign/detail-view';

type Props = {
    params: { id: string };
};

const CampaignDetailPage = ({ params }: Props) => {
    const { id } = params;
    return <CampaignDetailView id={id} />;
};

export default CampaignDetailPage;