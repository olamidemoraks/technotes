import { apiSlice } from "../../app/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const notesAdapter = createEntityAdapter({});
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
    addNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNoteData,
        },
      }),
      invalidatesTags: (response, error, arg) => [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNoteData,
        },
      }),
      invalidatesTags: (response, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (response, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
