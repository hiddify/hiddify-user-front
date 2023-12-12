import { Modal } from '../../../../designSystem/Modal'
import { Text } from '../../../../designSystem/Text'
import { Button, ButtonProps, CircularProgress, InputAdornment, TextField, styled } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'clipboard-copy';
import { useTranslation } from 'react-i18next';
import { QRCode } from 'react-qrcode-logo';
import Hlogo from "@assets/images/hiddify-logo-gray-bg-white.png"




const ConfigModal = ({ closeModal, open, domain, link }) => {
    const { t } = useTranslation();

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

      const CopyLinkBtn = styled(Button)<ButtonProps>(() => ({
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
      
  return (
    <Modal closeModal={closeModal} isModalOpen={open} title={t('Subscription Link b64')}>
        <div className='w-full md:w-[400px] h-fit flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <Text fontSize='sm' fontWeight='light' className='text-[#6C757D]'>{t('Domain')}:</Text>
                <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>{domain}</Text>
            </div>
            <TeleLinkInput 
                  id="custom-css-outlined-input" 
                  className='w-full'
                  size="small"
                  dir="ltr"
                  disabled
                  defaultValue={link ? link : ''}
                  InputProps={{
                      endAdornment: (
                          <InputAdornment position="end">
                              <div className='flex items-center gap-1'>
                                  <CopyButton onClick={() => copy(link ? link : '')}>
                                    <ContentCopyIcon />
                                  </CopyButton>
                              </div>
                          </InputAdornment>
                      )
                  }}
            />
            <div className="flex items-center justify-center">
                {!link ? 
                    <CircularProgress size={40} thickness={4}/>
                    :
                    <div className="scale-in-center flex justify-center items-center">
                      <QRCode
                        size={200}
                        value={link ? link : ''}
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
                }
            </div>
            <div className='flex items-center justify-center'>
                <CopyLinkBtn style={{ textTransform: 'none', fontFamily: "Vazirmatn, sans-serif"}} onClick={() => copy(link ? link : '')}>
                    <Text fontSize='sm' fontWeight='regular' className='text-white whitespace-nowrap'>{t('Copy Link')}</Text>
                </CopyLinkBtn>
            </div>
        </div>
    </Modal>
  )
}

export default ConfigModal