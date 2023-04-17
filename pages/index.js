import Header from '../components/Header'
import AfterConnection from '../components/AfterConnection';
import NotConnected from '../components/NotConnected';
import { useMoralis } from "react-moralis";
import style from '../styles/Home.module.css'
export default function Home() {
  const { account } = useMoralis();
  return (
    <div className={style.wrapper}>
      <Header />
    
      {
        account?(
          <AfterConnection/>
       ):(
         <NotConnected/>
        )
      }
      
    </div>
  )
}
