import { Button, ButtonProps, InputAdornment, TextField, styled } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Countdown from 'react-countdown';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { Text } from '../../../designSystem/Text';
import useAPI from '../../../hooks/useAPI';
import CircularProgress from '@mui/material/CircularProgress';
import { QRCode } from 'react-qrcode-logo';
import copy from 'clipboard-copy';
import { useTranslation } from 'react-i18next';
import HlogoPurpleBg from "@assets/images/apple-touch-icon.png"
import HlogoWhiteBg from "@assets/images/apple-touch-icon.png"
import React from 'react';


type propsTypes = {
  isModalOpen?: boolean;
}


const ShareLinks: React.FC<propsTypes> = ({ isModalOpen }) => {
  const { t } = useTranslation();
  const getShortLink = useAPI(
    'short/',
    'get',
    { reactQueryOptions: { enabled: true } }
  );

  const getInfo = useAPI(
    'me/',
    'get',
    { reactQueryOptions: { enabled: true } }
  );

  const CopyButton = styled(Button)<ButtonProps>(() => ({
    color: '#ADB5BD',
    minWidth: 'unset',
  }));


  const PanelLinkInput = styled(TextField)({
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


  const renderer = ({ minutes, seconds, completed }) => {
      return <span className='text-red-500'>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
  };
  

  return (
    <div className='flex flex-col gap-5 justify-between h-full'>
        <PanelLinkInput 
            id="custom-css-outlined-input" 
            className='w-full'
            dir="ltr"
            size="small"
            defaultValue={getInfo.data?.profile_url ? getInfo.data?.profile_url : ''}
            disabled
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      {getInfo.isLoading ? 
                        <CircularProgress size={20} thickness={4}/>
                        :
                        <CopyButton onClick={() => copy(getInfo.data?.profile_url ? getInfo.data?.profile_url : '')}>
                            <ContentCopyIcon />
                        </CopyButton>
                      }
                    </InputAdornment>
                )
            }}
        />
        <div className='w-full flex items-center justify-center'>
            {getInfo.isLoading ? 
              <CircularProgress size={40} thickness={8}/>
              :
              <div className="w-fit h-fit flex justify-center items-center scale-in-center">
                <QRCode
                  id="profile-qr-code"
                  value={getInfo.data?.profile_url ? getInfo.data?.profile_url : ''}
                  bgColor='transparent'
                  fgColor='#495057'
                  ecLevel='M'
                  logoImage={isModalOpen ? HlogoWhiteBg : HlogoPurpleBg}
                  logoWidth={50}
                  logoHeight={50}
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
            }
        </div>
        {/* <div className='flex gap-5 flex-col'>
            <div className='flex flex-col gap-3'>
                <Text fontSize='base' fontWeight='regular' className='text-[#212529]'>{t('Temporary Short Link')}</Text>
                <Text fontSize='xs' fontWeight='regular' className='text-[#212529]'>
                    {t('Please open this link in a browser; it will expire in 5 minutes for security reasons.')}
                </Text>
            </div>
            <PanelLinkInput 
                id="custom-css-outlined-input" 
                className='w-full'
                size="small"
                dir="ltr"
                multiline
                disabled
                defaultValue={getShortLink.data?.full_url ? getShortLink.data?.full_url : ''}
                InputProps={{
                    style: { resize: "both" },
                    endAdornment: (
                        <InputAdornment position="end">
                                {getShortLink.isLoading ? 
                                <CircularProgress size={20} thickness={4}/>
                                :
                                <div className='flex flex-col justify-center items-center'>
                                  <AvTimerIcon fontSize='small' />
                                  <Text fontSize='xs' fontWeight='regular' className='text-[#6C757D]'>
                                      <Countdown 
                                        onComplete={() => getShortLink.refetch()}
                                        zeroPadTime={2} 
                                        renderer={renderer} 
                                        date={new Date().setSeconds(new Date().getSeconds() + getShortLink.data?.expire_in )} 
                                      />
                                  </Text>
                                  </div>
                                }
                        </InputAdornment>
                    )
                }}
            />
        </div> */}
    </div>
  )
}

export default ShareLinks