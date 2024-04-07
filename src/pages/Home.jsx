import React, { useState } from 'react'
import { read, writeFileXLSX } from "xlsx";


const Home = () => {
  const [topic,setTopic] = useState({
    title:"",
    answer:""
  });
  const [showList,setShowList] = useState([]);

  const handleFile = (e) => {
    console.log('start change File!')
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = function (e) {
      var data = new Uint8Array(reader.result);
      var workbook = read(data, {type: 'array'});
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      //-------------------------------
      // var cell_ref = utils.encode_cell({c: 1, r: 2});
      //
      console.log(sheet?.['!ref'])
      // var cell = sheet[cell_ref];
      // console.log(cell.v);
    }

  }


  return (
    <div className='container mx-auto'>
      {/* Top-Input File */}
      <section className='my-10'>
        <h1 className='font-bold text-2xl mb-2'>隨機題目抽測</h1>
        <input onChange={handleFile} type="file" className="file-input file-input-bordered file-input-sm w-full max-w-xs" />
      </section>
      {/* QA */}
      <section>
          <div>QA:</div>
          <div>Ans:</div>
      </section>
      {/* show Item */}
      <section></section>
    </div>
  )
}

export default Home