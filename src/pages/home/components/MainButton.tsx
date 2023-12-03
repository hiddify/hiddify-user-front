import ButtonSvg from '@assets/svg/Button.svg?react';

type propsTypes = {
  onClick: () => void;
  className?: string;
}

const MainButton: React.FC<propsTypes> = ({ className, onClick }) => {
  return (
    <div onClick={onClick} className={`h-fit w-fit rounded-full xl:cursor-pointer  ${className}`}>
      <ButtonSvg className='main-button rounded-full' />
    </div>
  )
}

export default MainButton