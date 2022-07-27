import { LoadingOutlined } from "@ant-design/icons";
import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Checkbox, Image, Radio, Select, Space, Upload } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { isIOS } from "react-device-detect";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRecoilState } from "recoil";
import { flagFeedUpdate, karmaPoints, tenantNameState } from "../../atoms/globalStates";
import colors from "../../commons/styles/colors";
import Category, { CategoryOrder } from "../../models/category.model";
import Post, { PostData, PostType } from "../../models/post.model";
import User from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import postAction from "../../redux/actions/post.action";
import categoryService from "../../services/category.service";
import uploadService from "../../services/upload.service";
import postService from "../../services/post.service";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import CompanyGuideModal from "../modal/CompanyGuideModal";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import Initiative from "./Initiative";
import "./styles.scss";
import AlertModal from "../AlertModal/AlertModal";

import axios from "axios";
import IcomoonReact from "icomoon-react";
import images from "../../assets/images/images";
import { KamrmaValueGeneration } from "../../karmaModule/karmaTemplate";
import { source, types_points } from "../../karmaModule/dtos";

const { Option } = Select;

interface Props {
  containerStyle?: any;
  type?: any;
  postData?: any;
  open?: boolean;
  onClose?: any;
}

const dataPostDefault: PostData = {
  title: "",
  description: "",
  category_id: "",
  hashtags: "",
};

const VOTE_CLOSE_IN_OPTIONS = [
  {
    label: "Closes in 24 Hours",
    value: "0",
    getValue: (createdAt?: string) =>
      createdAt
        ? moment(createdAt).add(1, "day").toDate()
        : moment().add(1, "day").toDate(),
  },
  {
    label: "Closes in 1 Week",
    value: "1",
    getValue: (createdAt?: string) =>
      createdAt
        ? moment(createdAt).add(1, "weeks").toDate()
        : moment().add(1, "weeks").toDate(),
  },
  {
    label: "Closes in 2 Weeks",
    value: "2",
    getValue: (createdAt?: string) =>
      createdAt
        ? moment(createdAt).add(2, "weeks").toDate()
        : moment().add(2, "weeks").toDate(),
  },
];

/**
 * ActionSheetPost Component
 * @param props
 * @returns JSX.Element
 */
function ActionSheetPost(props: Props) {
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const ref: any = useRef<ActionSheetRef>();
  const {
    type = PostType.Post,
    containerStyle,
    open,
    onClose,
    postData,
  } = props;
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const resizeScreen = () => {
    setScreenWidth(window.innerWidth);
  };
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [inputTagVisible, setInputTagVisible] = useState(false);
  const [visibleLink, setVisibleLink] = useState(!!postData?.link);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataRequest, setDataRequest] = useState<PostData>({
    post_type: type,
    category_id: postData?.categories[0]?.id || undefined,
    ...(postData || {}),
  });
  const [previewImage, setPreviewImage] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [answerRemoveIds, setAnswerRemoveIds] = useState<string[]>([]);
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [time, setTime] = useState(moment().format("HH:mm"));
  const [error, setError] = useState<any>("");
  const [dialogAnonymous, setDialogAnonymous] = useState(false);
  const [allowInitiative, setAllowInitiative] = useState(false);
  const [dialogGuide, setDialogGuide] = useState(false);
  const [dialogPost, setDialogPost] = useState(false);
  const [allowGuide, setAllowGuide] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hashTags, setHashTags] = useState<string>('')
  const [dialogReviewing, setDialogReviewing] = useState(false);
  const [karmaPointsState, setKarmaPointsState] = useRecoilState<any>(karmaPoints)

  const { posts: dataPosts, searchUsers: dataUsers, categoriesSelected } = useSelector(
    (state: any) => state.feed
  );
  const [videoLink, setVideoLink] = useState(false);

  var hashTagsString = '';  
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: postData
      ? { ...postData, category_id: postData?.categories[0]?.id || null, description:postData?.content, hashtags: hashTags }
      : { ...dataPostDefault },
  });

  useEffect( () =>{
    if(postData){
      let arrOfHashTags = postData.hashTags.map( (hashTag: any) =>{
        return hashTag.title;
      })
       // eslint-disable-next-line react-hooks/exhaustive-deps
      hashTagsString = arrOfHashTags.join(' ');
      console.log({arrOfHashTags})
      console.log({hashTagsString})
      setDataRequest({
        ...dataRequest,
        hashtags: hashTagsString
      });
      setHashTags(()=>hashTagsString);

    }
    
  },[postData])

  // useEffect(()=>{
  //   console.log({hashTags})
  // },[hashTags])

  useEffect(() => {
    console.log(postData);
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
    return () => {
      handleLockScroll(false);
    };
  }, [open]);

  useEffect(() => {
    if (dialogPost && !user?.agreed_community_guidelines) {
      setDialogGuide(true);
    }
  }, [dialogPost]);

 
  useEffect(() => {
    register("title", {
      required: {
        value: true,
        message: "Title is required",
      },
    });
    register("category_id", {
      required: {
        value: true,
        message: "Category is required",
      },
    });
    register("hashtags", {
      validate: {
        required: (value) => {
          const hashtags = value
            .trim()
            .split(" ")
            .map((item: string = "") => {
              if (item[0] !== "#") item = `#${item}`;
              return item;
            });
          return hashtags.length > 6
            ? "Oops! You can only use 6 hashtags."
            : true;
        },
      },
    });
    switch (type) {
      case PostType.Post:
        register("description", {
          required: {
            value: true,
            message: "Description is required",
          },
        });
        break;
      case PostType.Poll:
        register("polls", {
          validate: {
            require: (value) => {
              return answers.filter((x) => !!x).length === 0
                ? "Please add answer."
                : answers.filter((x) => !!x).length === 1
                ? "Please add more answer."
                : true;
            },
          },
        });
        break;
      case PostType.Initiative:
        register("initiative_business", {
          required: {
            value: true,
            message: "Potential Business Impact is required",
          },
        });
        break;
      default:
        break;
    }
  }, [register, answers]);

  useEffect(() => {
    if (postData) {
      setInputTagVisible(true);
      if (type === PostType.Poll) {
        setAnswers(postData.options?.map((x: any) => x.title));
        setAnswerIds(postData.options?.map((x: any) => x.id));
      }
      setPreviewImage(postData?.image?.url || null);
    }
    const getCategories = async () => {
      try {
        const tenantName: any = localStorage.getItem("tenantName");
        const rs = await categoryService.getAll(tenantName, {
          order: "ASC",
        });
        console.log("rs data in categories", rs);
        setCategories(rs);
      } catch (error) {}
    };
    getCategories();
  }, []);

  /**
   * Handle input change
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onDataChange = (e: any) => {
    setValue(e.target.name, e.target.value, { shouldValidate: true });
    setDataRequest({
      ...dataRequest,
      [e.target.name]: e.target.value,
    });
  };


  /** 
   * Handle file change
   * @param {any} FileInfo
   */
   const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;  
    try {
      //Todo : Upload to aws 
      uploadService.uploadFile(file).then(res =>{
        console.log({res})
        setDataRequest({
          ...dataRequest,
          imageUrl: res,
        });
      })
     
      onSuccess("Ok");
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };
  const handleFileChange = (info: any) => {
    if (!info.file) return;
    const file = info.file;
    setPreviewImage(URL.createObjectURL(file.originFileObj));
  
  };

  const handleLockScroll = (isLock: boolean) => {
    if (isIOS) {
      document.body.style.overflow = isLock ? "hidden" : "unset";
    }
  };

  /**
   * Handle ActionSheet open
   */
  const handleOpen = () => {
    ref.current.open();
    handleLockScroll(true);
  };

  /**
   * Handle ActionSheet close
   */
  const handleClose = () => {
    // setDataRequest({ ...dataPostDefault });
    reset();
    ref.current.close();
    onSheetClose();
  };

  /**
   * 描述
   * @date 2021-11-04
   */
  const onChangeInputVisible = () => {
    setInputTagVisible(!inputTagVisible);
  };

  /**
   * Handle category selected
   * @param {string} CategoryId
   */
  const onSelect = (data: string) => {
    const c = categories.find((x) => x.name == data);
    dataRequest.category_id = c?.id;
    setValue("category_id", c?.id, { shouldValidate: true });
  };

  const onCategorySelect = (value: string) => {
    dataRequest.category_id = value;
    setValue("category_id", value, { shouldValidate: true });
  };

  /**
   * Handle search category
   * @param {string} searchText
   * @returns {any}
   */
  const onSearch = (searchText: string) => {
    const c = categories
      .filter(
        (x) =>
          x?.name &&
          x?.name?.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      )
      .map((item: any) => {
        return { value: item?.name };
      });
    const arr = !searchText ? [] : [...c];
    setOptions(arr);
  };

  /**
   * Handle add new answer
   */
  const addAnswerChoice = () => {
    if (answers.length < 10) {
      setAnswers([...answers, ""]);
      setAnswerIds([...answerIds, ""]);
    }
  };

  /**
   * Update answer value
   * @param {string} value
   * @param {number}  index
   */
  const onAnswerChange = (value: string, index: number) => {
    answers[index] = value;
    setAnswers([...answers]);
    if (type === PostType.Poll) {
      const polls = answers.filter((x) => !!x);
      setValue("polls", polls.join(","), { shouldValidate: true });
    }
  };

  const onAnswerRemoveChange = (index: number) => {
    answerRemoveIds.push(answerIds[index]);
    answers.splice(index, 1);
    answerIds.splice(index, 1);
    setAnswers([...answers]);
    setAnswerIds([...answerIds]);
    setAnswerRemoveIds([...answerRemoveIds]);
  };

  /**
   * Handle submit post
   * @returns {any}
   */
  const onSend = async () => {
    
    
    const tenantName: any = localStorage.getItem("tenantName");
    // if (!postData) {
    //   if (!dialogAnonymous) onOpenStartInitiative();
    //   if (!allowInitiative) {
    //     setAllowInitiative(true);
    //     return;
    //   }
    // }
    // if (!postData && type === PostType.Post) {
    //   if (!dialogPost) setDialogPost(true);
    //   if (!allowGuide) return;
    // }
    setDialogAnonymous(false);
    setDialogPost(false);
    setError("");
    setLoading(true);
    if (!postData) {
      if (!dataRequest.vote_ends) {

        if(PostType.Poll === type)
        dataRequest.vote_ends = VOTE_CLOSE_IN_OPTIONS[1].getValue();
        else
        dataRequest.vote_ends = VOTE_CLOSE_IN_OPTIONS[2].getValue();
      }
    }

    if (dataRequest && dataRequest.hashtags) {
      const hashtags = dataRequest.hashtags
        .trim()
        .split(" ")
        .map((item: string = "") => {
          if (item[0] !== "#") item = `#${item}`;
          return item;
        });
      dataRequest.hashtags = hashtags.join(" ");
    }
    dataRequest.is_anonymous = isAnonymous;

    try {
      if (!postData) {
        if (type === PostType.Poll) {
          dataRequest.polls = answers;
        }
        console.log("datareqest in post creation", dataRequest);
        let body: any = {};
        console.log("previewImage", previewImage);
        body.link = dataRequest.link;
        body.videoLink = dataRequest.videoLink;
        body.isAnonymous = dataRequest.is_anonymous;
        console.log("isAnonimous", body.isAnonymous);
        body.userId = user.id;
        body.imageUrl = dataRequest.imageUrl;
        console.log("userId bhai", user.id)
        let categories = [];
        let selectedCategory = { id: dataRequest.category_id };
        categories.push(selectedCategory);
        body.categories = categories;
        console.log({ body });
        console.log("data hastags in action sheet", dataRequest.hashtags);
        let tempHash: any = dataRequest.hashtags
        let hashArray = []
        if(dataRequest.hashtags && tempHash.length > 0) {
          hashArray = tempHash.split(" ");
        }
        body.hashTags = [];
        console.log('check hash')
        for(var i=0;i<hashArray.length;i++){
          body.hashTags.push({ title: hashArray[i] });
        }
        console.log('hashTags split', body.hashTags)

        // body.categories[0].id = 1
        // to be continued here add catogory id to the body
        if (type === PostType.Post) {
          const _karmaPoint = KamrmaValueGeneration(types_points.CREATE, source.POLL)
          console.log('_karmaPointsPost', _karmaPoint)
          setKarmaPointsState(karmaPointsState + _karmaPoint)
          dataRequest.polls = answers;
          body.title = dataRequest.title;
          body.content = dataRequest.description;
          body.tenant = tenantName;
          body.type = "Post";
        }
        if (type === PostType.Initiative) {
          console.log('dataRequestCheck', dataRequest)
          const _karmaPoint = KamrmaValueGeneration(types_points.CREATE, source.INITIATIVE)
          console.log('_karmaPointsIni', _karmaPoint)
          setKarmaPointsState(karmaPointsState + _karmaPoint)
          dataRequest.polls = answers;
          body.title = dataRequest.title;
          body.content = dataRequest.description;
          body.tenant = tenantName;
          body.impact = dataRequest.initiative_business;
          body.theme = dataRequest.theme_type;
          body.type = "Initiative";
          body.closeDate = dataRequest.vote_ends
          body.options = [];
          body.options.push({ title: "against" });
          body.options.push({ title: "for" });
          console.log("Initiative bodyyy...", body);
        }

        if (type === PostType.Poll) {
          const _karmaPoint = KamrmaValueGeneration(types_points.CREATE, source.POST)
          console.log('_karmaPointsPoll', _karmaPoint)
          setKarmaPointsState(karmaPointsState + _karmaPoint)
          dataRequest.polls = answers;
          body.title = dataRequest.title;
          body.content = dataRequest.description;
          body.tenant = tenantName;
          body.type = "Poll";
          body.options = [];
          body.closeDate = dataRequest.vote_ends
          for (var i = 0; i < answers.length; i++) {
            body.options.push({ title: answers[i] });
          }
          // body.options[0].o
        }
        console.log("body in create poll", body);
        const rs = await postService.create(body);
        setLoading(false);
        console.log('rs from post create', rs.result)
        dispatch(postAction.create(rs.result))
        console.log('feed after creare dispatch', dataPosts)
        AlertModal.hide();
        // onClose()
        setFlag_feed(!flag_feed)
        handleClose();
        ref.current.close();
        onSheetClose();
        if (rs.message) {
          setDialogReviewing(true);
          return;
        }
        const post = rs.post_detail;
        console.log('post detail', rs.post_detail)
        dispatch(postAction.create(post));
        if (user) {
          switch (type) {
            case PostType.Post:
              user.count_posts = (user.count_posts || 0) + 1;
              break;
            case PostType.Poll:
              user.count_polls = (user.count_polls || 0) + 1;
              break;
            case PostType.Initiative:
              user.count_initiatives = (user.count_initiatives || 0) + 1;
              break;
            default:
              break;
          }
          dispatch(authAction.updateUser(user));
        }
      } else {
        console.log("inside update of post", dataRequest);
        if (!(dataRequest.image?.type?.indexOf("image/") > -1)) {
          dataRequest.image = null;
        }
        let body: any = {};

  
        body.categories = [];
        body.categories.push({ id: dataRequest.category_id });
        body.id = dataRequest.id;
        body.link = dataRequest.link;
        body.isAnonymous = dataRequest.is_anonymous;
        body.userId = user.id;
        let tempHash: any = dataRequest.hashtags
        const hashArray = tempHash.split(" ");
        body.hashTags = [];
        for(var i=0;i<hashArray.length;i++){
          body.hashTags.push({ title: hashArray[i] });
        }
        if (type === PostType.Post) {
          dataRequest.polls = answers;
          body.title = dataRequest.title;
          body.content = dataRequest.description;
          body.tenant = tenantName;
          body.type = "Post";
        }
        if (type === PostType.Initiative) {
          dataRequest.polls = answers;
          body.title = dataRequest.title;
          body.content = dataRequest.description;
          body.tenant = tenantName;
          body.impact = dataRequest.initiative_business;
          body.theme = dataRequest.theme_type;
          body.type = "Initiative";
        }

        if (type === PostType.Poll) {
          dataRequest.polls = answers;
          body.title = dataRequest.title;
          body.content = dataRequest.description;
          body.tenant = tenantName;
          body.type = "Poll";
          body.options = [];
          body.is_voted = false
         answers.forEach((option, index) =>{
          body.options.push({ title: answers[index], id: answerIds[index] });
         }) 
      
          // body.options[0].o
        }
        if (type === PostType.Poll) {
          const add_polls: any[] = [];
          const update_polls: any[] = [];
          answerIds.map((a, i) => {
            if (a) {
              update_polls.push({ [a]: answers[i] });
            } else {
              add_polls.push(answers[i]);
            }
          });
          dataRequest.update_polls = JSON.stringify(update_polls)
            .replace("[", "")
            .replace("]", "")
            .replaceAll("},{", ",");
          dataRequest.add_polls =
            add_polls.length > 0 ? add_polls.join(",") : null;
          dataRequest.delete_polls = answerRemoveIds.join(",");
        }
        await postService.update(body);
        const rs = await postService.detail(tenantName,body.id,user.id)
        const updatedPost : Post = rs;
        dispatch(postAction.update(updatedPost));
        AlertModal.hide();
      }
      handleClose();
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  /**
   * Handle ActionSheet Close
   */
  const onSheetClose = () => {
    handleLockScroll(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  /**
   * Add link
   */
  const onAddLink = () => {
    setVisibleLink(true);
  };

  const onCloseInChange = (value: any) => {
    // console.log(VOTE_CLOSE_IN_OPTIONS[e]);
    console.log('postDataCreated', postData?.created_at, value)
    dataRequest.vote_ends = VOTE_CLOSE_IN_OPTIONS[value].getValue(
      postData?.created_at
    );
    dataRequest.vote_ends_text = value;
    setDataRequest({ ...dataRequest });
  };

  /**
   * Handle date Poll_end change
   * @param {any} date
   * @param {string}  dateString
   */
  const onDateChange = (date: any, dateString: string) => {
    setDate(date.format("YYYY-MM-DD"));
  };

  /**
   * Handle time Poll_end change
   * @date 2021-11-04
   * @param { any} time
   * @param { string}  timeString
   */
  const onTimeChange = (time: any, timeString: string) => {
    setTime(time.format("HH:mm"));
  };

  const onClearMedia = () => {
    setPreviewImage(undefined);
    setDataRequest({
      ...dataRequest,
      image: null,
    });
  };

  const onOpenStartInitiative = () => {
    setDialogAnonymous(true);
  };
  const onStartInitiative = () => {
    onSend();
  };
  const onAnonymousChange = (e: any) => {
    setIsAnonymous(!isAnonymous);
  };
  const onAllowGuide = (e: any) => {
    setAllowGuide(!allowGuide);
  };
  const onOpenGuide = () => {
    setDialogGuide(true);
  };

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >
      <Stack className="action-sheet-post">
        <Stack direction="horizontal">
          {!postData && (
            <h3>
              {type === PostType.Poll
                ? "Create a Poll"
                : type === PostType.Initiative
                ? "Start an Initiative"
                : "Post Something"}
            </h3>
          )}
          {postData && (
            <h3>
              {type === PostType.Poll
                ? "Edit your poll"
                : type === PostType.Initiative
                ? "Edit your initiative"
                : "Edit your post"}
            </h3>
          )}
          <Form.Select aria-label="Default select example" className="ms-auto"  onChange={onAnonymousChange}>
            <option value="1">Publish as {user.userName}</option>
            <option value="2">Publish as Anonymous</option>
          </Form.Select>
        </Stack>
        {type === PostType.Initiative && (
          <div className="select-theme mb-2">
            <h6>Select a Theme</h6>
            <Radio.Group
              name="theme_type"
              defaultValue={dataRequest.theme_type || "theme5"}
              onChange={onDataChange}
            >
              <Space size={8}>
                <Radio value={"theme1"} className="theme-1"></Radio>
                <Radio value={"theme2"} className="theme-2"></Radio>
                <Radio value={"theme3"} className="theme-3"></Radio>
                <Radio value={"theme4"} className="theme-4"></Radio>
                <Radio value={"theme5"} className="theme-5"></Radio>
              </Space>
            </Radio.Group>
          </div>
        )}
        <InputStacked
          className="input-title"
          name="title"
          placeholder={
            type === PostType.Initiative
              ? "Name your Initiative"
              : type === PostType.Poll
              ? "Ask a question…"
              : "Your title goes here"
          }
          value={dataRequest.title}
          maxLength={300}
          onChange={onDataChange}
          error={errors.title}
        />
        {(type === PostType.Post || type === PostType.Initiative) && (
          <>
            <InputStacked
              name={`description`}
              className="description"
              as="textarea"
              placeholder={
                type === PostType.Initiative
                  ? "The problem, potential solutions, and why it matters."
                  : "What’s on your mind?"
              }
              defaultValue={postData? postData.content : ""}
              value={dataRequest.description}
              maxLength={30000}
              onChange={onDataChange}
              errors={errors}
            />
          </>
        )}

        {type === PostType.Initiative && (
          <InputStacked
            name="initiative_business"
            placeholder="Potential business impact (numbers work best!)"
            maxLength={30000}
            defaultValue ={postData? postData.impact : ""}
            value={dataRequest.initiative_business}
            onChange={onDataChange}
            errors={errors}
          />
        )}

        {(type === PostType.Poll || type === PostType.Initiative) && (
          <div>
            <div className="mb-2">
              {type === PostType.Poll &&
                answers.map((item, i) => {
                  return (
                    <InputStacked
                      key={`answer-${i}`}
                      placeholder={`Choice ${i + 1}`}
                      value={item}
                      onChange={(e) => onAnswerChange(e.target.value, i)}
                      suffix={
                        <IcoMoon
                          icon="close"
                          color={colors.mint}
                          size={24}
                          onClick={() => onAnswerRemoveChange(i)}
                        />
                      }
                    />
                  );
                })}
              {type === PostType.Poll && (
                <button
                  className="btn btn-add-answer"
                  onClick={addAnswerChoice}
                >
                  <IcoMoon icon="plus" size={24} color={colors.mint} />
                  Add Answer Choice
                </button>
              )}
              {errors.polls && (
                <p className="text-error"> {errors.polls.message}</p>
              )}
            </div>
            {type === PostType.Initiative && (
              <InputStacked
                name="hashtags"
                className="hashtag"
                placeholder={
                  type === PostType.Initiative
                    ? "Hashtag related words and departments"
                    : "Your hashtags go here"
                }
                maxLength={60}
                value={dataRequest.hashtags}
                onChange={onDataChange}
                error={errors.hashtags}
              />
            )}
            <Stack className="mb-2">
              {/* <p className="mb-1">Close in:</p> */}
              <Select
                suffixIcon={
                  <IcoMoon
                    icon="chevron_down"
                    color={colors.mint}
                    size={24}
                    style={{ marginTop: -6 }}
                  />
                }
                defaultValue={
                  dataRequest.vote_ends
                    ? dataRequest.vote_ends
                    : PostType.Poll === type
                    ? "1"
                    : "2"
                }
                onChange={onCloseInChange}
                placeholder="Close in"
              >
                {VOTE_CLOSE_IN_OPTIONS.map((item) => (
                  <Option key={`close-${item.value}`} value={`${item.value}`}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Stack>
            {/* <Stack direction="horizontal" className="mb-2" gap={2}>
              <DatePicker
                dropdownClassName="action-sheet-post-picker"
                allowClear={false}
                onChange={onDateChange}
                placeholder="Select date"
                format="YYYY-MM-DD"
                defaultValue={
                  dataRequest.vote_ends
                    ? moment(dataRequest.vote_ends)
                    : moment()
                }
              />
              <TimePicker
                popupClassName="action-sheet-post-picker"
                allowClear={false}
                use12Hours
                format="h:mm A"
                defaultValue={
                  dataRequest.vote_ends
                    ? moment(dataRequest.vote_ends)
                    : moment()
                }
                onChange={onTimeChange}
              />
            </Stack> */}
          </div>
        )}

        {type !== PostType.Initiative && (
          <InputStacked
            name="hashtags"
            className="hashtag"
            placeholder={
              type === PostType.Initiative
                ? "Hashtag related words and departments"
                : "Your hashtags go here"
            }
            maxLength={60}
            value={dataRequest.hashtags}
            onChange={onDataChange}
            error={errors.hashtags}
          />
        )}

{type === PostType.Post && (
videoLink &&

        <InputStacked
          name="videoLink"
          placeholder="Add video link"
          onChange={onDataChange}
        />
        )}
        {/* {!inputTagVisible && (
          <div className=" mt-auto">
            <button
              className="btn btn-add-category"
              onClick={onChangeInputVisible}
            >
              <IcoMoon icon="plus" size={24} color={colors.mint} />
              Add a Category
            </button>
          </div>
        )} */}
        {errors.category_id && (
          <p className="text-error">{errors.category_id.message}</p>
        )}
        <Stack className="align-items-start">
          {!!previewImage && (
            <Image height={100} width={100} src={previewImage} />
          )}
        </Stack>
        {visibleLink && (
          <InputStacked
            name="link"
            defaultValue={dataRequest.link}
            placeholder="Add link"
            onChange={onDataChange}
          />
        )}
        
        {
          <div className="mb-3 mt-2">
            <Stack className="box-select-category">
              <Select
                style={{ width: 200 }}
                placeholder="Select a category"
                defaultValue={postData?.categories[0]?.id || null}
                onChange={onCategorySelect}
                suffixIcon={
                  <IcoMoon
                    icon="chevron_down"
                    color={colors.mint}
                    size={24}
                    style={{ marginTop: 0 }}
                  />
                }
              >
                {categories.map((item) => (
                  <Option key={`category-${item.id}`} value={item?.id || ""}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Stack>
          </div>
        }
        {!!error && <p className="text-error">{error}</p>}
        <Stack direction="horizontal" className="w-100 mt-2">
          <Stack direction="horizontal" className="v-button">
            <button className="btn btn-x" onClick={onClearMedia}>
              <IcoMoon icon="close" size={24} />
            </button>
            <Upload
               customRequest={uploadImage}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
              maxCount={1}
              fileList={[]}
            >
              <button className="btn">
                <IcoMoon icon="image" size={24} color="#fff" />
              </button>
            </Upload>

            <button className="btn" onClick={onAddLink}>
              <IcoMoon icon="link" size={24} color="#fff" />
            </button>

            <button className="btn" onClick={(e)=>setVideoLink(true)}>
            <img className="desktop-only" width="24" src={images.VideoCall} alt="" />
            <img className="mobile-only" width="24" src={images.VideoCallWhite} alt="" />

            </button>
          </Stack>
          <Button
            size="lg"
            className="ms-auto desktop-only"
            onClick={handleSubmit(onSend)}
            disabled={loading}
          >
            Post
            {loading && (
              <LoadingOutlined style={{ fontSize: 24, marginLeft: 8 }} />
            )}
          </Button>
          <Button
            className="ms-auto mobile-only"
            onClick={handleSubmit(onSend)}
            disabled={loading}
          >
            {!loading && <IcoMoon icon="send" color="#fff" size={24} />}
            {loading && (
              <LoadingOutlined style={{ fontSize: 24, marginLeft: 8 }} />
            )}
          </Button>
        </Stack>
      </Stack>
      {/* <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogAnonymous}
        message="Before we start your initiative, you need to confirm whether you would like your username to be visible as the initiator."
        renderContent={
          <div>
            <Checkbox checked={isAnonymous} onChange={onAnonymousChange}>
              Publish my username as Anonymous
            </Checkbox>
          </div>
        }
        btnOkDisabled={!allowInitiative}
        okText="Yes, I’m sure"
        onCancel={() => {
          setAllowInitiative(false);
          setDialogAnonymous(false);
          setIsAnonymous(false);
        }}
        onOk={onStartInitiative}
      /> */}
      
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogPost}
        message="Before we publish your post, Loominate needs to ensure that you are aware of our Community Guidelines."
        renderContent={
          <Stack>
            <button className="btn mb-2 btn-guide" onClick={onOpenGuide}>
              Read our Community Guidelines
            </button>
            <Checkbox checked={allowGuide} onChange={onAllowGuide}>
              I have read and agree with the Community Guidelines.
            </Checkbox>
          </Stack>
        }
        btnOkDisabled={!allowGuide}
        okText="Publish Post"
        onCancel={() => {
          setAllowGuide(false);
          setDialogPost(false);
        }}
        onOk={() => {
          onSend();
          setDialogPost(false);
        }}
      />
      <ModalConfirm
        visible={dialogReviewing}
        message={`Your content is being reviewed. We will reach out to you soon.`}
        cancelText={null}
        onOk={() => {
          setDialogReviewing(false);
          onSheetClose();
        }}
      />
      
      {screenWidth < 1200 ? (
        <CompanyGuideModal
        visible={dialogGuide}
        onClose={() => setDialogGuide(false)}
      />
      ) : (
        <></>
      )}
    </ActionSheet>
  );
}

export default ActionSheetPost;
