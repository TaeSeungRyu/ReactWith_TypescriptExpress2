import { HashRouter, Routes, Route } from 'react-router-dom'
import SearchPage from './component/SearchPage'
import NotFound from './component/NotFound'
import DetailPage from './component/DetailPage'

//라우팅을 담당하는 App 함수 입니다.
function App(props) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SearchPage {...props} />} ></Route>
        <Route path="/DetailPage" element={<DetailPage {...props} />} ></Route>
        <Route path="*" element={<NotFound {...props} />} ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
