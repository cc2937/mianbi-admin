import request from "../utils/request"
import router from '../router'

export function login(data) {
    return request({
        method: 'POST',
        url: '/auth/login',
        data,
    })
}

export function getUsers(params = {}) {
    return request({
        method: 'GET',
        url: '/users',
        params,
    })
}

export function getUser(id) {
    return request({
        method: 'GET',
        url: `/users/${id}`,
    })
}

export function createUser(data) {
    return request({
        method: 'POST',
        url: '/users',
        data,
    })
}

export function updateUser(id, data) {
    return request({
        method: 'PUT',
        url: `/users/${id}`,
        data,
    })
}

export function deleteUser(id) {
    return request({
        method: 'DELETE',
        url: `/users/${id}`,
    })
}