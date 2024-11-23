import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

function MyBlog() {
  const navigateTo = useNavigate();
  const [myBlog, setMyBlog] = useState([]);
  console.log("myBlog:", myBlog);
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:4001/api/blogs/my-blog", { withCredentials: true });
        console.log("myBlog:", data);
        setMyBlog(data);
      } catch (error) {
        console.log("MYBLOG:",error);
      }
    }
    fetchMyBlogs();
  }, []);

  const handleDelete = async(id) =>{
    await axios.delete(`http://localhost:4001/api/blogs/delete/${id}`,{withCredentials: true})
    .then((res) =>{
      toast.success(res.data.messsage || "Blog delete Successfully.");
      navigateTo("/");
      setMyBlog((value) =>value.filter((blog) =>blog._id !== id));
    }).catch((error) =>{
      toast.error(error.response.messsage || "Failed to delete blog" );
    })
  }
  return <div className='mx-44'>
    <div className='container mx-auto my-12 p-4'>
      <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:ml-20'>
        {myBlog && myBlog.length > 0 ? (
          myBlog.map((element) => (
            <Link to={`/blog/${element._id}`} 
            className='bg-white shadow-lg rounded-lg overflow-hidden'
              key={element._id}>
              {element?.blogImage && (
                <img
                  src={element?.blogImage.url}
                  alt='blogImg'
                  className='w-full h-48 object-cover'
                />
              )}
              <div className='p-4'>
                <span className='text-sm text-gray-600'>{element?.category}</span>
                <h4 className='text-xl font-semibold my-2'>{element?.title}</h4>
                <div className='flex justify-between mt-4'>
                  <div className='flex justify-between  mt-4'>
                    <Link
                      to={`/blog/update/${element._id}`}
                      className='text-blue-500 bg-white rounded-md shadow-lg px-3 py-1 border border-gray-400 hover:underline'
                    >
                      UPDATE
                    </Link>
                    <button onClick={()=>handleDelete(element._id)} className='text-red-500 bg-white rounded-md shadow-lg mx-20 px-3 py-1 border border-gray-400 hover:underline'>
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className='text-center text-gray-500'>
            You have not posted any blog to see!
          </p>
        )}
      </div>
    </div>
  </div>
}

export default MyBlog;