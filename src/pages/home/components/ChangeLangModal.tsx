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

    const patchLang = useAPI('me/', 'patch', {});

    const getInfo = useAPI(
        'me/',
        'get',
        { reactQueryOptions: { enabled: true } }
      );

    const getApps = useAPI(
        'apps/',
        'get',
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
                    style={{ fontFamily: 'var(--ui-font)' }}
                    id="demo-simple-select"
                    value={lang}
                    className='w-full'
                    onChange={handleChange}
                >
                    <MenuItem style={{ fontFamily: 'var(--ui-font)' }} value={'en'}>{language !== 'fa' ? '🇬🇧 ' + t('English') : t('English') + ' 🇬🇧'}</MenuItem>
                    <MenuItem style={{ fontFamily: 'var(--ui-font)' }} value={'fa'}>{'🇮🇷 ' + t('Farsi')}</MenuItem>
                    <MenuItem style={{ fontFamily: 'var(--ui-font)' }} value={'zh'}>{language !== 'fa' ? '🇨🇳 ' + t('Chinese') : t('Chinese') + ' 🇨🇳'}</MenuItem>
                    <MenuItem style={{ fontFamily: 'var(--ui-font)' }} value={'ru'}>{language !== 'fa' ? '🇷🇺 ' + t('Russian') : t('Russian') + ' 🇷🇺'}</MenuItem>
                    <MenuItem style={{ fontFamily: 'var(--ui-font)' }} value={'pt'}>{language !== 'fa' ? '🇵🇹 ' + t('Portuguese') : t('Portuguese') + ' 🇵🇹'}</MenuItem>
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
                    fontFamily: 'var(--ui-font)',
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