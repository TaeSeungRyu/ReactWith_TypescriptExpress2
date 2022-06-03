import React from 'react'
import { useLocation } from "react-router";

/***
 * 단순한 세부보기 페이지 입니다.
 *  */
function DetailPage() {
    let { state: { ask_result, url, node, type, date } } = useLocation();


    return <div className='container'>

        <div className="card">
            <div className="card-header">세부내용</div>
            <div className="card-body">
                <div><span>url : </span> {url}</div>
                <div><span>date : </span> {date}</div>
                <div><span>node : </span> {node}</div>
                <div><span>type : </span> {type}</div>
            </div>
            <div className="card-footer">
                <div><span>질의결과 : </span> {ask_result}</div>

            </div>
        </div>

    </div>
}

export default DetailPage;