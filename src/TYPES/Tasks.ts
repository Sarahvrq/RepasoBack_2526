import { ObjectId } from "mongodb"

export type Tasks = {

    _id: ObjectId
    title: String, 
    projectId: ObjectId,
    assignedTo: ObjectId,
    status: String,
    priority: String,
    dueDate: Date
    
};