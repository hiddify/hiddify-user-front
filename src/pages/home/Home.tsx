import MainBody from "./components/MainBody"
import BrandAndLogo from "./components/BrandAndLogo"
import FooterSocialIcons from "./components/FooterSocialIcons"
import Header from "./components/Header"
import { AllConfigs } from "./allConfigs"
import { useEffect, useState } from "react"
import { TeleProxy } from "./teleProxy"
import useAPI from "../../hooks/useAPI"
import PreLoading from "./components/PreLoading"
import { useTranslation } from "react-i18next"


const Home = () => {
  const [showAllConfigs, setShowAllConfigs] = useState(false)
  const [showTeleProxy, setShowTeleProxy] = useState(false)
  const [showMainBody, setShowMainBody] = useState(true)

  const getInfo = useAPI(
    'me/',
    'GET',
    { reactQueryOptions: { enabled: true } }
  );

  const { i18n: {changeLanguage, language} } = useTranslation();

  useEffect(() => {
      if(getInfo.data && getInfo.data.lang && language !== getInfo.data.lang){
        changeLanguage(getInfo.data.lang);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInfo.data])

  return getInfo.isLoading ? (<PreLoading />) : (
    <div className={`bg-[#F4F4F9] w-[100vw] h-[100vh] overflow-hidden m-0 p-0 md:flex flex-col md:justify-center md:items-center`}>
      <Header 
        setShowAllConfigs={setShowAllConfigs}
        setShowTeleProxy={setShowTeleProxy}
        setShowMainBody={setShowMainBody}
        showAllConfigs={showAllConfigs}
        showTeleProxy={showTeleProxy}
        showMainBody={showMainBody}
      />
      <div className="w-full md:w-5/6 lg:max-w-[1000px] h-full">
        {showAllConfigs && <AllConfigs />}
        {showMainBody && <MainBody />}
        {showTeleProxy && <TeleProxy />}
      </div>
      <div className="lg:max-w-[1000px] md:w-5/6 fixed md:static bottom-0 md:bottom-[unset] z-50 h-fit w-full flex justify-between items-center px-5 md:px-0 py-5">
          <FooterSocialIcons />
          <BrandAndLogo />
      </div>
    </div>
  )
}

export default Home