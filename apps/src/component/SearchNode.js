import React from 'react'
import axios from 'axios'
import { INSERT_DATA } from '../state/DataList'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

/***
 * 단순한 목록결과를 리턴하는 함수 입니다.
 *  */
function SearchNode(props) {
    const { idx, url, node, type, date, ask_result } = props;
    const dispatch = useDispatch()
    const navigate = useNavigate();

    //세부보기 버튼을 누르면 DetailPage 페이지로 이동 합니다.
    const goToPage = () => {
        navigate('/DetailPage', { state: { idx, url, node, type, date, ask_result } })
    }

    //분석된 결과를 제거 합니다.
    const removeThisItem = () => {
        axios.post('data/remove', { idx }).then(arg => {
            let { result } = arg.data;
            if (result) {
                axios.post('data/getList', {}).then(res => {
                    dispatch(INSERT_DATA({ item: JSON.parse(res.data.result) }))
                })
            }
        })
    }
    return <tr key={idx}>
        <td>{url}</td>
        <td>{node}</td>
        <td>{type}</td>
        <td>{date}</td>
        <td>
            <button type='button' onClick={goToPage} className='btn btn-primary'>세부보기</button>
            <button type='button' onClick={removeThisItem} className='btn btn-danger'>삭제</button>
        </td>
    </tr>
}

export default SearchNode;