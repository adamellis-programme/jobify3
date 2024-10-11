import multer from 'multer'
import DataParser from 'datauri/parser.js'
import path from 'path'

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads')
//   },

//   filename: (req, file, cb) => {
//     const fileName = file.originalname

//     cb(null, fileName)
//   },
// })
// const upload = multer({ storage })

const storage = multer.memoryStorage()
const upload = multer({ storage })

const parser = new DataParser()

// export helper file
export const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString()
  // console.log(fileExtension)
  return parser.format(fileExtension, file.buffer).content
  // console.log(file)
  // console.log(file.buffer)
}

// one default per file
export default upload
