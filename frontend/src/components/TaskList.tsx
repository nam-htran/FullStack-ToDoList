'use client';

import { API_URL } from "@/constants/api";
import { DeleteModal, EditModalBtn, InsertModalBtn } from "./index";
import { Task, UserData } from "@/types/type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TaskList: React.FC = () => {
  const [data, setData] = useState<Task[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    userID: "",
    userName: "",
  });
  const router = useRouter();

  const handleGetTask = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-task`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error in handleGetTask:", error);
    }
  };

  const refreshList = () => {
    handleGetTask();
  };

  useEffect(() => {
    handleGetTask();
  }, []);

  const handleUserData = (userID: string, userName: string, type: string) => {
    if (type === "delete") {
      setDeleteModal(true);
      setUserData({ userID, userName });
    } else if (type === "edit") {
      setEditModal(true);
      setUserData({ userID, userName });
    }
  };

  // Handle signout
  const handleSignOut = () => {
    // Xóa token trong cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Chuyển hướng về trang login
    router.push("/auth/login");
  };

  // Kiểm tra xem có token trong cookie hay không
  const token = document.cookie.split(";").find(cookie => cookie.trim().startsWith("token="));

  return (
    <React.Fragment>
      {/* Nút SignOut ở góc trên phải */}
      {token && (
        <div className="absolute top-4 right-4">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      )}

      <div>
        <InsertModalBtn refreshList={refreshList} />
        <EditModalBtn
          editModal={editModal}
          setEditModal={setEditModal}
          userData={userData}
          refreshList={refreshList}
        />
        <DeleteModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          userData={userData}
          refreshList={refreshList}
        />
      </div>
      <div className="w-full flex flex-col h-full text-center px-5">
        <table>
          <thead>
            <tr>
              <th className="text-sm">List</th> {/* Font-size nhỏ hơn cho header */}
              <th className="w-1/3 text-sm">Actions</th> {/* Font-size nhỏ hơn cho header */}
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, name }) => (
              <tr key={id}>
                <td className="text-left px-5 my-2 text-sm">{name}</td> {/* Font-size nhỏ cho data */}
                <td>
                  <div className="flex justify-center gap-3">
                    <div>
                      <svg
                        className="hover:cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 512 512"
                        onClick={() => handleUserData(id, name, "edit")}
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </div>
                    <div>
                      <svg
                        className="hover:cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        viewBox="0 0 448 512"
                        onClick={() => handleUserData(id, name, "delete")}
                      >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default TaskList;
