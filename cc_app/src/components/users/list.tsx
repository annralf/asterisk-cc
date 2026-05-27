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

import { sumBy } from 'src/utils/helper';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
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
import { UserTable } from './table';
import { UserTableToolbar } from './user-table-toolbar';
import { UserTableFiltersResult } from './table-filters-results';
import { IUser, IPagination } from '@/src/types/app';

import { getUsers, deleteUser, uploadAvatar } from '@/src/services/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'first_name', label: 'Nombres' },
  { id: 'acces_type', label: 'Tipo de usuario' },
  { id: 'createdAt', label: 'Fecha de ingreso' },
  { id: 'email', label: 'Correo electrónico' },
  { id: '' },
];

export interface IUserFilters {
  first_name: String;
  access_type: String;
  createdAt : Dayjs | null;
  email: String;
}

// ----------------------------------------------------------------------

export function UserList() {
  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'first_name' });

  const confirm = useBoolean();
  const [users, setUsers] = useState<IUser[]>([]);
  const [tableData, setTableData] = useState<IUser[]>(users);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);

  const filters = useSetState<IUserFilters>({
    first_name: '',
    access_type:'',
    createdAt: null,
    email: '',    
  });

  const limit = 10;
  

  const dataFiltered: IUser[] = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state
  }) || [];

  /**
   * Setup the user data
   */

  const fetchUsers = async (page: number, limit: number) => {
      try {
        const { users, pagination } = await getUsers(page, limit);
        console.log(users);
        setTableData(users);
        setPagination(pagination);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    filters.state.first_name ||
    filters.state.createdAt  ||
    filters.state.email  

    const notFound = Boolean((!dataFiltered.length && canReset) || dataFiltered.length === 0);

  const getUserLength = (access_type: string) =>
    tableData.filter((item) => item.access_type === access_type).length;

  const TABS = [
    {
      value: 'all',
      label: 'Total',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'active',
      label: 'Activos',
      color: 'success',
      count: '2',
    },
    {
      value: 'inactive',
      label: 'Pausados',
      color: 'warning',
      count: '3',
    }    
  ] as const;

  const handleDeleteRow = useCallback(
    (id: number | undefined) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(String(row.id)));

    toast.success('Eliminado con éxito!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.user.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ first_name: newValue });
    },
    [filters, table]
  );

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Usuarios"
          links={[
            { name: 'Configuración', href: paths.setup.main },
            { name: 'Usuario',},           
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo usuario
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>        

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}           
          />

          {canReset && (
            <UserTableFiltersResult
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
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTable
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(String(row))}
                        onEditRow={() => handleEditRow(String(row.id))}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Desea eliminar estos<strong> {table.selected.length} </strong> usuarios?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IUser[] | [];
  filters: IUserFilters;
  comparator: (a: any, b: any) => number;
};
/* 
function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const dataFiltered = inputData.filter((row) => {
    const nameMatch = filters.first_name ? row.first_name?.toLowerCase().includes(filters.first_name.toLowerCase()) : true;
    const accessTypeMatch = filters.access_type ? row.access_type?.toLowerCase().includes(filters.access_type.toLowerCase()) : true;
    const emailMatch = filters.email ? row.email?.toLowerCase().includes(filters.email.toLowerCase()) : true;
    const createdAtMatch = filters.createdAt
    ? fIsBetween(row.created_at, filters.createdAt.startOf('day'), filters.createdAt.endOf('day'))
    : true;
    return nameMatch && accessTypeMatch && emailMatch && createdAtMatch;
  });
  return dataFiltered.sort(comparator); */
function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { first_name } = filters;

  
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    /* console.log('a',a)
    console.log('b',b) */
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (first_name) {
    inputData = inputData.filter(
      (user) =>
        user.first_name.toLowerCase().indexOf(first_name.toLowerCase()) !==  -1
    );
  }

  /* if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service))
    );
  } */

  /* if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => fIsBetween(invoice.createDate, startDate, endDate));
    }
  } */
  console.log(inputData)
  return inputData;

}