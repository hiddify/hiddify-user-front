import { useTranslation } from 'react-i18next';
import { Text } from '../../../designSystem/Text'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

const UsedTraffic = ({ current, total }) => {
    const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
        <div className="w-8 h-8 bg-[#D6DEF7] rounded-[8px] flex items-center justify-center">
            <InsertChartOutlinedIcon sx={{ color: '#495057'}} />
        </div>
        <div className="flex flex-col justify-center items-center gap-1 lg:items-start lg:justify-start">
            <Text className="text-[#212529] whitespace-nowrap" fontSize="xs" fontWeight="light">
                {t('Used Traffic')}
            </Text>
            <Text className="text-[#212529] whitespace-nowrap" fontSize="sm" fontWeight="regular">
                {(current || total) ? Math.round(current * 1e5) / 1e5 + ' / ' + total + 'GB' : ''}
            </Text>
        </div>
    </div>
  )
}

export default UsedTraffic