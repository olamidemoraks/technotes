import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Note from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";
import { RiseLoader } from "react-spinners";
import useTitle from "../../hooks/useTitle";

const NoteList = () => {
  useTitle("Olamide repair | Notes");

  const { isAdmin, isManager, username } = useAuth();
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
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
    const { ids, entities } = notes;

    let filterIds;
    if (isAdmin || isManager) {
      filterIds = [...ids];
    } else {
      filterIds = ids.filter(
        (noteId) => entities[noteId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filterIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
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

export default NoteList;
