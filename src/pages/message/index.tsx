import {
  limitToLast,
  onChildAdded,
  onChildChanged,
  query,
  ref
} from "@firebase/database";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import images from "../../assets/images/images";
import DesktopCategory from "../../components/desktopcategory/DesktopCategory";
import DesktopCulture from "../../components/desktopculture/DesktopCulture";
import DesktopGuidelines from "../../components/desktopguidelines/DesktopGuidelines";
import DesktopHashtags from "../../components/desktophashtags/DesktopHashtags";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import DesktopMyCommunity from "../../components/desktopmycommunity/DesktopMyCommunity";
import DesktopMyProfile from "../../components/desktopmyprofile/DesktopMyProfile";
import DesktopOurPurpose from "../../components/desktopourpurpose/DesktopOurPurpose";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import IcoMoon from "../../components/icon/IcoMoon";
import InputSearch from "../../components/input/InputSearch";
import NavBarMessage from "../../components/message/NavBarMessage";
import UserMessageItem from "../../components/message/UserMessageItem";
import ModalConfirm from "../../components/modal/ModalConfirm";
import Chat from "../../models/chat.model";
import { PageData } from "../../models/page.model";
import User from "../../models/user.model";
import chatService from "../../services/chat.service";
import { realtimeDB } from "../../services/firebase.service";
import "./styles.scss";

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function MessagePage(props: any) {
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [dataRequest, setDataRequest] = useState<PageData>({
    page: 1,
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [chatSelected, setChatSelected] = useState<any>();
  const [readCount, setReadCount] = useState()
  useEffect(() => {
    const getChats = async () => {
      try {
        console.log('here is the black sheep')
        const tenantName: any = localStorage.getItem('tenantName')
        const rs = await chatService.getList(tenantName,{ id:user.id, take:20,order:'DESC' });
        setChats(rs.data.data);
        console.log('readCount=', rs.data)
        setReadCount(rs.data.notRead);


      } catch (error) {}
      setLoading(false);
    };
    getChats();
  }, []);

  useEffect(() => {
    let unsubscribe: any;
    let unsubscribeChange: any;
    try {
      const chatRef = ref(realtimeDB, `users/${user.id}/chats`);
      const chatsQuery = query(chatRef, limitToLast(1));
      unsubscribe = onChildAdded(chatsQuery, (snapshot) => {
        const data = snapshot.val();
        console.log("CHAT_ITEM", data);
        setChats((prev) => {
          const find = prev.find((x) => x.id === data.id);
          if (!find) {
            return [{ ...data }, ...prev];
          }
          return prev;
        });
      });
      unsubscribeChange = onChildChanged(chatRef, (snapshot) => {
        const data = snapshot.val();
        console.log("onChildChanged", data);
        setChats((prev) => {
          const findIndex = prev.findIndex((x) => x.id === data.id);
          console.log("onChildChanged", findIndex);
          if (findIndex > -1) {
            prev.splice(findIndex, 1);
          }
          return [{ ...data }, ...prev];
        });
      });
    } catch (error) {}
    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubscribeChange) unsubscribeChange();
    };
  }, []);

  const onSearch = (keywords: string) => {
    setDataRequest({
      ...dataRequest,
      keywords,
    });
  };

  const onClear = (e: any) => {
    if (!e.target.value) {
      setDataRequest({
        ...dataRequest,
        keywords: "",
      });
    }
  };

  const onNewMessage = (data: any) => {
    // console.log(data);
    // const iNew = chats.findIndex(x => x.id === data.roomId);
    // if(iNew > -1) {
    // }
  };

  const onChatDelete = async () => {
    setDialogDelete(false);
    try {
      const tenantName: any = localStorage.getItem('tenantName')
      let body: any = {};
      console.log('chatSelected ID', chatSelected.chat_id)
      body.id = chatSelected.chat_id;
      body.tenant = tenantName;
      await chatService.deleteChat(body);
      const i = chats.findIndex((x) => x.id === chatSelected.id);
      if (i > -1) {
        chats.splice(i, 1);
        setChats([...chats]);
      }
    } catch (error) {
      
    }
  };

  const trailingActions = (data: any) => {
    const showDialogDelete = () => {
      setDialogDelete(true);
      console.log('trailing actions data', data)
      setChatSelected(data);
    };
    return (
      <TrailingActions>
        <SwipeAction
          // destructive={true}
          onClick={showDialogDelete}
        >
          <Stack className="box-delete flex-fill">
            <IcoMoon icon="trash" color="#EB0303" />
            {/* <span>Delete</span> */}
          </Stack>
        </SwipeAction>
      </TrailingActions>
    );
  };

  return (
    <div className="m-screen message-page">
    <HeaderDesktop/>
      <NavBarMessage hasBack />
      <Stack className="v-content h-100 article-padding-top">
        
      <Container >
            <Row gutter={16}>
              <Col xl={5}>
                <div className="desktop-only">
                <DesktopMenu />
                <DesktopCategory />
                <DesktopHashtags />
                </div>
              </Col>
              <Col span={24} xl={12}>
                
        <div className="ps-3 pe-3">
          <InputSearch
            placeholder="Search messages..."
            onSearch={onSearch}
            onChange={onClear}
            className="mb-3"
          />
        </div>

        {!loading && chats && chats.length > 0 && (
          <SwipeableList fullSwipe={true} threshold={0.5} type={Type.IOS}>
            {chats.map((item) => (
              <SwipeableListItem
                key={`chat-${item.id}`}
                trailingActions={trailingActions(item)}
              >
                <UserMessageItem data={item} countRate={readCount} onNewMessage={onNewMessage} />
              </SwipeableListItem>
            ))}
          </SwipeableList>
        )}
        {/* {!loading &&
          chats.map((item) => (
            <UserMessageItem
              key={`chat-${item.id}`}
              data={item}
              onNewMessage={onNewMessage}
            />
          ))} */}
        {!loading && chats && chats.length == 0 && (
          <Stack className="flex-fill align-items-center justify-content-center">
            <img className="logo-empty" src={images.chatEmpty} />
            <p className="text-empty">
              No messages found! Start chatting with your co-workers
              anonymously.
            </p>
          </Stack>
        )}
              </Col>
              <Col xl={7}>
                <div className="desktop-only">
                <DesktopMyCommunity />
                <DesktopMyProfile/>
                <DesktopOurPurpose/>
                <DesktopGuidelines/>
                <DesktopCulture/>
                </div>
              </Col>
            </Row>
          </Container>
      </Stack>
      <ModalConfirm
        visible={dialogDelete}
        message="Are you sure delete this room?"
        onOk={onChatDelete}
        onCancel={() => {
          setDialogDelete(false);
          setChatSelected(undefined);
        }}
      />
    </div>
  );
}

export default MessagePage;
