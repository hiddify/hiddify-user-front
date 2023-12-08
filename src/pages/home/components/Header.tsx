import { Text } from "../../../designSystem/Text"
import ShareIcon from '@mui/icons-material/Share';
import MenuDropdown from "./MenuDropdown";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, CardMedia, Tooltip } from "@mui/material";
import HLogo from '@assets/images/hiddify-logo.png'
import { Modal } from "../../../designSystem/Modal";
import ShareLinks from "./ShareLinks";
import DohContent from "./DohContent";
import { useTranslation } from "react-i18next";
import TranslateIcon from '@mui/icons-material/Translate';
import ChangeLangModal from "./ChangeLangModal";
import { getCurrentUrl } from "../../../utils/getCurrentUrl";

type propsTypes = {
  setShowAllConfigs:  Dispatch<SetStateAction<boolean>>;
  setShowTeleProxy:  Dispatch<SetStateAction<boolean>>;
  setShowMainBody:  Dispatch<SetStateAction<boolean>>;
  showAllConfigs: boolean;
  showTeleProxy: boolean;
  showMainBody: boolean;
}

const Header: FC<propsTypes> = (props) => {
  const { 
    setShowAllConfigs, 
    setShowTeleProxy, 
    setShowMainBody, 
    showAllConfigs, 
    showTeleProxy, 
    showMainBody,
  } = props;

  const [shareModal, setShareModal ] = useState(false)
  const [dohModal, setDohModal ] = useState(false)
  const [changeLangModal, setChangeLangModal] = useState(false)

  const { t } = useTranslation();

  const showMainBodyFun = () => {
    setShowAllConfigs(false)
    setShowTeleProxy(false)
    setShowMainBody(true)
  }

  const showAllConfigsFun = () => {
    setShowAllConfigs(true)
    setShowTeleProxy(false)
    setShowMainBody(false)
  }

  const showTeleProxyFun = () => {
    setShowAllConfigs(false)
    setShowTeleProxy(true)
    setShowMainBody(false)
  }

  const handleGoToSpeedTest = () => {

    const currentUrl = getCurrentUrl(false)
    // Navigate to the new URL
    window.open(currentUrl + '/speedtest/', '_blank');
  };

  return (
    <>
      <div className={`md:hidden ${showMainBody && 'bg-[#E0E4F5] bg-opacity-50'} w-full h-[10%] flex items-center justify-between px-5 py-3`}>
        <MenuDropdown 
          dohModal={setDohModal} 
          setChangeLangModal={setChangeLangModal}
          showAllConfigs={showAllConfigsFun}
          showTeleProxy={showTeleProxyFun}
          handleGoToSpeedTest={handleGoToSpeedTest}
          showMainBodyFun={showMainBodyFun}
        />
        <div onClick={showMainBodyFun} className="flex items-center gap-3 cursor-pointer">
          <CardMedia
              sx={{ height: 24, width: 24, marginBottom: 1 }}
              image={HLogo}
              title="Hiddify Logo"
          />
          <Text 
            fontWeight="medium" 
            fontSize="xl" 
            className="text-[#455FE9]" 
          >
            {t('Hiddify')}
          </Text>
        </div>
        <Button onClick={() => setShareModal(true)} className='bg-transparent [&.css-1e6y48t-MuiButtonBase-root-MuiButton-root]:min-w-[unset]'>
          <ShareIcon sx={{ color: '#292D32'}} />
        </Button>
      </div>
      <div className="hidden w-full md:w-8/12 md:min-w-[650px] h-[10%] bg-transparent md:flex items-center justify-between py-3">
        <div className="w-fit flex items-center lg:gap-8 xl:gap-11 md:gap-5">
          <div onClick={showMainBodyFun} className="flex items-center gap-3 cursor-pointer">
            <CardMedia
                sx={{ height: 24, width: 24, marginBottom: 1 }}
                image={HLogo}
                title="Hiddify Logo"
            />
            <Text fontWeight="semibold" fontSize="lg" className="hidden lg:block text-[#455FE9]" >{t('Hiddify')}</Text>
          </div>
          <Text 
            onClick={showMainBodyFun} 
            fontWeight="semibold" 
            fontSize="xl" 
            className={`text-[#495057] cursor-pointer ${showMainBody && 'underline decoration-[#455FE9] decoration-solid decoration-[2px] underline-offset-8'}`}
          >
            {t('Home')}
          </Text>
          <Text 
            onClick={showAllConfigsFun} 
            fontWeight="semibold" 
            fontSize="lg" 
            className={`text-[#495057] cursor-pointer ${showAllConfigs && 'underline decoration-[#455FE9] decoration-solid decoration-[2px] underline-offset-8'}`}
          >
            {t('All Configs')}
          </Text>
          <Text 
            onClick={showTeleProxyFun} 
            fontWeight="semibold" 
            fontSize="lg" 
            className={`text-[#495057] cursor-pointer ${showTeleProxy && 'underline decoration-[#455FE9] decoration-solid decoration-[2px] underline-offset-8'}`}
          >
            {t('Telegram proxy')}
          </Text>
          <Text 
            onClick={() => setDohModal(true)} 
            fontWeight="semibold" 
            fontSize="lg" 
            className={`text-[#495057] cursor-pointer ${dohModal && 'underline decoration-[#455FE9] decoration-solid decoration-[2px] underline-offset-8'}`}
          >
            {t('DoH')}
          </Text>
          <Text 
            fontWeight="semibold" 
            fontSize="lg" 
            className={`text-[#495057] cursor-pointer`}
            onClick={handleGoToSpeedTest}
          >
            {t('Speed test')}
          </Text>
        </div>
        <Button
          size='small'
          className='bg-transparent [&.css-bb99s9-MuiButtonBase-root-MuiButton-root]:min-w-[unset]'
          onClick={() => setChangeLangModal(true)}
        >
          <Tooltip title="Change language" >
            <TranslateIcon sx={{ color: '#495057'}} />
          </Tooltip>
        </Button>
      </div>

      <Modal title={t("Panel Link")} isModalOpen={shareModal} closeModal={() => setShareModal(false)}>
        <ShareLinks isModalOpen={shareModal} />
      </Modal>

      <Modal title={t("DNS over HTTPS (DoH)")} isModalOpen={dohModal} closeModal={() => setDohModal(false)}>
        <DohContent />
      </Modal>

      <Modal title={t("Change language")} isModalOpen={changeLangModal} closeModal={() => setChangeLangModal(false)}>
        <ChangeLangModal />
      </Modal>
    </>
  )
}

export default Header