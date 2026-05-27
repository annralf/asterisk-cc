import { CONFIG } from 'src/config-global';

import ContextDetailView from '@/src/components/context/detail-view';

type Props = {
    params: { id: string };
};

const ContextDetailPage = ({ params }: Props) => {
    const { id } = params;
    return <ContextDetailView id={id} />;
};

export default ContextDetailPage;