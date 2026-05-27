'use client';

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from '@mui/material';

import ModalCampaign from './modal';

import React, { useEffect, useState } from 'react';
import { IService, IPagination } from '@/src/types/app';
import { getServices, deleteService } from '@/src/services/campaing';
import { toast } from 'src/components/snackbar';

export interface ICampaign {
  userName: string;
  campaignName: string;
  id: string;
  status: string;
}

export interface IListConversationsProps {
  campaigns: ICampaign[];
}
const BoardCampaign = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState<IService>();

  const limit = 10;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchServices = async (page: number, limit: number) => {
    try {
      const { services, pagination } = await getServices(page, limit);
      setServices(services);
      setPagination(pagination);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleEditService = (data: IService) => {
    setToEdit(data);
    setOpen(true);
  };

  const handleDeleteService = async (id: any) => {
    try {
      const result = await deleteService(id);
      toast.info(result.message);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error deleting service', error.message);
    }
  };
  useEffect(() => {
    fetchServices(page, limit);
  }, []);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Campaña</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!services
              ? 'Sin data'
              : services.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditService(row)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleDeleteService(row.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {pagination && (
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
      </TableContainer>
      <ModalCampaign open={open} onClose={handleClose} service={toEdit} />
    </Box>
  );
};

export default BoardCampaign;