import { InputAdornment, TextField } from '@mui/material'
import { Text } from '../../../../designSystem/Text'
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';

const TableHeader = ({ setSearch, search, configsCount }) => {
    const { t, i18n: {language} } = useTranslation();

  return (
    <div className='pb-3 pt-5 flex sm:items-center sm:justify-between flex-col sm:flex-row gap-5'>
        <Text fontSize='lg' fontWeight='medium'>
            {t('All Configurations')} {`(${configsCount})`}
        </Text>
        <div className='flex items-center gap-3 w-full sm:max-w-[240px]'>
                <Input 
                    className='w-full rounded-full font-[Vazirmatn, sans-serif]'
                    size="large" 
                    value={search}
                    onChange={(val) => {setSearch(val.target.value)}}
                    placeholder={t("Search Configs")} 
                    prefix={<SearchIcon className='text-[#ADB5BD]' />} 
                />
        </div>
    </div>
  )
}

export default TableHeader