import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Text } from '../../../designSystem/Text'
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useAPI from '../../../hooks/useAPI';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

type propsType = {
    setChangeLangModal: Dispatch<SetStateAction<boolean>>
}

const ChangeLangModal: React.FC<propsType> = ({ setChangeLangModal }) => {
    const { t, i18n: {changeLanguage, language} } = useTranslation();
    const [lang, setLang] = useState(language ? language : 'en')

    const patchLang = useAPI('me/', 'PATCH', {});

    const getInfo = useAPI(
        'me/',
        'GET',
        { reactQueryOptions: { enabled: true } }
      );

    const getApps = useAPI(
        'apps/',
        'GET',
        { reactQueryOptions: { enabled: true } }
      );

    useEffect(() => {
        if(getInfo.data && getInfo.data.lang){
            setLang(getInfo.data.lang);
        }
    }, [getInfo.data])

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value as string);
    };

    const handleConfirm = async () => {
        changeLanguage(lang)
        try {
            await patchLang.mutateAsync({
                language: lang,
                telegram_id: 0
              });
            getInfo.refetch()
            getApps.refetch()
            setChangeLangModal(false)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-full flex flex-col gap-4 md:w-[400px]'>
        <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>
            {t('Choose your preferred language:')}
        </Text>
        <div className='w-full'>
            <FormControl fullWidth>
                <Select
                    style={{ fontFamily: "Vazirmatn, sans-serif" }}
                    id="demo-simple-select"
                    value={lang}
                    className='w-full'
                    onChange={handleChange}
                >
                    <MenuItem style={{ fontFamily: "Vazirmatn, sans-serif" }} value={'en'}>{'🇬🇧 ' + t('English')}</MenuItem>
                    <MenuItem style={{ fontFamily: "Vazirmatn, sans-serif" }} value={'fa'}>{'🇮🇷 ' + t('Farsi')}</MenuItem>
                    <MenuItem style={{ fontFamily: "Vazirmatn, sans-serif" }} value={'zh'}>{'🇨🇳 ' + t('Chinese')}</MenuItem>
                    <MenuItem style={{ fontFamily: "Vazirmatn, sans-serif" }} value={'ru'}>{'🇷🇺 ' + t('Russian')}</MenuItem>
                    <MenuItem style={{ fontFamily: "Vazirmatn, sans-serif" }} value={'pt'}>{'🇵🇹 ' + t('Portuguese')}</MenuItem>
                </Select>
            </FormControl>
        </div>
        <div className='w-full flex items-center justify-end'>
            <LoadingButton
                loading={patchLang.isLoading}
                disabled={patchLang.isLoading}
                onClick={handleConfirm}
                loadingPosition="start"
                dir="ltr"
                startIcon={patchLang.isLoading && <SaveIcon />}
                style={{
                    textTransform: 'none',
                    fontFamily: "Vazirmatn, sans-serif",
                    color: 'white',
                    backgroundColor: '#455FE9',
                    border: '1px solid #455FE9',
                    borderRadius: '8px'
                }}
            >
                {t('Confirm')}
            </LoadingButton>
        </div>
    </div>
  )
}

export default ChangeLangModal