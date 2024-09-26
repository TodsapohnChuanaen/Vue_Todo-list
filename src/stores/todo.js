import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API

export const useTodoStore = defineStore('todo',{
  state: () => ({
    list: [],
    selectedTodo:{},
    status:['Pending','Doing','Done']
  }),
  actions: {
    async loadTodos() {
      try{
        const response = await axios.get(`${BASE_URL}/todos`)
        this.list = response.data
        console.log('load todo list completed')
      }catch(error){
        console.log('error',error)
      }  
    },
    async loadTodo(id){
      try{
        const response = await axios.get(`${BASE_URL}/todos/${id}`)
        this.selectedTodo = response.data
        console.log('load todo by Id completed')
      }catch(error){
        console.log('error',error)
      }  
    },
    async addTodo(todoText){
      const bodyData = {
        name: todoText,
        status: 'Pending'
      } 

      try{
        const response = await axios.post(`${BASE_URL}/todos`,bodyData)
        //this.selectedTodo = response.data
        this.list.push(response.data)
        console.log('add completed')
      }catch(error){
        console.log('error',error)
      }
    },
    async editTodo(id,todoData){
      try{
        const response = await axios.put(`${BASE_URL}/todos/${id}`,todoData)
        console.log('edit todo completed')
      }catch(error){
        console.log('error',error)
      }
    },
    async removeTodo(id){
      try{
        const response = await axios.delete(`${BASE_URL}/todos/${id}`)
        console.log('delete completed')
      }catch(error){
        console.log('error',error)
      }
    }
  }
})

