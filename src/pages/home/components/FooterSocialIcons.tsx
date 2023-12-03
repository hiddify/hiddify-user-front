import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';

const FooterSocialIcons = () => {
  return (
    <div className="flex items-center justify-center gap-2">
        <div 
            onClick={() => window.open("https://youtube.com/@hiddify", "_blank")}
            className="w-5 h-5 bg-[#455FE9] rounded-full flex items-center justify-center cursor-pointer"
        >
            <YouTubeIcon sx={{ fontSize: 16, color: 'white' }} />
        </div>
        <div 
            onClick={() => window.open("https://twitter.com/hiddify_com", "_blank")}
            className="w-5 h-5 bg-[#455FE9] rounded-full flex items-center justify-center cursor-pointer"
        >
            <TwitterIcon sx={{ fontSize: 16, color: 'white' }} />
        </div>
        <div 
            onClick={() => window.open("https://t.me/hiddify", "_blank")}
            className="w-5 h-5 bg-[#455FE9] rounded-full flex items-center justify-center cursor-pointer"
        >
            <TelegramIcon sx={{ fontSize: 16, color: 'white', marginRight: 0.2 }} />
        </div>
        <div 
            onClick={() => window.open("https://github.com/hiddify/Hiddify-Manager", "_blank")}
            className="w-5 h-5 bg-[#455FE9] rounded-full flex items-center justify-center cursor-pointer"
        >
            <GitHubIcon sx={{ fontSize: 16, color: 'white' }} />
        </div>
    </div>
  )
}

export default FooterSocialIcons