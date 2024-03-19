import { useTranslation } from 'react-i18next';
import { Text } from '../../../designSystem/Text'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { ClickAwayListener, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';


const RemainingTime = ({ remainingDays, resetIn }) => {
    const [showFullTime, setShowFullTime] = useState(false)
    const { t } = useTranslation();
    

      const tooltipContent = (
        <span>
          {t('Remaining time') + ': '}
          {remainingDays ? remainingDays + ' ' + t('Days') : '-'}
        </span>
      );

  return (
    <ClickAwayListener onClickAway={() => setShowFullTime(false)}>
        <Tooltip open={showFullTime} title={tooltipContent} placement="top">
            <div onClick={() => setShowFullTime(!showFullTime)} className="flex flex-col lg:flex-row items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-[#D6DEF7] rounded-[8px] flex items-center justify-center">
                        <AccessAlarmIcon sx={{ color: '#495057'}} />
                    </div>
                <div className="flex flex-col justify-center items-center gap-1 lg:items-start lg:justify-start">
                    <Text className="text-[#212529] whitespace-nowrap" fontSize="xs" fontWeight="light">
                        {t('Remaining time')}
                    </Text>
                    <Text className="text-[#212529] whitespace-nowrap" fontSize="sm" fontWeight="regular">
                        {remainingDays > 1000 ? <AllInclusiveIcon className='text-[#212529]' fontSize='small' /> : remainingDays ? remainingDays + ' ' + t('Days') : '-'}
                    </Text>
                </div>
            </div>
        </Tooltip>
    </ClickAwayListener>
  )
}

export default RemainingTime