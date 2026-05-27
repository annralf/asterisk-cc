'use client'

import React, {useState, useEffect} from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid } from '@mui/material';
import { IExtension } from '@/src/types/app';
import { getExtensions, IPagination, IExtensionsResponse, deleteExtension, updateExtensions } from '@/src/services/extension';

import ModalExtensionForm from './modal';



type ListExtProps = {
  extensions: IExtension[] | null
}

const ListExtension = () => {
  const [extensions, setExtensions] = useState<IExtension[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [ open, setOpen ] = useState(false);
  const [toEdit, setToEdit] = useState<IExtension>();

  const limit = 10;

  const handleOpen = () => setOpen(true);  
  const handleClose = () => setOpen(false); 

  const fetchExtensions = async(page: number, limit: number) => {
    try{
      const { extensions, pagination } = await getExtensions(page, limit);
      setExtensions(extensions);
      setPagination(pagination);
    }catch(error){
      console.error("Error fetching extensions:", error);
    }
  }

  const handleEditExtension = (data:IExtension) => {
    setToEdit(data);
    setOpen(true);
  }

  const handleDeleteExtension = async(id:any) => {
    try{
      const result = await deleteExtension(id);
      console.log(result.message);

      setExtensions((prev) => prev.filter((ext) => ext.id !== id));
    }catch(error){
      console.error("Error deleting extension:", error);
    }
  }
  useEffect(() => {
    fetchExtensions(page, limit);
  },[]);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Extensión</TableCell>
              <TableCell>Estatus</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {!extensions ? 'Sin data' : extensions.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.identity}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleDeleteExtension(row.id)}>Eliminar</Button>
                  <Button variant="outlined" onClick={() => handleEditExtension(row)} >Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          pagination && (
            <div>
              <button onClick={() => setPage(pagination.page - 1)} disabled={pagination.page === 1}>Anterior</button>
              <span>Página {pagination.page} de {pagination.pages}</span>
              <button onClick={() => setPage(pagination.page + 1)} disabled={pagination.page === pagination.pages}>Siguiente</button>
            </div>
          )
        }
      </TableContainer>
      <ModalExtensionForm open={open} onClose={handleClose} extension={toEdit}/>
    </Box>
  )
}

export default ListExtension;
