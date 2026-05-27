'use client';

import { useState, useCallback, useEffect } from 'react';
import { IExtensions, IPagination } from '@/src/types/app';

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

import { ExtensionItem, getExtensions, getFilteredExtensions, updateExtensions } from '@/src/services/extension';
import { DashboardContent } from '@/src/layouts/dashboard';
import { AnalyticCard } from '../custom-components/analytic-card';
import { ExtensionTableToolBar } from './table-toolbar';
import { ExtensionTableFiltersResult } from './table-filters-results';
import { ExtensionTable } from './table';
import ModalExtensionForm from './modal';

import { IExtensionsResponse } from '@/src/services/extension';
import { set, status } from 'nprogress';

const TABLE_HEAD = [
  { id: 'extension', label: '#Extensión' },
  { id: 'service', label: 'Campaña' },
  { id: 'agent', label: 'Operador/a' },
  { id: 'status', label: 'Estado' },
  { id: '' },
];

export interface IExtensionFilters {
  extension: string;
  status: string;
}

export const applyFilter = ({ inputData, filters, comparator }: ApplyFilterProps): ExtensionItem[] => {
  const dataFiltered = inputData.filter((row) => {
    const extension = filters.extension === '' || row.identity?.includes(filters.extension);
    const status = filters.status === '' || row.is_active === (filters.status === 'true');
    return extension && status;
  });

  return dataFiltered.sort(comparator);
};

export const ExtensionList = () => {
  const theme = useTheme();
  const router = useRouter();

  const [extensions, setExtensions] = useState<ExtensionItem>();

  const table = useTable({ defaultOrderBy: 'names' });

  const confirm = useBoolean();
  const [tableData, setTableData] = useState<ExtensionItem[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);

  const [open, setOpen] = useState(false); // Estado para controlar el modal

  const [actives, setActives] = useState<number>(0);
  const [inactives, setInactives] = useState<number>(0);
  const [extensionsList, setExtensionsList] = useState<string[]>([]);

  const filters = useSetState<IExtensionFilters>({
    extension: '',
    status: '',
  });

  const dataFiltered =
    applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters: filters.state,
    });

  const handleOpen = () => setOpen(true); // Función para abrir el modal
  const handleClose = () => {
    fetchData();
    setOpen(false);
  }; // Función para cerrar el modal
  const limit = 10;

  //-------------------------------- Functions definitions
  const fetchData = useCallback(async () => {
    try {
      const response = await getExtensions(page, limit);
      setTableData(response.extensions);
      const extensionNames = response.extensions
        ? response.extensions
            .map((ext) => ext.identity)
            .filter((name): name is string => name !== undefined)
        : [];
      setExtensionsList(extensionNames);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Error al cargar las extensiones');
    }
  }, [page]);

  const fetchExtensionsCount = useCallback(async () => {
    try {
      console.log('fetching extensions count');
      const actives = await getFilteredExtensions( { is_active: true });
      const inactives = await getFilteredExtensions({ is_active: false });
      setActives(actives.extensions.length);
      setInactives(inactives.extensions.length);
    } catch (error) {
      console.error('Error fetching extensions count', error);
      toast.error('Error al cargar las extenciones');
    }
  }, []);

  const handleDownloadCSV = () => {
    console.log('Descargando CSV...');
    const csvContent = [
      ['Extensión', 'Campaña', 'Operador', 'Estado'],
      ...dataFiltered.map((row) => [
        row.identity,
        typeof row.service === 'object' && row.service !== null ? row.service.service : 'Sin campaña',
        row.agent?.names || 'Sin operador',
        row.is_active ? 'Activo' : 'Inactivo',
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    const currentDate = dayjs().format('YYYY-MM-DD:HH:mm:ss');
    const fileName = `extensiones_${currentDate}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditRow = (extension:ExtensionItem) => {
    setExtensions(extension);
    handleOpen();
  };

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.setup.extension.details(id));
    },
    [router]
  );

  const handleDisable = async (id: string | undefined, value:boolean) => {
    try {
      const response = await updateExtensions(id, { is_active: value });
      toast.success(value ? 'Extensión activada' : 'Extensión desactivada');
      fetchData();
    } catch (error) {
      console.error(value ? 'Error enable extension' : 'Error disabling extension', error);
  toast.error(value ? 'Error al activando la extensión' : 'Error al desactivar la extensión');
      }
    };

  //-------------------------------- Close Functions definitions

  const getExtensionLength = (extension: string) => {
    tableData.filter((item) => item.identity === extension).length;
  };

  const TABS = [
    {
      value: 'all',
      label: 'Total',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'active',
      label: 'Activas',
      color: 'success',
      count: 2,
    },
    {
      value: 'inactive',
      label: 'Inactivas',
      color: 'warning',
      count: 3,
    },
  ] as const;

  const CARDS = [
    {
      title: 'Total',
      total: tableData.length,
      icon: 'clarity:connect-solid',
      color: 'primary.light',
      percent: 100,
    },
    {
      title: 'En Línea',
      total: actives,
      icon: 'clarity:connect-line',
      color: 'info.light',
      percent: 100,
    },
    {
      title: 'Desconectadas',
      total: inactives,
      icon: 'hugeicons:connect',
      color: 'grey.500',
      percent: 100,
    },
  ];

  const options = {
    extensions: extensionsList,
    status: ['true', 'false'],
  };

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = filters.state.extension || filters.state.status;
  const notFound = Boolean((!dataFiltered.length && canReset) || dataFiltered.length === 0);

  useEffect(() => {
    fetchData();
    fetchExtensionsCount();
  }, []);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Configuración de Extensiones"
          links={[{ name: 'Configuración', href: paths.setup.main }, { name: 'Extensiones' }]}
          action={
            <Button
              onClick={handleOpen}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nueva Extensión
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
              {CARDS.map((item, index) => (
                <AnalyticCard key={index} {...item} />
              ))}
            </Stack>
          </Scrollbar>
        </Card>
        <ExtensionTableToolBar
          filters={filters}
          onResetPage={table.onResetPage}
          options={options}
        />
        {canReset && (
          <ExtensionTableFiltersResult
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
                  .map((row: ExtensionItem) => (
                    <ExtensionTable
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onViewRow={() => handleViewRow(String(row.id))}
                      onEditRow={() => handleEditRow(row)}
                      onDisable={() => handleDisable(String(row.id), !row.is_active)}
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
      <ModalExtensionForm open={open} onClose={handleClose} extension={extensions} />
    </>
  );
};

type ApplyFilterProps = {
  inputData: ExtensionItem[] | [];
  filters: IExtensionFilters;
  comparator: (a: any, b: any) => number;
};


