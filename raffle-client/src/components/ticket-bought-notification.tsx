import { ContainerCloseButton, H1, NotificationContainer } from './styles'
// import CloverPic from "../assets/clover.png"
import { Polygon } from '../icons/polygon'


export const TicketBoughtNotification = ({closeMe}: {closeMe: () => void}) => {
  return (
    <NotificationContainer>
        <ContainerCloseButton onClick={closeMe}>Close</ContainerCloseButton>
        <Polygon />
        <H1>You're in! Good Luck for the draw!</H1>
        {/* <img src={CloverPic} alt="Clover" /> */}
    </NotificationContainer>
  )
}
