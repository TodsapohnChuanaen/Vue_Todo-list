<template>
    <div>
        <div class="flex">
            <input class="input input-bordered w-full" type="text" v-model="todoText" placeholder="Type here">
            <button class="btn btn-primary ml-2 text-white" @click="addTodo(todoText)">Add</button>

        </div>
        <loading v-if="isLoading"></loading>
        <div class="tabs tabs-lg flex tabs-boxed mt-4">   <!-- or remove flex เพื่อให้ tab width เท่าๆกัน -->
            <a v-for="status in todoStore.status" 
            :class="status === selectedStatus ? 'tab tab-active' : 'tab'"
            @click="changeSelectedStatus(status)">
                {{status}}</a>
        </div>

        <!-- :key เป็น unique ใช้เพื่อบอกว่า dom ตัวนี้ไม่เหมือนกับตัวอื่น
        ใช้แยก state ออกมาจากตัวอื่น 
        ในที่นี้ใช้เพื่อแก้ bug ที่เมื่อกด status done แล้ว เครื่องหมายถูกยังค้างอยู่-->
        <div class="flex items-center justify-between mt-4" v-for="todo in filterTodoList" :key="todo.id">
            <div>
                <input type="checkbox" 
                :checked="todo.status ==='Done'" 
                class="checkbox" 
                @change="changeStatus(todo.id,$event )" />
            </div> 
            <!-- if else โดยจะเช็คเงื่อนไขถ้าเป็นจริงจะทำเงื่อนไขหน้า : แต่ถ้าไม่จะทำตัวหลัง : --> 
            <div :class="todo.status === 'Done' ? 'line-through' : ''">
                {{ todo.name }}
            </div>
            <div>
            <RouterLink :to="{ name: 'todo-edit', params: { id: todo.id } }">
                <button class="btn btn-square btn-outline ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                    </svg>
                </button>
            </RouterLink>
            <button class="btn btn-square btn-outline ml-2" @click="removeTodo(todo.id)">
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
            </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref,computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTodoStore } from '../stores/todo'
import loading from '../components/loading.vue'

const todoStore = useTodoStore()
const todoText = ref('')
const isLoading = ref(false)
const selectedStatus = ref('Pending')

//เปิด web ขึ้นมาแล้ว status จะอยู่ที่ Pending by default
const filterTodoList = computed(() => {
    return todoStore.list.filter(todo => todo.status === selectedStatus.value)
})

onMounted(async () => {
    isLoading.value = true
    await todoStore.loadTodos()
    console.log(todoStore.list)
    isLoading.value = false
})

const addTodo = async (todoText) => {
    try {
        isLoading.value = true
        await todoStore.addTodo(todoText)
        isLoading.value = false
        //await todoStore.loadTodos()
        //ให้โหลดข้อมูลใหม่เสมอหลังจาก add ข้อมูล โดยจะทำการ call api ใหม่ เช่น นำข้อมูลไปประมวลผล แล้วนำกลับมาคำนวณ มาเพิ่มข้อมูล
        //อยู่ใน file todo.js from stores >>this.list.push(response.data) ส่วนอันนี้ใช้แค่นำข้อมูลที่เพิ่ม มาใส่ใน list แค่นั้น 
        //แล้วแต่สถานการณ์ และ performance ที่ต้องการ
    } catch (error) {
        console.log('error', error)
    }
}

const editStatus = async (todoId, todoData) => {
    try {
        isLoading.value = true
        const updateData = {
            name: todoData.name,
            status: todoData.status
        }
        await todoStore.editTodo(todoId, updateData)
        isLoading.value = false
    } catch (error) {
        console.log('error', error)
    }

}

const removeTodo = async (todoId) => {
    try {
        isLoading.value = true
        await todoStore.removeTodo(todoId)
        await todoStore.loadTodos()
        isLoading.value = false
    } catch (error) {
        console.log('error', error)
    }
}

const changeStatus = async (todoId, event) => {
    isLoading.value = true
    try{ 
        if(event.target.checked && selectedStatus.value === 'Pending'){
        await todoStore.editTodo(todoId, {status: 'Doing'})
        }  
        if(event.target.checked && selectedStatus.value === 'Doing'){
        await todoStore.editTodo(todoId, {status: 'Done'})
        }else{
            await todoStore.editTodo(todoId, {status: 'Doing'})
        }
        await todoStore.loadTodos()
    }catch(error){
        console.log('error', error)
    }
    isLoading.value = false
}

const changeSelectedStatus = async (newStatus) => {
    selectedStatus.value = newStatus
}

</script>

<style scoped>
    svg {
        fill: white;
        width: 30px;
        height: 30px;
    }
</style>
