import { useAppContext } from '../context/context'
import style from '../styles/Header.module.css'
import UserCard from './UserCard'
import WalletConnectBtn from './WalletConnectBtn'
import { ConnectButton } from '@web3uikit/web3'
import { useMoralis } from "react-moralis"
const Header = () => {
  const { address, connectWallet  } = useAppContext()
  
  return (
    <div className={style.wrapper}>
      <div className={style.title}>Luck of the Draw 💰</div>
     
         <ConnectButton  onClick={connectWallet} />
      
    </div>
  )
}
export default Header

/*
<div className={style.wrapper}>
      <div className={style.title}>Luck of the Draw 💰</div>
      {!address ? (
        //  <WalletConnectBtn connectWallet={connectWallet} />
         <ConnectButton onClick={connectWallet} />
      ) : (
        // <UserCard address={address} />
        <ConnectButton onClick={connectWallet} />
      )}
    </div>

*/