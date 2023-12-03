import { Text } from '../../../designSystem/Text'
import HLogoSvg from '@assets/svg/hiddify-logo.svg?react';




const PreLoading = () => {
  return (
    <div className='bg-[#F4F4F9] w-screen h-screen md:flex md:justify-center md:items-center'>
        <div className='w-full h-full bg-transparent flex flex-col gap-5 items-center justify-center'>
            <div className='w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-gray-300 bg-opacity-50 rounded-full flex items-center justify-center p-20'>
                <HLogoSvg />
            </div>
            <Text fontSize='lg' fontWeight='semibold' className='text-[#455FE9]'>Hiddify</Text>
            <Text fontSize='lg' fontWeight='semibold' className='text-[#455FE9]'>Powered By Hiddify.com</Text>
        </div>
    </div>
  )
}

export default PreLoading