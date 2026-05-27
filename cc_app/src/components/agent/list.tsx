'use client';

import { useState, useCallback, useEffect } from 'react';

import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { AnalyticCard } from '../custom-components/analytic-card';
import { AgentTableToolbar } from './agent-table-toolbar';
import { AgentTable } from './table';
import { AgentTableFiltersResult } from './agent-filters.results';
import { IAgent, IPagination, IService, IServicesAgent } from '@/src/types/app';
import { DashboardContent } from '@/src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';
export interface IAgentFilters {
  status: string;
  extension: string;
  service: string;
}

const TABLE_HEAD = [
  { id: 'agent', label: 'Agent', alignRight: false },
  { id: 'service', label: 'Servicio', alignRight: false },
  { id: 'extension', label: 'Extensión', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
  { id: 'actions', label: 'Acciones', alignRight: true },
];

const limit = 10;

export const AgentList = () => {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IServicesAgent[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [pagination, setPagination] = useState<IPagination | null>(null);

  const HEAD_ANALITIC = [
    {
      title: 'Activos',
      total: 0,
      icon: 'bxs:user-check',
      color: 'primary.light',
      percent: 100,
    },
    {
      title: 'En Llamada',
      total: 0,
      icon: 'bxs:user-voice',
      color: 'info.light',
      percent: 100,
    },
    {
      title: 'En Pausa',
      total: 0,
      icon: 'bxs:user-minus',
      color: 'grey.500',
      percent: 100,
    },
  ];

  const options = {
    status: ['all', 'active', 'paused', 'onCall'],
    services: ['service1', 'service2', 'service3'],
    extensions: ['extension1', 'extension2', 'extension3'],
  };

  const filters = useSetState<IAgentFilters>({
    status: 'all',
    service: '',
    extension: '',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset =
    filters.state.status !== 'all' ||
    filters.state.service !== '' ||
    filters.state.extension !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row?.id?.toString() !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.agent.edit(id));
    },
    [router]
  );
  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.agent.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const theme = useTheme();

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Agentes"
          links={[{ name: 'Inicio', href: paths.agent.main }, { name: 'Panel de control' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.agent.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Cargar Agente
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Scrollbar sx={{ minWidth: 800 }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              {HEAD_ANALITIC.map((item, index) => (
                <AnalyticCard key={index} {...item} />
              ))}
            </Stack>
          </Scrollbar>
        </Card>
        <Card sx={{ mt: 5 }}>
          <AgentTableToolbar filters={filters} onResetPage={table.onResetPage} options={options} />
          {canReset && (
            <AgentTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
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
                  {dataFiltered
                    .slice(
                      (pagination?.page ?? 0) * (pagination?.total ?? 0),
                      (pagination?.page ?? 0) * (pagination?.pages ?? 0) + (pagination?.pages ?? 0)
                    )
                    .map((row) => (
                      <AgentTable
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(String(row.id))}
                        onEditRow={() => handleEditRow(String(row.id))}
                      />
                    ))}
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
  inputData: IServicesAgent[] | [];
  comparator: (a: any, b: any) => number;
  filters: IAgentFilters;
};

export const applyFilter = ({ inputData, filters, comparator }: AplyFilterProps) => {
  const dataFiltered = inputData.filter((row) => {
    const status =
      filters.status === 'all' || row.extensionsAgent?.agent1?.status === filters.status;
    const service = filters.service === '' || row.service1?.name === filters.service;
    const extension =
      filters.extension === '' || row.extensionsAgent?.extension1?.identity === filters.extension;

    return status && service && extension;
  });

  return dataFiltered.sort(comparator);
};
