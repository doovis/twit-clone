import ContentType from "./home/ContentType";
import PostInput from "./home/PostInput";
import MainFeed from "./home/MainFeed";
import { FormEvent, useCallback, useEffect, useState } from 'react';
import PostElement from "./PostElement";
import { PostType } from "../types/PostType";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/store"
import { setUser } from "../store/features/userSlice"
import ExploreHeader from "./home/ExploreHeader";
import SideMenuModal from "./modals/SideMenuModal";

enum CONTENT {
  MAINFEED,
  POST
}

function Home() {
  const [ feedType, setFeedType ] = useState("forYou");
  const [ showContent, setShowContent ] = useState(CONTENT.MAINFEED);
  const [ activePost, setActivePost ] = useState<PostType | null>(null);
  const [ posts, setPosts ] = useState<PostType[]>([]);
  const [ inputValue, setInputValue ] = useState("");
  const [ sideMenuOpen, setSideMenuOpen ] = useState(false);
  let content;  

  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(state => state.user);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postString = import.meta.env.VITE_API_SERVER_URL + "/posts";
        const data = await axios.get(postString);        

        setPosts(data.data); 
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [])

  const handleActivePostUpdate = (posts: PostType[]) => {
    setPosts(posts);

    const postActive = posts.filter(post => activePost?.post_id === post.post_id)

    setActivePost(postActive[0])
  }

  const handleSideMenu = () => {
    setSideMenuOpen(state => !state)
  }

  const handlePost = async (e: FormEvent) => {
    e.preventDefault()
    const url = import.meta.env.VITE_API_SERVER_URL + "/posts";

    if (inputValue.trim() === '') {
      toast.error("Post cannot be empty");
      return;
    }

    await axios.post(url, { userID: loggedUser.id, content: inputValue.trim() }, {withCredentials: true})

    // Fetching updated posts
    const updatedPosts = await axios.get(url);  
    
    // updating posts list
    setPosts(updatedPosts.data)
    
    // updating user tweet count    
    const updatedUser = {
      ...loggedUser,
      tweet_count: loggedUser.tweet_count + 1
    }
    dispatch(setUser(updatedUser))

    setInputValue('');
  }

  const handleFeedType = useCallback((type: string) => {
    if (type === "forYou") {
      setFeedType("forYou");
    } else {
      setFeedType("following");
    }

  }, [feedType])

  const handlePostOpen = useCallback((post: PostType) => {
    setActivePost(post)
    setShowContent(CONTENT.POST)
  }, [showContent, activePost])
  
  const handlePostClose = useCallback(() => {
    setActivePost(null);
    setShowContent(CONTENT.MAINFEED)
  }, [showContent, activePost])

  if (Object.keys(loggedUser).length === 0) {
    content = (
        <div className="mb-[70px]">
          <ExploreHeader />
          <MainFeed loggedUser={loggedUser} onClick={handlePostOpen} postData={posts} setPosts={setPosts} />
        </div>
    )
  }

  else if (showContent === CONTENT.MAINFEED) {
    content = (
        <>
          <ContentType feedType={feedType} onClick={handleFeedType} loggedUser={loggedUser} handleSideMenu={handleSideMenu} />
          <PostInput loggedUser={loggedUser} handlePost={handlePost} inputValue={inputValue} setInputValue={setInputValue} />
          <MainFeed loggedUser={loggedUser} onClick={handlePostOpen} postData={posts} setPosts={setPosts} />
          <SideMenuModal handleSideMenu={handleSideMenu} sideMenuOpen={sideMenuOpen} />
          {/* black screen overlay */}
          {
            sideMenuOpen && (
              <div 
                onClick={handleSideMenu}
                className="
                  z-30
                  absolute
                  block
                  sm:hidden
                  top-0
                  left-0
                  w-screen
                  h-screen
                  bg-neutral-500/50
                "
              >
              </div>
            )
          }
        </>
    )
  }

  if (showContent === CONTENT.POST) {
    content = (
      <PostElement
        loggedUser={loggedUser}
        post={activePost}
        onClose={handlePostClose}
        handleActivePostUpdate={handleActivePostUpdate}
      />
    )
  }

  return (
    <div className="
      border-x
      border-neutral-500/50
      sm:ml-[76px]
      lg:col-span-6
      xl:ml-[223px]
      
      h-full
      pb-[53px]
      sm:pb-0
      overflow-scroll
      dark:text-neutral-100
      text-zinc-900
      dark:bg-[#15202B]
      bg-white
    ">
      {content}
    </div>
  )
}

export default Home;
