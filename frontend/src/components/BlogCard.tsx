import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string
}

const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
    <div className="border-b border-slate-200 p-4 min-w-md w-screen max-w-screen-md cursor-pointer ">
      <div className="flex">
        <div className="flex justify-center flex-col">
          <Avatar name={authorName} />
          {/* {authorName} {publishedDate */}
        </div>
        <div className="font-extralight pl-2">{authorName}</div>
        <div className="flex items-center pl-2 "><Circle /></div>
        <div className="pl-2 font-thin text-slate-500">{publishedDate}</div>
      </div>
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-md font-thin">
        {/* //do a check if content length > 100 then only put ... */}
        {content.slice(0, 100) + "..."}
      </div>
      <div className="text-slate-400 text-sm font-thin">{`${Math.ceil(content.length / 100)} minute(s)`}</div>
    </div>
    </Link>
    
  );
}; 


export function Circle(){
    return(
    <div className="h-2 w-2 rounded-full bg-slate-200">

    </div>
    )
}

export function Avatar({ name, size="small" }: { name: string, size? : "small"| "big" }) {
  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
      <span className={`${size === "small" ? "text-xs" : "text-md" } font-extralight text-gray-600 dark:text-gray-300`}>
        {name[0]}
      </span>
    </div>
  );
}
export default BlogCard;
