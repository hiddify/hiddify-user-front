import React, { useEffect, useState } from 'react'
import { Text } from '../../../designSystem/Text'
import styled from '@emotion/styled';
import { Button, ButtonProps, CardMedia, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import useAPI from '../../../hooks/useAPI';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import copy from 'clipboard-copy';


import Appstore from '@assets/icons/applestore.png'
import Playstore from '@assets/icons/playstore.png'
import Microsoft from '@assets/icons/microsoft.png'
import Direct from '@assets/icons/direct-download.png'
import Linux from '@assets/icons/linux.png'
import Snapcraft from '@assets/icons/snapcraft.png'
import Apk from '@assets/icons/apk.png'
import { useTranslation } from 'react-i18next';






enum icon {
    APP_STORE = "app_store",
    GOOGLE_PLAY = "google_play",
    APP_IMAGE = "appimage",
    SNAPCRAFT = "snapcraft",
    MICROSOFT_STORE = "microsoft_store",
    APK = "apk",
    DMG = "dmg",
    SETUP = "setup",
    OTHER = "other",
}

const stores = ['app_store', 'google_play', 'snapcraft', 'microsoft_store']


const AppModal = ({ profileUrl }) => {
    const { t, i18n: { language} } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [apps, setApps] = useState<any>([])
    const [showMoreApps, setShowMoreApps] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [app, setApp] = useState<any>()

    const getApps = useAPI(
        'apps/',
        'GET',
        { reactQueryOptions: { enabled: true } }
      );

    const CopyLinkButton = styled(Button)<ButtonProps>(() => ({
        color: '#455FE9',
        backgroundColor: '#E0E4F5',
        border: '1px solid #E0E4F5',
        borderRadius: '8px',
        minWidth: "170px"
    }));

    useEffect(() => {
        const element1 = document.getElementById('appComponent')
        const element2 = document.getElementById('appsComponent')
        if(app){
            if(element1){
                element1.classList.add('morph-in')
            }
            if(element2){
                element2.classList.remove('morph-in')
            }
        }else{
            if(element2){
                element2.classList.add('morph-in')
            }
            if(element1){
                element1.classList.remove('morph-in')
            }
        }   
    }, [app])

    const determineDownloadSource = (iconType: string) => {
        switch (iconType) {
            case iconType = icon.APK:
                return {img: Apk, title: t('APK File')};
            case iconType = icon.APP_STORE:
                return {img: Appstore, title: t("App Store")};
            case iconType = icon.GOOGLE_PLAY:
                return {img: Playstore, title: t("Google Play")};
            case iconType = icon.MICROSOFT_STORE:
                return {img: Microsoft, title: t("Microsoft")};
            case iconType = icon.APP_IMAGE:
                return {img: Linux, title: t("AppImage File")};
            case iconType = icon.SNAPCRAFT:
                return {img: Snapcraft, title: t("Snapcraft")};
            case iconType = icon.DMG:
                return {img: Direct, title: t("DMG File")};
            case iconType = icon.SETUP:
                return {img: Direct, title: t("Setup File")};
            default:
                return {img: Direct, title: t("Setup File")};
        }

    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results: any = []
        if(getApps.data && getApps.data?.length){
            for(const item of getApps.data) {
                results.push(item)
            }
        }

        if(!showMoreApps && results.length){
            setApps([results[0]])
        }else{
            setApps(results)
        }
    }, [showMoreApps, getApps.data])

    const downloadApp = (link: string) => {        
        // Open a new tab with the specified link
        window.open(link);
    }

    const importApp = (link: string | undefined) => {   
        if(link) {
            // Open a new tab with the specified link
            window.open(link);
        }else {
            copy(profileUrl)
        }  
    }


  return (
    <div className={`max-w-[400px]`}>
            <div id='appComponent' className={`${app ? 'flex morph-in' : 'hidden'} flex-col gap-6`}>
                <div onClick={() => setApp(null)} className='bg-[#FBFBFB] rounded-2xl py-3 px-2 cursor-pointer'>
                    <div className='flex gap-2'>
                        <div className='flex items-center justify-center p-2'>
                            {language === 'fa' ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
                        </div>
                        <div className='bg-[#F2F4FB] w-[50px] h-[50px] p-2 rounded-lg flex items-center justify-center'>
                            <CardMedia
                                sx={{ height: '100%', width: '100%' }}
                                image={app && app?.icon_url ? app?.icon_url : ''}
                                title="App Logo"
                            />
                        </div>
                        <div className='flex items-center justify-center'>
                            <Text fontSize='base' fontWeight='regular' className='text-[#495057] line-clamp-1'>{app && app.title ? app.title : ''}</Text>
                        </div>
                    </div> 
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <Text fontSize='lg' fontWeight='medium' className='text-[#212529]'>{t('Download')}</Text>
                        <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>
                            {t('Choose one the sources below to download the file:')}
                        </Text>
                    </div>
                    <div dir="rtl" className='grid grid-cols-2 gap-1 md:gap-4 px-0 md:px-10'>
                        {app && app?.install && app?.install?.length ? app?.install.map(item => (
                            <div dir={language === 'fa' ? 'rtl' : "ltr"} onClick={() => downloadApp(item?.url ? item?.url : '')} className='w-full bg-black rounded-md flex items-center gap-2 py-1 px-2 cursor-pointer'>
                                <div className='bg-transparent w-4 h-4 md:w-6 md:h-6 flex items-center justify-center overflow-visible'>
                                    <CardMedia
                                        sx={{ height: '100%', width: '100%', backgroundSize: 'cover' }}
                                        image={determineDownloadSource(item?.type).img}
                                        title="App Logo"
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <Text customFontSize={8} fontWeight='semibold' className='text-[#FFF]'>{stores.includes(item?.type) ? t('GET IT ON') : t('DIRECT DOWNLOAD')}</Text>
                                    <Text fontSize='sm' fontWeight='semibold' className='text-[#FFF]'>{determineDownloadSource(item?.type).title}</Text>
                                </div>
                            </div>
                        )) : null}
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <Text fontSize='lg' fontWeight='medium' className='text-[#212529]'>{t('Import')}</Text>
                        <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>
                            {t('After you downloaded and successfully installed the app, click on the Import to App button. It will set up your VPN automatically.')} 
                        </Text>
                    </div>
                    <div className='w-full flex items-end justify-between'>
                        <Text onClick={() => window.open(app && app.guide_url, "_blank")} fontSize='xs' fontWeight='medium' className='line-clamp-1 text-[#495057] underline underline-offset-4 cursor-pointer'>
                            {app && app.guide_url ? t('View Youtube Tutorial...') : ''}
                        </Text>
                        <CopyLinkButton style={{ textTransform: 'none'}} onClick={() => importApp(app && app.deeplink ? app.deeplink : undefined)}>
                            <Text className='text-[#455FE9] mr-2'>{app && app.deeplink ? t('Import To App') : t('Copy Link')}</Text>
                            {app && app.deeplink ? null : <ContentCopyIcon />}
                        </CopyLinkButton>
                    </div>
                </div>
            </div>
            <div id='appsComponent' className={`${app === null ? 'flex morph-in' : !app ? 'flex' : 'hidden'} flex-col gap-6`}>
                <div>
                    <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>{t('Choose one of the apps below:')}</Text>
                </div>
                <div className='flex flex-col gap-3'>
                    {getApps.isLoading ? 
                        <div className='w-full flex justify-center items-center'>
                            <CircularProgress size={30} thickness={4}/> 
                        </div>
                    : 
                        <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                            {apps?.map((item, index) => (
                                <div onClick={() => setApp(item)} className='bg-[#FBFBFB] rounded-2xl py-3 px-2 cursor-pointer'>
                                    <div className='flex gap-2'>
                                        <div className='bg-[#F2F4FB] w-[50px] h-[50px] p-2 rounded-lg flex items-center justify-center'>
                                            <CardMedia
                                                sx={{ height: '100%', width: '100%' }}
                                                image={item?.icon_url ? item?.icon_url : ''}
                                                title="Hiddify Logo"
                                            />
                                        </div>
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='flex flex-col'>
                                                <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>{item.title ? item.title : ''}</Text>
                                                <Text fontSize='sm' fontWeight='normal' className='text-[#212529]'>{item.title === "Streisand" || item.title === 'Hiddify Next' ? t('*Recommended') : '' }</Text>
                                            </div>
                                            {language === 'fa' ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                                        </div>
                                    </div> 
                                </div>
                            ))}
                        </div>
                    }
                    {getApps.isSuccess && getApps.data && getApps.data?.length > 1 ? (
                        <div>
                            <Text>
                                {showMoreApps ? (
                                    <div onClick={() => setShowMoreApps(false)} className='flex items-center justify-center gap-2 cursor-pointer'>
                                        <Text fontSize='sm' fontWeight='normal' className='text-[#495057]'>{t('View Less')}</Text>
                                        <ExpandLessIcon className='text-[#495057]' />
                                    </div>
                                ) : (
                                    <div onClick={() => setShowMoreApps(true)} className='flex items-center justify-center gap-2 cursor-pointer'>
                                        <Text fontSize='sm' fontWeight='normal' className='text-[#495057]'>{t('View More')}</Text>
                                        <ExpandMoreIcon className='text-[#495057]' />
                                    </div>
                                )}
                            </Text>
                        </div>
                    ) : null}
                </div>
                <div className='flex flex-col gap-2'>
                    <Text fontSize='lg' fontWeight='medium' className='text-[#212529]'>{t('Import manually')}</Text>
                    <Text fontSize='base' fontWeight='regular' className='text-[#495057]'>
                        {t('If your VPN is not listed above, copy the link and import it manually in your preferred VPN application.')} 
                    </Text>
                </div>
                <div className='w-full flex items-end justify-end'>
                    <CopyLinkButton style={{ textTransform: 'none'}} onClick={() => copy(profileUrl)}>
                        <Text className='text-[#455FE9] mr-2'>{t('Copy Link')}</Text>
                        <ContentCopyIcon />
                    </CopyLinkButton>
                </div>
            </div>
    </div>
  )
}

export default AppModal