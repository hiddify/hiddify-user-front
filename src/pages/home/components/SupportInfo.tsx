import { Text } from '../../../designSystem/Text'
import { Button, ButtonProps, styled } from "@mui/material";


// title / moreText: the box's title and "View More" button set by the admin; null: hidden
const SupportInfo = ({viewMoreUrl, adminMessageHtml, title, moreText}) => {

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
        {title !== null && (
        <div className="flex justify-start">
            <Text className="text-black" fontWeight="medium" fontSize="lg">
                {title}
            </Text>
        </div>
        )}
        <div className={`${title !== null ? 'mt-4 ' : ''}flex flex-col gap-5`}>
            <Text className="text-[#495057]" fontWeight="regular" fontSize="sm">
                <div dangerouslySetInnerHTML={{ __html: adminMessageHtml }} />
            </Text>
            {moreText !== null && (
            <div className="w-full flex justify-end">
                <ViewMoreButton style={{ textTransform: 'none', fontFamily: 'var(--ui-font)'}} onClick={() => window.open(viewMoreUrl, '_blank')}>
                    {moreText}
                </ViewMoreButton>
            </div>
            )}
        </div>
    </div>
  )
}

export default SupportInfo