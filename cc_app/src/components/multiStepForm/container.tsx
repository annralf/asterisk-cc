'use client'
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import ExtensionForm from './extensionForm';
import ServiceForm from './serviceForm';
import UserForm from './userForm';
import ConfirmationSteps from './confirmation';
import { DashboardContent } from '@/src/layouts/dashboard';


const steps = [ 'Extensión', 'Configuración de Campaña', 'Información del Usuario', 'Confirmación' ];

const Wizard: React.FC = () => {
    const [ activeStep, setActiveStep ] = useState(0); // Estado del paso actual

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const StepContent: React.FC<{ step: number }> = ({ step }) => {
        switch (step) {
            case 0:
                return <ExtensionForm onNext={handleNext} />;
            case 1:
                return <ServiceForm onNext={handleNext} onBack={handleBack} />;
            case 2:
                return <UserForm onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <ConfirmationSteps onBack={handleBack} onSubmit={handleReset} />;
            default:
                return <Typography>Step desconocido</Typography>;
        }
    };

    return (
        <Box>
            <DashboardContent>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box mt={4}>
                    {activeStep === steps.length ? (
                        <Box>
                            <Typography>¡Todos los pasos completados!</Typography>
                            <Button onClick={handleReset} variant="outlined">
                                Reiniciar
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <StepContent step={activeStep} />
                        </Box>
                    )}
                </Box>
            </DashboardContent>

        </Box>
    );
};

export default Wizard;
