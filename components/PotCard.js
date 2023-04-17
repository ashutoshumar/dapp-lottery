import style from '../styles/PotCard.module.css'
import truncateEthAddress from 'truncate-eth-address'
import { useAppContext } from '../context/context'
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti'
import { useMoralis } from "react-moralis";
const PotCard = () => {
  const {enter,pick, lotteryId, lastWinner, lotteryPot, enterLottery, pickWinner, address, owner } =
    useAppContext()
  const { width, height } = useWindowSize()
  const { account } = useMoralis();
  console.log(account);
  return (
   <div className={style.wrapper}>
    <Confetti width={width}
       height={height}/>
    <div className={style.title}>
      Lottery{' '}
      <span className={style.textAccent}>#{lotteryId ? lotteryId : ''}</span>
    </div>
    <div className={style.pot}>
      Pot 🍯: <span className={style.goldAccent}>{lotteryPot} ETH</span>
    </div>
    <div className={style.recentWinnerTitle}>🏆Last Winner🏆</div>
    {!lastWinner.length ? (
      <div className={style.winner}>No winner yet</div>
    ) : (
      lastWinner.length > 0 && (
        <div className={style.winner}>
          {truncateEthAddress(lastWinner[lastWinner.length - 1])}
        </div>
      )
    )}
    {address? (<button className={style.btn} onClick={enterLottery}  disabled={enter}  >

      Enter
    </button>) : (<></>)}
    {(address && address === owner) ? (
      <button className={style.btn} onClick={pickWinner} disabled={pick}>
        Pick Winner!
      </button>
    ) : (
      <div  >

      </div>
    )}

  </div>



  
    
  )
}
export default PotCard



// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
