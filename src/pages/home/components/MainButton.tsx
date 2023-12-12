import ButtonSvg from '@assets/svg/Button.svg?react';
import { Button } from 'antd';

type propsTypes = {
  onClick: () => void;
  className?: string;
}

const MainButton: React.FC<propsTypes> = ({ className, onClick }) => {

  const btnClassName = `rounded-full border-none p-0 m-0 flex items-center justify-center ${className}
  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default md:cursor-pointer
  md:w-[100px] md:h-[100px] md:active:w-[90px] md:active:h-[90px]
  lg:w-[130px] lg:h-[130px] lg:active:w-[120px] lg:active:h-[120px]
  w-[140px] h-[140px] active:w-[130px] active:h-[130px]
  `

  return (
    <Button onClick={onClick} className={btnClassName}>
      <ButtonSvg />
    </Button>
  )
}

export default MainButton