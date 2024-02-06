import MainButton from "./MainButton"
import RemainingTime from "./RemainingTime";
import UsedTraffic from "./UsedTraffic";
import UserFullName from "./UserFullName";
import SupportInfo from "./SupportInfo";
import ShareLinks from "./ShareLinks";
import { Text } from "../../../designSystem/Text";
import useAPI from "../../../hooks/useAPI";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Modal } from "../../../designSystem/Modal";
import AppModal from "./AppModal";
import { getWindowData } from "../../../utils/getWindowData";
import useMediaQuery from "@hooks/useMediaQuery";
import modal from "antd/es/modal";
import { Button } from "antd";


const MainBody = () => {
  const [isAppModalOpen, setIsAppModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation();

  const isMobile = useMediaQuery('(max-width: 767px)');

  const getInfo = useAPI(
    'me/',
    'get',
    { reactQueryOptions: { enabled: true } }
  );

  const { deepLink } = getWindowData()


  useEffect(() => {
    // if(getInfo.data && !getInfo.data.telegram_id){
      setIsModalOpen(true)
    // }
  }, [getInfo.data])


  return (
      <div className="md:grid md:grid-cols-2 md:gap-3 w-full h-full">
        <div className="w-full h-full flex flex-col gap-2 md:gap-3 relative">
          <div className='w-full h-full bg-[#E0E4F5] rounded-b-[24px] md:rounded-[24px] bg-opacity-50 relative'>
            <div className="w-full absolute top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] md:-translate-y-1/2 flex items-center flex-col gap-7">
              <UserFullName fullName={getInfo.data?.profile_title ? getInfo.data?.profile_title : ''} />
              <div className="px-10 md:px-8 lg:px-10 w-full max-w-[400px] flex items-center justify-between">
                <UsedTraffic 
                  current={getInfo.data?.profile_usage_current ? getInfo.data?.profile_usage_current : ''} 
                  total={getInfo.data?.profile_usage_total ? getInfo.data?.profile_usage_total : ''} 
                />
                <RemainingTime 
                  remainingDays={getInfo.data?.profile_remaining_days ? getInfo.data?.profile_remaining_days : ''} 
                  resetIn={getInfo.data?.profile_reset_days ? getInfo.data?.profile_reset_days : ''}  
                />
              </div>
            </div>
          </div>
          <div className='w-full h-full bg-[#E0E4F5] rounded-t-[24px] md:rounded-[24px] bg-opacity-50 relative'>
            <div className="p-4 h-full  mt-5 md:m-0 bg-transparent flex items-center justify-center">
              <SupportInfo 
                viewMoreUrl={getInfo.data?.admin_message_url ? getInfo.data?.admin_message_url : ''} 
                adminMessageHtml={getInfo.data?.admin_message_html ? getInfo.data?.admin_message_html : ''} 
              />
            </div>
          </div>
          <MainButton onClick={() => setIsAppModalOpen(true)} />
          <Modal isModalOpen={isAppModalOpen} closeModal={() => setIsAppModalOpen(false)} title={t("Configure your VPN")}>
            <AppModal profileUrl={getInfo.data?.profile_url ? getInfo.data?.profile_url : ''} />
          </Modal>
        </div>
        <div className="w-full md:flex md:flex-col md:gap-5 hidden bg-[#E0E4F5] rounded-[24px] p-10 bg-opacity-50">
          <Text fontSize='lg' fontWeight='medium' className='text-[#212529]'>
              {t('Share Link')}
          </Text>
          {!isMobile && <ShareLinks />}
        </div>
        {isAppModalOpen ? <iframe className="hidden" src={deepLink} width="0" height="0"></iframe> : null}
        <Modal isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} title={t('Connect To Telegram')}>
          <div className="flex flex-col gap-10">
            <Text fontSize='base' fontWeight='medium' className='text-[#212529] max-w-[400px]'>
              {t('Please connect your Telegram account to the panel to know the latest status of your subscription')}
            </Text>
            <div className="flex flex-row justify-start items-center gap-5">
              <Button onClick={() => {window.open(getInfo.data && getInfo.data.telegram_bot_url ? getInfo.data.telegram_bot_url : '', '_blank')}} className="bg-blue-500">
                <Text fontSize='base' fontWeight='medium' className='text-white'>
                  {t('Connect To Telegram')}
                </Text>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  )
}

export default MainBody