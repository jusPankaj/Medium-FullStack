import Appbar from "../components/Appbar";
import FullBlog from "../components/FullBlog";
import Spinner from "../components/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

// use Recoil here to store blogs
//Atomfamilies/selectorFamilies

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: String(id || ""),
  });

  if (loading || !blog) {
    return (
      <div>
        <Appbar />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <FullBlog blog={blog} />
    </div>
  );
};
