import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import axios from 'axios'
import { INSERT_DATA } from '../state/DataList'
import SearchNode from './SearchNode'

/**
 * 분석용 페이지 입니다.
 */
function SearchPage() {

  const { register, handleSubmit, getValues, formState: { errors }, setError } = useForm();  //useForm을 한번 사용하여 보았습니다.
  const [askResult, setAskResult] = useState('');  //url을 요청한 뒤 결과를 담는 상태 입니다.
  const [saveBtnShow, setSaveBtnShow] = useState(false);  //결과값이 있으면 저장버튼을 보여주는 상태 입니다.

  const dispatch = useDispatch()
  const DATA_LIST = useSelector(arg => arg.CHANGE_DATA);  //저장된 데이터 목록 입니다.

  //데이터를 가지고 질의 합니다.
  const askUrl = () => {
    let value = getValues();
    let { url, node, type } = value;
    if (url.toLowerCase().indexOf('http') !== 0) {
      setError("url", { type: "required", shouldFocus: true, message: 'http로 시작하는 값이 아닙니다.' });
      return;
    }

    axios.post('data/study', { url, node, type }).then(arg => {
      let { result } = arg.data;
      setAskResult(result)
      if (result) setSaveBtnShow(true)
    })
  }

  //textarea에 사용자가 수정하는 경우 상태값을 바꿉니다.
  const changeAskValue = (event) => {
    setAskResult(event.target.value)
  }

  //데이터를 저장합니다.
  const saveResult = () => {
    let { url, node, type } = getValues();

    axios.post('data/saveResult', { url, node, type, ask_result: askResult }).then(arg => {
      let { result } = arg.data;
      if (result) {
        axios.post('data/getList', {}).then(res => {
          dispatch(INSERT_DATA({ item: JSON.parse(res.data.result) }))
        })
      }
    })
  }

  //화면 최초 로딩시 데이터를 가져옵니다.
  useEffect(() => {
    axios.post('data/getList', {}).then(arg => {
      dispatch(INSERT_DATA({ item: JSON.parse(arg.data.result) }))
    })
  }, [dispatch])

  return (
    <div className='container'>
      <div className='h2'>URL 분석하기</div>

      {/* 분석을 하는 기능 입니다. */}
      <form onSubmit={handleSubmit(askUrl)} className='col-md-12 border m-4' >
        <input type='text' {...register('url', { required: '분석할 주소 값은 빈 상태일 수 없습니다.' })} className='form-control' placeholder='url' />
        <div className='text-danger'>{errors?.url && errors.url.message}</div>
        <input type='text' {...register('node')} className='form-control' placeholder='노드 [ex : body, #id, .class]' />
        <div className='clearfix'>&nbsp;</div>
        <select {...register("type")} className='btn btn-success'>
          <option value="post">post 방식</option>
          <option value="get">get 방식</option>
        </select>
        <button type='submit' className='btn btn-warning'>서브밋</button>
        <div className='clearfix'>&nbsp;</div>
      </form>

      {/* 분석한 결과가 나오는 곳 입니다. */}
      <div className='col-md-12 border m-4' >
        <textarea defaultValue={askResult} className='form-control' onChange={changeAskValue} />
        {saveBtnShow && <button type='button' className='btn btn-primary' onClick={saveResult}>분석내용 저장하기</button>}
      </div>

      {/* 분석하여 저장 하였던 데이터 목록이 나옵니다. */}
      <div className='col-md-12 border m-4' >
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>주소</th>
              <th>선택자</th>
              <th>요청방식</th>
              <th>일자</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {DATA_LIST && DATA_LIST.map(item => {
              return <SearchNode {...item} key={item.idx}></SearchNode>
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SearchPage;
