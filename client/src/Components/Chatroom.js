import React, { useState, useEffect , useRef} from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import ScrollToBottom from "react-scroll-to-bottom";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import './Chatroom.css'

let socket;
const Chat = ({ location }) => {
	
//room
  const [name, setName] = useState('');
  const [roomid, setRoom] = useState('');
  const sendRef= useRef(null);
  useEffect(() => {
    const { username, id } = queryString.parse(location.search);
	socket = io("https://simplefornow.herokuapp.com:5223",{ transports : ['websocket'] });
    setRoom(id);
    setName(username);
	socket.emit("join_room", id);
  
  
  }, [location.search]);
  	console.log(name,roomid);
  //messages
	const [currentMessage, setCurrentMessage] = useState("");
	const [buildCurrentMessage, setBuildCurrentMessage] = useState("");
	const [allMessages, setAllMessages] = useState([]);
	const sendMessage = async() => {
		if(currentMessage != ""){
			const messageData = {
				room: roomid,
				author: name,
				message: currentMessage,
				time: new Date(Date.now()).getHours()+ ":" +new Date(Date.now()).getMinutes(),
				
				
			};
			await socket.emit("send_message", messageData);
			setAllMessages((list) => [...list,messageData]);
		}
		setCurrentMessage("");
		document.getElementById("message-box").value='';
	};
	
	useEffect(() => {
		socket.on("recieve_message", (data) =>
		{
			setAllMessages((list) => [...list,data]);
			//console.log(data);
		});
	},[]);
	
	//emoji
	const [emojiList,setEmojiList] = useState(false);
	const showEmojiList = () =>{
		if(emojiList == false){
			setEmojiList(true);
		}
		else{
			setEmojiList(false);
		}
		
	};
	const addEmoji = async(e) => {
		const messageData = {
			room: roomid,
			author: name,
			message: e,
			time: new Date(Date.now()).getHours()+ ":" +new Date(Date.now()).getMinutes(),	
			};
		await socket.emit("send_message", messageData);
		setAllMessages((list) => [...list,messageData]);
		
	};
	
	//console.log(allMessages);
	return(
		<div>
			<div className = "chat-header">
				<p>Live Chat</p>
			</div>
			
			<div className = "chat-body">
			{
				<ScrollToBottom>
				{allMessages.map((messages,i) => 
					{
						return <h1 key ={i}>{messages.message}</h1>;
				})}
				</ScrollToBottom>
			}
			</div>
			
			<div className = "chat-footer">
				<input id = "message-box" type = "text" placeholder = "message" onChange = {(e) => {setCurrentMessage(e.target.value);}}/>
				<button ref={sendRef} onClick={sendMessage}>&#9658;</button>				
				<button onClick={showEmojiList}>&#128578;</button>
				{emojiList ? <Picker set='apple' title='Pick your emoji…' emoji='point_up' style={{ position: 'absolute', bottom: '20px', right: '20px' }} onSelect={(e) => addEmoji(e.native)} /> : "" }
				
			</div>
		</div>
	);
}

export default Chat;
