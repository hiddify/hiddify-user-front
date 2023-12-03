import { useTranslation } from 'react-i18next';
import { Text } from '../../../designSystem/Text'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

const RemainingTime = ({ remainingDays, resetIn }) => {
    const { t } = useTranslation();

    const years = remainingDays ? Math.floor(remainingDays / 365) : 0;
    const months =remainingDays ? Math.floor((remainingDays % 365) / 30) : 0; // Assuming an average of 30 days per month

    let dateRepresentation = '';

    if (years > 0) {
        dateRepresentation = years + (years === 1 ? " " + t('year') : " " + t('years'));
    } else if (months > 0) {
        dateRepresentation = months + (months === 1 ? " " + t('month') : " " + t('months'));
    }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
        <div className="w-8 h-8 bg-[#D6DEF7] rounded-[8px] flex items-center justify-center">
            <AccessAlarmIcon sx={{ color: '#495057'}} />
        </div>
        <div className="flex flex-col justify-center items-center gap-1 lg:items-start lg:justify-start">
            <Text className="text-[#212529] whitespace-nowrap" fontSize="xs" fontWeight="light">
                {t('Remaining time')}
            </Text>
            <Text className="text-[#212529] whitespace-nowrap" fontSize="sm" fontWeight="regular">
                {dateRepresentation}
            </Text>
        </div>
    </div>
  )
}

export default RemainingTime