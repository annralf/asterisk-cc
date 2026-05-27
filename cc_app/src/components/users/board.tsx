'use client';

import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material'
import React, { useEffect, useState } from 'react';

import { IUser, IPagination } from '@/src/types/app';
import { getUsers, deleteUser, uploadAvatar } from '@/src/services/user';
import ModalUser from './modal';
import { toast } from 'src/components/snackbar';


const UserList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState<IUser>();
  
  const limit = 10;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchUsers = async (page: number, limit: number) => {
    try {
      const { users, pagination } = await getUsers(page, limit);
      setUsers(users);
      setPagination(pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = (data: IUser) => {
    setToEdit(data);
    setOpen(true);
  }

  const handleDeleteUser = async (id: any) => {
    try {
      const result = await deleteUser(id);
      console.log(result.message);
      toast.info(result.message);
      setUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (error) {
      toast.error('Error deleting User', error.message);
      console.error('Error deleting User', error.message);
    }
  };

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page])

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.first_name}</TableCell>
                <TableCell>{row.last_name}</TableCell>
                <TableCell>{row.access_type}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditUser(row)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDeleteUser(row.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
      {
        pagination && (
          <div>
            <button onClick={() => setPage(pagination.page - 1)} disabled={pagination.page === 1}>
              Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.pages}
            </span>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Siguiente
            </button>
          </div>
        )}
      </TableContainer >
      <ModalUser open={open} onClose={handleClose} user={toEdit}/>
    </Box>
)}

export default UserList