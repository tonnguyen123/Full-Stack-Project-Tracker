import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Projects } from "./pages/Projects";
import { ForgetUserName } from "./pages/ForgetUserName";

import { ResetPasswordRequest } from "./pages/ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword";
import { UpdateProfile } from "./pages/UpdateProfile";
import { CreateProject } from "./pages/CreateProject";
import { ProjectInfo } from "./pages/ProjectInfo";
import { UserCalendar } from "./pages/UserCalendar";
import { Teams } from "./pages/Teams";
import { MemberProfile } from "./pages/MemberProfile";
import { SharedProject } from "./pages/SharedProject";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects/:token" element={<Projects />} />
        <Route path="/forgotUsername" element={<ForgetUserName />} />
        <Route path="/resetPass" element={<ResetPasswordRequest />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/update-profile/:token" element={<UpdateProfile/>} />
        <Route path="/create-project" element={<CreateProject/>} />
        <Route path="/project/:projectname" element={<ProjectInfo/>} />
        <Route path="/shared-project/:projectname" element={<SharedProject/>} />
        <Route path="/calendar" element={<UserCalendar/>} />
        <Route path="/teams" element={<Teams/>} />
        <Route path="/member/:username" element={<MemberProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;
