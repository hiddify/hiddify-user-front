import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Text } from '../Text';


type propsTypes = {
    isModalOpen: boolean;
    closeModal: () => void;
    title: string;
    children: React.ReactNode,
}


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
   '& .MuiPaper-root' : {
    borderRadius: '16px',
    maxWidth: 'fit-content'
   },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
  

const Modal: React.FC<propsTypes> = ({ isModalOpen, closeModal, title, children }) => {

  return (
    <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={isModalOpen}
    >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            <Text fontSize='base' fontWeight='regular' className='text-[#212529]'>{title}</Text>
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
                position: 'absolute',
                right: 8,
                top: 12,
                color: '#212529',
            }}
        >
            <CloseIcon />
        </IconButton>
        <DialogContent>
          {children}
        </DialogContent>
    </BootstrapDialog>
  );
}

export default Modal;
