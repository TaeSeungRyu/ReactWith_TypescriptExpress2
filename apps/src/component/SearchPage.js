import React, { useEffect, useState } from 'react'
//import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import axios from 'axios'

function SearchPage() {

  const { register, handleSubmit, getValues } = useForm();  //useForm을 한번 사용하여 보았습니다.
  const [checkbox, setcheckbox] = useState({});

  const askUrl = () => {
    let value = getValues();
    console.log(value)
    console.log(checkbox)

    axios.post('data/study', { url: value.url, node: value.node, type: value.type }).then(arg => {
      let { result } = arg.data;
      console.log(result)
    })
  }

  const boxes = [
    {
      name: 'check-box-1',
      key: 'checkBox1',
      label: 'Check Box 1',
    },
    {
      name: 'check-box-2',
      key: 'checkBox2',
      label: 'Check Box 2',
    }
  ];

  const handleChange = (event) => {
    console.log(event.target.name, event.target.checked)
    setcheckbox({ ...checkbox, [event.target.name]: event.target.checked })
  }

  const testOther = (data, event) => {
    console.log(event.target.name)
    let value = getValues();
    console.log(value)
  }

  const testArray = [
    { name: 'efef', name1: 'efef11', idx: 12 },
    { name: 'abfe', name1: 'abfe11', idx: 23 },
    { name: 'bbqb', name1: 'bbqb11', idx: 56 },
    { name: 'rjfy', name1: 'rjfy11', idx: 67 }
  ]

  return (
    <div className='container'>
      <div className='h2'>페이지</div>
      <form onSubmit={handleSubmit(askUrl)} className='col-md-12 border m-4' >

        <input type='text' {...register('url')} className='form-control' placeholder='url' />
        <input type='text' {...register('node')} className='form-control' placeholder='노드' />
        <select {...register("type")}>
          <option value="post">post 방식</option>
          <option value="get">get 방식</option>
        </select>

        {
          boxes.map(item => (
            <label key={item.key}>
              {item.name}
              <input type='checkbox' name={item.name} onChange={handleChange} />
            </label>
          ))
        }
        <div>
          <div>react hook from checkbox style</div>
          box1 : <input type='checkbox' value='체크박스1'  {...register('chbox[0]')} />
          box2 : <input type='checkbox' value='체크박스2'  {...register('chbox[1]')} />
          box3 : <input type='checkbox' value='체크박스3'  {...register('chbox[2]')} />
        </div>
        <div>
          <div>react hook from radio style</div>
          radio1 : <input type='radio' value='radio11'  {...register('radioType')} />
          radio2 : <input type='radio' value='radio22'  {...register('radioType')} />
          radio3 : <input type='radio' value='radio33'  {...register('radioType')} />
        </div>
        <button type='submit' className='btn btn-warning'>서브밋</button>
        <div className='clearfix'>&nbsp;</div>
      </form>

      <hr></hr>
      {testArray.map(data =>
        <form onSubmit={handleSubmit(testOther)} className='col-md-12 border m-4' key={data.idx} name={data.idx}>

          <input type='text'  {...register(data.name)} className='form-control' placeholder='G00D' />
          <input type='text'  {...register(data.name1)} className='form-control' placeholder='KOKO' />
          <button type='submit' className='btn btn-warning'>TEST</button>
        </form>


      )}


    </div>
  );
}

export default SearchPage;
