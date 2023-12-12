import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Text } from '../../../designSystem/Text';
import useAPI from '../../../hooks/useAPI';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button, ButtonProps, Collapse, IconButton, InputAdornment, TextField, styled } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'clipboard-copy';
import { useTranslation } from 'react-i18next';
import { QRCode } from 'react-qrcode-logo';
import Hlogo from "@assets/images/hiddify-logo-gray-bg-white.png"





function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const { t, i18n: {language} } = useTranslation();

  const TeleLinkInput = styled(TextField)({
    '& .MuiInput-underline:after': {
      borderBottomColor: '#B8C7F4',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#B8C7F4',
      },
      '&:hover fieldset': {
        borderColor: '#B8C7F4',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#B8C7F4',
      },
    },
  });

  const OpenTeleBtn = styled(Button)<ButtonProps>(() => ({
    color: 'white',
    backgroundColor: '#455FE9',
    border: '1px solid #455FE9',
    borderRadius: '8px',
    "&:hover": {
        backgroundColor: 'blue'
    }
  }));

  const CopyButton = styled(Button)<ButtonProps>(() => ({
    color: '#ADB5BD',
    minWidth: 'unset',
  }));

  const openTele = () => {
    const link = row?.link ? row.link : '';
    
    // Open a new tab with the specified link
    window.open(link, '_blank');
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { cursor: 'pointer' } }} onClick={() => setOpen(!open)}>
        <TableCell style={{ fontFamily: "Vazirmatn, sans-serif" }} align={language === "fa" ? 'right' : 'left'} sx={{ maxWidth: 200 }}>
            <Text fontSize='sm' fontWeight='regular' className='whitespace-nowrap' lineClamp='1'>{row?.title ? row?.title : ''}</Text>
        </TableCell>
        <TableCell style={{ fontFamily: "Vazirmatn, sans-serif" }} align={language === "fa" ? 'right' : 'left'} sx={{ maxWidth: 200 }}>
            <Text fontSize='sm' fontWeight='regular' tooltip={row?.link ? row?.link : ''} className='text-[#6C757D] line-clamp-1'>{row?.link ? row?.link : ''}</Text>
        </TableCell>
        <TableCell style={{ fontFamily: "Vazirmatn, sans-serif" }} align={language === "fa" ? 'left' : 'right'}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className='flex flex-col md:flex-row gap-5 p-5'>
              <div className="scale-in-center flex justify-center items-center">
                  <QRCode
                    size={150}
                    value={row?.link ? row?.link : ''}
                    bgColor='transparent'
                    fgColor='#495057'
                    ecLevel='M'
                    logoImage={Hlogo}
                    logoWidth={35}
                    logoHeight={35}
                    logoOpacity={1}
                    qrStyle="dots"
                    eyeRadius={5}
                    eyeColor="#495057"
                    logoPadding={10}
                    logoPaddingStyle="square"
                    quietZone={0}
                    removeQrCodeBehindLogo
                  />
              </div>
              <div className="flex flex-col gap-5 w-full">
                <TeleLinkInput 
                    id="custom-css-outlined-input" 
                    className='w-full'
                    size="small"
                    dir="ltr"
                    disabled
                    defaultValue={row?.link ? row?.link : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <div className='flex items-center gap-1'>
                                    <CopyButton onClick={() => copy(row?.link ? row?.link : '')}>
                                      <ContentCopyIcon />
                                    </CopyButton>
                                </div>
                            </InputAdornment>
                        )
                    }}
                />
                <div className='flex justify-center md:justify-start w-full '>
                  <OpenTeleBtn style={{ textTransform: 'none', fontFamily: "Vazirmatn, sans-serif" }} onClick={openTele}>
                      <Text fontSize='sm' fontWeight='regular' className='text-white whitespace-nowrap'>{t('Open Telegram')}</Text>
                  </OpenTeleBtn>
                </div>
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

  
const TeleProxy = () => {
    const { t, i18n: {language} } = useTranslation();

    const getTeleProxies = useAPI(
        'mtproxies/',
        'GET',
        { reactQueryOptions: { enabled: true } }
      );
    
      
  return (
    <div className='w-full h-full px-5 flex flex-col'>
        <div className='pb-3 pt-5 flex items-start justify-start flex-col gap-5'>
            <Text fontSize='lg' fontWeight='medium'>
              {t('Telegram proxy')}
            </Text>
            <Text fontSize='base' fontWeight='regular'>
              {t('To connect to Telegram choose a proxy.')}
            </Text>
        </div>
        <div className='w-full h-full overflow-auto'>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    {getTeleProxies.data ? 
                    <>
                        <TableHead>
                            <TableRow>
                                <TableCell align={language === "fa" ? 'right' : 'left'}>
                                    <Text fontSize='base' fontWeight='medium' className='whitespace-nowrap' lineClamp='1'>{t('Name')}</Text>
                                </TableCell>
                                <TableCell align={language === "fa" ? 'right' : 'left'}>
                                    <Text fontSize='base' fontWeight='medium' className='whitespace-nowrap' lineClamp='1'>{t('Domain')}</Text>
                                </TableCell>
                                <TableCell align={language === "fa" ? 'left' : 'right'}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getTeleProxies.data?.map((row, index) => (
                                <Row key={index} row={row} />
                            ))}
                        </TableBody>
                    </>
                    :
                    <Box className='flex items-center justify-center p-20 w-full h-full'>
                        <CircularProgress />
                    </Box>
                    }
                </Table>
            </TableContainer>
        </div>
    </div>
  );
}

export default TeleProxy;
