const taskModel = require('../models/taskModel');
const express = require('express');
const router = express.Router();

router.post('/create',async (req,res)=>{
    try{
    const{title,description,status,assignedTo}=req.body;
    const newTask=new taskModel({
        title,
        description,
        status,
        assignedTo
    });
    await newTask.save();
    res.status(201).json({message:'Task created successfully',task:newTask});
}catch(error){
    console.error(error);
    res.status(500).json({message:'Server error'});  }     

});

router.get('/all',async (req,res)=>{
    try{
        const tasks=await taskModel.find();
        res.status(200).json({tasks});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});  }     
});
router.put('/update/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        const {title,description,status,assignedTo}=req.body;
        const updatedTask=await taskModel.findByIdAndUpdate(id,{title,description,status,assignedTo},{new:true});
        if(!updatedTask){
            return res.status(404).json({message:'Task not found'});
        }
        res.status(200).json({message:'Task updated successfully',task:updatedTask});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});  }     
});

router.delete('/delete/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        const deletedTask=await taskModel.findByIdAndDelete(id);
        if(!deletedTask){
            return res.status(404).json({message:'Task not found'});
        }
        res.status(200).json({message:'Task deleted successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});  }     
});
module.exports=router;