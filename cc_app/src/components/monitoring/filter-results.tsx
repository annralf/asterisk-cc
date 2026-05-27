'use client';
import type { Theme, SxProps } from '@mui/material/styles';
import { IMonitoringFilters } from './list';
import { UseSetStateReturn } from 'src/hooks/use-set-state';
import { useCallback } from 'react';
import { Chip } from '@mui/material';
import { fDateRangeShortLabel } from 'src/utils/format-time';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IMonitoringFilters>;
};

export const MonitorTableFiltersResult = ({ filters, totalResults, onResetPage, sx }: Props) => {
    const handleRemoveAgent = useCallback(() => {
        onResetPage();
        filters.setState({ agent: '' });
    }, [filters, onResetPage]);

    const handleRemoveCampaign = useCallback((inputValue: string) => {
        const newValue = Array.isArray(filters.state.campaing) ? filters.state.campaing.filter((item) => item !== inputValue) : [];

        onResetPage();
        filters.setState({ campaing: newValue });
    },[filters, onResetPage]);

    const handleRemoveExtension = useCallback((inputValue: string) => {
        const newValue = Array.isArray(filters.state.extension) ? filters.state.extension.filter((item) => item !== inputValue) : [];

        onResetPage();
        filters.setState({ extension: newValue });
    },[filters, onResetPage]);

    return (
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
            <FiltersBlock label="Agent:" isShow={!!filters.state.agent}>
                <Chip {...chipProps} label={filters.state.agent} onDelete={handleRemoveAgent} />
            </FiltersBlock>

            <FiltersBlock label="Campaign:" isShow={Array.isArray(filters.state.campaing) && !!filters.state.campaing.length}>
                {Array.isArray(filters.state.campaing) && filters.state.campaing.map((item) => (
                    <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveCampaign(item)} />
                ))}
            </FiltersBlock>

            <FiltersBlock label="Extension:" isShow={Array.isArray(filters.state.extension) && !!filters.state.extension.length}>
                {Array.isArray(filters.state.extension) && filters.state.extension.map((item) => (
                    <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveExtension(item)} />
                ))}
            </FiltersBlock>
        </FiltersResult>
    );
};