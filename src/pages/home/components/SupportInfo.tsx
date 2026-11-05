import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '../../../designSystem/Text'
import Modal from '../../../designSystem/Modal/Modal'
import { Button, ButtonProps, styled } from "@mui/material";

const ViewMoreButton = styled(Button)<ButtonProps>(() => ({
    color: '#455FE9',
    border: '1px solid #455FE9',
    padding: '6px, 12px, 6px, 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 400,
}));

const ReadMoreButton = styled(Button)<ButtonProps>(() => ({
    color: '#455FE9',
    padding: '6px 4px',
    minWidth: 0,
    fontSize: '14px',
    fontWeight: 600,
}));

// The text fades out at the bottom when it is cut off.
const FADE = 'linear-gradient(to bottom, #000 calc(100% - 2.5rem), transparent)'

// title / moreText: the box's title and "View More" button set by the admin; null: hidden.
// The box shows the Lite text (adminMessageHtml) in the room it has. "Read More" opens a small window with the Full text
// (fullHtml) when the admin wrote one, else with the Lite text when it does not fit.
const SupportInfo = ({viewMoreUrl, adminMessageHtml, fullHtml = '', title, moreText}) => {
  const { t } = useTranslation()
  const clip = useRef<HTMLDivElement>(null)
  const [cut, setCut] = useState(false)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const box = clip.current
    if (!box) return
    const measure = () => setCut(box.scrollHeight > box.clientHeight + 1)
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    if (box.firstElementChild) observer.observe(box.firstElementChild)
    measure()
    return () => observer.disconnect()
  }, [adminMessageHtml])

  const hasFull = Boolean(fullHtml.trim())
  const readMore = hasFull || cut
  const buttonStyle = { textTransform: 'none', fontFamily: 'var(--ui-font)' } as const

  return (
    <div className="w-[360px] max-w-full max-h-full min-h-0 flex flex-col">
        {title !== null && (
        <div className="flex justify-start shrink-0">
            <Text className="text-black" fontWeight="medium" fontSize="lg">
                {title}
            </Text>
        </div>
        )}
        <div
            ref={clip}
            className={`${title !== null ? 'mt-4 ' : ''}min-h-0 overflow-hidden`}
            style={cut ? { maskImage: FADE, WebkitMaskImage: FADE } : undefined}
        >
            <Text className="text-[#495057]" fontWeight="regular" fontSize="sm">
                <div dangerouslySetInnerHTML={{ __html: adminMessageHtml }} />
            </Text>
        </div>
        {(readMore || moreText !== null) && (
        <div className="w-full flex items-center justify-between gap-3 mt-5 shrink-0">
            {readMore ? (
                <ReadMoreButton style={buttonStyle} onClick={() => setOpen(true)}>
                    {t('Read More')}
                </ReadMoreButton>
            ) : <span />}
            {moreText !== null && (
                <ViewMoreButton style={buttonStyle} onClick={() => window.open(viewMoreUrl, '_blank')}>
                    {moreText}
                </ViewMoreButton>
            )}
        </div>
        )}
        <Modal isModalOpen={open} closeModal={() => setOpen(false)} title={title ?? t('Support')}>
            <div className="w-[min(520px,calc(100vw-6rem))] max-h-[65vh] overflow-y-auto">
                <Text className="text-[#495057]" fontWeight="regular" fontSize="sm">
                    <div dangerouslySetInnerHTML={{ __html: hasFull ? fullHtml : adminMessageHtml }} />
                </Text>
            </div>
        </Modal>
    </div>
  )
}

export default SupportInfo
