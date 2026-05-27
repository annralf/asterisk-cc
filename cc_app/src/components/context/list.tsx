'use client';
import { useState, useCallback, useEffect } from 'react';
import { IContextDef, IPagination } from '@/src/types/app';

import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Divider,
  TableBody,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { paths } from '@/src/routes/paths';

import { useRouter } from '@/src/routes/hooks';
import { RouterLink } from '@/src/routes/components';
import { useBoolean } from '@/src/hooks/use-boolean';
import { useSetState } from '@/src/hooks/use-set-state';

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

import { getContexts, getFilteredContexts } from '@/src/services/contextDef';

import { DashboardContent } from '@/src/layouts/dashboard';
import { AnalyticCard } from '../custom-components/analytic-card';
import { ContextTableToolBar } from './table-toolbar';
import { ContextTableFiltersResult } from './table-filters-results';
import { ContextTable } from './table';
import ModalContextForm from './modal';
import page from '@/src/app/(home)/page';
import { table } from 'console';

const TABLE_HEAD = [
  { id: 'name', label: 'Identificador' },
  { id: 'permission', label: 'Permiso' },
  { id: 'monitors', label: 'Monitores | Supervisores' },
  { id: 'is_active', label: 'Estatus' },
  { id: '', },
];

export interface IContextFilters {
  name: string;
  permission: string;
  monitors: string;
  is_active: string | boolean;
}

export const ContextList = () => {
  const theme = useTheme();
  const router = useRouter();
  const [contexts, setContexts] = useState<IContextDef[]>([]);
  const [contextSelected, setContextSelected] = useState<IContextDef | null>(null);

  const [tableData, setTableData] = useState<IContextDef[]>(contexts);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [inactive, setInactive] = useState<IContextDef[]>([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetchData();
    setContextSelected(null);
  };

  const table = useTable({ defaultOrderBy: 'name' });
  const filters = useSetState<IContextFilters>({
    name: '',
    permission: '',
    monitors: '',
    is_active: '',
  });

  const dataFiltered =
    applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters: filters.state,
    }) || [];

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching contexts');
      const response = await getContexts(page, limit);
      setContexts(response.context_defs);
      setTableData(response.context_defs);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Error al cargar los contextos');
    }
  }, [contexts, page, limit]);

  const fetchInactive = useCallback(async () => {
    try {
      console.log('Fetching inactive contexts');
      const response = await getFilteredContexts(1, 100, { is_active: false });
      setInactive(response.context_defs);
    } catch (error) {
      console.error("Fetching inactive contexts error:", error);
      //toast.error('Error al cargar los contextos inactivos');
    }
  }, [inactive]);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset =
    !!filters.state.name ||
    !!filters.state.permission ||
    !!filters.state.monitors ||
    !!filters.state.is_active;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getContextsLength = (name: string) => {
    tableData.filter((item) => item.name === name).length;
  };

  const TABS = [
    {
      value: 'all',
      label: 'Todos',
      color: 'default',
      count: contexts.length,
    },
  ] as const;

  const CARDS = [
    {
      title: 'Total',
      total: tableData.length,
      icon: 'clarity:connect-solid',
      color: 'primary.light',
    },
    {
      title: 'Inactivas',
      total: !inactive.length ? 0 : inactive.length,
      icon: 'hugeicons:connect',
      color: 'secondary.main',
    },
  ];

  const handleEditRow = (row:IContextDef) =>{
    setContextSelected(row);
    handleOpen();
  }

  const handleViewRow = useCallback((id: string) => {
    router.push(paths.context_setup.details(id));
  }, []);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ is_active: newValue });
    },
    [filters, table]
  );
  
  useEffect(() => {
    if (tableData.length === 0) {
      fetchInactive();
      fetchData();
    }
  }, [page, tableData]);

  useEffect(() => {},[contextSelected]);

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Identificador', 'Permiso', 'Monitores | Supervisores', 'Estatus'],
      ...dataFiltered.map((row) => [
        row.name,
        row.permission,
        row.monitors,
        row.is_active ? 'Activo' : 'Inactivo',
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'contexts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Configuración de Contextos"
          links={[{ name: 'Inicio', href: paths.setup.main }, { name: 'Contextos' }]}
          action={
            <Button
              onClick={() => {
                setContextSelected(null);
                setOpen(true);
              }}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo Contexto
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              direction="row"
              display={{ xs: 'none', sm: 'flex' }}
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, justifyContent: 'flex-start' }}
            >
              {CARDS.map((item, index) => (
                <AnalyticCard key={index} {...item} />
              ))}
            </Stack>
          </Scrollbar>
        </Card>
        <ContextTableToolBar filters={filters} onResetPage={table.onResetPage} />
        {canReset && (
          <ContextTableFiltersResult
            filters={filters}
            onResetPage={table.onResetPage}
            totalResults={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) => {
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => String(row.id))
              );
            }}
            action={
              <Stack direction="row">
                <Tooltip title="Descargar">
                  <IconButton color="primary" onClick={handleDownloadCSV}>
                    <Iconify icon="eva:download-outline" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
          />
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
                    dataFiltered.map((row: any) => String(row.id))
                  )
                }
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row: IContextDef) => (
                    <ContextTable
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onViewRow={() => handleViewRow(String(row.id))}
                      onEditRow={() => handleEditRow(row)}
                      onDisable={() => handleEditRow(row)}
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
      </DashboardContent>
      <ModalContextForm open={open} onClose={handleClose} context={contextSelected} />
    </>
  );
};

type ApplyFilterProps = {
  inputData: IContextDef[] | [];
  filters: IContextFilters;
  comparator: (a: any, b: any) => number;
};

const applyFilter = ({ inputData, filters, comparator }: ApplyFilterProps) => {
  const { name, permission, monitors, is_active } = filters;
  return inputData
    .filter((row) => {
      const nameMatch = row.name?.toLowerCase().includes(name.toLowerCase()) ?? false;
      const permissionMatch = (row.permission ?? '')
        .toLowerCase()
        .includes(permission.toLowerCase());
        const monitorsMatch = row.monitors?.toLowerCase().includes(monitors.toLowerCase()) ?? false;
      const isActiveMatch = is_active === '' || row.is_active === is_active;
      return nameMatch && permissionMatch && monitorsMatch && isActiveMatch;
    })
    .sort(comparator);
};