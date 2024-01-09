import { useTranslation } from 'react-i18next';
import { Text } from '../../../designSystem/Text'
import { Button, ButtonProps, styled } from "@mui/material";


const SupportInfo = ({viewMoreUrl, adminMessageHtml}) => {
    const { t } = useTranslation();

    const ViewMoreButton = styled(Button)<ButtonProps>(() => ({
        color: '#455FE9',
        border: '1px solid #455FE9',
        padding: '6px, 12px, 6px, 12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 400,
    }));
  return (
    <div className="p-4 h-fit w-[360px]">
        <div className="flex justify-start">
            <Text className="text-black" fontWeight="medium" fontSize="lg">
                {t('Support')}
            </Text>
        </div>
        <div className="mt-4 flex flex-col gap-5">
            <Text className="text-[#495057]" fontWeight="regular" fontSize="sm">
                {adminMessageHtml}
            </Text>
            <div className="w-full flex justify-end">
                <ViewMoreButton style={{ textTransform: 'none', fontFamily: "Vazirmatn, sans-serif"}} onClick={() => window.open(viewMoreUrl, '_blank')}>
                    {t('View More')}
                </ViewMoreButton>
            </div>
        </div>
    </div>
  )
}

export default SupportInfo