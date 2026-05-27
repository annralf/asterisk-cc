'use client';

import { useState, useCallback, useEffect, use } from 'react';

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
import { ServiceCategoryTableToolbar } from './table-toolbar';
import { ServiceCategoryTable } from './table';
import { ServiceCategoryTableFiltersResult } from './filter-results';

import { IServicesCategory, IPagination } from '@/src/types/app';

import { DashboardContent } from '@/src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import ModalCampaign from '../campaign/modal';

import { getServices } from '@/src/services/campaing';
import { getFilteredServiceCategories, getServiceCategories, ICategory, IServiceCategoryResponse, updateServiceCategory } from '@/src/services/serviceCategory';
import ModalServiceCategoryForm from './modal';

export interface IServiceCategoryFilters {
  name: string;
  service: any;
  is_active: string;
  campaign: string;
}

const TABLE_HEAD = [
  { id: 'campaign', label: 'Identificador de Cola', alignRight: false },
  { id: 'name', label: 'Tipificación', alignRight: false },
  { id: 'is_active', label: 'Estatus', alignRight: false },
  { id: '' },
];

const limit = 10;

export const ServiceCategoryList = () => {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'campaign' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<ICategory[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);

  const [open, setOpen] = useState(false); // Estado para controlar el modal

  const handleOpen = () => setOpen(true); // Función para abrir el modal
  const handleClose = () =>{ 
    console.log("close modal tipification")
    setServicesCategory(null);
    setOpen(false);
    fetchServicesCategory();
  };
  const [servicesCategory, setServicesCategory] = useState<IServicesCategory | null>(null);
  const [activeServicesCategory, setActiveServicesCategory] = useState<number>(0);
  const [inactiveServicesCategory, setInActiveServicesCategory] = useState<number>(0);

  const [servicesList, setServicesList] = useState<string[]>([]);

  //-------------------------------- Functions definitions
  const fetchServices = async () => {
    try {
      const response = await getServices();
      const serviceNames = response.services ? response.services.map((service) => service.name).filter((name): name is string => name !== undefined) : [];
      setServicesList(serviceNames);
    } catch (error) {
      toast.error('Error al cargar los servicios');
    }
  };

  const fetchServicesCategory = useCallback(async() => {
    try {
      const response = await getServiceCategories(page, limit);
      setTableData(response.categories);
      setTotalResults(response.pagination.total);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching services category', error);
      toast.error('Error al cargar las tipificaciones');
    }
  }, [page]);

  const fetchServicesCategoryCount = useCallback(async() => {
    try {
      const actives = await getFilteredServiceCategories(1, limit, { is_active: true });
      const inactives = await getFilteredServiceCategories(1, limit, { is_active: false });
      setActiveServicesCategory(actives.categories.length);
      setInActiveServicesCategory(inactives.categories.length);
    } catch (error) {
      console.error('Error fetching services category', error);
      toast.error('Error al cargar las tipificaciones');
    }
  }, []);

  
  const handleDownloadCSV = () => {
    console.log('Descargando CSV...');
    const csvContent = [
      ['Campaña', 'Estado', ''],
      ...dataFiltered.map((row) => [
        row.name,
        row.service.name,
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

    const handleDisable = async (id: string) => {
      try {
        await updateServiceCategory(id, { is_active: false });
        await fetchServicesCategory(); // Esperar que la actualización se refleje en los datos
        toast.success('Tipificación desactivada');
      } catch (error) {
        toast.error('Error al desactivar la tipificación');
      }
    };

    const handleEditRow = (serviceCategory:any) => {
      setServicesCategory(serviceCategory);
      handleOpen();
    };
    
    const handleViewRow = useCallback(
      (id: string) => {
        router.push(paths.categories.details(id));
      },
      [router]
    );

  //-------------------------------- Close Functions definitions

  const HEAD_ANALITIC = [
    {
      title: 'Total',
      total: tableData.length,
      icon: 'bx:tag',
      color: 'primary.light',
      percent: 100,
    },
    {
      title: 'Activas',
      total: activeServicesCategory,
      icon: 'mage:tag-check',
      color: 'info.light',
      percent: 100,
    },
    {
      title: 'Inactivas',
      total: inactiveServicesCategory,
      icon: 'mage:tag-cross',
      color: 'grey.500',
      percent: 100,
    },
  ];

  const options = {
    services: servicesList,
    status: ['true', 'false'],
  };

  const filters = useSetState<IServiceCategoryFilters>({
    service: '',
    name: '',
    is_active: '',
    campaign: '',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = filters.state.name || filters.state.service || filters.state.is_active;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length; 

  useEffect(() => {
    fetchServices();
    fetchServicesCategory();
    fetchServicesCategoryCount();
  },[]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Tipificaciones de Atención"
          links={[
            { name: 'Colas', href: paths.campaign.main }, 
            { name: 'Tipificaciones' }]}
          action={
            <Button
              onClick={handleOpen}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nueva Tipificación
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
          <ServiceCategoryTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={options}
          />
          {canReset && (
            <ServiceCategoryTableFiltersResult
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
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: ICategory) => (
                      <ServiceCategoryTable
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(String(row.id))}
                        onEditRow={() => handleEditRow(row)}
                        onDisableRow={() => handleDisable(String(row.id))}
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
      <ModalServiceCategoryForm open={open} onClose={handleClose} serviceCategory={servicesCategory}/>
    </>
  );
};

type AplyFilterProps = {
  inputData: ICategory[] | [];
  comparator: (a: any, b: any) => number;
  filters: IServiceCategoryFilters;
};

export const applyFilter = ({ inputData, filters, comparator }: AplyFilterProps) => {
  const dataFiltered = inputData.filter((row) => {
    const status = filters.name === '' || row.name.includes(filters.name);
    const service = filters.service === '' || row.service.name === filters.service;
    const is_active = filters.is_active === '' || row.is_active === (filters.is_active === 'true');
    const campaign = filters.campaign === '' || row.service.name === filters.campaign;
    return status && service && is_active && campaign;
  });

  return dataFiltered.sort(comparator);
};