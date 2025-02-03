import Student from "../models/student.js"


export function getStudents(req,res){
  Student.find().then(
    (result)=>{
      res.json(result)
    }
  ).catch(
    
  )
}

export function postStudents(req,res){
  
  let studentData = req.body

  let student = new Student(studentData)

  student.save().then(()=>{
    res.json({
      message:"Student saved successfully"
    })
  }).catch(()=>{
    message : "Student saving failed"
  })
}
