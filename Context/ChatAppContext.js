import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT 
import {
    checkIfWalletConnected,
    connectWallet,
    connectingWithContract
} from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({ children }) => {
    //USESTATE
    const [account, setAccount] = useState("");
    const [useName, setUserName] = useState("");
    const [friendList, setFriendList] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [useLists, setUseLists] = useState([]);
    const [error, setError] = useState("");

    //CHAT USER DATA 
    const [currentUserName, setCurrentUserName] = useState("");
    const [curentUserAddress, setCurentUserAddress] = useState("");

    const router = useRouter();

    //FETCH DATA TIME OF PAGE LOAD 
    const fetchData = async () => {
        try {
            //GET CONTRACT
            const contract = await connectingWithContract();
            //GET ACCOUNT
            const connectAccount = await connectWallet();
            setAccount(account);
            //GET USERNAME
            const userName = await contract.getUsername(connectAccount);
            setUserName(userName);
            //GET MY FRIEND LIST
            const friendLists = await contract.getMyFriendList();
            setFriendList(friendList);
            //GET ALL APP USER LIST 
            const userList = await contract.getAllAppUser();
            setUseLists(userList);
        } catch (error) {
            setError("Please Install and Connect your Wallet");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    //READ MESSAGE
    const readMessage = async (friendAddress) => {
        try {
            const contract = await connectingWithContract();
            const read = await contract.readMessage(friendAddress);
            setFriendMsg(read);
        } catch (error) {
            setError("Currently You Have No Message");
        }
    };

    //CREATE ACCOUNT 
    const createAccount = async ({ name, acountAddress }) => {
        try {
            if (name || accountAddress)
                return setError("Name and AcountAddress cannot be empty");

            const contract = await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setError("Error while Creating your account please reload brower");
        }
    };

    //ADD YOUR FRIENDS
    const addFriends = async () => {
        try {
            if (name || accountAddress) return setError("Please provide contract");

            const contract = await connectingWithContract();
            const addMyFriends = await contract.addFriend(accountAddress);
            setLoading(true);
            await addMyFriends.wait();
            setLoading(false);
            router.push("/");
            window.location.reload();
        } catch (error) {
            setError("Somthing went wrong while adding friends, try again later");
        }
    };

    //SEND MESSAGE TO YOUR FRIEND
    const sendMessage = async ({ msg, address }) => {
        try {
            if (msg || address) return setError("Please Type your message");

            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(address, msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setError("Please reload and try again");
        }
    };

    //READ INFO
    const readUser = async (userAddress) => {
        const contract = await connectingWithContract();
        const userName = await contract.getUsername(userAddress);
        setCurrentUserName(userName);
        setCurentUserAddress(userAddress);
    }
    return (

        <ChatAppContect.Provider 
            value={{ 
                readMessage, 
                createAccount, 
                addFriends, 
                sendMessage, 
                readUser, 
                connectWallet,
                checkIfWalletConnected,
                account, 
                useName, 
                friendList, 
                friendMsg, 
                useLists, 
                loading, 
                error, 
                currentUserName, 
                curentUserAddress }}>
            {children}
        </ChatAppContect.Provider>
    );
}