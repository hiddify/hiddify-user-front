import { Text } from '../../../../designSystem/Text'
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { Input, Spin } from 'antd';

type Props = {
  setSearch: (value: string) => void
  search?: string
  configsCount: number
  loading?: boolean
}

const TableHeader = ({ setSearch, search, configsCount, loading = false }: Props) => {
  const { t } = useTranslation()

  return (
    <div className="pb-3 pt-5 flex sm:items-center sm:justify-between flex-col sm:flex-row gap-5">
      <Text fontSize="lg" fontWeight="medium" className="flex items-center gap-2">
        {t('All Configurations')}
        {loading ? (
          <span className="inline-flex items-center gap-2 text-[#6C757D]">
            <Spin size="small" />
            <Text fontSize="sm" fontWeight="regular" className="text-[#6C757D]">
              {t('Loading')}
            </Text>
          </span>
        ) : (
          <span>{`(${configsCount})`}</span>
        )}
      </Text>
      <div className="flex items-center gap-3 w-full sm:max-w-[240px]">
        <Input
          className="w-full rounded-full"
          style={{ fontFamily: 'var(--ui-font)' }}
          size="large"
          value={search}
          disabled={loading}
          onChange={(val) => {
            setSearch(val.target.value)
          }}
          placeholder={t('Search Configs')}
          prefix={<SearchIcon className="text-[#ADB5BD]" />}
        />
      </div>
    </div>
  )
}

export default TableHeader
