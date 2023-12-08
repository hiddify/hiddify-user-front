import { Text } from "@designSystem/Text"
import { CardMedia } from "@mui/material";
import HLogo from '@assets/images/hiddify-logo.png'
import { getWindowData } from "../../../utils/getWindowData";

const BrandAndLogo = () => {
  // Access the app version from the global variable
  const { appVersion } = getWindowData()

  return (
    <div className="flex items-end gap-3 mx-3">
        <Text fontSize="xs" fontWeight="light" className="text-[#495057] line-clamp-1">
          Powered by Hiddify v{appVersion}
        </Text>
        <div>
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