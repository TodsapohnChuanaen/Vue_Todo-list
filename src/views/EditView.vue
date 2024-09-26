<template>
    <div class="w-1/2 mx-auto">

            <div v-if="isUpdated">
                <toast></toast>
            </div>
      

        <div class="flex items-center">
            <RouterLink :to="{ name: 'todo-lists' }">
                <div class="btn btn-circle btn-outline ">
                    <svg class="hover:fill-cyan-700" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                </div>
            </RouterLink>
            <div class="ml-2">Edit page</div>
        </div>

        <div v-if="isLoaded">
            id <div class="badge badge-neutral">{{ todoId }}</div>


            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Name</span>
                </div>
                <input type="text" placeholder="Type todo here" class="input input-bordered w-full"
                    v-model="todoStore.selectedTodo.name" />
            </label>

            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Status</span>
                </div>
                <select class="select select-bordered" v-model="todoStore.selectedTodo.status">
                    <option>Select status</option>
                    <option v-for="status in todoStore.status" :value="status">
                        {{ status }}
                    </option>
                </select>
            </label>

            <div class="flex">
                <button class="btn btn-primary w-full mt-4" @click="editTodo(todoStore.selectedTodo)">Edit</button>
            </div>
        </div>
        <div v-else>
            <loading></loading>
        </div>
    </div>
</template>

<script setup>
import { useTodoStore } from '../stores/todo'
import { useRoute, RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'

import loading from '../components/loading.vue';
import toast from '../components/toast.vue';

const todoStore = useTodoStore()
const isLoaded = ref(false)
const todoId = ref(-1)
const route = useRoute()
const isUpdated = ref(false)

onMounted(async () => {
    console.log(route.params.id)
    await todoStore.loadTodo(route.params.id)
    todoId.value = parseInt(route.params.id)
    console.log(todoStore.selectedTodo)
    isLoaded.value = true
})

const editTodo = async (selectedTodo) => {
    try {
        isLoaded.value = false
        const bodyData = {
            name: selectedTodo.name,
            status: selectedTodo.status
        }
        await todoStore.editTodo(todoId.value, bodyData)
        isUpdated.value = true
        isLoaded.value = true
        setTimeout(() => {
            isUpdated.value = false
        }, 2000);
    } catch (error) {
        console.log('erorr', error)
    }

}

</script>

<style scoped>
svg {
    fill: white;
    width: 30px;
    height: 30px;
}
</style>