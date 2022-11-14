import React from "react";
import { Link } from "react-router-dom";
import User from "./User";
import { useGetUsersQuery } from "./usersApiSlice";
import { RiseLoader } from "react-spinners";
import useTitle from "../../hooks/useTitle";

const UserList = () => {
  useTitle("Olamide repair | User");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let content;
  if (isLoading) content = <RiseLoader color="#fff" />;

  if (isError) {
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to={"/login"}>Please Login again</Link>
      </p>
    );
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default UserList;
