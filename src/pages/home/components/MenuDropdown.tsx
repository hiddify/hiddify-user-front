import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DnsIcon from '@mui/icons-material/Dns';
import TelegramIcon from '@mui/icons-material/Telegram';
import SpeedIcon from '@mui/icons-material/Speed';
import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';
import HomeIcon from '@mui/icons-material/Home';


type propsTypes = {
  dohModal: React.Dispatch<React.SetStateAction<boolean>>;
  showAllConfigs: () => void;
  showTeleProxy: () => void;
  handleGoToSpeedTest: () => void;
  setChangeLangModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMainBodyFun: () => void;
}

const MenuDropdown: React.FC<propsTypes> = ({dohModal, showTeleProxy, showAllConfigs, handleGoToSpeedTest, setChangeLangModal, showMainBodyFun}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { t, i18n: {language} } = useTranslation();

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: language === 'fa' ? 'unset' : theme.spacing(1.5),
          marginLeft: language === 'fa' ? theme.spacing(1.5) : 'unset'
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  return (
    <>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        size='small'
        className='bg-transparent [&.css-bb99s9-MuiButtonBase-root-MuiButton-root]:min-w-[unset]'
        onClick={handleClick}
      >
        <MenuIcon sx={{ color: '#343A40'}} />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem 
          onClick={() => {
            showMainBodyFun(); handleClose()}
          } 
          disableRipple
        >
          <HomeIcon />
          {t('Home')}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            showAllConfigs(); handleClose()}
          } 
          disableRipple
        >
          <QrCodeIcon />
          {t('All Configs')}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            showTeleProxy(); handleClose()}
          } 
          disableRipple
        >
          <TelegramIcon />
          {t('Telegram Proxy')}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            dohModal(true); handleClose()}
          } 
          disableRipple
        >
          <DnsIcon />
          {t('DNS over HTTPS')}
        </MenuItem>
        <MenuItem onClick={() => { handleGoToSpeedTest(); handleClose();}} disableRipple>
          <SpeedIcon />
          {t('Speed Test')}
        </MenuItem>
        <MenuItem onClick={() => { setChangeLangModal(true); handleClose();}} disableRipple>
          <TranslateIcon />
          {t('Language Settings')}
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default MenuDropdown
