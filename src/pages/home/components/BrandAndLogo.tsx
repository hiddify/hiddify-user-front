import { Text } from "@designSystem/Text"
import { CardMedia } from "@mui/material";
import HLogo from '@assets/images/hiddify-logo.png'
import { getWindowData } from "../../../utils/getWindowData";
import { useState } from "react";

const BrandAndLogo = () => {
  const [showText, setShowText] = useState(false)
  // Access the app version from the global variable
  const { appVersion } = getWindowData()

  return (
    <div className="flex items-end gap-3 mx-3">
        <Text onClick={() => window.open('https://hiddify.com', '_blank')} fontSize="xs" fontWeight="light" className="text-[#495057] line-clamp-1">
          {showText && 'Powered by Hiddify'} {appVersion ? "v" + appVersion : ''}
        </Text>
        <div onClick={() => setShowText(!showText)}>
          <CardMedia
              sx={{ height: 24, width: 24 }}
              image={HLogo}
              title="Hiddify Logo"
          />
        </div>
    </div>
  )
}

export default BrandAndLogo