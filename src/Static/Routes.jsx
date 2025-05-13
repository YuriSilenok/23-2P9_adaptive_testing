import { BrowserRouter, redirect, Route, Routes } from "react-router-dom";
import StudentNavigator from "../Pages/StudentPage";
import MainLOUT from "../Layouts/MainLOUT";
import Autorize from "../Pages/Autorize";
import Regisration from "../Pages/Registration";
import MainRedirect from "../Layouts/Redirect";
import ShowForm from "../Pages/Form";
import { createBrowserHistory } from "history";
import TeacherLout from "../Layouts/TeacherPage";
import Results from "../Pages/Results";


export default function RoutePaths () {
  return(
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/*" Component={MainLOUT}>

            <Route path="users/*">
              <Route path="autorize" Component={Autorize}/>
              <Route path="registration" Component={Regisration} />
            </Route>

            <Route path="*" element={<MainRedirect checkAccount={true} /> } >

                <Route path="forstudent" Component={StudentNavigator} />
                <Route path="showForm/">
                    <Route path=":id" Component={ShowForm} />
                </Route>

                <Route path="forteacher/" Component={TeacherLout} />
                    <Route path="forteacher/results/" Component={Results}>
                </Route>

            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}