'use client';

import { Container, stepConnectorClasses, StepIconProps } from '@mui/material';

import { useEffect, useState } from 'react';

import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  styled,
  StepLabel,
  Typography,
  StepConnector,
  StepConnectorClasses,
} from '@mui/material';

import { Iconify } from '../iconify';
import { stylesMode, varAlpha } from '@/src/theme/styles';

import UserInitAuth from '../users/auth_init';
import NewContextForm from '../context/new-form';
import NewServiceForm from '../campaign/new-form';
import NewExtensionForm from '../extension/new-form';
import NewServiceCategoryForm from '../service-category/new-form';
import NewUser from '../users/new';
import CoreUpdatesTable from '../core/view-updates_log';
import CoreView from '../core/view';


import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getUserSession } from '@/src/auth/context/jwt';
import { getSystemLogs, updateSystemLog, createSystemLog } from '@/src/services/systemLog';

const STEPS = [
  'Acceso a la configuración inicial del sistema',
  'Configuración de Contextos de Optimus',
  'Configuración de Colas',
  'Configuración de Tipificaciones',
  'Configuracion de Extensiones',
  'Configuración de Usuarios',
  'Instalación de la Aplicación',
  'Monitoreo de Estatus del Servicio',
];
//=================================================Start Custom Stepper Components =====================================================
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [ `&.${stepConnectorClasses.alternativeLabel}` ]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [ `&.${stepConnectorClasses.active}` ]: {
    [ `& .${stepConnectorClasses.line}` ]: { borderColor: theme.vars.palette.success.main },
  },
  [ `&.${stepConnectorClasses.completed}` ]: {
    [ `& .${stepConnectorClasses.line}` ]: { borderColor: theme.vars.palette.success.main },
  },
  [ `& .${stepConnectorClasses.line}` ]: {
    borderRadius: 1,
    borderTopWidth: 3,
    borderColor: theme.vars.palette.divider,
  },
}));

const QontoStepIconRoot = styled('div')<{
  ownerState: {
    active?: boolean;
  };
}>(({ theme, ownerState }) => ({
  height: 22,
  display: 'flex',
  alignItems: 'center',
  color: theme.vars.palette.text.disabled,
  ...(ownerState.active && { color: theme.vars.palette.success.main }),
  '& .QontoStepIcon-completedIcon': {
    zIndex: 1,
    fontSize: 18,
    color: theme.vars.palette.success.main,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }}>
      {completed ? (
        <Iconify className="QontoStepIcon-completedIcon" icon="bi:check" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const ColorlibStepIconRoot = styled('div')<{
  ownerState: {
    completed?: boolean;
    active?: boolean;
  };
}>(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.vars.palette.text.disabled,
  backgroundColor: theme.vars.palette.grey[ 300 ],
  [ stylesMode.dark ]: { backgroundColor: theme.vars.palette.grey[ 700 ] },
  ...(ownerState.active && {
    backgroundColor: '#259ed7',
    color: 'rgb(255, 255, 255)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,0.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#259ed7',
    color: 'rgb(255, 255, 255)',
  }),
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [ `&.${stepConnectorClasses.alternativeLabel}` ]: { top: 22 },
  [ `&.${stepConnectorClasses.active}` ]: {
    [ `& .${stepConnectorClasses.line}` ]: {
      backgroundColor: '#259ed7',
      color: 'rgb(255, 255, 255)',
    },
  },
  [ `&.${stepConnectorClasses.completed}` ]: {
    [ `& .${stepConnectorClasses.line}` ]: {
      color: 'rgb(255, 255, 255)',
      backgroundColor: '#259ed7',
    },
  },
  [ `& .${stepConnectorClasses.line}` ]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.vars.palette.divider,
  },
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  const icons: {
    [ index: string ]: React.ReactElement;
  } = {
    1: <Iconify icon="lets-icons:user-alt-light" width={24} />,
    2: <Iconify icon="material-symbols-light:call-log-outline-sharp" width={24} />,
    3: <Iconify icon="material-symbols-light:stacks-outline" width={24} />,
    4: <Iconify icon="carbon:category-new-each" width={24} />,
    5: <Iconify icon="f7:scope" width={24} />,
    6: <Iconify icon="lets-icons:user-alt-light" width={24} />,
    7: <Iconify icon="material-symbols-light:install-desktop" width={24} />,
    8: <Iconify icon="hugeicons:configuration-02" width={24} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      <>{icons[String(icon)]}</>
    </ColorlibStepIconRoot>
  );
}

//=================================================End Custom Stepper Components =====================================================

const InitialSetup = () => {
  //const user = getUserSession(); 
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const [ user, setUser ] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getUserSession();
      setUser(session);
    };

    fetchUser();
  }, []);

  //=================================Start Functions to handle steps =================================================================
  const handleNext = () => setActiveStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  const handleBack = () => setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  const handleReset = () => router.push("/");

   const updateSystemStatus = async () => {
      const data = {
        service_status: "Configured",
        setup: true
      }
      const result = await getSystemLogs();
      if (result?.system_log[0]){
        await updateSystemLog(data, 1).then((data) => {
          console.log("System Setup ok");
        });
      }else{
        await createSystemLog(data).then((data) => {
          console.log("System Setup ok");
        });
      }
      router.push(paths.admin.main);
  
    }

  //=================================End Functions to handle steps =================================================================

  //=================================Start Functions to handle Context Form ========================================================
  const onCloseContextForm = () => {
    console.log('Close Context Form');
  };
  //=================================End Functions to handle Context Form ==========================================================

  //=================================Start content handle===========================================================================
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
      default:
        return <UserInitAuth step_next={handleNext} step_back={handleBack} />;
      case 1:
        return (
          <NewContextForm
            context={null}
            onClose={onCloseContextForm}
            handleClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            step_next={handleNext}
            step_back={handleBack}
          />
        );
      case 2:
        return (
          <NewServiceForm
            service={null}
            onClose={onCloseContextForm}
            step_next={handleNext}
            step_back={handleBack}
          />
        );
      case 3:
        return (
          <NewServiceCategoryForm
            serviceCategory={null}
            onClose={onCloseContextForm}
            step_next={handleNext}
            step_back={handleBack}
          />
        );
    
      case 4:
        return (
          <NewExtensionForm
            extension={null}
            onClose={onCloseContextForm}
            step_next={handleNext}
            step_back={handleBack}
          />
        );
      case 5:
        return <NewUser user={null} step_next={handleNext} step_back={handleBack} />;
      case 6:
        return <CoreUpdatesTable step_next={handleNext} step_back={handleBack} />;
      case 7:
        return <CoreView />;
    }
  };
  //=================================End content handle=================================================================
  useEffect(() => {
    if (typeof window !== 'undefined' && user && activeStep === 0) {
      setActiveStep(1);
    }
  }, [ user ]);
  useEffect(() => { console.log('Active Step:', activeStep); }, [ activeStep ]);
  return (
    <>
      <Container sx={{ pt: { xs: 3, md: 5 }, pb: 10 }}>
        <Typography variant="h3" align="center" sx={{ mb: 2 }}>
          Configuración Inicial del Sistema
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
          Completa los pasos iniciar el sistema de call center.
        </Typography>

        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {/** Active form section */}
        {activeStep === STEPS.length ? (
          <>
            <Paper
              sx={{
                p: 3,
                my: 3,
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
              }}
            >
              <Typography sx={{ my: 1 }}>
                ¡Configuración completada! Sistema está listo para operar.
              </Typography>
            </Paper>

            <Button color="inherit" onClick={handleReset} sx={{ mr: 'auto' }}>
              Finalizar Configuración
            </Button>
          </>
        ) : (
          <>
            <Paper
              sx={{
                p: 3,
                my: 3,
                boxShadow: '7px 12px 20px 0 rgb(28 18 18 / 16%)',
              }}
            >
              <Typography component='div' sx={{ my: 1 }}>
                {typeof window !== 'undefined' && getStepContent(activeStep)}
              </Typography>
            </Paper>
            <Box sx={{ textAlign: 'right' }}>
              {
                activeStep === STEPS.length -1 && (
                  <Button variant="contained" onClick={updateSystemStatus} sx={{ mr: 1 }}>
                  Finalizar Configuración
                </Button>
                )
              }
             {/*   <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                {activeStep === STEPS.length - 1 ? 'Finish' : 'Next'}
              </Button> */}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default InitialSetup;