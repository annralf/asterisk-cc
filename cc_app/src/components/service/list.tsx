'use client';

import { useState, useCallback, useEffect } from 'react';

import { Box, Card, Table, Stack, Button, Divider, Tooltip, TableBody } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from '@/src/routes/paths';
import { useRouter } from '@/src/routes/hooks/use-router';
import { RouterLink } from '@/src/routes/components';

import { useBoolean } from '@/src/hooks/use-boolean';
import { useSetState } from '@/src/hooks/use-set-state';

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
import { AnalyticCard } from '../custom-components/analytic-card';

import { ServiceTableToolbar } from './toolbar';
import { ServiceTableFiltersResult } from './filter-results';
import { IServiceList, ServiceTable } from './table';
import { IService, IPagination } from '@/src/types/app';
import { orderBy } from '@/src/utils/helper';
import { channel } from 'diagnostics_channel';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';
import { Iconify } from '../iconify/iconify';
import { Scrollbar } from '../scrollbar';
import { UserTable } from '../users/table';
import { UserTableFiltersResult } from '../users/table-filters-results';
import { UserTableToolbar } from '../users/user-table-toolbar';

export interface IServiceFilters {
  channel: string;
  clientNames: string;
  clienId: number;
  startAt: IDatePickerControl;
}

const TABLE_HEAD = [
  { id: 'channel', label: 'Canal', alignRight: false },
  { id: 'clientNames', label: 'Nombre del cliente', alignRight: false },
  { id: 'clienId', label: 'ID del cliente', alignRight: false },
  { id: 'startAt', label: 'Fecha', alignRight: false },
  { id: 'actions', label: 'Acciones', alignRight: true },
];

const limit = 10;

export const ServiceList = () => {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'channel' });
  const confirm = useBoolean();
  const [services, setServices] = useState<IServiceList[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);

  const filters = useSetState<IServiceFilters>({
    channel: '',
    clientNames: '',
    clienId: 0,
    startAt: null,
  });

  const dataFiltered =
    applyFilter({
      inputData: services,
      comparator: getComparator(table.order, table.orderBy),
      filters: filters.state,
    }) || [];

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.channel ||
    !!filters.state.clientNames ||
    !!filters.state.clienId ||
    !!filters.state.startAt;

  const notFound =
    !services.length &&
    !filters.state.channel &&
    !filters.state.clientNames &&
    !filters.state.clienId &&
    !filters.state.startAt;

  const getServiceLength = (channel: string) =>
    services.filter((service) => service.channel === channel).length;

  const TABS = [
    { value: 'all', label: 'Todos' },
    { value: 'received', label: 'Recibidas' },
    { value: 'wrong', label: 'Con Novedad' },
    { value: 'closed', label: 'Cerradas' },
  ] as const;

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.service.edit(id));
    },
    [router]
  );
  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.service.details(id));
    },
    [router]
  );
  useEffect(() => {
    if (!services.length) {
      console.log('fetch services');
    }
  }, [services, pagination]);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Servicios"
          links={[{ name: 'Home', href: paths.service.main }]}
          action={
            <Button
              component={RouterLink}
              href={paths.service.new}
              variant="contained"
              startIcon={<Iconify icon="material-symbols-light:add-call-outline-sharp" 
                color="success.main"
              />}
            >
              Responder
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <ServiceTableToolbar filters={filters} onResetPage={table.onResetPage} />

          {canReset && (
            <ServiceTableFiltersResult
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
                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
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
                  {dataFiltered &&
                    dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <ServiceTable
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

type ApplyFilterProps = {
  inputData: IServiceList[] | [];
  filters: IServiceFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { channel, clientNames, clienId, startAt } = filters;

  if (inputData) {
    const stabilizedThis = inputData.map((el: any, index: any) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    inputData = stabilizedThis.map((el) => el[0]);

    if (channel) {
      inputData = inputData.filter((row: any) =>
        row.channel.toLowerCase().includes(channel.toLowerCase())
      );
    }
    return inputData;
  }

  return [];
}