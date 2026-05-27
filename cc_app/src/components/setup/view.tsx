'use client';

import { useState, useCallback, useEffect } from 'react';

import { Box, Card, Table, Stack, Button, Divider, Tooltip, TableBody, Tabs, Tab } from '@mui/material';
import { Label } from 'src/components/label';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from '@/src/routes/paths';
import { useRouter } from '@/src/routes/hooks/use-router';
import { RouterLink } from '@/src/routes/components';

import { useBoolean } from '@/src/hooks/use-boolean';
import { useSetState } from '@/src/hooks/use-set-state';

import { MonitorAnalytic } from '../monitoring/analytic';
import { DashboardContent } from '@/src/layouts/dashboard';

import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableEmptyRows,
} from 'src/components/table';
import { IDatePickerControl } from '@/src/types/common';
import { IPagination, ISupport } from '@/src/types/app';
import { AnalyticCard } from '../custom-components/analytic-card';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';
import { Iconify } from '../iconify';
import { Scrollbar } from '../scrollbar';
import { varAlpha } from '@/src/theme/styles';
import { color } from 'framer-motion';
import { Monitor } from '@mui/icons-material';
import { MonitorTableToolbar } from '../monitoring/toolbar';
import { MonitorTableFiltersResult } from '../monitoring//filter-results';
import { MonitorTableRow } from '../monitoring//table-row';
import { ComponentBlock } from '@/src/sections/_examples/component-block';
import SetupNavBar from './navbar';

export interface IMonitoringFilters {
    agent: string;
    campaing: string | string[];
    extension: string | string[];
    serviceStatus: string | string[];
    createdAt: {
      startDate: IDatePickerControl;
      endDate: IDatePickerControl;
    };
}

export interface IMonitoringList {
  id: number;
  agent: string;
  extension: string;
  campaing: string;
  serviceStatus: string;
  createdAt: string;
}

const TABLE_HEAD = [
  { id: 'agent', label: 'Agente/Operador', alignRight: false },
  { id: 'extension', label: '# de Extensión', alignRight: false },
  { id: 'campaing', label: 'Campaña', alignRight: false },
  { id: 'serviceStatus', label: 'Estado del Servicio', alignRight: false },
  { id: 'createdAt', label: 'Fecha', alignRight: false },
  { id: 'actions', label: 'Acciones', alignRight: true },
];

const limit = 10;

export const SetupView = () => {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'serviceStatus' });
  const confirm = useBoolean();
  const [monitor, setMonitor] = useState<IMonitoringList[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);

  const filters = useSetState<IMonitoringFilters>({
    agent: '',
    extension: '',
    campaing: '',
    serviceStatus: '',
    createdAt: { startDate: null, endDate: null },
  });

const dateError = filters.state.createdAt && !!filters.state.createdAt.startDate && !!filters.state.createdAt.endDate ? false : true;

  const dataFiltered = applyFilter({
    inputData: monitor,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.agent ||
    !!filters.state.extension ||
    !!filters.state.campaing ||
    !!filters.state.serviceStatus ||
    !!filters.state.createdAt;

  const notFound =
    !monitor.length &&
    !filters.state.agent &&
    !filters.state.extension &&
    !filters.state.campaing &&
    !filters.state.serviceStatus &&
    !filters.state.createdAt;

  const getMonitoringLength = (agent: string) =>
    monitor.filter((monitor) => monitor.agent === agent).length;

  const TABS = [
    { value: 'all', label: 'Todos', color: 'default' },
    { value: 'received', label: 'Recibidas', color: 'primary' },
    { value: 'wrong', label: 'Con Novedad', color: 'error' },
    { value: 'closed', label: 'Cerradas', color: 'info' },
  ] as const;

  const handleViewRow = useCallback(
    (row: IMonitoringList) => {
      router.push(`${paths.monitoring.details}/${row.id}`);
    },
    [router]
  );

  const handleEditRow = useCallback(
    (row: IMonitoringList) => {
      router.push(`${paths.monitoring.edit}/${row.id}`);
    },
    [router]
  );

  const handleSelectRow = useCallback(
    (row: IMonitoringList) => {
      router.push(`${paths.monitoring.details}/${row.id}`);
    },
    [router]
  );

  const handleFilterAgent = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ agent: newValue });
    },
    [filters, table]
  );

  useEffect(() => {
    if (!monitor.length) {
      console.log('fetch monitoring');
    }
  }, [monitor, pagination]);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Operaciones"
          links={[{ name: 'Inicio', href: paths.monitoring.main }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />       
        <Card>
          <Scrollbar sx={{ minWidth: 800 }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <MonitorAnalytic
                title="Total de Llamadas"
                total={monitor.length}
                icon="material-symbols-light:call-end-sharp"
                color={theme.vars.palette.info.main}
                percent={100}
              />
              <MonitorAnalytic
                title="Total de Llamadas en Curso"
                total={monitor.length}
                icon="garden:call-in-26"
                color={theme.vars.palette.success.light}
                percent={100}
              />
              <MonitorAnalytic
                title="Extensiones Activas"
                total={monitor.length}
                icon="circum:wifi-on"
                color={theme.vars.palette.success.main}
                percent={100}
              />
              <MonitorAnalytic
                title="Extensiones Pausadas/Inactivas"
                total={monitor.length}
                icon="material-symbols-light:wifi-off-rounded"
                color={theme.vars.palette.error.dark}
                percent={100}
              />
            </Stack>
          </Scrollbar>
        </Card>
       {/*  <ComponentBlock title="Administración de operaciones" sx={{ flexDirection: 'column', alignItems: 'unset', mt: 5, paddingTop: 3, paddingBottom: 3 }}>
          <SetupNavBar/>
        </ComponentBlock> */}
        <Card sx={{ mt: 5 }}>
          <MonitorTableToolbar filters={filters} onResetPage={table.onResetPage} dateError={dateError} options={{agent:[]}}/>
          {
            canReset && (
                <MonitorTableFiltersResult
                    filters={filters}
                    onResetPage={table.onResetPage}
                    totalResults={dataFiltered.length}
                    sx={{ p: 2.5, pt: 0 }}
                />
            )
          }
          <Box sx={{ position: 'relative' }}>
            <Scrollbar sx={{ minHeight: 444 }}>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => String(row.id))
                        )
                    }
                    />
                    <TableBody>
                    {
                        dataFiltered.slice(
                            (pagination?.page ?? 0) * (pagination?.total ?? 0),
                            (pagination?.page ?? 0) * (pagination?.pages ?? 0) + (pagination?.pages ?? 0)
                        ).map((row) => (
                            <MonitorTableRow
                                key={row.id}
                                row={row}
                                selected={table.selected.includes(String(row.id))}
                                onSelectRow={() => table.onSelectRow(String(row.id))}
                                onViewRow={() => handleViewRow(row)}
                                onEditRow={() => handleEditRow(row)}
                            />
                        ))
                    }
                    <TableEmptyRows 
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />
                    <TableNoData notFound={notFound} />
                    </TableBody>
                </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
             page={table.page}
             dense={table.dense}
             count={dataFiltered.length}
             rowsPerPage={table.rowsPerPage}
             onPageChange={table.onChangePage}
             onChangeDense={table.onChangeDense}
             onRowsPerPageChange={table.onChangeRowsPerPage}
            />
        </Card>
      </DashboardContent>
    </>
  );
};

type AplyFilterProps = {
  inputData: IMonitoringList[] | [];
  comparator: (a: any, b: any) => number;
  filters: IMonitoringFilters;
  dateError: boolean;
};

export const applyFilter = ({ inputData, comparator, filters }: AplyFilterProps) => {
  const { agent, extension, campaing, serviceStatus, createdAt } = filters;
  const stabilizedThis = inputData ? inputData.map((el, index) => [el, index] as const) : [];

  stabilizedThis.sort((a, b) => {
    const agent = comparator(a[0], b[0]);
    if (agent !== 0) return agent;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (!inputData) {
    return [];
  }
  if (createdAt) {
    inputData = inputData.filter((row) => {
      const createdAtDate = new Date(row.createdAt);
      if (
        createdAt?.startDate &&
        createdAtDate >= createdAt.startDate.toDate() &&
        createdAt?.endDate &&
        createdAtDate <= createdAt.endDate.toDate()
      ) {
        return row;
      }
      return null;
    });
  }

  return inputData
    .filter((row) => {
      if (
        row.agent.toLowerCase().includes(filters.agent.toLowerCase()) &&
        typeof filters.extension === 'string' && row.extension.toLowerCase().includes(filters.extension.toLowerCase()) &&
        typeof filters.campaing === 'string' && row.campaing.toLowerCase().includes(filters.campaing.toLowerCase()) &&
        typeof filters.serviceStatus === 'string' && row.serviceStatus.toLowerCase().includes(filters.serviceStatus.toLowerCase())
      ) {
        return row;
      }
      return null;
    })
    .sort(comparator);
};
