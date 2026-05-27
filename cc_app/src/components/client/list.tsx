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

import { ClientTableFiltersResult } from './filter-results';
import { ClientTable } from './table';
import { IService, IPagination, IClient } from '@/src/types/app';
import { orderBy } from '@/src/utils/helper';
import { channel } from 'diagnostics_channel';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';
import { Iconify } from '../iconify/iconify';
import { Scrollbar } from '../scrollbar';
import { UserTable } from '../users/table';
import { UserTableFiltersResult } from '../users/table-filters-results';
import { UserTableToolbar } from '../users/user-table-toolbar';
import { ClientTableToolbar } from './toolbar';
import { getClients } from '@/src/services/client';





/* export interface IClient  {

 } */

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'first_name', label: 'Nombre', alignRight: false },
  { id: 'id_type', label: 'Tipo de ID', alignRight: false },
  { id: 'id_number', label: 'Número de ID', alignRight: false },
  { id: 'mail', label: 'Correo Electrónico', alignRight: false },
  { id: 'address', label: 'Dirección', alignRight: false },
  { id: 'created_at', label: 'Fecha de Creación', alignRight: false },
  { id: 'phone_number', label: 'Teléfono', alignRight: false },
  { id: 'actions', label: 'Acciones', alignRight: true },
];


const limit = 10;

export const ClientList = () => {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'id' });
  const confirm = useBoolean();
  const [ clients, setClients ] = useState<IClient[]>([]);
  const [ pagination, setPagination ] = useState<IPagination | null>(null);

  const filters = useSetState<IClient>({
    id: 0,
    first_name: '',
    last_name: '',
    id_type: '',
    id_number: '',
    mail: '',
    address: '',
    created_at: null,	// Date
    updated_at: null,	// Date
    phone_number: '',
  });

  const dataFiltered = applyFilter({
    inputData: clients,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state
  }) || [];

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.first_name ||
    !!filters.state.last_name ||
    !!filters.state.phone_number;

  const notFound =
    !clients.length &&
    !filters.state.created_at &&
    !filters.state.updated_at 
    ;

 /*  const getServiceLength = (channel: string) =>
    clients.filter((client) => client. === channel).length; */

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
    [ router ]
  );
  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.service.details(id));
    },
    [ router ]
  );
  useEffect(() => {
    if (!clients.length) {
      getClients().then((response) => {
        setClients(response.clients);
        setPagination(response.pagination);
      });
      console.log('fetch clients');
    }
  }, [ ]);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Clientes"
          links={[ { name: 'Home', href: paths.dashboard.root } ]}
          action={
            <Button
              component={RouterLink}
              href='/clients/new'
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Agregar Clientes
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>

          <ClientTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <ClientTableFiltersResult
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
                  {dataFiltered && dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ClientTable
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
  inputData: IClient[] | [];
  filters: IClient;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { first_name,
    last_name,
    phone_number } = filters;

  if (inputData) {

    const stabilizedThis = inputData.map((el: any, index: any) => [ el, index ] as const);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[ 0 ], b[ 0 ]);
      if (order !== 0) return order;
      return a[ 1 ] - b[ 1 ];
    });
    inputData = stabilizedThis.map((el) => el[ 0 ]);

   /*  if (channel) {
      inputData = inputData.filter((row: any) => row.channel.toLowerCase().includes(channel.toLowerCase()));
    } */
    return inputData;
  }

  return [];
}