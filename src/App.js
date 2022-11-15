import { Route, Routes } from "react-router-dom";
import DashLayout from "./components/DashLayout";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import Public from "./components/Public";
import Welcome from "./features/auth/Welcome";
import NoteList from "./features/notes/NoteList";
import UserList from "./features/users/UserList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import NewNote from "./features/notes/NewNote";
import EditNote from "./features/notes/EditNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
function App() {
  useTitle("Olamide repair");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />

          {/* Protect Routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                <Route path="dash" element={<DashLayout />}>
                  <Route index element={<Welcome />} />
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Admin, ROLES.Manager]}
                      />
                    }
                  >
                    <Route path="users">
                      <Route index element={<UserList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
                    </Route>
                  </Route>

                  <Route path="notes">
                    <Route index element={<NoteList />} />
                    <Route path=":id" element={<EditNote />} />
                    <Route path="new" element={<NewNote />} />
                  </Route>
                </Route>
                {/*end Dash */}
              </Route>
            </Route>
          </Route>
          {/* Protect Routes */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
