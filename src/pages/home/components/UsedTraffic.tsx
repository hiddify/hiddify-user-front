import { useTranslation } from 'react-i18next';
import { Text } from '../../../designSystem/Text'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const UsedTraffic = ({ current, total }) => {
    const [showFullTraffic, setShowFullTraffic] = useState(false)
    const [roundedCurrent, setRoundedCurrent] = useState<number>()
    const [remaining, setRemaining] = useState<number>()
    const { t } = useTranslation();

    useEffect(() => {
        setRoundedCurrent(current > 10 ? Math.round(current * 1e1) / 1e1 : Math.round(current * 1e3) / 1e3)
        const minus = total - current
        setRemaining(minus > 10 ? Math.round(minus * 1e1) / 1e1 : Math.round(minus * 1e3) / 1e3)
    }, [current, total])

  return (
    <ClickAwayListener onClickAway={() => setShowFullTraffic(false)}>
        <Tooltip open={showFullTraffic} title={roundedCurrent ? t('Used Traffic') + ': ' + roundedCurrent + ' GB' : t('Used Traffic') + ': -'} placement="top">
            <div onClick={() => setShowFullTraffic(!showFullTraffic)} className="flex flex-col lg:flex-row items-center justify-center gap-2">
                <div className="w-8 h-8 bg-[#D6DEF7] rounded-[8px] flex items-center justify-center">
                    <InsertChartOutlinedIcon sx={{ color: '#495057'}} />
                </div>
                <div className="flex flex-col justify-center items-center gap-1 lg:items-start lg:justify-start">
                    <Text className="text-[#212529] whitespace-nowrap" fontSize="xs" fontWeight="light">
                        {t('Remaining Traffic')}
                    </Text>
                    <Text className="text-[#212529] whitespace-nowrap" fontSize="sm" fontWeight="regular">
                        <span dir="ltr">
                            {remaining && remaining > 1000 ? <AllInclusiveIcon className='text-[#212529]' fontSize='small' /> : remaining ? remaining + ' GB' : '-'}
                        </span>
                    </Text>
                </div>
            </div>
        </Tooltip>
    </ClickAwayListener>
  )
}

export default UsedTraffic