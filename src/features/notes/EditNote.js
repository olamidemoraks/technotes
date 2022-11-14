import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { PulseLoader } from "react-spinners";

const EditNote = () => {
  const { id } = useParams();
  const { username, isManager, isAdmin } = useAuth();

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data.entities[id]),
    }),
  });

  if (!note || !users?.length) return <PulseLoader color={"#fff"} />;

  if (!isAdmin && !isManager) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditNoteForm users={users} note={note} />;
  return content;
};

export default EditNote;
