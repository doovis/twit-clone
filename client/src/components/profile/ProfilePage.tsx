import { IoMdArrowBack } from "react-icons/io"
import { useAppSelector } from "../../store/store"
import { useNavigate } from "react-router";
import { useState } from "react";
import Button from "../custom_elements/Button";
import { FaRegCalendarAlt } from "react-icons/fa";

const categories = [
    {
        category: "Tweets",
        emptyContentHeader: "You don't have any Tweets yet",
        emptyContentText: "When you Tweet something, they will show up here."
    },
    {
        category: "Replies",
        emptyContentHeader: "You don't have any replies yet",
        emptyContentText: "When you reply to tweets, they will show up here."
    },
    {
        category: "Media",
        emptyContentHeader: "Lights, camera... attachments!",
        emptyContentText: "When you send Tweets with photos or videos in them, they will show up here."
    },
    {
        category: "Likes",
        emptyContentHeader: "You don't have any likes yet",
        emptyContentText: "Tap the heart on any Tweet to show it some love. When you do, it'll show up here."
    }
]

const ProfilePage = () => {
    const loggedUser = useAppSelector(state => state.user)
    const [ selectedCat, setSelectedCat ] = useState(categories[0].category)

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    const date = new Date(loggedUser.created_at as string);
    const JoinedDate = date.toLocaleString('default', { month: 'long'}) + ' ' + date.getFullYear();


    return (
      <div className="
          sm:col-span-7
          h-full
          lg:col-span-5
          xl:col-span-5
          border-white/20
          border
        bg-[#15202B]
      ">
        <div>
            <div className="flex items-center px-2 py-1">
                <div 
                    onClick={handleGoBack}
                    className="
                        rounded-full
                        p-2
                        cursor-pointer
                        hover:bg-white/10
                        "
                    >
                    <IoMdArrowBack size={22} />
                </div>
                <div className="ml-6">
                    <div className="font-bold text-[1.4rem] capitalize">
                        {
                            loggedUser.username
                        }
                    </div>
                    <div className="text-slate-400/80 text-sm tracking-wider">
                        0 Tweets
                    </div>
                </div>
            </div>
            <div className="bg-slate-600 h-56 overflow-hidden">
                {
                    loggedUser.cover_image && (
                        <img 
                            src={loggedUser.cover_image}
                            alt="cover image"
                            className="m-auto w-full object-cover" />
                    )
                }
            </div>
            <div className="
                flex
                justify-between
                px-4
            ">
                {
                    loggedUser.avatar && (
                        <img 
                            src={loggedUser.avatar} 
                            alt="avatar" 
                            className="
                                object-cover
                                w-36
                                p-1.5
                                bg-[#15202B]
                                rounded-full
                                mt-[-4.5rem]
                            "
                        />
                    )
                }
                <div className="mt-3">
                    <Button
                        small
                        outline
                        value='Edit profile'
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3 px-4 mt-4">
                <div className="font-bold text-2xl capitalize">
                    {
                        loggedUser.username
                    }
                </div>
                <div className="flex gap-2 items-center text-slate-400/80">
                    <FaRegCalendarAlt /> Joined {JoinedDate}
                </div>
                <div className="text-slate-400/80 flex gap-4">
                    <div>
                        <span className="text-white">{0}</span> Following
                    </div>
                    <div className="text-slate-400/80">
                        <span className="text-white">{0}</span> Followers
                    </div>
                </div>
            </div>
            <div className='
                mt-8
                flex
                justify-around
            '>
                {
                    categories.map(category => (
                            <div 
                                key={category.category}
                                onClick={() => setSelectedCat(category.category)}
                                className="
                                    hover:bg-white/10
                                    text-center
                                    h-14
                                    flex
                                    pt-[0.9rem]
                                    font-semibold
                                    text-lg
                                    w-full
                                    cursor-pointer
                                "
                            >
                                <p className={`
                                    border-sky-500
                                    ${category.category === selectedCat ? 'border-b-4' : ''}                                    
                                    w-fit
                                    mx-auto
                                `}>
                                    {category.category}
                                </p>
                            </div>
                        )
                    )
                }
            </div>
            <div
                className="
                    flex
                    border-white/20
                    border-t
                "
            >
                {
                    categories.map(category => (
                        category.category === selectedCat ? (
                            <div className="
                                mt-10
                                mb-14
                                mx-auto
                                w-96
                                flex
                                flex-col
                                gap-4
                            ">
                                <div className="font-bold text-3xl">
                                    {
                                        category.emptyContentHeader
                                    }
                                </div>
                                <div className="text-md text-slate-400/80">
                                    {
                                        category.emptyContentText
                                    }
                                </div>
                            </div>
                        ) : ''
                    ))
                }
            </div>
        </div>
      </div>
    )
}

export default ProfilePage