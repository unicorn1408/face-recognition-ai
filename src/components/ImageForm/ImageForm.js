import React from 'react';
import s from './ImageForm.module.css'

const ImageForm = () => {
   return <div>
      <p className='f3'>
         {`This Magic Brain will detect faces in your pictures, give it a try!`}
      </p>
      <div className='flex justify-center '>
         <div className={` ${s.form} w-65 pa4 br3 shadow-5`}>
            <input className='f4 pa2 w-70 center' type='text' />
            <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'>Detect</button>
         </div>

      </div>
   </div>
}

export default ImageForm