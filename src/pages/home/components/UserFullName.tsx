import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Text } from '../../../designSystem/Text'
import { useTranslation } from 'react-i18next';

const UserFullName = ({ fullName }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-row items-center justify-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center">
            <AccountCircleOutlinedIcon sx={{ color: '#495057'}} />
        </div>
        <Text className="text-[#212529]" fontSize="sm" fontWeight="regular">
            {t('Welcome')}, <b>{fullName ?? ''}</b>
        </Text>
    </div>
  )
}

export default UserFullName