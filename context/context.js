import { createContext, useState, useEffect, useContext } from 'react'
import Web3 from 'web3'
import createLotteryContract from '../utils/lottery'
export const appContext = createContext()
import { useMoralis } from "react-moralis"
import {useNotification } from "@web3uikit/core"
export const AppProvider = ({ children }) => {
  const dispatch = useNotification();
  const { isWeb3Enabled } = useMoralis()
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState('')
  const [lotteryContract, setLotteryContract] = useState()
  const [lotteryPot, setLotteryPot] = useState()
  const [lotteryPlayers, setPlayers] = useState([])
  const [lastWinner, setLastWinner] = useState([])
  const [lotteryId, setLotteryId] = useState()
  const [etherscanUrl, setEtherscanUrl] = useState()
  const [owner, setOwner] = useState('')
  const [enter, setEnter] = useState(false)
  const [pick, setPick] = useState(false)
  const [enable, setEnable] = useState(false)
  const handleNewNotification = () => {
    dispatch({
        type: "info",
        message: "Transaction Complete!",
        title: "Transaction Notification",
        position: "topR",
        icon:"",
    })
}

const handleFailNotification = () => {
  dispatch({
      type: "info",
      message: "Transaction Failed!",
      title: "Transaction Notification",
      position: "topR",
      icon:"",
  })
}
console.log(isWeb3Enabled)
  useEffect(() => {
    if (isWeb3Enabled ) {
      console.log(isWeb3Enabled)
        connectWallet()
    }
}, [isWeb3Enabled])
  
  useEffect(() => {
    updateLottery()
  }, [lotteryContract])

  const updateLottery = async () => {
    if (lotteryContract) {
      try {
        const pot = await lotteryContract.methods.getBalance().call()

        setLotteryPot(web3.utils.fromWei(pot, 'ether'))

        setPlayers(await lotteryContract.methods.getPlayers().call())
        
        setOwner( await lotteryContract.methods.getOwner().call())
       
        console.log(owner)
        setLotteryId(await lotteryContract.methods.lotteryId().call())

        setLastWinner(await lotteryContract.methods.getWinners().call())
        console.log([...lastWinner], 'Last Winners')
      } catch (error) {
        console.log(error, 'updateLottery')
      }
    }
  }

  const enterLottery = async () => {
    setEnter(true)
    try {
      console.log('entering lottery')
      await lotteryContract.methods.enter().send({
        from: address,
        // 0.015 ETH in Wei
        value: '15000000000000000',
        // 0.0003 ETH in Gwei
        gas: 300000,
        gasPrice: null,
      })
      updateLottery()
      setEnter(false)
      handleNewNotification()
    } catch (err) {
      console.log(err, 'enter')
      setEnter(false)
      handleFailNotification()
    }
  }

  const pickWinner = async () => {
    setPick(true)
    try {
      let tx = await lotteryContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      })

      console.log(tx)
      setEtherscanUrl('https://sepolia.etherscan.io/tx/' + tx.transactionHash)
      updateLottery()
      setPick(false)
      handleNewNotification()
    } catch (err) {
      console.log(err, 'pick Winner')
      setPick(false)
      handleFailNotification()
    }
  }
 
  const connectWallet = async () => {
    /* check if MetaMask is installed */
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {
        /* request wallet connection */
       // await window.ethereum.request({ method: 'eth_requestAccounts' })
        /* create web3 instance & set to state */
        const web3 = new Web3(window.ethereum)
        /* set web3 instance in React state */
        setWeb3(web3)
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts()
        /* set account 1 to React state */
        setAddress(accounts[0])
        console.log(address)
        setLotteryContract(createLotteryContract(web3))
       
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()

          /* set account 1 to React state */
          setAddress(accounts[0])
        })
        console.log(address)
      } catch (err) {
        console.log(err, 'connect Wallet')
      }
    } else {
      /* MetaMask is not installed */
      console.log('Please install MetaMask')
    }
  }
                                             

  return (
    <appContext.Provider
      value={{
        address,
        owner,
        enter,
        pick,
        connectWallet,
        lotteryPot,
        lotteryPlayers,
        enterLottery,
        pickWinner,
        lotteryId,
        lastWinner,
        etherscanUrl,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(appContext)
}
