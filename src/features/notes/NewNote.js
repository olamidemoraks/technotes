import React from "react";
import NewNoteForm from "./NewNoteForm";
import { RingLoader } from "react-spinners";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useTitle from "../../hooks/useTitle";

const NewNote = () => {
  useTitle("Olamide repair | Create Notes");

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });
  if (!users?.length) return <RingLoader color="#fff" />;
  const content = <NewNoteForm users={users} />;
  return content;
};

export default NewNote;
