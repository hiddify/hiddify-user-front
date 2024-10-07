import { Button, ButtonProps, CircularProgress, InputAdornment, TextField, styled } from '@mui/material';
import useAPI from '../../../hooks/useAPI';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Text } from '../../../designSystem/Text';
import copy from 'clipboard-copy';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "react-router-dom"



const DohContent = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams()
    const username = searchParams.get("username")
    const password = searchParams.get("password")
    const getInfo = useAPI(
        'https://tunnelino.com/api/v1/me',
        'get',
        {
          query: { username, password },
          reactQueryOptions: { enabled: true },
          // Pass the extracted query params to the API
        }
      );

    const CopyButton = styled(Button)<ButtonProps>(() => ({
        color: '#ADB5BD',
        minWidth: 'unset',
      }));
    
    const DohLinkInput = styled(TextField)({
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

  return (
    <div className='flex flex-col gap-5 h-full max-w-[500px]'>
        <Text fontSize='xs' fontWeight='regular' className='text-[#6C757D]'>
            {t(`There are several browsers compatible with DNS over HTTPS (DoH). This protocol lets you encrypt your connection to 1.1.1.1 in order to protect your DNS queries from privacy intrusions and tampering. Some browsers might already have this setting enabled.`)}
        </Text>
        <DohLinkInput 
            id="custom-css-outlined-input" 
            className='w-full'
            defaultValue={getInfo.data?.doh ? getInfo.data?.doh : ''}
            dir="ltr"
            disabled
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      {getInfo.isLoading ? 
                      <CircularProgress size={20} thickness={4}/>
                      :
                      <CopyButton onClick={() => copy(getInfo.data?.doh ? getInfo.data?.doh : '')}>
                          <ContentCopyIcon />
                      </CopyButton>
                      }
                    </InputAdornment>
                )
            }}
        />
    </div>
  )
}

export default DohContent