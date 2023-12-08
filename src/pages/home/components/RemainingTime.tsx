import { useTranslation } from 'react-i18next';
import { Text } from '../../../designSystem/Text'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { ClickAwayListener, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';


const RemainingTime = ({ remainingDays, resetIn }) => {
    const [showFullTime, setShowFullTime] = useState(false)
    const { t } = useTranslation();

    const years = remainingDays ? Math.floor(remainingDays / 365) : 0;
    const months =remainingDays ? Math.floor((remainingDays % 365) / 30) : 0; // Assuming an average of 30 days per month

    let dateRepresentation = '';

    if (years > 0) {
        dateRepresentation = years + (years === 1 ? " " + t('year') : " " + t('years'));
    } else if (months > 0) {
        dateRepresentation = months + (months === 1 ? " " + t('month') : " " + t('months'));
    }

    const calculateRemainingTime = (days) => {
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const daysLeft = days % 30;
    
        return { years, months, days: daysLeft };
      };
    
      const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime(remainingDays));
    
      useEffect(() => {
        setTimeRemaining(calculateRemainingTime(remainingDays));
      }, [remainingDays]);

      const tooltipContent = (
        <div>
          {timeRemaining.years > 0 && (
            <span>{timeRemaining.years} {timeRemaining.years === 1 ? t('year') + ' ' : t('years') + ' '}</span>
          )}
          {timeRemaining.months > 0 && (
            <span>{timeRemaining.months} {timeRemaining.months === 1 ? t('month') + ' ' : t('months') + ' '}</span>
          )}
          {timeRemaining.days > 0 && (
            <span>{timeRemaining.days} {timeRemaining.days === 1 ? t('day') + ' ' : t('days') + ' '}</span>
          )}
        </div>
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
                        {remainingDays > 1000 ? <AllInclusiveIcon className='text-[#212529]' fontSize='small' /> : dateRepresentation ? dateRepresentation : '-'}
                    </Text>
                </div>
            </div>
        </Tooltip>
    </ClickAwayListener>
  )
}

export default RemainingTime