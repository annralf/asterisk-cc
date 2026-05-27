'use client';

import { useState, useCallback, useEffect } from 'react';
import { IService, IPagination } from '@/src/types/app';

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
import { getServices, getFilteredService } from '@/src/services/campaing';
import { DashboardContent } from '@/src/layouts/dashboard';
import { AnalyticCard } from '../custom-components/analytic-card';

import ModalCampaign from './modal';
import ModalServiceCategoryForm from '../service-category/modal';

import { CampaignTableToolBar } from './table-toolbar';
import { CampaignTableFiltersResult } from './filters_results';
import { CampaignTable } from './table';
import { IServiceFilters } from '../service/list';

import { updateServices } from '@/src/services/campaing';

export interface ICampaignFilters {
  name: string;
  status: string;
  is_active: string;
}

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
  { id: 'is_active', label: 'Actividad', alignRight: false },
  { id: '', },
];

const limit = 10;

const CampaignList = () => {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IService[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);

  const [open, setOpen] = useState(false); // Estado para controlar el modal
  const [openCategory, setOpenCategory] = useState(false); // Estado para controlar el modal

  const handleOpen = () => setOpen(true); // Función para abrir el modal
  const handleClose = () => {
    fetchData();
    setOpen(false);
  }; // Función para cerrar el modal

  const [campaigns, setCampaigns] = useState<IService | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<number>(0);
  const [inactiveCampaigns, setInactiveCampaigns] = useState<number>(0);

   //User details
   const user = localStorage.getItem('user');
   const parsedUser = user ? JSON.parse(user) : '1';

  const HEAD_ANALITIC = [
    {
      title: 'Total de Campañas',
      total: tableData.length,
      icon: 'fluent:slide-text-call-20-regular',
      color: 'primary.light',
      percent: 100,
    },
    {
      title: 'Activas',
      total: activeCampaigns,
      icon: 'hugeicons:call-outgoing-02',
      color: 'info.light',
      percent: 100,
    },
    {
      title: 'Inactivas',
      total: inactiveCampaigns,
      icon: 'hugeicons:call-disabled-02',
      color: 'grey.500',
      percent: 100,
    },
  ];

  const options = {
    status: ['active', 'cancel'],
    is_active: ['true', 'false'],
  };

  const filters = useSetState<ICampaignFilters>({
    name: '',
    status: '',
    is_active: '',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  }) || [];
  
  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching services...');
      const response = await getServices(page, limit);
      setTableData(response.services);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching services:', error.message);
      toast.error('Error al cargar las campañas');
    }
  }, [page, limit]);

  const fetchCampaigns = useCallback(async() => {
    const actives: { services: IService[] } = await getFilteredService({
      is_active: true,
    });
    const inactives = await getFilteredService({ is_active: false });
    setActiveCampaigns(actives.services.length);
    setInactiveCampaigns(inactives.services.length);
  }, [activeCampaigns, inactiveCampaigns]);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || 
    !!filters.state.status ||
    !!filters.state.is_active;

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleEditRow = (service:IService) => {
    setCampaigns(service);
    setOpen(true);
  }

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.campaign.details(id));
    },
    [router]
  );

  const handleDisableRow = async (id: string) => {
    const data = {
      is_active: false,
      users : parsedUser
    }
    const response = await updateServices(id, data);
    fetchData();
    toast.info(`Campaña actualizada con éxito`);
    console.log('Service updated:', response.message);
  };

  const theme = useTheme();

  const handleDownloadCSV = () => {
    console.log('Descargando CSV...');
    const csvContent = [
      ['Campaña', 'Estado', ''],
      ...dataFiltered.map((row) => [
        row.name,
        row.status,
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
    const fileName = `campania_${currentDate}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  useEffect(() => {
    fetchCampaigns();
  }, [activeCampaigns, inactiveCampaigns]);

  console.log('tableData:', tableData);
  console.log('dataFiltered:', dataFiltered);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Colas"
          links={[
            { name: 'Configuración', href: paths.setup.main }, 
            { name: 'Colas'},
          ]}
          action={
           <Stack
           spacing={2}
           alignItems={{ xs: 'flex-end', md: 'center' }}
           direction={{ xs: 'column', md: 'row' }}
           sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
            <Button
              onClick={handleOpen}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{ width: { xs: '100%', md: 'auto' }, textAlign: 'left' }}
            >
              Nueva Cola
            </Button>
           </Stack>
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
          <CampaignTableToolBar
            filters={filters}
            onResetPage={table.onResetPage}
            options={options}
          />
          {canReset && (
            <CampaignTableFiltersResult
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
                      dataFiltered.map((row) => String(row.id))
                    )
                  }
                />
                <TableBody>
                {dataFiltered
                    .slice((page - 1) * limit, page * limit)
                    .map((row) => (
                      <CampaignTable
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(String(row.id))}
                        onEditRow={() => handleEditRow(row)}
                        onDisableRow={() => handleDisableRow(String(row.id))}
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
        <ModalCampaign open={open} onClose={handleClose} service={campaigns} />
        <ModalServiceCategoryForm open={openCategory} onClose={() => setOpenCategory(false)} serviceCategory={null} />
      </DashboardContent>
    </>
  );
};

type AplyFilterProps = {
  inputData: IService[] | [];
  filters: ICampaignFilters;
  comparator: (a: any, b: any) => number;
};

export const applyFilter = ({ inputData, filters, comparator }: AplyFilterProps) => {
  const { name, status, is_active } = filters;

  return inputData
    .filter((row) => {
      const nameMatch = name ? row.name?.toLowerCase().includes(name.toLowerCase()) : true;
      const statusMatch = status ? row.status?.toLowerCase().includes(status.toLowerCase()) : true;
      const isActiveMatch = is_active ? String(row.is_active) === is_active : true;
      
      return nameMatch && statusMatch && isActiveMatch;
    })
    .sort(comparator);
};

export default CampaignList;
