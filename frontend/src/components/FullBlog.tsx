import Appbar from "./Appbar";
import { Blog } from "../hooks";
import { Avatar } from "./BlogCard";

const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid  grid-cols-12 px-10 pt-200 w-full max-w-screen-xl pt-12">
          <div className="col-span-8">
            <div className="text-5xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500">Post on 2nd Decemeber 2023</div>
            <div className="p-4">{blog.content}</div>
          </div>
          <div className="col-span-4">
            <div className="text-slate-600 text-lg">
            Author
            </div>
            <div className="flex w-full">
              <div className="pr-2 flex flex-col justify-center">
              <Avatar size="big" name={blog.author.name || "Anonymous"}/>
              </div>
              <div>
                <div>{blog.author.name || "Anonymous"}</div>
                <div>
                  Random cathc phrase about the authot's ability to grab the
                  user's attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBlog;
