import { InputAdornment, TextField } from '@mui/material'
import { Text } from '../../../../designSystem/Text'
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useTranslation } from 'react-i18next';

const TableHeader = ({ setSearch, search, configsCount }) => {
    const { t } = useTranslation();

  return (
    <div className='pb-3 pt-5 flex sm:items-center sm:justify-between flex-col sm:flex-row gap-5'>
        <Text fontSize='lg' fontWeight='medium'>
            {t('All Configurations')} {`(${configsCount})`}
        </Text>
        <div className='flex items-center gap-3 w-full sm:max-w-[240px]'>
            <FilterAltOutlinedIcon fontSize='large' className='text-[#ADB5BD] mx-2' />
            <div className='w-full border border-solid border-[#ADB5BD] rounded-full px-3 pb-1 pt-1.5 flex items-center justify-center'>
                <TextField
                    size="small"
                    className='w-full'
                    variant="standard"
                    value={search}
                    onChange={(val) => {setSearch(val.target.value)}}
                    placeholder={t("Search Configs")}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className='text-[#ADB5BD]' />
                            </InputAdornment>
                        )
                    }}
                />
            </div>
        </div>
    </div>
  )
}

export default TableHeader