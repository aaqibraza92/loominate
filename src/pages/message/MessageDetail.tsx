import {
  endBefore,
  get,
  limitToLast,
  onChildAdded,
  onValue,
  query,
  ref,
  startAfter,
} from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import Div100vh, { use100vh } from "react-div-100vh";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import MessageBottomBar from "../../components/message/MessageBottomBar";
import MessageItem from "../../components/message/MessageItem";
import NavBarMessage from "../../components/message/NavBarMessage";
import Chat from "../../models/chat.model";
import User from "../../models/user.model";
import chatService from "../../services/chat.service";
import { realtimeDB } from "../../services/firebase.service";
import userService from "../../services/user.service";
import "./styles.scss";

/**
 * Message Detail Page
 * @param props
 * @returns JSX.Element
 */
function MessageDetailPage() {
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const height = use100vh() || 0;
  const { user } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const [recipient, setRecipient] = useState<User>({});
  const [room, setRoom] = useState<Chat>();
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [autoScrollBottom, setAutoScrollBottom] = useState(true);
  const messagesEndRef: any = useRef(null);
  const scrollRef: any = useRef();

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef && autoScrollBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  const loadMore = async () => {
    setLoading(true)
    const tenantName: any = localStorage.getItem('tenantName')
    console.log('inside loadmore in message detail', tenantName)
    const rs = await chatService.getAll(tenantName,{ id:params?.id, take:20,order:'DESC' });
    setMessages(rs)
    setLoading(false)

  };
  
  useEffect(() => {
    loadMore()
  
  }, [])
  

  const handleScroll = (e: any) => {
    try {
      if (e) {
        // console.log(e.target.scrollHeight);
        if (e.target.scrollTop === 0) {
          console.log("load more");
          loadMore();
        }
        if (
          Math.abs(e.target.scrollHeight - height - e.target.scrollTop) < 300
        ) {
          setAutoScrollBottom(true);
        } else {
          setAutoScrollBottom(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const div = scrollRef?.current;
    if (!!div) {
      div.addEventListener("scroll", handleScroll);
    }
    return () => {
      div?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, messages, total]);

  // const getRoom = async () => {
  //   try {
  //     const rs = await chatService.getRoomFirebase(id);
  //     setRoom(rs.room);
  //   } catch (error) {
  //     try {
  //       const rs = await chatService.getRoomFirebase(user.id);
  //       setRoom(rs.room);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const getRecipient = async () => {
  //     try {
  //       const rs = await userService.getUser(id);
  //       setRecipient(rs.user);
  //     } catch (error) {}
  //     setLoading(false);
  //   };

  //   getRecipient();
  //   getRoom();
  // }, []);

  useEffect(() => {
    if (room && isFirstLoading) {
      const roomRef = ref(realtimeDB, `rooms/${room.identifier}`);
      const messageRef = query(roomRef, limitToLast(20));
      onValue(roomRef, (snap) => {
        console.log(snap.size);
        setTotal(snap.size);
      });

      onChildAdded(messageRef, (snapshot) => {
        const data = snapshot.val();
        if (typeof data === "object") {
          setTimeout(() => {
            setMessages((prev) => [...prev, { ...data }]);
          }, 500);
        }
      });
      setIsFirstLoading(false);
    }
  }, [room]);

  // const onSent = () => {
  //   if (!room) {
  //     getRoom();
  //   }
  // };

  // if (loading) return <div></div>;

  return (
    <div className="m-screen">
      {!loading && <NavBarMessage data={messages} />}
      <Div100vh ref={scrollRef} className="message-detail-page">
        {!loading && (
          <Stack className="v-content" gap={2}>
            {messages.map((item) => (
              <MessageItem key={`message-${item.id}`} data={item} />
            ))}
          </Stack>
        )}
        <div ref={messagesEndRef} />
      </Div100vh>
      <MessageBottomBar recipientId={recipient?.id} />
    </div>
  );
}

export default MessageDetailPage;
