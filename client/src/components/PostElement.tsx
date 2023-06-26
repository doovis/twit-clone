import { PostType } from "../types/PostType"
import { CommentType } from "../types/CommentType"
import { AiOutlineHeart } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { User } from "../types/UserType";
import InputTextArea from "./custom_elements/InputTextArea";
import BlueButton from "./custom_elements/BlueButton";
import Button from "./custom_elements/Button";
import Comment from "./Comment";

import axios from "axios";
import { useState, useEffect } from "react";

interface PostElementProps {
    loggedUser: User;
    theme: string;
    post: PostType | null;
    onClose: (e: React.MouseEvent) => void;
}

const PostElement: React.FC<PostElementProps> = ({
    loggedUser,
    theme,
    post,
    onClose
}) => {
    const [ commentValue, setCommentValue ] = useState('');
    const [ postComments, setPostComments ] = useState<CommentType[]>([]);
    const postDate = new Date(post?.post_created_at as Date);    

    const CreatedDate = postDate.getDate() + ' ' + postDate.toLocaleString('default', { month: 'short'}) + ' ' + postDate.getFullYear();
    
    if (Object.keys(loggedUser).length < 1) {
        // don't allow any buttons to be interactive
    }

    useEffect(() => {
        const getComments = async () => {
            const comments = await axios.get(import.meta.env.VITE_API_SERVER_URL + `/comments/${post?.post_id}`)
            
            setPostComments(comments.data)
        }

        getComments();
    }, [])

    const handlePostComment = async () => {
        const commentData = {
            userID: loggedUser.id,
            postID: post?.post_id,
            content: commentValue
        }

        await axios.post(import.meta.env.VITE_API_SERVER_URL + '/comments', commentData)

        const allComments = await axios.get(import.meta.env.VITE_API_SERVER_URL + `/comments/${post?.post_id}`)

        setPostComments(allComments.data)
        setCommentValue('');
    }    

  return (
    <div className="h-full">
        <div 
            className="
                flex
                flex-col
                px-4
                py-2
                border-b
                border-white/20
            "
        >
            <div className="flex items-center gap-6 pb-4">
                <BiArrowBack 
                    size={34}
                    onClick={onClose}
                    className="
                        cursor-pointer
                        hover:bg-slate-100/10
                        rounded-full
                        p-1.5
                        transition
                    "/>
                <p className="text-xl font-bold">Tweet</p>
            </div>
            <div className="flex justify-between">
                <div className="flex">
                    <img
                        src={post?.user_avatar} 
                        alt="avatar"
                        className="rounded-full w-10 h-10 mr-3"
                    />
                    <div className="mt-1 gap-2">
                        <b className="capitalize text-[15px]">{post?.username}</b>
                    </div>
                </div>
                {
                    Object.keys(loggedUser).length > 0 && (
                        <div>
                            <Button
                                medium
                                value="Follow"
                            />
                        </div>
                    )
                }
            </div>
            <div className="mb-4 break-all">
                <p className='text-lg mt-4'>
                    {post?.content}
                </p>
            </div>
            <div className="pb-2 text-neutral-400 font-normal text-xs border-b  border-white/20">
                <p>{CreatedDate}</p>
            </div>
            <div className="py-2 border-b border-white/20">
                <p className="text-sm font-semibold">
                    {post?.likes} <span className="text-neutral-400 font-normal text-xs">
                                    Likes
                                    </span>
                </p>
            </div>
            <div className='
                flex
                gap-1
                w-fit
                p-2
                mt-1
                items-center
                hover:text-pink-600
                hover:bg-pink-600/10
                rounded-full
                transition
                cursor-pointer
            '>
                <AiOutlineHeart size={18} />
            </div>
            {
                Object.keys(loggedUser).length > 0 ? (
                    <div className="
                        flex
                        pt-4
                        my-2
                        border-t
                        border-white/20
                    ">
                        <div className="min-w-[2.7rem]">
                            <img
                                src={loggedUser.avatar} 
                                alt="avatar"
                                className="rounded-full object-cover w-10 h-10"
                            />
                        </div>
                        <InputTextArea 
                            theme={theme}
                            inputValue={commentValue}
                            setInputValue={setCommentValue}
                            placeholder="Tweet your reply!"
                            classes="mr-2 "
                        />
                        <BlueButton 
                            value="Reply"
                            onClick={handlePostComment}
                        />
                    </div>
                ) : (
                    ""
                )
            }
        </div>
        {
            postComments.length !== 0 ? 
                <div 
                onClick={() => {}}
                className="">
                    {
                        postComments.map(comment => (
                            <Comment
                                key={comment.comment_id}
                                owner_avatar={comment.user_avatar}
                                username={comment.username}
                                content={comment.content}
                                likes={comment.likes}
                            />
                        ))
                    }
                </div>
            :
                <div 
                onClick={() => {}}
                className="
                    flex
                    justify-center
                    py-6
                    text-neutral-400
                    text-sm
                ">
                    No Comments
                </div>
        }
    </div>
  )
}

export default PostElement